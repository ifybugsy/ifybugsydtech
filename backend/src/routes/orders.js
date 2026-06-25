const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, orderController.createOrder);
router.get('/my-orders', protect, orderController.getMyOrders);
router.get('/:id', protect, orderController.getOrderById);
router.put('/:id/status', protect, authorize('admin'), orderController.updateOrderStatus);
router.get('/', protect, authorize('admin'), orderController.getAllOrders);

module.exports = router;
