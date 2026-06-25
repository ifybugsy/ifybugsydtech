const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '24h',
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      phone,
      role: role === 'instructor' ? 'instructor' : 'student',
    });

    await user.save();

    const token = generateToken(user._id);
    res.status(201).json({
      message: 'Registration successful',
      user: user.toJSON(),
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

// Instructor Registration
exports.registerInstructor = async (req, res) => {
  try {
    const { name, email, password, phone, bio, skills, experience } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Instructor with this email already exists' });
    }

    // Validate required fields
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create new instructor
    const instructor = new User({
      name,
      email,
      password,
      phone,
      role: 'instructor',
      bio: bio || '',
      skills: Array.isArray(skills) ? skills : (skills ? [skills] : []),
      experience: experience || '',
    });

    await instructor.save();

    const token = generateToken(instructor._id);
    res.status(201).json({
      message: 'Instructor registration successful',
      user: instructor.toJSON(),
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Instructor registration failed', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);
    res.json({
      message: 'Login successful',
      user: user.toJSON(),
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user.toJSON());
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user', error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, bio, address } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, bio, address },
      { new: true, runValidators: true }
    );
    res.json({ message: 'Profile updated', user: user.toJSON() });
  } catch (error) {
    res.status(500).json({ message: 'Update failed', error: error.message });
  }
};

// Admin: Register offline student
exports.registerOfflineStudent = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Student with this email already exists' });
    }

    // Generate temporary password
    const tempPassword = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);

    // Create new offline student
    const user = new User({
      name,
      email,
      password: tempPassword,
      phone,
      role: 'student',
      isOfflineRegistered: true,
      registeredBy: req.user._id,
      registeredAt: new Date(),
    });

    await user.save();

    res.status(201).json({
      message: 'Offline student registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        temporaryPassword: tempPassword, // Send this only once to admin
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

// Admin: Get all offline students
exports.getOfflineStudents = async (req, res) => {
  try {
    const students = await User.find({ isOfflineRegistered: true })
      .select('-password')
      .populate('registeredBy', 'name email');
    
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch offline students', error: error.message });
  }
};

// Admin: Bulk register offline students
exports.bulkRegisterOfflineStudents = async (req, res) => {
  try {
    const { students } = req.body; // Array of {name, email, phone}

    if (!Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ message: 'Students array is required' });
    }

    const createdStudents = [];
    const errors = [];

    for (const studentData of students) {
      try {
        const { name, email, phone } = studentData;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          errors.push({ email, error: 'Email already exists' });
          continue;
        }

        // Generate temporary password
        const tempPassword = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);

        const user = new User({
          name,
          email,
          password: tempPassword,
          phone,
          role: 'student',
          isOfflineRegistered: true,
          registeredBy: req.user._id,
          registeredAt: new Date(),
        });

        await user.save();

        createdStudents.push({
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          temporaryPassword: tempPassword,
        });
      } catch (err) {
        errors.push({ data: studentData, error: err.message });
      }
    }

    res.status(201).json({
      message: 'Bulk registration completed',
      createdStudents,
      errors,
      summary: {
        total: students.length,
        created: createdStudents.length,
        failed: errors.length,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Bulk registration failed', error: error.message });
  }
};
