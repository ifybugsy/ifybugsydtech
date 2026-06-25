'use client';

import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/lib/auth-context';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FaArrowLeft,
  FaPaperPlane,
  FaTrash,
  FaFlag,
  FaSpinner,
  FaReply,
  FaDownload,
  FaEllipsisV
} from 'react-icons/fa';

interface MessageThread {
  id: string;
  from: {
    name: string;
    email: string;
    profileImage: string;
    studentId: string;
  };
  subject: string;
  originalMessage: {
    content: string;
    attachments: Array<{
      id: string;
      name: string;
      size: string;
      url: string;
    }>;
    createdAt: string;
  };
  replies: Array<{
    id: string;
    sender: {
      name: string;
      role: 'instructor' | 'student';
      profileImage: string;
    };
    content: string;
    createdAt: string;
    attachments: Array<{
      id: string;
      name: string;
      size: string;
      url: string;
    }>;
  }>;
  read: boolean;
  archived: boolean;
}

export default function MessageDetailPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const messageId = params.id as string;

  const [message, setMessage] = useState<MessageThread | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [showReplyForm, setShowReplyForm] = useState(false);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'instructor')) {
      router.push('/instructor-login');
    }
  }, [isLoading, isAuthenticated, user, router]);

  useEffect(() => {
    // Mock message data - replace with API call
    if (!isLoading && isAuthenticated) {
      setTimeout(() => {
        const mockMessage: MessageThread = {
          id: messageId,
          from: {
            name: 'John Doe',
            email: 'john@example.com',
            profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
            studentId: 'IFY-STU-00001'
          },
          subject: 'Question about React hooks',
          originalMessage: {
            content: `Hi, I have a question about React hooks. I'm trying to understand the difference between useEffect and useLayoutEffect. 

When should I use useLayoutEffect instead of useEffect? I noticed you mentioned it briefly in one of the lectures but didn't go into much detail.

Also, I'm experiencing some performance issues with my component that heavily relies on useEffect. Do you have any suggestions on how to optimize it?

Looking forward to your response.

Thanks!`,
            attachments: [
              {
                id: '1',
                name: 'MyComponent.jsx',
                size: '2.3 KB',
                url: '#'
              },
              {
                id: '2',
                name: 'performance_issue.png',
                size: '125 KB',
                url: '#'
              }
            ],
            createdAt: '2024-01-20T10:30:00'
          },
          replies: [
            {
              id: '1',
              sender: {
                name: 'You',
                role: 'instructor',
                profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Instructor'
              },
              content: `Great question, John! Let me break this down for you.

useEffect vs useLayoutEffect:
- useEffect runs AFTER the DOM is painted (async)
- useLayoutEffect runs BEFORE the DOM is painted (sync)

You should use useLayoutEffect when you need to:
1. Measure layout properties (offsetHeight, scrollPosition, etc.)
2. Make DOM mutations that need to be visible before the browser paints

For most cases, useEffect is the right choice. However, looking at your code, I think the issue might be related to how you're handling dependencies.

I've reviewed your MyComponent.jsx file. The problem is that you're not memoizing some of your functions in the dependency array. Try using useCallback for those functions and see if performance improves.

Let me know if you need any further clarification!`,
              createdAt: '2024-01-20T14:15:00',
              attachments: []
            }
          ],
          read: true,
          archived: false
        };
        setMessage(mockMessage);
        setLoading(false);
      }, 500);
    }
  }, [isLoading, isAuthenticated, messageId]);

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    // Handle reply submission here
    setReplyText('');
    setShowReplyForm(false);
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

  if (!message) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background pt-20">
          <div className="container mx-auto px-4 py-12 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Message not found</h1>
            <Link href="/instructor/messages" className="text-primary hover:underline">
              Back to Messages
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
            href="/instructor/messages"
            className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
          >
            <FaArrowLeft className="w-4 h-4" />
            Back to Messages
          </Link>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-3xl">
          {/* Message Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border/20 rounded-xl overflow-hidden mb-6"
          >
            {/* Header Bar */}
            <div className="p-6 bg-secondary/20 border-b border-border/20 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-1">{message.subject}</h1>
                <p className="text-sm text-foreground/70">From: {message.from.name} ({message.from.email})</p>
              </div>
              <button className="p-2 text-foreground/70 hover:text-foreground hover:bg-secondary rounded-lg transition">
                <FaEllipsisV className="w-5 h-5" />
              </button>
            </div>

            {/* Original Message */}
            <div className="p-6 border-b border-border/20">
              <div className="flex items-start gap-4 mb-6">
                <img
                  src={message.from.profileImage}
                  alt={message.from.name}
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-foreground">{message.from.name}</h3>
                    <span className="text-xs text-foreground/50">
                      {new Date(message.originalMessage.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-foreground/70 mb-4">{message.from.studentId}</p>
                </div>
              </div>

              <p className="text-foreground/80 whitespace-pre-wrap leading-relaxed mb-4">
                {message.originalMessage.content}
              </p>

              {/* Attachments */}
              {message.originalMessage.attachments.length > 0 && (
                <div className="mt-6 pt-6 border-t border-border/20">
                  <p className="text-sm font-medium text-foreground mb-3">Attachments</p>
                  <div className="space-y-2">
                    {message.originalMessage.attachments.map((attachment) => (
                      <a
                        key={attachment.id}
                        href={attachment.url}
                        className="flex items-center justify-between p-3 bg-secondary/30 border border-border/20 rounded-lg hover:bg-secondary/50 transition"
                      >
                        <span className="text-sm font-medium text-foreground truncate">
                          {attachment.name}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-foreground/50">{attachment.size}</span>
                          <FaDownload className="w-4 h-4 text-primary" />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6 pt-6 border-t border-border/20">
                <button
                  onClick={() => setShowReplyForm(!showReplyForm)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium text-sm"
                >
                  <FaReply className="w-4 h-4" />
                  Reply
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-border/20 text-foreground hover:bg-secondary rounded-lg transition font-medium text-sm">
                  <FaFlag className="w-4 h-4" />
                  Flag
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-border/20 text-foreground hover:bg-secondary rounded-lg transition font-medium text-sm">
                  <FaTrash className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </motion.div>

          {/* Replies */}
          {message.replies.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4 mb-6"
            >
              <h2 className="text-lg font-bold text-foreground">Replies</h2>
              {message.replies.map((reply, index) => (
                <div
                  key={reply.id}
                  className="bg-card border border-border/20 rounded-xl p-6"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={reply.sender.profileImage}
                      alt={reply.sender.name}
                      className="w-10 h-10 rounded-full flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-foreground">{reply.sender.name}</h3>
                          <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-bold">
                            {reply.sender.role === 'instructor' ? 'Instructor' : 'Student'}
                          </span>
                        </div>
                        <span className="text-xs text-foreground/50">
                          {new Date(reply.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-foreground/80 whitespace-pre-wrap leading-relaxed">
                    {reply.content}
                  </p>

                  {/* Reply Attachments */}
                  {reply.attachments.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-border/20">
                      <p className="text-xs font-medium text-foreground mb-2">Attachments</p>
                      <div className="space-y-2">
                        {reply.attachments.map((attachment) => (
                          <a
                            key={attachment.id}
                            href={attachment.url}
                            className="flex items-center justify-between p-2 bg-secondary/20 border border-border/20 rounded hover:bg-secondary/30 transition text-xs"
                          >
                            <span className="font-medium text-foreground truncate">
                              {attachment.name}
                            </span>
                            <span className="text-foreground/50">{attachment.size}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </motion.div>
          )}

          {/* Reply Form */}
          {showReplyForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border/20 rounded-xl p-6 mb-6"
            >
              <h3 className="text-lg font-bold text-foreground mb-4">Write a Reply</h3>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your reply here..."
                className="w-full px-4 py-3 bg-secondary/30 border border-border/20 rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:border-primary resize-none mb-4"
                rows={6}
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowReplyForm(false)}
                  className="px-6 py-2 border border-border/20 text-foreground hover:bg-secondary rounded-lg transition font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendReply}
                  className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium"
                >
                  <FaPaperPlane className="w-4 h-4" />
                  Send Reply
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
