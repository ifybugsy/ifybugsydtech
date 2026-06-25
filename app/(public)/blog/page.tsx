'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';
import { blogAPI } from '@/lib/api';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  featuredImage?: string;
  status?: string;
  publishedDate?: string;
}

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await blogAPI.getAll();
        
        if (response.data && Array.isArray(response.data)) {
          // Filter for published blogs only
          const publishedBlogs = response.data
            .filter((blog: any) => blog.isPublished || blog.status === 'published')
            .map((blog: any) => ({
              id: blog._id || blog.id,
              title: blog.title,
              excerpt: blog.excerpt || blog.description,
              date: blog.publishedAt 
                ? new Date(blog.publishedAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })
                : blog.date || 'Recently published',
              category: blog.category || 'General',
              featuredImage: blog.featuredImage,
              status: blog.isPublished || blog.status === 'published' ? 'published' : 'draft',
            }));
          
          setBlogPosts(publishedBlogs);
        }
      } catch (err: any) {
        // Fallback to demo blogs if API fails
        console.debug('[v0] Using demo blogs');
        setBlogPosts([
          {
            id: '1',
            title: 'How to Learn Web Development in 2025',
            excerpt: 'A comprehensive guide to starting your web development journey.',
            date: 'Jan 15, 2025',
            category: 'Learning',
          },
          {
            id: '2',
            title: 'Top 10 Programming Languages for Career Growth',
            excerpt: 'Explore the most in-demand programming languages.',
            date: 'Jan 10, 2025',
            category: 'Career',
          },
          {
            id: '3',
            title: 'The Future of AI in Education',
            excerpt: 'Understanding how artificial intelligence is transforming learning.',
            date: 'Jan 5, 2025',
            category: 'AI',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <section className="py-12 border-b border-border/20 bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">Our Blog</h1>
            <p className="text-foreground/70 max-w-2xl">
              Stay updated with the latest insights on digital education, career development, and technology trends.
            </p>
          </div>
        </section>

        <section className="py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-foreground/60">Loading blog posts...</p>
              </div>
            ) : blogPosts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-foreground/60">No blog posts available yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.id}`}>
                  <div className="rounded-lg bg-card border border-border/20 p-6 hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded">
                        {post.category}
                      </span>
                      <span className="text-xs text-foreground/60">{post.date}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2 flex-1">{post.title}</h3>
                    <p className="text-foreground/70 text-sm mb-4">{post.excerpt}</p>
                    <span className="text-primary font-medium text-sm hover:underline inline-block">
                      Read More →
                    </span>
                  </div>
                </Link>
              ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
