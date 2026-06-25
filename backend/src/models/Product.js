const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['laptops', 'phones', 'accessories'],
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    specs: {
      type: Map,
      of: String,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: {
      type: Number,
      default: 0,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    brand: {
      type: String,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  { timestamps: true }
);

// Index for search
productSchema.index({ name: 'text', description: 'text', category: 1 });

module.exports = mongoose.model('Product', productSchema);
