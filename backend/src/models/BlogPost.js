const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },
    content: {
      type: String,
      required: true,
    },
    excerpt: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    featuredImage: String,
    category: String,
    tags: [String],
    views: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    comments: [
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
      },
    ],
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: Date,
  },
  { timestamps: true }
);

// Index for search
blogPostSchema.index({ title: 'text', content: 'text', tags: 1 });

module.exports = mongoose.model('BlogPost', blogPostSchema);
