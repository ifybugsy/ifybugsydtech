const Enrollment = require('../models/Enrollment');
const Certificate = require('../models/Certificate');
const Course = require('../models/Course');
const User = require('../models/User');

// Get all enrollments for a student
exports.getStudentEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id })
      .populate('course', 'title description image level price duration instructor')
      .populate('certificate')
      .sort({ createdAt: -1 });

    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch enrollments', error: error.message });
  }
};

// Get completed enrollments for a student
exports.getCompletedEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id, status: 'completed' })
      .populate('course', 'title description image level duration instructor')
      .populate('certificate')
      .sort({ createdAt: -1 });

    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch completed enrollments', error: error.message });
  }
};

// Get single enrollment details
exports.getEnrollmentById = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id)
      .populate('student', 'name email')
      .populate('course')
      .populate('certificate');

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    // Check authorization
    if (enrollment.student._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch enrollment', error: error.message });
  }
};

// Enroll student in course
exports.enrollStudent = async (req, res) => {
  try {
    const { courseId, totalClassDays } = req.body;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student: req.user._id,
      course: courseId,
    });

    if (existingEnrollment) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    // Create enrollment
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + (course.duration || 30));

    const enrollment = new Enrollment({
      student: req.user._id,
      course: courseId,
      endDate,
      totalClassDays: totalClassDays || 30,
    });

    await enrollment.save();
    await enrollment.populate('course', 'title description image');

    // Update course enrollment count
    await Course.findByIdAndUpdate(courseId, { $inc: { studentsEnrolled: 1 } });

    res.status(201).json({ message: 'Enrolled successfully', enrollment });
  } catch (error) {
    res.status(500).json({ message: 'Failed to enroll', error: error.message });
  }
};

// Update enrollment progress
exports.updateProgress = async (req, res) => {
  try {
    const { progressPercentage, completedDays, attendancePercentage } = req.body;
    const enrollment = await Enrollment.findByIdAndUpdate(
      req.params.id,
      {
        progressPercentage,
        completedDays,
        attendancePercentage,
        status: progressPercentage === 100 ? 'completed' : 'in_progress',
      },
      { new: true }
    );

    res.json({ message: 'Progress updated', enrollment });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update progress', error: error.message });
  }
};

// Mark enrollment as completed
exports.completeEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    // Update enrollment status
    enrollment.status = 'completed';
    enrollment.progressPercentage = 100;
    await enrollment.save();

    // Create certificate
    const certificateNumber = `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const certificate = new Certificate({
      student: enrollment.student,
      course: enrollment.course,
      enrollment: enrollment._id,
      certificateNumber,
      verificationUrl: `https://ifybugsy.com/verify/${certificateNumber}`,
    });

    await certificate.save();
    enrollment.certificate = certificate._id;
    await enrollment.save();

    res.json({ message: 'Enrollment completed and certificate generated', enrollment });
  } catch (error) {
    res.status(500).json({ message: 'Failed to complete enrollment', error: error.message });
  }
};

// Get all enrollments (admin only)
exports.getAllEnrollments = async (req, res) => {
  try {
    const { courseId, status } = req.query;
    let query = {};

    if (courseId) query.course = courseId;
    if (status) query.status = status;

    const enrollments = await Enrollment.find(query)
      .populate('student', 'name email')
      .populate('course', 'title')
      .sort({ createdAt: -1 });

    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch enrollments', error: error.message });
  }
};

module.exports = exports;
