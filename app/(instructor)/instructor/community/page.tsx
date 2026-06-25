'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useNotifications } from '@/lib/notifications-context';
import { FaArrowLeft, FaPlus, FaHeart, FaComment } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function InstructorCommunityPage() {
  const { addNotification } = useNotifications();
  const [isCreating, setIsCreating] = useState(false);
  const [newPost, setNewPost] = useState('');
  const [posts] = useState([
    {
      id: '1',
      title: 'Welcome to My Community!',
      content: 'This is a great place for announcements and discussions.',
      type: 'announcement',
      likes: 24,
      comments: 5,
      timestamp: '2 days ago',
    },
    {
      id: '2',
      title: 'Learning Resource: React Docs',
      content: 'Check out the official React documentation...',
      type: 'resource',
      likes: 18,
      comments: 3,
      timestamp: '1 day ago',
    },
  ]);

  const handleCreatePost = () => {
    if (!newPost.trim()) {
      addNotification('Please write something', 'error');
      return;
    }
    addNotification('Post created successfully', 'success');
    setNewPost('');
    setIsCreating(false);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <section className="py-8 border-b border-border/20 bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/instructor" className="p-2 hover:bg-secondary rounded-lg">
                  <FaArrowLeft className="w-5 h-5 text-foreground" />
                </Link>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Community</h1>
                  <p className="text-foreground/70">Share posts and resources with your students</p>
                </div>
              </div>
              <button
                onClick={() => setIsCreating(!isCreating)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
              >
                <FaPlus className="w-4 h-4" />
                New Post
              </button>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-2xl mx-auto px-4 sm:px-6">
            {/* Create Post */}
            {isCreating && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-6 bg-card border border-border/20 rounded-xl"
              >
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="Share something with your students..."
                  rows={4}
                  className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary mb-3"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleCreatePost}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                  >
                    Post
                  </button>
                  <button
                    onClick={() => setIsCreating(false)}
                    className="px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}

            {/* Posts */}
            <div className="space-y-4">
              {posts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 bg-card border border-border/20 rounded-xl hover:border-primary/50 transition-colors"
                >
                  <div className="mb-3">
                    <span className="inline-block px-2 py-1 text-xs font-semibold bg-primary/20 text-primary rounded mb-2">
                      {post.type.charAt(0).toUpperCase() + post.type.slice(1)}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{post.title}</h3>
                  <p className="text-foreground/70 mb-4">{post.content}</p>
                  <div className="flex items-center justify-between text-sm text-foreground/60">
                    <span>{post.timestamp}</span>
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-1 hover:text-primary transition-colors">
                        <FaHeart className="w-4 h-4" />
                        {post.likes}
                      </button>
                      <button className="flex items-center gap-1 hover:text-primary transition-colors">
                        <FaComment className="w-4 h-4" />
                        {post.comments}
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
