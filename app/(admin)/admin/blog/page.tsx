'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaPlus, FaEdit, FaTrash, FaEye, FaSearch, FaCheck, FaClock, FaStar } from 'react-icons/fa';
import Link from 'next/link';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  publishedDate?: string;
  views: number;
  status: 'published' | 'draft' | 'scheduled';
  category: string;
  featured: boolean;
  featuredImage?: string;
}

const MOCK_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'The Future of Web Development in 2025',
    excerpt: 'Explore the latest trends and technologies shaping web development',
    content: 'Full content here...',
    author: 'Dr. Sarah Johnson',
    date: '2025-06-15',
    publishedDate: '2025-06-15',
    views: 2450,
    status: 'published',
    category: 'Technology',
    featured: true,
  },
  {
    id: '2',
    title: 'Machine Learning Fundamentals',
    excerpt: 'A beginner-friendly guide to understanding ML',
    content: 'Full content here...',
    author: 'Prof. Michael Chen',
    date: '2025-06-10',
    publishedDate: '2025-06-10',
    views: 1820,
    status: 'published',
    category: 'AI',
    featured: false,
  },
  {
    id: '3',
    title: 'Agile Development Best Practices',
    excerpt: 'Tips for successful agile implementation',
    content: 'Full content here...',
    author: 'Emily Rodriguez',
    date: '2025-06-05',
    views: 0,
    status: 'draft',
    category: 'Development',
    featured: false,
  },
];

export default function BlogManagementPage() {
  const router = useRouter();
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft' | 'scheduled'>('all');
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    status: 'draft',
    featured: false,
    publishedDate: new Date().toISOString().split('T')[0],
    featuredImage: '',
  });

  const filtered = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || post.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handlePublish = (post: BlogPost) => {
    setPosts(posts.map((p) => p.id === post.id ? { ...p, status: 'published', publishedDate: new Date().toISOString().split('T')[0], views: p.views + 0 } : p));
  };

  const handleUnpublish = (post: BlogPost) => {
    setPosts(posts.map((p) => p.id === post.id ? { ...p, status: 'draft' } : p));
  };

  const handleToggleFeatured = (post: BlogPost) => {
    setPosts(posts.map((p) => p.id === post.id ? { ...p, featured: !p.featured } : p));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData({ ...formData, featuredImage: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePost = () => {
    if (!formData.title?.trim()) return;

    if (editingPost) {
      setPosts(posts.map((p) => (p.id === editingPost.id ? { ...editingPost, ...formData } : p)));
    } else {
      const newPost: BlogPost = {
        id: Date.now().toString(),
        title: formData.title || '',
        excerpt: formData.excerpt || '',
        content: formData.content || '',
        category: formData.category || '',
        status: (formData.status || 'draft') as 'published' | 'draft' | 'scheduled',
        author: 'Admin User',
        date: new Date().toISOString().split('T')[0],
        publishedDate: formData.publishedDate,
        views: 0,
        featured: formData.featured || false,
        featuredImage: formData.featuredImage,
      };
      setPosts([newPost, ...posts]);
    }

    setShowForm(false);
    setEditingPost(null);
    setImagePreview('');
    setFormData({ title: '', excerpt: '', content: '', category: '', status: 'draft', featured: false, featuredImage: '' });
  };

  const handleDeletePost = (id: string) => {
    setPosts(posts.filter((p) => p.id !== id));
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Header */}
        <section className="border-b border-border/20 bg-card py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-4"
            >
              <FaArrowLeft className="w-4 h-4" />
              Back
            </button>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Blog Management</h1>
                <p className="text-foreground/70 mt-1">Create and manage blog posts</p>
              </div>
              <button
                onClick={() => {
                  setShowForm(!showForm);
                  setEditingPost(null);
                  setFormData({});
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-semibold"
              >
                <FaPlus className="w-4 h-4" />
                New Post
              </button>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-8 sm:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            {/* New Post Form */}
            {showForm && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-lg border border-border/20 p-6 mb-8"
              >
                <h2 className="text-xl font-bold text-foreground mb-6">
                  {editingPost ? 'Edit Post' : 'Create New Post'}
                </h2>
                <div className="space-y-4">
                  {/* Featured Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Featured Image</label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                      {imagePreview ? (
                        <div className="relative">
                          <img src={imagePreview} alt="Preview" className="h-40 w-auto mx-auto rounded-lg object-cover" />
                          <button
                            type="button"
                            onClick={() => {
                              setImagePreview('');
                              setFormData({ ...formData, featuredImage: '' });
                            }}
                            className="mt-2 px-3 py-1 bg-red-500/20 text-red-500 rounded text-sm hover:bg-red-500/30 transition-colors"
                          >
                            Remove Image
                          </button>
                        </div>
                      ) : (
                        <div>
                          <p className="text-foreground/60 mb-2">Upload blog featured image</p>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="w-full"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Title</label>
                    <input
                      type="text"
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Post title"
                      className="w-full px-4 py-2 rounded-lg bg-secondary border border-border text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Excerpt</label>
                    <input
                      type="text"
                      value={formData.excerpt || ''}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      placeholder="Brief excerpt"
                      className="w-full px-4 py-2 rounded-lg bg-secondary border border-border text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Category</label>
                    <select
                      value={formData.category || ''}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select Category</option>
                      <option value="Technology">Technology</option>
                      <option value="AI">AI & ML</option>
                      <option value="Development">Development</option>
                      <option value="Career">Career</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Content</label>
                    <textarea
                      value={formData.content || ''}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Post content"
                      rows={8}
                      className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Status</label>
                    <select
                      value={formData.status || 'draft'}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as 'published' | 'draft' | 'scheduled' })}
                      className="w-full px-4 py-2 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="scheduled">Scheduled</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.featured || false}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-4 h-4 rounded border-border"
                    />
                    <label className="text-sm font-medium text-foreground">Featured Post</label>
                  </div>

                  {formData.status === 'scheduled' && (
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Publish Date</label>
                      <input
                        type="date"
                        value={formData.publishedDate || ''}
                        onChange={(e) => setFormData({ ...formData, publishedDate: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  )}

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      onClick={() => {
                        setShowForm(false);
                        setEditingPost(null);
                        setFormData({});
                      }}
                      className="px-6 py-2 rounded-lg bg-secondary hover:bg-border text-foreground transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSavePost}
                      className="px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
                    >
                      {editingPost ? 'Update' : 'Publish'}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-4 top-3.5 w-4 h-4 text-foreground/40" />
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-2 rounded-lg bg-secondary border border-border text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-4 py-2 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Posts</option>
                <option value="published">Published</option>
                <option value="draft">Drafts</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>

            {/* Posts List */}
            <div className="space-y-4">
              {filtered.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-card rounded-lg border border-border/20 p-6 hover:border-primary/50 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                          {post.featured && <FaStar className="w-4 h-4 text-yellow-500" />}
                          {post.title}
                        </h3>
                        <div className="flex gap-2 mt-2">
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                              post.status === 'published'
                                ? 'bg-green-500/20 text-green-600 dark:text-green-400'
                                : post.status === 'scheduled'
                                ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400'
                                : 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400'
                            }`}
                          >
                            {post.status === 'scheduled' && <FaClock className="w-3 h-3" />}
                            {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                          </span>
                          <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">{post.category}</span>
                        </div>
                      </div>
                      <p className="text-foreground/70 text-sm mb-3">{post.excerpt}</p>
                      <div className="flex items-center gap-4 text-xs text-foreground/60">
                        <span>By {post.author}</span>
                        <span>•</span>
                        <span>{post.date}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <FaEye className="w-3 h-3" />
                          {post.views} views
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {post.status === 'draft' && (
                        <button
                          onClick={() => handlePublish(post)}
                          className="p-2 rounded-lg hover:bg-green-500/20 text-foreground/70 hover:text-green-500 transition-colors"
                          title="Publish"
                        >
                          <FaCheck className="w-4 h-4" />
                        </button>
                      )}
                      {post.status === 'published' && (
                        <button
                          onClick={() => handleUnpublish(post)}
                          className="p-2 rounded-lg hover:bg-yellow-500/20 text-foreground/70 hover:text-yellow-500 transition-colors"
                          title="Unpublish"
                        >
                          <FaTimes className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleToggleFeatured(post)}
                        className={`p-2 rounded-lg transition-colors ${
                          post.featured
                            ? 'bg-yellow-500/20 text-yellow-500'
                            : 'hover:bg-yellow-500/20 text-foreground/70 hover:text-yellow-500'
                        }`}
                        title="Toggle Featured"
                      >
                        <FaStar className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingPost(post);
                          setFormData(post);
                          setShowForm(true);
                        }}
                        className="p-2 rounded-lg hover:bg-secondary text-foreground/70 hover:text-primary transition-colors"
                      >
                        <FaEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="p-2 rounded-lg hover:bg-red-500/20 text-foreground/70 hover:text-red-500 transition-colors"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
