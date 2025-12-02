import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  customer: {
    customerName: String,
    phoneNumber: String,
    address: String
  },
  items: [{
    productId: String,
    name: String,
    price: Number,
    image: String,
    size: String,
    color: String,
    quantity: Number,
    stock: Number
  }],
  total: { type: Number, required: true },
  orderStatus: { type: String, default: 'Processing' },
  paymentStatus: { type: String, default: 'Awaiting Confirmation' }
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);