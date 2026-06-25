const CommunityPost = require('../models/CommunityPost');

exports.getAllPosts = async (req, res) => {
  try {
    const { category, search, status } = req.query;
    let query = { isFlagged: false };

    if (category) query.category = category;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
      ];
    }

    const posts = await CommunityPost.find(query)
      .populate('author', 'name profileImage role')
      .populate('replies.author', 'name profileImage role')
      .populate('likes', 'name')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch posts', error: error.message });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await CommunityPost.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate('author', 'name profileImage role')
      .populate('replies.author', 'name profileImage role')
      .populate('likes', 'name');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch post', error: error.message });
  }
};

exports.createPost = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    const post = new CommunityPost({
      title,
      description,
      category,
      author: req.user._id,
    });

    await post.save();
    await post.populate('author', 'name profileImage role');

    res.status(201).json({ message: 'Post created', post });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create post', error: error.message });
  }
};

exports.addReply = async (req, res) => {
  try {
    const { content } = req.body;
    const post = await CommunityPost.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          replies: {
            content,
            author: req.user._id,
          },
        },
      },
      { new: true }
    )
      .populate('author', 'name profileImage role')
      .populate('replies.author', 'name profileImage role');

    res.json({ message: 'Reply added', post });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add reply', error: error.message });
  }
};

exports.likePost = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);

    if (post.likes.includes(req.user._id)) {
      post.likes.pull(req.user._id);
    } else {
      post.likes.push(req.user._id);
    }

    await post.save();
    await post.populate('likes', 'name');
    res.json({ message: 'Like updated', liked: post.likes.includes(req.user._id), likesCount: post.likes.length, post });
  } catch (error) {
    res.status(500).json({ message: 'Failed to like post', error: error.message });
  }
};

exports.likeReply = async (req, res) => {
  try {
    const { replyId } = req.params;
    const post = await CommunityPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const reply = post.replies.id(replyId);
    if (!reply) {
      return res.status(404).json({ message: 'Reply not found' });
    }

    if (reply.likes.includes(req.user._id)) {
      reply.likes.pull(req.user._id);
    } else {
      reply.likes.push(req.user._id);
    }

    await post.save();
    res.json({ message: 'Reply like updated', liked: reply.likes.includes(req.user._id), likesCount: reply.likes.length });
  } catch (error) {
    res.status(500).json({ message: 'Failed to like reply', error: error.message });
  }
};

exports.markSolved = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);

    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    post.status = 'solved';
    await post.save();

    res.json({ message: 'Post marked as solved', post });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update post', error: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);

    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await CommunityPost.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete post', error: error.message });
  }
};

exports.flagPost = async (req, res) => {
  try {
    const { reason } = req.body;
    const post = await CommunityPost.findByIdAndUpdate(
      req.params.id,
      { isFlagged: true, flagReason: reason },
      { new: true }
    );

    res.json({ message: 'Post flagged', post });
  } catch (error) {
    res.status(500).json({ message: 'Failed to flag post', error: error.message });
  }
};
