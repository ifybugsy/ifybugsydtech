const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/auth');

// Mark attendance
router.post('/mark', protect, authorize('admin', 'instructor'), attendanceController.markAttendance);
router.post('/bulk-mark', protect, authorize('admin', 'instructor'), attendanceController.bulkMarkAttendance);

// Get attendance
router.get('/by-date/:courseId', protect, authorize('admin', 'instructor'), attendanceController.getAttendanceByDate);
router.get('/today/:courseId', protect, authorize('admin', 'instructor'), attendanceController.getTodayAttendance);
router.get('/report', protect, attendanceController.getStudentAttendanceReport);
router.get('/course-report/:courseId', protect, authorize('admin', 'instructor'), attendanceController.getCourseAttendanceReport);

module.exports = router;
