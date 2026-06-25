const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    phone: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['student', 'admin', 'instructor', 'guest'],
      default: 'student',
    },
    profileImage: {
      type: String,
      default: null,
    },
    address: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    isOfflineRegistered: {
      type: Boolean,
      default: false,
    },
    registeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    registeredAt: {
      type: Date,
      default: null,
    },
    // Instructor-specific fields
    skills: [{
      type: String,
      default: null,
    }],
    experience: {
      type: String,
      default: null,
    },
    certifications: [{
      name: String,
      issuer: String,
      date: Date,
    }],
    socialLinks: {
      github: { type: String, default: null },
      linkedin: { type: String, default: null },
      twitter: { type: String, default: null },
      facebook: { type: String, default: null },
      instagram: { type: String, default: null },
      portfolio: { type: String, default: null },
      youtube: { type: String, default: null },
    },
    assignedStudents: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    isSuspended: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Remove password from JSON response
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', userSchema);
