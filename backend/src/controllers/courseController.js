const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

exports.getAllCourses = async (req, res) => {
  try {
    const { level, search } = req.query;
    let query = { isPublished: true };

    if (level) query.level = level;
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
      ];
    }

    const courses = await Course.find(query).populate('instructor', 'name email bio image');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch courses', error: error.message });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('instructor', 'name email bio image');
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch course', error: error.message });
  }
};

exports.createCourse = async (req, res) => {
  try {
    const { title, description, image, price, duration, level, curriculum, materials } = req.body;

    const course = new Course({
      title,
      description,
      image,
      price,
      duration,
      level,
      curriculum,
      materials,
      instructor: req.user._id,
    });

    await course.save();
    await course.populate('instructor', 'name email bio image');
    res.status(201).json({ message: 'Course created', course });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create course', error: error.message });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.assign(course, req.body);
    await course.save();
    res.json({ message: 'Course updated', course });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update course', error: error.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Course deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete course', error: error.message });
  }
};

exports.enrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if already enrolled
    const existing = await Enrollment.findOne({
      student: req.user._id,
      course: req.params.id,
    });

    if (existing) {
      return res.status(400).json({ message: 'Already enrolled' });
    }

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + course.duration);

    const enrollment = new Enrollment({
      student: req.user._id,
      course: req.params.id,
      endDate,
      totalClassDays: course.duration,
      dailyProgress: Array(course.duration).fill(false),
    });

    await enrollment.save();
    course.studentsEnrolled += 1;
    await course.save();

    res.status(201).json({ message: 'Enrolled successfully', enrollment });
  } catch (error) {
    res.status(500).json({ message: 'Enrollment failed', error: error.message });
  }
};
