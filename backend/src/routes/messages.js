const express = require('express');
const messageController = require('../controllers/messageController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// User routes (protected)
router.get('/conversations', protect, messageController.getConversations);
router.get('/conversation/:userId', protect, messageController.getConversation);
router.post('/send', protect, messageController.sendMessage);
router.put('/:messageId/read', protect, messageController.markAsRead);
router.delete('/:messageId', protect, messageController.deleteMessage);

// Admin routes
router.get('/admin/all', protect, authorize('admin'), messageController.getAllMessagesAdmin);
router.put('/admin/:messageId/flag', protect, authorize('admin'), messageController.flagMessage);

module.exports = router;
