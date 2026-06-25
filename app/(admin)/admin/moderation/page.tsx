'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaTrash, FaCheckCircle, FaSearch, FaFlag, FaComments, FaEye } from 'react-icons/fa';

interface CommunityPost {
  id: string;
  title: string;
  author: string;
  category: string;
  date: string;
  status: 'approved' | 'flagged' | 'pending';
  reportCount: number;
  violations: string[];
  content: string;
}

const MOCK_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: '1',
    title: 'Inappropriate language in course discussion',
    author: 'Ahmed Ibrahim',
    category: 'React',
    date: '2025-06-15',
    status: 'flagged',
    reportCount: 3,
    violations: ['Inappropriate language', 'Harassment'],
    content: 'This post contains offensive content that violates community standards...',
  },
  {
    id: '2',
    title: 'How to optimize React performance?',
    author: 'Zainab Khan',
    category: 'React',
    date: '2025-06-14',
    status: 'approved',
    reportCount: 0,
    violations: [],
    content: 'A legitimate technical question about React optimization...',
  },
  {
    id: '3',
    title: 'Spam promotional post',
    author: 'Unknown User',
    category: 'General',
    date: '2025-06-13',
    status: 'flagged',
    reportCount: 5,
    violations: ['Spam', 'Promotional content'],
    content: 'Buy my courses at unbelievable prices! Click here...',
  },
  {
    id: '4',
    title: 'Database indexing strategies',
    author: 'Chidi Okafor',
    category: 'Database',
    date: '2025-06-12',
    status: 'pending',
    reportCount: 1,
    violations: [],
    content: 'A detailed explanation of database indexing techniques...',
  },
  {
    id: '5',
    title: 'Off-topic discussion',
    author: 'Fatima Hassan',
    category: 'Off-Topic',
    date: '2025-06-11',
    status: 'flagged',
    reportCount: 2,
    violations: ['Off-topic', 'Not relevant to learning'],
    content: 'This post is about personal matters unrelated to tech education...',
  },
];

export default function ModerationPage() {
  const router = useRouter();
  const [posts, setPosts] = useState(MOCK_COMMUNITY_POSTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'approved' | 'flagged' | 'pending'>('all');
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);

  const filtered = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || post.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (id: string) => {
    setPosts(posts.map((p) => (p.id === id ? { ...p, status: 'approved' as const } : p)));
    setSelectedPost(null);
  };

  const handleDelete = (id: string) => {
    setPosts(posts.filter((p) => p.id !== id));
    setSelectedPost(null);
  };

  const handleFlag = (id: string) => {
    setPosts(posts.map((p) => (p.id === id ? { ...p, status: 'flagged' as const } : p)));
    setSelectedPost(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500/20 text-green-600 dark:text-green-400';
      case 'flagged':
        return 'bg-red-500/20 text-red-600 dark:text-red-400';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400';
      default:
        return 'bg-gray-500/20 text-gray-600 dark:text-gray-400';
    }
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
            <div>
              <h1 className="text-3xl font-bold text-foreground">Community Moderation</h1>
              <p className="text-foreground/70 mt-1">Review and moderate community posts</p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-8 sm:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            {/* Detail View */}
            {selectedPost && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-lg border border-border/20 p-6 mb-8"
              >
                <button
                  onClick={() => setSelectedPost(null)}
                  className="mb-4 text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                >
                  <FaArrowLeft className="w-3 h-3" />
                  Back to list
                </button>

                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">{selectedPost.title}</h2>
                    <div className="flex items-center gap-4 text-sm text-foreground/70">
                      <span>By {selectedPost.author}</span>
                      <span>•</span>
                      <span>{selectedPost.date}</span>
                      <span>•</span>
                      <span className="bg-primary/20 text-primary px-2 py-1 rounded">{selectedPost.category}</span>
                    </div>
                  </div>

                  <div className="bg-secondary/30 rounded-lg p-4">
                    <p className="text-foreground leading-relaxed">{selectedPost.content}</p>
                  </div>

                  {selectedPost.violations.length > 0 && (
                    <div>
                      <h3 className="font-bold text-foreground mb-3">Reported Violations</h3>
                      <div className="space-y-2">
                        {selectedPost.violations.map((violation, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 text-red-600 dark:text-red-400"
                          >
                            <FaFlag className="w-4 h-4" />
                            {violation}
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-foreground/70 mt-3">
                        Report count: <strong>{selectedPost.reportCount}</strong> reports from community
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3 pt-6 border-t border-border/20">
                    <button
                      onClick={() => handleApprove(selectedPost.id)}
                      className="flex-1 px-4 py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <FaCheckCircle className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleDelete(selectedPost.id)}
                      className="flex-1 px-4 py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <FaTrash className="w-4 h-4" />
                      Delete
                    </button>
                    <button
                      onClick={() => handleFlag(selectedPost.id)}
                      className="flex-1 px-4 py-3 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <FaFlag className="w-4 h-4" />
                      Flag
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
                  placeholder="Search posts or authors..."
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
                <option value="approved">Approved</option>
                <option value="flagged">Flagged</option>
                <option value="pending">Pending Review</option>
              </select>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-card rounded-lg border border-border/20 p-4">
                <div className="flex items-center gap-3">
                  <FaComments className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="text-foreground/70 text-sm">Total Posts</p>
                    <p className="text-2xl font-bold text-foreground">{posts.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-card rounded-lg border border-border/20 p-4">
                <div className="flex items-center gap-3">
                  <FaFlag className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <div>
                    <p className="text-foreground/70 text-sm">Flagged</p>
                    <p className="text-2xl font-bold text-foreground">{posts.filter((p) => p.status === 'flagged').length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-card rounded-lg border border-border/20 p-4">
                <div className="flex items-center gap-3">
                  <FaCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="text-foreground/70 text-sm">Approved</p>
                    <p className="text-2xl font-bold text-foreground">{posts.filter((p) => p.status === 'approved').length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Posts List */}
            <div className="space-y-4">
              {filtered.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedPost(post)}
                  className="bg-card rounded-lg border border-border/20 p-6 hover:border-primary/50 transition-all cursor-pointer hover:shadow-md"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-foreground">{post.title}</h3>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(post.status)}`}>
                          {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-foreground/70 mb-3">
                        <span>By {post.author}</span>
                        <span>•</span>
                        <span>{post.date}</span>
                        <span>•</span>
                        <span className="bg-primary/20 text-primary px-2 py-1 rounded">{post.category}</span>
                      </div>
                      {post.violations.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {post.violations.slice(0, 2).map((violation, index) => (
                            <span key={index} className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-red-500/20 text-red-600 dark:text-red-400">
                              <FaFlag className="w-2 h-2" />
                              {violation}
                            </span>
                          ))}
                          {post.violations.length > 2 && (
                            <span className="text-xs text-foreground/70">+{post.violations.length - 2} more</span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      {post.reportCount > 0 && (
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 text-red-600 dark:text-red-400">
                            <FaFlag className="w-4 h-4" />
                            <span className="font-bold">{post.reportCount}</span>
                          </div>
                          <p className="text-xs text-foreground/60">Reports</p>
                        </div>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPost(post);
                        }}
                        className="px-4 py-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors text-sm font-medium"
                      >
                        <FaEye className="w-4 h-4" />
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
