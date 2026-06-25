'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  FaArrowLeft,
  FaThumbsUp,
  FaComment,
  FaShareAlt,
  FaCheckCircle,
  FaClock,
  FaUser,
  FaReply,
} from 'react-icons/fa';

interface Reply {
  id: string;
  author: string;
  authorRole: 'student' | 'instructor' | 'admin';
  content: string;
  timestamp: string;
  likes: number;
  helpful: boolean;
}

interface PostDetail {
  id: string;
  title: string;
  description: string;
  content: string;
  author: string;
  authorRole: 'student' | 'instructor' | 'admin';
  authorImage?: string;
  category: string;
  likes: number;
  views: number;
  replies: Reply[];
  timestamp: string;
  solved: boolean;
}

const MOCK_POST_DETAILS: Record<string, PostDetail> = {
  '1': {
    id: '1',
    title: 'How to fix React hooks dependency array issues?',
    description: 'I keep getting infinite loops when using useEffect. Can someone explain the dependency array concept?',
    content: `I've been learning React for a while now, but I keep running into issues with infinite loops when using useEffect. I read the documentation but it's still confusing. Here's what I'm trying to do:

\`\`\`javascript
useEffect(() => {
  // some code
}, [])
\`\`\`

Sometimes my effect runs too many times and sometimes it doesn't run at all. I need help understanding how the dependency array works and why my code is behaving this way. Should I include all variables in the dependency array? What about functions defined inside the effect?`,
    author: 'Ahmed Ibrahim',
    authorRole: 'student',
    authorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    category: 'React',
    likes: 48,
    views: 245,
    replies: [
      {
        id: 'r1',
        author: 'Dr. Sarah Johnson',
        authorRole: 'instructor',
        content: `Great question! The dependency array is crucial for understanding how useEffect works. Here's the key concept:

- If you pass no dependency array, the effect runs after every render
- If you pass an empty array [], the effect runs only once after the first render
- If you pass variables in the array, the effect runs whenever any of those variables change

So if you're getting infinite loops, make sure you're not including variables in the dependency array that are being updated inside the effect itself.`,
        timestamp: '1 hour ago',
        likes: 156,
        helpful: true,
      },
      {
        id: 'r2',
        author: 'Zainab Khan',
        authorRole: 'instructor',
        content: 'I recommend also checking out the ESLint plugin for React hooks: eslint-plugin-react-hooks. It helps catch dependency array issues automatically.',
        timestamp: '45 minutes ago',
        likes: 89,
        helpful: false,
      },
    ],
    timestamp: '2 hours ago',
    solved: true,
  },
  '2': {
    id: '2',
    title: 'Best practices for state management in large projects',
    description: 'What are the recommended approaches for managing complex state in enterprise applications?',
    content: `We're building a large enterprise application and we need to decide on a state management solution. We have considered Redux, Zustand, Recoil, and even just using Context API with custom hooks. 

Our app has complex nested state, multiple features that need to communicate, and we need good debugging capabilities. What would be the best choice for our use case? Are there any pitfalls we should avoid?`,
    author: 'Zainab Khan',
    authorRole: 'instructor',
    authorImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    category: 'Architecture',
    likes: 156,
    views: 512,
    replies: [
      {
        id: 'r3',
        author: 'Prof. Michael Chen',
        authorRole: 'instructor',
        content: 'For enterprise applications, I recommend Redux Toolkit. It has great DevTools support, a large community, and scales well.',
        timestamp: '3 hours ago',
        likes: 234,
        helpful: true,
      },
    ],
    timestamp: '5 hours ago',
    solved: false,
  },
};

interface CommunityPostDetailProps {
  params: Promise<{ postId: string }>;
}

export default function CommunityPostDetail({ params }: CommunityPostDetailProps) {
  const router = useRouter();
  const resolvedParams = React.use(params);
  const post = MOCK_POST_DETAILS[resolvedParams.postId];
  const [likes, setLikes] = useState(post?.likes || 0);
  const [liked, setLiked] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showReplyForm, setShowReplyForm] = useState(false);

  if (!post) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background">
          <div className="max-w-4xl mx-auto px-4 py-12 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Post not found</h1>
            <Link
              href="/community"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
            >
              <FaArrowLeft className="w-4 h-4" />
              Back to Community
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const handleLike = () => {
    if (!liked) {
      setLikes(likes + 1);
      setLiked(true);
    } else {
      setLikes(likes - 1);
      setLiked(false);
    }
  };

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (replyText.trim()) {
      // In a real app, this would save the reply
      setReplyText('');
      setShowReplyForm(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'instructor':
        return 'bg-primary/20 text-primary';
      case 'admin':
        return 'bg-red-500/20 text-red-500';
      default:
        return 'bg-blue-500/20 text-blue-500';
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Header */}
        <section className="border-b border-border/20 bg-card py-6">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6"
            >
              <FaArrowLeft className="w-4 h-4" />
              Back to Community
            </button>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/20 text-primary">
                    {post.category}
                  </span>
                  {post.solved && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-500">
                      <FaCheckCircle className="w-3 h-3" />
                      Solved
                    </span>
                  )}
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">{post.title}</h1>
                <p className="text-foreground/70">{post.description}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12 sm:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            {/* Post Author Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-lg border border-border/20 p-6 mb-8"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center text-white font-bold">
                    {post.author.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-foreground">{post.author}</h3>
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-semibold capitalize ${getRoleBadgeColor(
                          post.authorRole
                        )}`}
                      >
                        {post.authorRole}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-foreground/70">
                      <span className="flex items-center gap-1">
                        <FaClock className="w-3 h-3" />
                        {post.timestamp}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaUser className="w-3 h-3" />
                        Posted in {post.category}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <div className="prose prose-sm max-w-none text-foreground mb-6">
                <p className="whitespace-pre-wrap leading-relaxed">{post.content}</p>
              </div>

              {/* Post Actions */}
              <div className="flex items-center gap-4 pt-6 border-t border-border/20">
                <button
                  onClick={handleLike}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    liked
                      ? 'bg-primary/20 text-primary'
                      : 'bg-secondary hover:bg-border text-foreground/70 hover:text-foreground'
                  }`}
                >
                  <FaThumbsUp className="w-4 h-4" />
                  <span>{likes}</span>
                </button>
                <button
                  onClick={() => setShowReplyForm(!showReplyForm)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary hover:bg-border text-foreground/70 hover:text-foreground transition-colors"
                >
                  <FaReply className="w-4 h-4" />
                  Reply
                </button>
                <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary hover:bg-border text-foreground/70 hover:text-foreground transition-colors">
                  <FaShareAlt className="w-4 h-4" />
                  Share
                </button>
                <div className="ml-auto text-sm text-foreground/70">
                  <span className="flex items-center gap-1">
                    <FaComment className="w-4 h-4" />
                    {post.replies.length} Replies
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Reply Form */}
            {showReplyForm && (
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleReplySubmit}
                className="bg-card rounded-lg border border-border/20 p-6 mb-8"
              >
                <h3 className="font-bold text-foreground mb-4">Write a Reply</h3>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Share your thoughts or solution..."
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg bg-secondary border border-border/20 text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                />
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowReplyForm(false)}
                    className="px-6 py-2 rounded-lg bg-secondary hover:bg-border text-foreground transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-colors font-semibold"
                  >
                    Post Reply
                  </button>
                </div>
              </motion.form>
            )}

            {/* Replies Section */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">{post.replies.length} Replies</h2>
              <div className="space-y-4">
                {post.replies.map((reply, index) => (
                  <motion.div
                    key={reply.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-card rounded-lg border border-border/20 p-6 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center text-white font-bold text-sm">
                        {reply.author.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-foreground">{reply.author}</h4>
                            <span
                              className={`inline-block px-2 py-1 rounded-full text-xs font-semibold capitalize ${getRoleBadgeColor(
                                reply.authorRole
                              )}`}
                            >
                              {reply.authorRole}
                            </span>
                          </div>
                          <span className="text-sm text-foreground/70">{reply.timestamp}</span>
                        </div>
                        <p className="text-foreground/80 mb-3">{reply.content}</p>
                        {reply.helpful && (
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 text-green-500 text-xs font-semibold mb-2">
                            <FaCheckCircle className="w-3 h-3" />
                            Marked as Helpful
                          </div>
                        )}
                        <div className="flex items-center gap-4">
                          <button className="inline-flex items-center gap-1 text-sm text-foreground/70 hover:text-primary transition-colors">
                            <FaThumbsUp className="w-3 h-3" />
                            {reply.likes}
                          </button>
                          <button className="text-sm text-foreground/70 hover:text-primary transition-colors">
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
