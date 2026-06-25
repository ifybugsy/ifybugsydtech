'use client';

import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/lib/auth-context';
import { useNotifications } from '@/lib/notifications-context';
import { communityAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaComment, FaThumbsUp, FaEye, FaPlus, FaSpinner } from 'react-icons/fa';

interface CommunityPost {
  _id: string;
  title: string;
  description: string;
  category: string;
  author: {
    name: string;
    profileImage: string;
  };
  likes: number;
  replies: number;
  views: number;
  createdAt: string;
}

export default function DashboardCommunityPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { addNotification } = useNotifications();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await communityAPI.getPosts({
          category: selectedCategory === 'all' ? undefined : selectedCategory,
        });
        setPosts(response.data || []);
      } catch (error) {
        console.error('[Community] Error fetching posts:', error);
        addNotification('error', 'Error', 'Failed to load community posts');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchPosts();
    }
  }, [isAuthenticated, selectedCategory, addNotification]);

  if (!isAuthenticated) {
    return null;
  }

  const categories = ['all', 'general', 'technical', 'announcements', 'study-groups'];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-background pt-20">
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex justify-between items-center"
          >
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Community</h1>
              <p className="text-muted-foreground">Connect with other students and share knowledge</p>
            </div>
            <Link
              href="/community"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition flex items-center gap-2"
            >
              <FaPlus /> New Discussion
            </Link>
          </motion.div>

          {/* Category Filter */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition ${
                  selectedCategory === category
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {category.replace('-', ' ').charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
              </button>
            ))}
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <FaSpinner className="animate-spin text-primary text-4xl" />
            </div>
          ) : posts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <FaComment className="text-5xl text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-2">No Posts Yet</h3>
              <p className="text-muted-foreground mb-6">Be the first to start a discussion in this category</p>
              <Link
                href="/community"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
              >
                <FaPlus /> Start Discussion
              </Link>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {posts.map((post, index) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-lg p-6 border border-border hover:border-primary/50 hover:shadow-lg transition"
                >
                  <Link href={`/community/${post._id}`}>
                    <h3 className="text-xl font-bold text-foreground hover:text-primary transition mb-2">
                      {post.title}
                    </h3>
                  </Link>

                  <p className="text-muted-foreground mb-4 line-clamp-2">{post.description}</p>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <FaThumbsUp className="text-primary" />
                        <span>{post.likes} likes</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaComment className="text-primary" />
                        <span>{post.replies} replies</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaEye className="text-primary" />
                        <span>{post.views} views</span>
                      </div>
                    </div>
                    <span className="text-xs">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
