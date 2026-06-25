const Attendance = require('../models/Attendance');
const User = require('../models/User');
const Course = require('../models/Course');

// Mark attendance for a student
exports.markAttendance = async (req, res) => {
  try {
    const { studentId, courseId, status, remarks } = req.body;

    if (!studentId || !courseId || !status) {
      return res.status(400).json({ message: 'Student ID, Course ID, and status are required' });
    }

    // Check if attendance already marked today for this student/course
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingAttendance = await Attendance.findOne({
      student: studentId,
      course: courseId,
      date: { $gte: today, $lt: tomorrow },
    });

    if (existingAttendance) {
      // Update existing attendance
      existingAttendance.status = status;
      existingAttendance.remarks = remarks || existingAttendance.remarks;
      existingAttendance.markedBy = req.user._id;
      existingAttendance.markedAt = new Date();
      await existingAttendance.save();

      return res.json({
        message: 'Attendance updated',
        attendance: existingAttendance,
      });
    }

    // Create new attendance record
    const attendance = new Attendance({
      course: courseId,
      student: studentId,
      date: new Date(),
      status,
      remarks,
      markedBy: req.user._id,
    });

    await attendance.save();

    res.status(201).json({
      message: 'Attendance marked',
      attendance: await attendance.populate('student', 'name email'),
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to mark attendance', error: error.message });
  }
};

// Bulk mark attendance for entire class
exports.bulkMarkAttendance = async (req, res) => {
  try {
    const { courseId, attendanceData } = req.body; // attendanceData: [{studentId, status, remarks}]

    if (!courseId || !Array.isArray(attendanceData)) {
      return res.status(400).json({ message: 'Course ID and attendance data required' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const results = [];
    const errors = [];

    for (const record of attendanceData) {
      try {
        const { studentId, status, remarks } = record;

        const existingAttendance = await Attendance.findOne({
          student: studentId,
          course: courseId,
          date: { $gte: today, $lt: tomorrow },
        });

        if (existingAttendance) {
          existingAttendance.status = status;
          existingAttendance.remarks = remarks || existingAttendance.remarks;
          existingAttendance.markedBy = req.user._id;
          existingAttendance.markedAt = new Date();
          await existingAttendance.save();
          results.push(existingAttendance);
        } else {
          const attendance = new Attendance({
            course: courseId,
            student: studentId,
            date: new Date(),
            status,
            remarks,
            markedBy: req.user._id,
          });
          await attendance.save();
          results.push(attendance);
        }
      } catch (err) {
        errors.push({ studentId: record.studentId, error: err.message });
      }
    }

    res.json({
      message: 'Bulk attendance marked',
      marked: results.length,
      failed: errors.length,
      results,
      errors,
    });
  } catch (error) {
    res.status(500).json({ message: 'Bulk marking failed', error: error.message });
  }
};

// Get attendance for a course on a specific date
exports.getAttendanceByDate = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { date } = req.query;

    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const attendance = await Attendance.find({
      course: courseId,
      date: { $gte: targetDate, $lt: nextDay },
    })
      .populate('student', 'name email phone')
      .populate('markedBy', 'name email');

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch attendance', error: error.message });
  }
};

// Get attendance report for a student
exports.getStudentAttendanceReport = async (req, res) => {
  try {
    const { studentId, courseId } = req.query;

    const query = {};
    if (studentId) query.student = studentId;
    if (courseId) query.course = courseId;

    const attendance = await Attendance.find(query)
      .populate('course', 'title')
      .populate('student', 'name email')
      .sort({ date: -1 })
      .limit(100);

    // Calculate statistics
    const totalDays = attendance.length;
    const presentDays = attendance.filter((a) => a.status === 'present').length;
    const absentDays = attendance.filter((a) => a.status === 'absent').length;
    const lateDays = attendance.filter((a) => a.status === 'late').length;
    const excusedDays = attendance.filter((a) => a.status === 'excused').length;

    const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

    res.json({
      attendance,
      statistics: {
        totalDays,
        presentDays,
        absentDays,
        lateDays,
        excusedDays,
        attendancePercentage,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch report', error: error.message });
  }
};

// Get attendance report for entire course
exports.getCourseAttendanceReport = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { startDate, endDate } = req.query;

    const query = { course: courseId };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const attendance = await Attendance.find(query)
      .populate('student', 'name email')
      .populate('markedBy', 'name email')
      .sort({ date: -1 });

    // Group by student and calculate statistics
    const studentStats = {};
    attendance.forEach((record) => {
      const studentId = record.student._id.toString();
      if (!studentStats[studentId]) {
        studentStats[studentId] = {
          studentName: record.student.name,
          studentEmail: record.student.email,
          totalDays: 0,
          presentDays: 0,
          absentDays: 0,
          lateDays: 0,
          excusedDays: 0,
          attendancePercentage: 0,
        };
      }

      studentStats[studentId].totalDays += 1;
      if (record.status === 'present') studentStats[studentId].presentDays += 1;
      else if (record.status === 'absent') studentStats[studentId].absentDays += 1;
      else if (record.status === 'late') studentStats[studentId].lateDays += 1;
      else if (record.status === 'excused') studentStats[studentId].excusedDays += 1;
    });

    // Calculate percentages
    Object.values(studentStats).forEach((stat) => {
      if (stat.totalDays > 0) {
        stat.attendancePercentage = Math.round((stat.presentDays / stat.totalDays) * 100);
      }
    });

    res.json({
      courseId,
      period: { startDate, endDate },
      totalRecords: attendance.length,
      studentStats: Object.values(studentStats),
      rawAttendance: attendance,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch course report', error: error.message });
  }
};

// Get today's attendance for a course
exports.getTodayAttendance = async (req, res) => {
  try {
    const { courseId } = req.params;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const attendance = await Attendance.find({
      course: courseId,
      date: { $gte: today, $lt: tomorrow },
    })
      .populate('student', 'name email phone')
      .populate('markedBy', 'name email');

    // Get course and enrolled students
    const course = await Course.findById(courseId).populate('enrolledStudents');
    const enrolledStudentIds = course.enrolledStudents.map((s) => s._id.toString());
    const markedStudentIds = attendance.map((a) => a.student._id.toString());
    const unmarkedStudentIds = enrolledStudentIds.filter((id) => !markedStudentIds.includes(id));

    res.json({
      date: new Date().toDateString(),
      marked: attendance,
      unmarked: unmarkedStudentIds.length,
      total: enrolledStudentIds.length,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch today attendance', error: error.message });
  }
};
