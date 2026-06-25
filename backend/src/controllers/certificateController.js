const Certificate = require('../models/Certificate');
const Enrollment = require('../models/Enrollment');
const User = require('../models/User');

// Get student certificates
exports.getStudentCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({ student: req.user._id })
      .populate('course', 'title description image')
      .populate('student', 'name email')
      .sort({ issuedAt: -1 });

    res.json(certificates);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch certificates', error: error.message });
  }
};

// Get certificate by ID
exports.getCertificateById = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id)
      .populate('course')
      .populate('student', 'name email')
      .populate('enrollment');

    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    // Check authorization
    if (certificate.student._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(certificate);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch certificate', error: error.message });
  }
};

// Verify certificate by certificate number
exports.verifyCertificate = async (req, res) => {
  try {
    const { certificateNumber } = req.params;

    const certificate = await Certificate.findOne({ certificateNumber })
      .populate('course', 'title description')
      .populate('student', 'name')
      .populate('enrollment', 'completedDays startDate endDate');

    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    res.json({
      valid: true,
      certificate,
      verificationData: {
        studentName: certificate.student.name,
        courseName: certificate.course.title,
        issuedAt: certificate.issuedAt,
        certificateNumber: certificate.certificateNumber,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to verify certificate', error: error.message });
  }
};

// Get all certificates (admin only)
exports.getAllCertificates = async (req, res) => {
  try {
    const { courseId, studentId, startDate, endDate } = req.query;
    let query = {};

    if (courseId) query.course = courseId;
    if (studentId) query.student = studentId;

    if (startDate || endDate) {
      query.issuedAt = {};
      if (startDate) query.issuedAt.$gte = new Date(startDate);
      if (endDate) query.issuedAt.$lte = new Date(endDate);
    }

    const certificates = await Certificate.find(query)
      .populate('course', 'title')
      .populate('student', 'name email')
      .sort({ issuedAt: -1 });

    res.json(certificates);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch certificates', error: error.message });
  }
};

// Generate certificate manually (admin only)
exports.generateCertificate = async (req, res) => {
  try {
    const { enrollmentId } = req.body;

    const enrollment = await Enrollment.findById(enrollmentId).populate('student course');

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    // Check if certificate already exists
    const existingCert = await Certificate.findOne({ enrollment: enrollmentId });
    if (existingCert) {
      return res.status(400).json({ message: 'Certificate already exists for this enrollment' });
    }

    const certificateNumber = `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const certificate = new Certificate({
      student: enrollment.student._id,
      course: enrollment.course._id,
      enrollment: enrollmentId,
      certificateNumber,
      verificationUrl: `https://ifybugsy.com/verify/${certificateNumber}`,
    });

    await certificate.save();

    // Update enrollment with certificate reference
    enrollment.certificate = certificate._id;
    await enrollment.save();

    res.status(201).json({ message: 'Certificate generated', certificate });
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate certificate', error: error.message });
  }
};

module.exports = exports;
