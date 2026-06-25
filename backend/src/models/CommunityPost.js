const mongoose = require('mongoose');

const communityPostSchema = new mongoose.Schema(
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
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      enum: ['React', 'Database', 'CSS', 'DevOps', 'Security', 'Architecture'],
      required: true,
    },
    status: {
      type: String,
      enum: ['unsolved', 'solved'],
      default: 'unsolved',
    },
    replies: [
      {
        content: String,
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        likes: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
          },
        ],
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
    isFlagged: {
      type: Boolean,
      default: false,
    },
    flagReason: String,
  },
  { timestamps: true }
);

// Index for search
communityPostSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('CommunityPost', communityPostSchema);
