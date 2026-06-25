const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: true,
    },
    progressPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    completedDays: {
      type: Number,
      default: 0,
    },
    totalClassDays: {
      type: Number,
      required: true,
    },
    attendancePercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    status: {
      type: String,
      enum: ['in_progress', 'completed', 'suspended'],
      default: 'in_progress',
    },
    dailyProgress: [
      {
        type: Boolean,
        default: false,
      },
    ],
    certificate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Certificate',
      default: null,
    },
    certificateIssuedAt: {
      type: Date,
      default: null,
    },
    isPaidFor: {
      type: Boolean,
      default: false,
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
      default: null,
    },
  },
  { timestamps: true }
);

// Compound index to prevent duplicate enrollments
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

// Pre-save hook to auto-issue certificate when progress reaches 100%
enrollmentSchema.pre('save', async function(next) {
  if (this.progressPercentage === 100 && this.status !== 'completed') {
    this.status = 'completed';
  }
  next();
});

module.exports = mongoose.model('Enrollment', enrollmentSchema);
