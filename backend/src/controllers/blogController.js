const BlogPost = require('../models/BlogPost');

// Helper function to generate slug
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

exports.getAllBlogPosts = async (req, res) => {
  try {
    const { category, search, published } = req.query;
    let query = {};

    if (published !== undefined) query.isPublished = published === 'true';
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { content: new RegExp(search, 'i') },
      ];
    }

    const posts = await BlogPost.find(query)
      .populate('author', 'name profileImage')
      .sort({ publishedAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch blog posts', error: error.message });
  }
};

exports.getBlogPostBySlug = async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate('author', 'name profileImage bio')
      .populate('comments.author', 'name profileImage');

    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch blog post', error: error.message });
  }
};

exports.createBlogPost = async (req, res) => {
  try {
    const { title, content, excerpt, category, tags, featuredImage } = req.body;

    const slug = generateSlug(title) + '-' + Date.now();

    const post = new BlogPost({
      title,
      slug,
      content,
      excerpt,
      category,
      tags,
      featuredImage,
      author: req.user._id,
      isPublished: false,
    });

    await post.save();
    await post.populate('author', 'name profileImage');

    res.status(201).json({ message: 'Blog post created', post });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create blog post', error: error.message });
  }
};

exports.updateBlogPost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.assign(post, req.body);
    await post.save();

    res.json({ message: 'Blog post updated', post });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update blog post', error: error.message });
  }
};

exports.publishBlogPost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    post.isPublished = true;
    post.publishedAt = new Date();
    await post.save();

    res.json({ message: 'Blog post published', post });
  } catch (error) {
    res.status(500).json({ message: 'Failed to publish blog post', error: error.message });
  }
};

exports.deleteBlogPost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await BlogPost.findByIdAndDelete(req.params.id);
    res.json({ message: 'Blog post deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete blog post', error: error.message });
  }
};

exports.likeBlogPost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);

    if (post.likes.includes(req.user._id)) {
      post.likes.pull(req.user._id);
    } else {
      post.likes.push(req.user._id);
    }

    await post.save();
    res.json({ message: 'Like updated', post });
  } catch (error) {
    res.status(500).json({ message: 'Failed to like post', error: error.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const post = await BlogPost.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          comments: {
            content,
            author: req.user._id,
          },
        },
      },
      { new: true }
    ).populate('comments.author', 'name profileImage');

    res.json({ message: 'Comment added', post });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add comment', error: error.message });
  }
};
