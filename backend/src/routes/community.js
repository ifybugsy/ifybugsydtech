const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', communityController.getAllPosts);
router.get('/:id', communityController.getPostById);
router.post('/', protect, communityController.createPost);
router.post('/:id/reply', protect, communityController.addReply);
router.post('/:id/like', protect, communityController.likePost);
router.post('/:id/reply/:replyId/like', protect, communityController.likeReply);
router.put('/:id/mark-solved', protect, communityController.markSolved);
router.delete('/:id', protect, communityController.deletePost);
router.post('/:id/flag', protect, communityController.flagPost);

module.exports = router;
