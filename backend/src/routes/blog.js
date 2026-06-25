const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', blogController.getAllBlogPosts);
router.get('/:id', blogController.getBlogPostBySlug);
router.post('/', protect, authorize('admin', 'instructor'), blogController.createBlogPost);
router.put('/:id', protect, blogController.updateBlogPost);
router.post('/:id/publish', protect, blogController.publishBlogPost);
router.delete('/:id', protect, blogController.deleteBlogPost);
router.post('/:id/like', protect, blogController.likeBlogPost);
router.post('/:id/comments', protect, blogController.addComment);

module.exports = router;
