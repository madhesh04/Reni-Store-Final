import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';
import morgan from 'morgan';
import Product from './models/Product.js';
import Order from './models/Order.js';
import Admin from './models/Admin.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security Middleware
app.use(helmet());
app.use(morgan('combined'));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Stricter rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // limit each IP to 5 login attempts per 15 minutes
  message: 'Too many login attempts, please try again later.'
});

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://your-vercel-app.vercel.app'] 
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB Connection
// const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/renis-store';
const mongoURI = 'mongodb://127.0.0.1:27017/renis-store'; // Force local for development
console.log('Attempting to connect to MongoDB at:', mongoURI);

mongoose.connect(mongoURI)
  .then(() => {
    console.log('Connected to MongoDB');
    createDefaultAdmin();
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Create default admin user and sync data
const createDefaultAdmin = async () => {
  try {
    const adminExists = await Admin.findOne({ username: 'admin' });
    if (!adminExists) {
      const defaultAdmin = new Admin({
        username: 'admin',
        email: 'admin@renis-store.com',
        password: 'admin123'
      });
      await defaultAdmin.save();
      console.log('Default admin created: admin/admin123');
    }
  } catch (error) {
    console.error('Error creating default admin:', error);
  }
};

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Email transporter verification failed:', error);
  } else {
    console.log('Email transporter verified successfully');
  }
});

app.post('/api/send-invoice', async (req, res) => {
  const { order, invoicePdf } = req.body;
  console.log('Received invoice email request for order:', order.id);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'madheshp42@gmail.com',
    subject: `Invoice for Order ${order.id} - Renis Store`,
    html: `
      <h3>New Order Invoice</h3>
      <p><strong>Order ID:</strong> ${order.id}</p>
      <p><strong>Customer:</strong> ${order.customer.customerName}</p>
      <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
      <p><strong>Payment Status:</strong> ${order.paymentStatus}</p>
      <p>Please find the invoice attached.</p>
    `,
    attachments: [{
      filename: `invoice-${order.id}.pdf`,
      content: invoicePdf.split('base64,')[1],
      encoding: 'base64'
    }]
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Invoice email sent successfully:', info.messageId);
    res.status(200).json({ message: 'Invoice email sent successfully' });
  } catch (error) {
    console.error('Detailed error:', error);
    res.status(500).json({ error: 'Failed to send invoice email', details: error.message });
  }
});

app.post('/api/send-email', async (req, res) => {
  console.log('POST /api/send-email endpoint hit');
  console.log('Request body:', req.body);
  console.log('Request headers:', req.headers);
  
  const { name, email, message } = req.body;
  
  // Validate required fields
  if (!name || !email || !message) {
    console.log('Missing required fields:', { name: !!name, email: !!email, message: !!message });
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  console.log('Email config check:', {
    EMAIL_USER: !!process.env.EMAIL_USER,
    EMAIL_PASS: !!process.env.EMAIL_PASS,
    EMAIL_USER_VALUE: process.env.EMAIL_USER
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'madheshp42@gmail.com',
    subject: `New Contact Form Message from ${name}`,
    html: `
      <h3>New Contact Form Submission</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `
  };

  try {
    console.log('Attempting to send email...');
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    res.status(200).json({ message: 'Email sent successfully', messageId: info.messageId });
  } catch (error) {
    console.error('Email sending failed:', error);
    console.error('Error details:', {
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode
    });
    res.status(500).json({ 
      error: 'Failed to send email', 
      details: error.message,
      code: error.code 
    });
  }
});

// Create new admin user (for development/setup only)
app.post('/api/admin/create', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ $or: [{ username }, { email }] });
    if (existingAdmin) {
      return res.status(400).json({ error: 'Admin already exists' });
    }
    
    const newAdmin = new Admin({
      username,
      email,
      password // Will be hashed automatically by the pre-save middleware
    });
    
    await newAdmin.save();
    res.status(201).json({ message: 'Admin created successfully', username });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin Authentication Routes
app.post('/api/admin/login', authLimiter, [
  body('username').isLength({ min: 3 }).trim().escape(),
  body('password').isLength({ min: 6 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    
    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET || 'renis-secret-key',
      { expiresIn: '24h' }
    );
    
    admin.lastLogin = new Date();
    await admin.save();
    
    res.json({ token, admin: { username: admin.username, email: admin.email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Middleware to verify admin token
const verifyAdmin = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Access denied' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'renis-secret-key');
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Product API Routes (Public)
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    let product;
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      product = await Product.findById(req.params.id);
    }
    if (!product) {
      product = await Product.findOne({ id: req.params.id });
    }
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/products', verifyAdmin, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/products/:id', verifyAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/products/:id', verifyAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Sync local storage data to database
app.post('/api/sync-data', verifyAdmin, async (req, res) => {
  try {
    const { products, orders } = req.body;
    
    // Sync products if provided
    if (products && products.length > 0) {
      for (const product of products) {
        await Product.findOneAndUpdate(
          { name: product.name },
          product,
          { upsert: true, new: true }
        );
      }
      console.log(`Synced ${products.length} products`);
    }
    
    // Sync orders if provided
    if (orders && orders.length > 0) {
      for (const order of orders) {
        await Order.findOneAndUpdate(
          { orderId: order.id },
          {
            orderId: order.id,
            customer: order.customer,
            items: order.items,
            total: order.total,
            orderStatus: order.orderStatus,
            paymentStatus: order.paymentStatus,
            createdAt: order.createdAt
          },
          { upsert: true, new: true }
        );
      }
      console.log(`Synced ${orders.length} orders`);
    }
    
    res.json({ message: 'Data synced successfully' });
  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Order API Routes
app.get('/api/orders', verifyAdmin, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/orders/:id', verifyAdmin, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});