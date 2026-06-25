const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    duration: {
      type: Number,
      required: true, // in days
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: {
      type: Number,
      default: 0,
    },
    studentsEnrolled: {
      type: Number,
      default: 0,
    },
    curriculum: [
      {
        _id: false,
        id: String,
        title: String,
        topics: [String],
      },
    ],
    materials: [
      {
        _id: false,
        id: String,
        title: String,
        type: {
          type: String,
          enum: ['pdf', 'video', 'assignment', 'quiz'],
        },
        url: String,
        content: String,
      },
    ],
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Index for search
courseSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Course', courseSchema);
