const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');
const { protect, authorize } = require('../middleware/auth');

// Student routes
router.get('/', protect, enrollmentController.getStudentEnrollments);
router.get('/completed', protect, enrollmentController.getCompletedEnrollments);
router.get('/:id', protect, enrollmentController.getEnrollmentById);
router.post('/', protect, enrollmentController.enrollStudent);
router.put('/:id/progress', protect, enrollmentController.updateProgress);
router.put('/:id/complete', protect, enrollmentController.completeEnrollment);

// Admin routes
router.get('/admin/all', protect, authorize('admin'), enrollmentController.getAllEnrollments);

module.exports = router;
