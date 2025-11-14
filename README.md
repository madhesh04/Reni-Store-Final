# RENIS STORE

*Transform Shopping Into Seamless, Effortless Experiences*

[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2.0-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Admin Panel](#admin-panel)
- [Contributing](#contributing)
- [License](#license)

---

## 🌟 Overview

**RENIS Store** is a modern, full-stack e-commerce platform designed specifically for premium men's innerwear. Built with React, TypeScript, and MongoDB, it provides a seamless shopping experience with comprehensive admin management capabilities.

### Why RENIS Store?

This project empowers businesses to create scalable, feature-rich e-commerce websites with ease. The platform includes:

- 🧩 **Component-Based Architecture**: Reusable UI components ensuring consistent design
- 🚀 **Seamless Navigation**: Robust routing with smooth page transitions
- 🛒 **Integrated Shopping Flow**: Complete cart, checkout, and payment system
- 🛠️ **Developer-Friendly**: Built with modern tools and best practices
- 🎯 **Admin Dashboard**: Comprehensive management panel with analytics
- 📊 **Real-time Analytics**: Visual charts and performance tracking

---

## ✨ Features

### 🛍️ **Customer Experience**
- **Product Catalog**: Browse products with advanced filtering
- **Product Details**: Detailed product pages with variants and sizing
- **Shopping Cart**: Persistent cart with quantity management
- **Secure Checkout**: Multi-step checkout process
- **UPI Payment**: QR code-based payment integration
- **Order Tracking**: Real-time order status updates
- **Invoice Generation**: Professional PDF invoices

### 🎛️ **Admin Dashboard**
- **Product Management**: Add, edit, delete products with variants
- **Order Management**: Track orders, update status, view invoices
- **Analytics Dashboard**: Visual charts and sales reports
- **Inventory Tracking**: Stock management with low-stock alerts
- **Customer Management**: View customer details and order history
- **Settings Panel**: Configure payment methods and store settings

### 🔧 **Technical Features**
- **Responsive Design**: Mobile-first, fully responsive layout
- **Dark Theme**: Professional black/gray color scheme
- **Real-time Sync**: Automatic MongoDB synchronization
- **Email Integration**: Automated invoice delivery via Nodemailer
- **JWT Authentication**: Secure admin authentication
- **Data Visualization**: Interactive charts with Chart.js

---

## 🛠️ Tech Stack

### **Frontend**
- **React 19.2.0** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Chart.js** - Data visualization
- **jsPDF** - PDF generation

### **Backend**
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - MongoDB object modeling
- **Nodemailer** - Email sending
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

### **Development Tools**
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Git** - Version control

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** (v8 or higher)
- **MongoDB Atlas** account (or local MongoDB)
- **Gmail** account (for email functionality)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/madhesh04/Renis-Store.git
   cd Renis-Store
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the root directory:
   ```env
   # Email Configuration
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_PASS=your-app-password
   
   # Database Configuration
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/renis-store
   
   # Security
   JWT_SECRET=your-super-secret-jwt-key
   ```

4. **Gmail App Password Setup**
   - Enable 2-Factor Authentication on your Gmail account
   - Generate an App Password for "Mail"
   - Use the 16-character password in `EMAIL_PASS`

5. **MongoDB Atlas Setup**
   - Create a MongoDB Atlas cluster
   - Create a database user
   - Whitelist your IP address
   - Copy the connection string to `MONGODB_URI`

### Running the Application

1. **Start the backend server**
   ```bash
   npm run server
   ```

2. **Start the frontend development server**
   ```bash
   npm start
   ```

3. **Access the application**
   - **Frontend**: http://localhost:5173
   - **Admin Panel**: http://localhost:5173/#/admin
   - **Backend API**: http://localhost:3001

### Default Admin Credentials
- **Username**: `admin`
- **Password**: `admin123`

---

## 📁 Project Structure

```
renis-store/
├── public/                 # Static assets
│   ├── favicon.svg        # Custom favicon
│   └── favicon.ico        # Fallback favicon
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── Header.tsx     # Navigation header
│   │   ├── Footer.tsx     # Site footer
│   │   ├── Layout.tsx     # Page layout wrapper
│   │   ├── Carousel.tsx   # Image carousel
│   │   └── Toast.tsx      # Notification component
│   ├── pages/             # Page components
│   │   ├── HomePage.tsx   # Landing page
│   │   ├── ProductListPage.tsx    # Product catalog
│   │   ├── ProductDetailPage.tsx  # Product details
│   │   ├── CartPage.tsx   # Shopping cart
│   │   ├── CheckoutPage.tsx       # Checkout process
│   │   ├── PaymentPage.tsx        # Payment interface
│   │   ├── AdminPage.tsx  # Admin dashboard
│   │   └── ...
│   ├── context/           # React context providers
│   │   └── CartContext.tsx        # Shopping cart state
│   ├── data/              # Mock data and constants
│   │   └── mockData.ts    # Product and sample data
│   ├── types/             # TypeScript type definitions
│   │   └── index.ts       # Shared interfaces
│   ├── utils/             # Utility functions
│   │   └── invoiceGenerator.ts    # PDF invoice creation
│   └── App.tsx            # Main application component
├── models/                # MongoDB schemas
│   ├── Product.js         # Product model
│   ├── Order.js           # Order model
│   └── Admin.js           # Admin user model
├── server.js              # Express server
├── package.json           # Dependencies and scripts
└── README.md              # Project documentation
```

---

## 🔌 API Documentation

### **Products**
- `GET /api/products` - Get all products
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### **Orders**
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order status

### **Admin**
- `POST /api/admin/login` - Admin authentication
- `POST /api/sync-data` - Sync local data to database

### **Email**
- `POST /api/send-email` - Send contact form email
- `POST /api/send-invoice` - Send invoice via email

---

## 🎛️ Admin Panel

The admin dashboard provides comprehensive store management:

### **Dashboard**
- Sales analytics with interactive charts
- Key performance indicators (KPIs)
- Recent orders and top products
- Low stock alerts

### **Product Management**
- Add new products with variants and sizing
- Edit product details and pricing
- Manage inventory and stock levels
- Upload product images

### **Order Management**
- View all customer orders
- Update order and payment status
- Generate and download invoices
- Track order fulfillment

### **Analytics**
- Revenue trends and growth charts
- Product performance metrics
- Category distribution analysis
- Sales forecasting

---

## 🤝 Contributing

We welcome contributions to RENIS Store! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Maintain consistent code formatting
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **React Team** - For the amazing React framework
- **Vite Team** - For the lightning-fast build tool
- **MongoDB** - For the flexible database solution
- **Tailwind CSS** - For the utility-first CSS framework
- **Chart.js** - For beautiful data visualizations

---

## 📞 Support

For support and questions:
- **Email**: madheshp42@gmail.com
- **GitHub Issues**: [Create an issue](https://github.com/madhesh04/Renis-Store/issues)

---

<div align="center">

**Built with ❤️ by [Madhesh](https://github.com/madhesh04)**

*RENIS Store - Premium Comfort Since 2018*

</div>