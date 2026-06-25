const express = require('express');
const router = express.Router();
const certificateController = require('../controllers/certificateController');
const { protect, authorize } = require('../middleware/auth');

// Student routes
router.get('/my-certificates', protect, certificateController.getStudentCertificates);
router.get('/', protect, certificateController.getStudentCertificates);
router.get('/:id', protect, certificateController.getCertificateById);

// Public verification route
router.get('/verify/:certificateNumber', certificateController.verifyCertificate);

// Admin routes
router.get('/admin/all', protect, authorize('admin'), certificateController.getAllCertificates);
router.post('/admin/generate', protect, authorize('admin'), certificateController.generateCertificate);

module.exports = router;
