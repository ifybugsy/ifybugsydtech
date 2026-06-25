'use client';

import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/lib/auth-context';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaThumbsUp, FaComment, FaShare, FaSpinner } from 'react-icons/fa';

interface PostComment {
  _id: string;
  author: {
    name: string;
    profileImage: string;
  };
  content: string;
  likes: number;
  createdAt: string;
}

interface CommunityPostDetail {
  _id: string;
  title: string;
  description: string;
  category: string;
  author: {
    name: string;
    profileImage: string;
  };
  content: string;
  likes: number;
  comments: PostComment[];
  views: number;
  createdAt: string;
}

export default function CommunityDetailPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const [post, setPost] = useState<CommunityPostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    // Mock post data - replace with API call
    if (!isLoading && isAuthenticated) {
      setTimeout(() => {
        const mockPost: CommunityPostDetail = {
          _id: postId,
          title: 'Best practices for React performance optimization',
          description: 'Discussion about React performance',
          category: 'React',
          author: {
            name: 'Sarah Johnson',
            profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
          },
          content: `React performance optimization is crucial for building responsive applications. Here are some key strategies to consider:

1. **Code Splitting**: Use React.lazy() and Suspense to load components only when needed.

2. **Memoization**: Implement useMemo and useCallback hooks to prevent unnecessary re-renders.

3. **Virtual Lists**: For large lists, use virtualization libraries like react-window.

4. **Image Optimization**: Use lazy loading and modern image formats.

5. **Bundle Analysis**: Regularly analyze your bundle size using tools like webpack-bundle-analyzer.

Would love to hear your experiences with performance optimization!`,
          likes: 156,
          comments: [
            {
              _id: '1',
              author: {
                name: 'John Doe',
                profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
              },
              content: 'Great post! Code splitting has really helped reduce our initial bundle size.',
              likes: 24,
              createdAt: '2024-01-15T10:30:00'
            },
            {
              _id: '2',
              author: {
                name: 'Emma Wilson',
                profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma'
              },
              content: 'I have been using useMemo extensively. Has definitely improved performance for complex calculations.',
              likes: 18,
              createdAt: '2024-01-15T11:45:00'
            }
          ],
          views: 1250,
          createdAt: '2024-01-15T08:00:00'
        };
        setPost(mockPost);
        setLoading(false);
      }, 500);
    }
  }, [isLoading, isAuthenticated, postId]);

  const handleCommentSubmit = () => {
    if (!newComment.trim()) return;
    // Add comment submission logic here
    setNewComment('');
  };

  if (isLoading || !isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background flex items-center justify-center">
          <FaSpinner className="animate-spin text-primary text-4xl" />
        </main>
        <Footer />
      </>
    );
  }

  if (!post) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background pt-20">
          <div className="container mx-auto px-4 py-12 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Post not found</h1>
            <Link href="/dashboard/community" className="text-primary hover:underline">
              Back to Community
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-background pt-20">
        {/* Back Button */}
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/dashboard/community"
            className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
          >
            <FaArrowLeft className="w-4 h-4" />
            Back to Community
          </Link>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-3xl">
          {/* Post Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border/20 rounded-xl overflow-hidden mb-8"
          >
            {/* Author Info */}
            <div className="p-6 border-b border-border/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={post.author.profileImage}
                  alt={post.author.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="font-bold text-foreground">{post.author.name}</p>
                  <p className="text-xs text-foreground/50">
                    {new Date(post.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-xs font-bold">
                {post.category}
              </span>
            </div>

            {/* Post Content */}
            <div className="p-6 border-b border-border/20">
              <h1 className="text-3xl font-bold text-foreground mb-4">{post.title}</h1>
              <p className="text-foreground/70 whitespace-pre-wrap leading-relaxed">{post.content}</p>
            </div>

            {/* Engagement Stats */}
            <div className="px-6 py-4 bg-secondary/20 border-b border-border/20 flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-foreground/70">
                <FaThumbsUp className="w-4 h-4" />
                <span>{post.likes} Likes</span>
              </div>
              <div className="flex items-center gap-2 text-foreground/70">
                <FaComment className="w-4 h-4" />
                <span>{post.comments.length} Comments</span>
              </div>
              <div className="flex items-center gap-2 text-foreground/70">
                <span>{post.views} Views</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="px-6 py-4 flex gap-3">
              <button className="flex-1 py-2 px-4 border border-border/20 text-foreground hover:bg-secondary rounded-lg transition font-medium flex items-center justify-center gap-2">
                <FaThumbsUp className="w-4 h-4" />
                Like
              </button>
              <button className="flex-1 py-2 px-4 border border-border/20 text-foreground hover:bg-secondary rounded-lg transition font-medium flex items-center justify-center gap-2">
                <FaComment className="w-4 h-4" />
                Comment
              </button>
              <button className="flex-1 py-2 px-4 border border-border/20 text-foreground hover:bg-secondary rounded-lg transition font-medium flex items-center justify-center gap-2">
                <FaShare className="w-4 h-4" />
                Share
              </button>
            </div>
          </motion.div>

          {/* Comments Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-foreground">Comments ({post.comments.length})</h2>

            {/* New Comment Input */}
            <div className="bg-card border border-border/20 rounded-xl p-6">
              <p className="text-sm font-medium text-foreground mb-3">Add your comment</p>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                className="w-full px-4 py-3 bg-secondary/30 border border-border/20 rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:border-primary resize-none"
                rows={4}
              />
              <div className="flex justify-end gap-3 mt-4">
                <button className="px-6 py-2 border border-border/20 text-foreground hover:bg-secondary rounded-lg transition font-medium">
                  Cancel
                </button>
                <button
                  onClick={handleCommentSubmit}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium"
                >
                  Post Comment
                </button>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
              {post.comments.map((comment, index) => (
                <motion.div
                  key={comment._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="bg-card border border-border/20 rounded-xl p-6"
                >
                  <div className="flex gap-4">
                    <img
                      src={comment.author.profileImage}
                      alt={comment.author.name}
                      className="w-10 h-10 rounded-full flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-bold text-foreground">{comment.author.name}</p>
                        <p className="text-xs text-foreground/50">
                          {new Date(comment.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <p className="text-foreground/70 mb-3">{comment.content}</p>
                      <button className="flex items-center gap-2 text-sm text-primary hover:underline">
                        <FaThumbsUp className="w-3 h-3" />
                        Like ({comment.likes})
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
