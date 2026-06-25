const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema(
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
    certificateNumber: {
      type: String,
      unique: true,
      required: true,
    },
    enrollment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Enrollment',
      required: true,
    },
    issuedAt: {
      type: Date,
      default: Date.now,
    },
    verificationUrl: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Certificate', certificateSchema);
