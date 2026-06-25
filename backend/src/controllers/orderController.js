const Order = require('../models/Order');
const Payment = require('../models/Payment');

exports.createOrder = async (req, res) => {
  try {
    const { items, total, shippingAddress, shippingMethod } = req.body;

    // Generate unique order ID
    const orderId = `ORD-${Date.now()}`;

    const order = new Order({
      orderId,
      customer: req.user._id,
      items,
      total,
      shippingAddress,
      shippingMethod,
    });

    await order.save();
    res.status(201).json({ message: 'Order created', order });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .populate('items.product')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.customer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch order', error: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('items.product');

    res.json({ message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order', error: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('customer', 'name email')
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
};
