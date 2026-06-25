'use client';

import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaEnvelope, FaSpinner, FaPaperPlane, FaCircle, FaSearch } from 'react-icons/fa';

interface User {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
}

interface Message {
  _id: string;
  sender: User;
  recipient: User;
  content: string;
  isRead: boolean;
  createdAt: string;
}

interface Conversation {
  user: User;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export default function MessagesPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      loadConversations();
      loadAvailableUsers();
    }
  }, [isAuthenticated, router]);

  const loadConversations = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/messages/conversations', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setConversations(data);
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableUsers = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/users', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        // Filter out current user
        setAvailableUsers(data.filter((u: User) => u._id !== user?.id));
      }
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const loadMessages = async (userId: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/messages/conversation/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUserId(userId);
    loadMessages(userId);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedUserId) return;

    setSending(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/messages/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientId: selectedUserId,
          content: messageText,
        }),
      });

      if (response.ok) {
        const newMessage = await response.json();
        setMessages([...messages, newMessage]);
        setMessageText('');
        // Refresh conversations
        loadConversations();
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  const selectedUser = availableUsers.find(u => u._id === selectedUserId);
  const filteredUsers = availableUsers.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center">
          <FaSpinner className="w-8 h-8 animate-spin text-primary" />
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Messages</h1>
            <p className="text-foreground/70">Send and receive messages with other students and instructors</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
            {/* Conversations List */}
            <div className="bg-card rounded-lg border border-border/20 overflow-hidden flex flex-col">
              <div className="p-4 border-b border-border/20">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-secondary border border-border text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                  <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 text-sm" />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {filteredUsers.length > 0 ? (
                  <div className="divide-y divide-border/10">
                    {filteredUsers.map((u) => {
                      const conversation = conversations.find(c => c.user._id === u._id);
                      return (
                        <motion.button
                          key={u._id}
                          onClick={() => handleSelectUser(u._id)}
                          className={`w-full px-4 py-3 text-left hover:bg-secondary transition-colors ${
                            selectedUserId === u._id ? 'bg-primary/10' : ''
                          }`}
                          whileHover={{ x: 4 }}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center text-white font-bold flex-shrink-0">
                              {u.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <p className="font-semibold text-foreground text-sm truncate">{u.name}</p>
                                {conversation && conversation.unreadCount > 0 && (
                                  <span className="px-2 py-1 rounded-full bg-primary text-white text-xs font-bold flex-shrink-0">
                                    {conversation.unreadCount}
                                  </span>
                                )}
                              </div>
                              {conversation && (
                                <p className="text-xs text-foreground/60 truncate">
                                  {conversation.lastMessage}
                                </p>
                              )}
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <FaEnvelope className="w-8 h-8 text-foreground/30 mx-auto mb-3" />
                    <p className="text-sm text-foreground/70">No conversations yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-2 bg-card rounded-lg border border-border/20 overflow-hidden flex flex-col">
              {selectedUser ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-border/20 bg-secondary/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center text-white font-bold">
                        {selectedUser.name.charAt(0)}
                      </div>
                      <div>
                        <h2 className="font-semibold text-foreground">{selectedUser.name}</h2>
                        <p className="text-xs text-foreground/60">{selectedUser.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.length > 0 ? (
                      messages.map((msg, index) => (
                        <motion.div
                          key={msg._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`flex ${msg.sender._id === user?.id ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs px-4 py-2 rounded-lg ${
                              msg.sender._id === user?.id
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-secondary text-foreground'
                            }`}
                          >
                            <p className="text-sm">{msg.content}</p>
                            <p className={`text-xs mt-1 ${msg.sender._id === user?.id ? 'text-primary-foreground/70' : 'text-foreground/60'}`}>
                              {new Date(msg.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-foreground/60 text-sm">No messages yet. Start a conversation!</p>
                      </div>
                    )}
                  </div>

                  {/* Message Input */}
                  <form onSubmit={handleSendMessage} className="p-4 border-t border-border/20 bg-secondary/30">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-2 rounded-lg bg-background border border-border text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      />
                      <button
                        type="submit"
                        disabled={sending || !messageText.trim()}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {sending ? (
                          <FaSpinner className="w-4 h-4 animate-spin" />
                        ) : (
                          <FaPaperPlane className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <FaEnvelope className="w-12 h-12 text-foreground/30 mx-auto mb-4" />
                    <p className="text-foreground/70 mb-2">Select a conversation to start messaging</p>
                    <p className="text-sm text-foreground/50">Search and select a user to begin chatting</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
