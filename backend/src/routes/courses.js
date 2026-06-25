const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);
router.post('/', protect, authorize('instructor', 'admin'), courseController.createCourse);
router.put('/:id', protect, courseController.updateCourse);
router.delete('/:id', protect, courseController.deleteCourse);
router.post('/:id/enroll', protect, courseController.enrollCourse);

module.exports = router;
