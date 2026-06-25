const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['present', 'absent', 'late', 'excused'],
      default: 'absent',
    },
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    remarks: String,
    markedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for fast queries
attendanceSchema.index({ course: 1, date: 1 });
attendanceSchema.index({ student: 1, course: 1 });

module.exports = mongoose.model('Attendance', attendanceSchema);
