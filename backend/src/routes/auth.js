const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');

router.post('/register', authController.register);
router.post('/register-instructor', authController.registerInstructor);
router.post('/login', authController.login);
router.get('/me', protect, authController.getCurrentUser);
router.put('/profile', protect, authController.updateProfile);

// Admin: Offline student registration
router.post('/offline-student', protect, authorize('admin'), authController.registerOfflineStudent);
router.get('/offline-students', protect, authorize('admin'), authController.getOfflineStudents);
router.post('/bulk-offline-students', protect, authorize('admin'), authController.bulkRegisterOfflineStudents);

module.exports = router;
