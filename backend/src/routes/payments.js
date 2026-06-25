const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');

// Paystack endpoints
router.post('/paystack/initialize', protect, paymentController.initializePayment);
router.get('/paystack/verify/:reference', protect, paymentController.verifyPayment);
router.post('/paystack/webhook', paymentController.handleWebhook);

// General payment endpoints
router.post('/', protect, paymentController.createPayment);
router.get('/my-payments', protect, paymentController.getMyPayments);
router.get('/', protect, authorize('admin'), paymentController.getAllPayments);
router.get('/stats', protect, authorize('admin'), paymentController.getPaymentStats);

module.exports = router;

