const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

// Auth routes
const authRoutes = require('./auth');
router.use('/auth', authRoutes);

// Course routes
const courseRoutes = require('./courses');
router.use('/courses', courseRoutes);

// Product routes
const productRoutes = require('./products');
router.use('/products', productRoutes);

// Order routes
const orderRoutes = require('./orders');
router.use('/orders', orderRoutes);

// Payment routes
const paymentRoutes = require('./payments');
router.use('/payments', paymentRoutes);

// Community routes
const communityRoutes = require('./community');
router.use('/community', communityRoutes);

// Blog routes
const blogRoutes = require('./blog');
router.use('/blog', blogRoutes);

// User routes
const userRoutes = require('./users');
router.use('/users', userRoutes);

// Enrollment routes
const enrollmentRoutes = require('./enrollments');
router.use('/enrollments', enrollmentRoutes);

// Certificate routes
const certificateRoutes = require('./certificates');
router.use('/certificates', certificateRoutes);

// Statistics routes
const statsRoutes = require('./stats');
router.use('/stats', statsRoutes);

// Message routes
const messageRoutes = require('./messages');
router.use('/messages', messageRoutes);

// Attendance routes
const attendanceRoutes = require('./attendance');
router.use('/attendance', attendanceRoutes);

module.exports = router;
