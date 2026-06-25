const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Order = require('../models/Order');
const Certificate = require('../models/Certificate');

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    // Get total counts
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalInstructors = await User.countDocuments({ role: 'instructor' });
    const totalCourses = await Course.countDocuments({ isPublished: true });
    const totalEnrollments = await Enrollment.countDocuments();
    const completedEnrollments = await Enrollment.countDocuments({ status: 'completed' });
    const totalCertificates = await Certificate.countDocuments();
    const totalOrders = await Order.countDocuments();

    // Get revenue data
    const orders = await Order.find();
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);

    // Get recent enrollments
    const recentEnrollments = await Enrollment.find()
      .populate('student', 'name email')
      .populate('course', 'title')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get course statistics
    const courseStats = await Course.aggregate([
      {
        $group: {
          _id: '$level',
          count: { $sum: 1 },
          avgRating: { $avg: '$rating' },
        },
      },
    ]);

    // Get enrollment statistics
    const enrollmentStats = await Enrollment.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          avgProgress: { $avg: '$progressPercentage' },
        },
      },
    ]);

    // Monthly statistics (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyStats = await Enrollment.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          newEnrollments: { $sum: 1 },
          completedEnrollments: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
          },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
    ]);

    res.json({
      summary: {
        totalUsers,
        totalStudents,
        totalInstructors,
        totalCourses,
        totalEnrollments,
        completedEnrollments,
        completionRate: totalEnrollments > 0 ? (completedEnrollments / totalEnrollments * 100).toFixed(2) : 0,
        totalCertificates,
        totalOrders,
        totalRevenue: totalRevenue.toFixed(2),
      },
      courseStats,
      enrollmentStats,
      monthlyStats,
      recentEnrollments,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch statistics', error: error.message });
  }
};

// Get user statistics (admin only)
exports.getUserStats = async (req, res) => {
  try {
    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
        },
      },
    ]);

    const activeUsers = await User.countDocuments({ isActive: true });
    const verifiedUsers = await User.countDocuments({ isVerified: true });

    const userGrowth = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          newUsers: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
    ]);

    res.json({
      usersByRole,
      activeUsers,
      verifiedUsers,
      userGrowth,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user statistics', error: error.message });
  }
};

// Get course statistics (admin only)
exports.getCourseStats = async (req, res) => {
  try {
    const courseStats = await Course.aggregate([
      {
        $lookup: {
          from: 'enrollments',
          localField: '_id',
          foreignField: 'course',
          as: 'enrollments',
        },
      },
      {
        $project: {
          title: 1,
          level: 1,
          price: 1,
          rating: 1,
          studentsEnrolled: { $size: '$enrollments' },
          enrollments: 1,
        },
      },
      {
        $sort: { studentsEnrolled: -1 },
      },
    ]);

    const topCourses = courseStats.slice(0, 10);
    const avgCourseEnrollment = courseStats.length > 0
      ? (courseStats.reduce((sum, c) => sum + c.studentsEnrolled, 0) / courseStats.length).toFixed(2)
      : 0;

    res.json({
      totalCourses: courseStats.length,
      topCourses,
      avgCourseEnrollment,
      courseStats,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch course statistics', error: error.message });
  }
};

// Get enrollment statistics (admin only)
exports.getEnrollmentStats = async (req, res) => {
  try {
    const enrollmentStats = await Enrollment.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          avgProgress: { $avg: '$progressPercentage' },
          avgAttendance: { $avg: '$attendancePercentage' },
        },
      },
    ]);

    const completionRate = await Enrollment.aggregate([
      {
        $match: { status: 'completed' },
      },
      {
        $count: 'completed',
      },
    ]);

    res.json({
      enrollmentStats,
      completionRate: completionRate[0]?.completed || 0,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch enrollment statistics', error: error.message });
  }
};

module.exports = exports;
