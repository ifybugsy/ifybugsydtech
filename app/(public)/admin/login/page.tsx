'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(email, password);
      
      // Get stored session to check user role
      const storedSession = localStorage.getItem('auth_session');
      if (storedSession && storedSession.trim()) {
        try {
          const session = JSON.parse(storedSession);
          if (session?.user?.role === 'admin') {
            router.push('/admin');
          } else {
            setError('Access denied. Admin credentials required.');
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_session');
          }
        } catch (parseErr) {
          setError('Error verifying credentials. Please try again.');
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_session');
        }
      } else {
        setError('Login failed. No session found.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background flex items-center justify-center py-12">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-card rounded-xl border border-border/20 p-8 sm:p-10"
          >
            {/* Logo & Title */}
            <div className="text-center mb-8">
              <img 
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Ifybugsy_Logo_I-removebg-preview-5qm2JA30ii98ZvwJ7DHxszyBR58FTQ.png" 
                alt="Ifybugsy Logo" 
                className="h-16 w-auto mx-auto mb-4"
              />
              <h1 className="text-3xl font-bold text-foreground mb-2">Admin Portal</h1>
              <p className="text-foreground/60">Restricted access for administrators only</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Admin Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ifybugsy.com"
                  className="w-full px-4 py-2 rounded-lg bg-secondary border border-border text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2 rounded-lg bg-secondary border border-border text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/60 hover:text-foreground"
                  >
                    {showPassword ? (
                      <FaEyeSlash className="w-5 h-5" />
                    ) : (
                      <FaEye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="rounded border-border text-red-600 focus:ring-red-500 cursor-pointer"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-foreground/70 cursor-pointer">
                  Remember me
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="w-full px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting || isLoading ? 'Signing in...' : 'Sign In to Admin'}
              </button>
            </form>

            {/* Security Warning */}
            <div className="mt-6 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
              <p className="text-xs font-semibold text-amber-900 dark:text-amber-400 mb-2">Security Notice:</p>
              <p className="text-xs text-amber-800 dark:text-amber-300">
                This is a restricted area. Only authorized administrators have access. All login attempts are logged.
              </p>
            </div>

            {/* Back Link */}
            <p className="text-center text-foreground/70 text-sm mt-6">
              <Link href="/login" className="text-primary font-semibold hover:underline">
                Back to Student Login
              </Link>
            </p>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
