const Payment = require('../models/Payment');
const Order = require('../models/Order');
const Enrollment = require('../models/Enrollment');
const axios = require('axios');

// Paystack API configuration
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || 'sk_test_your_paystack_secret_key_here';
const PAYSTACK_API_BASE_URL = process.env.PAYSTACK_API_BASE_URL || 'https://api.paystack.co';

// Initialize Paystack payment
exports.initializePayment = async (req, res) => {
  try {
    const { email, amount, metadata } = req.body;
    const userId = req.user._id;

    if (!email || !amount) {
      return res.status(400).json({ message: 'Email and amount are required' });
    }

    // Create a pending payment record
    const payment = new Payment({
      transactionId: `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      user: userId,
      amount,
      status: 'pending',
      paymentMethod: 'paystack',
      metadata,
    });

    await payment.save();

    // Initialize transaction with Paystack
    const response = await axios.post(
      `${PAYSTACK_API_BASE_URL}/transaction/initialize`,
      {
        email,
        amount: Math.round(amount * 100), // Paystack expects amount in kobo
        metadata: {
          paymentId: payment._id.toString(),
          userId: userId.toString(),
          ...metadata,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data.status) {
      // Update payment with Paystack reference
      payment.paystackReference = response.data.data.reference;
      await payment.save();

      res.json({
        message: 'Payment initialized',
        data: {
          authorizationUrl: response.data.data.authorization_url,
          accessCode: response.data.data.access_code,
          reference: response.data.data.reference,
          paymentId: payment._id,
        },
      });
    } else {
      payment.status = 'failed';
      await payment.save();
      res.status(400).json({ message: 'Failed to initialize payment' });
    }
  } catch (error) {
    console.error('Payment initialization error:', error.message);
    res.status(500).json({ message: 'Payment initialization failed', error: error.message });
  }
};

// Verify Paystack payment
exports.verifyPayment = async (req, res) => {
  try {
    const { reference } = req.params;

    if (!reference) {
      return res.status(400).json({ message: 'Reference is required' });
    }

    // Verify with Paystack
    const response = await axios.get(
      `${PAYSTACK_API_BASE_URL}/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    if (response.data.status && response.data.data.status === 'success') {
      // Update payment status
      const payment = await Payment.findOne({ paystackReference: reference });
      
      if (payment) {
        payment.status = 'completed';
        payment.paystackData = response.data.data;
        await payment.save();

        // Update order if exists
        if (payment.order) {
          await Order.findByIdAndUpdate(payment.order, { paymentStatus: 'paid' });
        }

        // Update enrollment if exists
        if (payment.enrollment) {
          await Enrollment.findByIdAndUpdate(payment.enrollment, { status: 'active' });
        }

        res.json({
          message: 'Payment verified and confirmed',
          payment,
          data: response.data.data,
        });
      } else {
        res.status(404).json({ message: 'Payment not found' });
      }
    } else {
      res.status(400).json({ message: 'Payment verification failed' });
    }
  } catch (error) {
    console.error('Payment verification error:', error.message);
    res.status(500).json({ message: 'Verification failed', error: error.message });
  }
};

// Paystack webhook handler
exports.handleWebhook = async (req, res) => {
  try {
    const { data } = req.body;

    if (data.status === 'success') {
      const reference = data.reference;

      // Find and update payment
      const payment = await Payment.findOne({ paystackReference: reference });

      if (payment) {
        payment.status = 'completed';
        payment.paystackData = data;
        await payment.save();

        // Update related orders/enrollments
        if (payment.order) {
          await Order.findByIdAndUpdate(payment.order, { paymentStatus: 'paid' });
        }

        if (payment.enrollment) {
          await Enrollment.findByIdAndUpdate(payment.enrollment, { status: 'active' });
        }

        console.log('Webhook: Payment confirmed for reference:', reference);
      }
    }

    res.status(200).json({ message: 'Webhook processed' });
  } catch (error) {
    console.error('Webhook error:', error.message);
    res.status(500).json({ message: 'Webhook processing failed' });
  }
};

exports.createPayment = async (req, res) => {
  try {
    const { amount, type, description, paymentMethod, orderId, enrollmentId } = req.body;

    const transactionId = `TXN-${Date.now()}`;

    const payment = new Payment({
      transactionId,
      user: req.user._id,
      amount,
      type,
      description,
      paymentMethod,
      status: 'completed',
      order: orderId,
      enrollment: enrollmentId,
    });

    await payment.save();

    // Update order if exists
    if (orderId) {
      await Order.findByIdAndUpdate(orderId, { paymentStatus: 'paid' });
    }

    res.status(201).json({ message: 'Payment recorded', payment });
  } catch (error) {
    res.status(500).json({ message: 'Payment failed', error: error.message });
  }
};

exports.getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id })
      .populate('order')
      .populate('enrollment')
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch payments', error: error.message });
  }
};

exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('user', 'name email')
      .populate('order')
      .populate('enrollment')
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch payments', error: error.message });
  }
};

exports.getPaymentStats = async (req, res) => {
  try {
    const stats = await Payment.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$amount' },
          totalTransactions: { $sum: 1 },
          completedPayments: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
          },
          failedPayments: {
            $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] },
          },
        },
      },
    ]);

    res.json(stats[0] || { totalRevenue: 0, totalTransactions: 0 });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch stats', error: error.message });
  }
};

