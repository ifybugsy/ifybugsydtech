'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useNotifications } from '@/lib/notifications-context';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';

export default function InstructorLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();
  const { addNotification } = useNotifications();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const data = await response.json();
      
      // Check if user is instructor
      if (data.user.role !== 'instructor') {
        throw new Error('This account is not an instructor account. Please use Student Login.');
      }

      // Store token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      addNotification('Login successful!', 'success');
      router.push('/instructor');
    } catch (error: any) {
      addNotification(error.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-200px)] bg-background flex items-center justify-center py-12">
        <div className="w-full max-w-md px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border/20 rounded-xl p-8"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <img 
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Ifybugsy_Logo_I-removebg-preview-k2hmHcsgESeqfwrIGVfB71PGSGOeJ9.png" 
                alt="Ifybugsy Logo" 
                className="h-32 w-auto mx-auto mb-4"
              />
              <h1 className="text-3xl font-bold text-foreground mb-2">Instructor Login</h1>
              <p className="text-foreground/60">Access your teaching dashboard</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? 'Signing in...' : 'Sign In'}
                {!loading && <FaArrowRight className="w-4 h-4" />}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-border"></div>
              <span className="text-sm text-foreground/60">or</span>
              <div className="flex-1 h-px bg-border"></div>
            </div>

            {/* Alternative Links */}
            <p className="text-center text-foreground/70 text-sm mb-4">
              Don't have an instructor account?
            </p>
            <Link
              href="/instructor-signup"
              className="w-full py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/10 transition-colors text-center block"
            >
              Create Instructor Account
            </Link>

            {/* Additional Links */}
            <div className="mt-6 space-y-2 text-center">
              <Link href="/login" className="block text-sm text-foreground/70 hover:text-primary transition-colors">
                Student Login
              </Link>
              <Link href="/contact" className="block text-sm text-foreground/70 hover:text-primary transition-colors">
                Need Help?
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
