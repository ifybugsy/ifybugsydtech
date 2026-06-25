'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/lib/auth-context';
import { useSocket } from '@/lib/socket-context';
import { communityAPI } from '@/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaFire, FaComment, FaThumbsUp, FaEye, FaPlus, FaSearch, FaFilter, FaCheckCircle } from 'react-icons/fa';

interface Post {
  id: string;
  title: string;
  description: string;
  author: string;
  authorRole: 'student' | 'instructor' | 'admin';
  category: string;
  replies: number;
  views: number;
  likes: number;
  timestamp: string;
  solved: boolean;
}

const FALLBACK_POSTS: Post[] = [
  {
    id: '1',
    title: 'How to fix React hooks dependency array issues?',
    description: 'I keep getting infinite loops when using useEffect. Can someone explain the dependency array concept?',
    author: 'Ahmed Ibrahim',
    authorRole: 'student',
    category: 'React',
    replies: 12,
    views: 245,
    likes: 48,
    timestamp: '2 hours ago',
    solved: true,
  },
  {
    id: '2',
    title: 'Best practices for state management in large projects',
    description: 'What are the recommended approaches for managing complex state in enterprise applications?',
    author: 'Zainab Khan',
    authorRole: 'instructor',
    category: 'Architecture',
    replies: 28,
    views: 512,
    likes: 156,
    timestamp: '5 hours ago',
    solved: false,
  },
  {
    id: '3',
    title: 'Database optimization - too many queries',
    description: 'My application is running slow because of N+1 query problems. Any optimization tips?',
    author: 'Chidi Okafor',
    authorRole: 'student',
    category: 'Database',
    replies: 8,
    views: 189,
    likes: 32,
    timestamp: '1 day ago',
    solved: true,
  },
  {
    id: '4',
    title: 'Docker containerization best practices',
    description: 'Looking for guidance on structuring Docker containers for microservices.',
    author: 'Fatima Hassan',
    authorRole: 'student',
    category: 'DevOps',
    replies: 15,
    views: 343,
    likes: 67,
    timestamp: '1 day ago',
    solved: false,
  },
  {
    id: '5',
    title: 'CSS Grid vs Flexbox - when to use each?',
    description: 'I often confuse when to use CSS Grid vs Flexbox. Can someone clarify the use cases?',
    author: 'Emeka Nwankwo',
    authorRole: 'student',
    category: 'CSS',
    replies: 22,
    views: 456,
    likes: 89,
    timestamp: '2 days ago',
    solved: true,
  },
  {
    id: '6',
    title: 'Authentication strategies for modern web apps',
    description: 'Comparing JWT vs Session-based authentication. Pros and cons?',
    author: 'Dr. Sarah Johnson',
    authorRole: 'instructor',
    category: 'Security',
    replies: 34,
    views: 678,
    likes: 201,
    timestamp: '2 days ago',
    solved: false,
  },
];

const categories = ['All', 'React', 'Database', 'CSS', 'DevOps', 'Security', 'Architecture'];

export default function CommunityPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { emit } = useSocket();
  const [posts, setPosts] = useState(FALLBACK_POSTS);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'mostReplies'>('latest');

  // Fetch posts from backend
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await communityAPI.getPosts({
          category: selectedCategory === 'All' ? undefined : selectedCategory,
          search: searchTerm || undefined,
        });
        setPosts(response.data);
      } catch (error) {
        console.warn('[Community] Failed to fetch from backend, using fallback data:', error);
        setPosts(FALLBACK_POSTS);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [selectedCategory, searchTerm]);

  // Listen for real-time post updates
  useEffect(() => {
    const handleNewPost = (newPost: Post) => {
      setPosts((prevPosts) => [newPost, ...prevPosts]);
    };

    emit('join-community', { userId: 'community' });
    // Uncomment when backend is ready
    // on('community-post-created', handleNewPost);

    return () => {
      // off('community-post-created', handleNewPost);
    };
  }, [emit]);

  const filtered = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === 'popular') return b.likes - a.likes;
    if (sortBy === 'mostReplies') return b.replies - a.replies;
    return 0;
  });

  const handleNewPost = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    // Redirect to new post form (can be created later)
    alert('New post form would open here');
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'instructor':
        return 'bg-blue-500/10 text-blue-600';
      case 'admin':
        return 'bg-red-500/10 text-red-600';
      default:
        return 'bg-primary/10 text-primary';
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Header */}
        <section className="py-12 border-b border-border/20 bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div>
                <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
                  Community Forum
                </h1>
                <p className="text-foreground/70 max-w-2xl">
                  Connect with fellow students, get help from instructors, and share knowledge with the Ifybugsy community.
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={handleNewPost}
                className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 w-fit"
              >
                <FaPlus className="w-4 h-4" />
                New Post
              </motion.button>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-8 border-b border-border/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Posts', value: '3,248' },
                { label: 'Active Members', value: '12,456' },
                { label: 'Questions Answered', value: '8,932' },
                { label: 'Topics', value: '45' },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-card rounded-lg border border-border/20 p-4 text-center"
                >
                  <p className="text-2xl sm:text-3xl font-bold text-primary mb-1">{stat.value}</p>
                  <p className="text-sm text-foreground/60">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Search & Filters */}
        <section className="py-8 border-b border-border/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-4">
              {/* Search Box */}
              <div className="relative">
                <FaSearch className="absolute left-4 top-3.5 w-5 h-5 text-foreground/40" />
                <input
                  type="text"
                  placeholder="Search discussions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-2 rounded-lg bg-secondary border border-border text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Category & Sort Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Categories */}
                <div className="flex-1 overflow-x-auto pb-2">
                  <div className="flex gap-2 min-w-max">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 rounded-full font-medium transition-colors whitespace-nowrap ${
                          selectedCategory === cat
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-foreground hover:bg-border'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <FaFilter className="w-4 h-4 text-foreground/60" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                    className="px-4 py-2 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="latest">Latest</option>
                    <option value="popular">Most Popular</option>
                    <option value="mostReplies">Most Replies</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Posts List */}
        <section className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {filtered.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-foreground/70 text-lg">No posts found matching your search.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filtered.map((post, index) => (
                  <Link key={post.id} href={`/community/${post.id}`}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-card rounded-lg border border-border/20 hover:border-primary/50 hover:shadow-md transition-all p-6 cursor-pointer group"
                    >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-3">
                          {post.solved && (
                            <span className="text-xs font-bold bg-green-500/10 text-green-600 px-2 py-1 rounded">
                              ✓ Solved
                            </span>
                          )}
                          <span className={`text-xs font-semibold px-2 py-1 rounded capitalize ${getRoleColor(post.authorRole)}`}>
                            {post.authorRole === 'instructor' ? '👨‍🏫 Instructor' : post.authorRole === 'admin' ? '🛡️ Admin' : 'Student'}
                          </span>
                          <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded">
                            {post.category}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-foreground/70 text-sm mb-3 line-clamp-2">
                          {post.description}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-foreground/60">
                          <span>{post.author}</span>
                          <span>•</span>
                          <span>{post.timestamp}</span>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex gap-6 sm:flex-col sm:gap-3 text-center min-w-fit">
                        <div>
                          <FaComment className="w-4 h-4 mx-auto mb-1 text-primary" />
                          <p className="font-semibold text-foreground">{post.replies}</p>
                          <p className="text-xs text-foreground/60">Replies</p>
                        </div>
                        <div>
                          <FaEye className="w-4 h-4 mx-auto mb-1 text-primary" />
                          <p className="font-semibold text-foreground">{post.views}</p>
                          <p className="text-xs text-foreground/60">Views</p>
                        </div>
                        <div>
                          <FaThumbsUp className="w-4 h-4 mx-auto mb-1 text-primary" />
                          <p className="font-semibold text-foreground">{post.likes}</p>
                          <p className="text-xs text-foreground/60">Likes</p>
                        </div>
                      </div>
                    </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-24 bg-card border-y border-border/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">Can't find what you're looking for?</h2>
            <p className="text-foreground/70 text-lg mb-8">
              Ask the community or our expert instructors for help. Get quick responses from an active community of learners.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={handleNewPost}
              className="px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
            >
              Start a Discussion
            </motion.button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
