const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      unique: true,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'NGN',
    },
    type: {
      type: String,
      enum: ['course', 'product', 'subscription'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'cancelled'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['card', 'transfer', 'wallet', 'paypal'],
      required: true,
    },
    description: String,
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },
    enrollment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Enrollment',
    },
    metadata: {
      type: Map,
      of: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
