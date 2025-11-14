import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  images: [String],
  description: String,
  details: {
    material: String
  },
  variants: [{
    color: String,
    colorHex: String,
    imageIndex: Number,
    sizes: [{
      size: String,
      stock: Number
    }]
  }]
}, { timestamps: true });

export default mongoose.model('Product', productSchema);