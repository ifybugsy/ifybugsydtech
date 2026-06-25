const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const { protect, authorize } = require('../middleware/auth');

// Dashboard statistics (admin only)
router.get('/dashboard', protect, authorize('admin'), statsController.getDashboardStats);
router.get('/users', protect, authorize('admin'), statsController.getUserStats);
router.get('/courses', protect, authorize('admin'), statsController.getCourseStats);
router.get('/enrollments', protect, authorize('admin'), statsController.getEnrollmentStats);

module.exports = router;
