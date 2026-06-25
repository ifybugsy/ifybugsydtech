'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaCheck } from "react-icons/fa";

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [studentId, setStudentId] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (step === 1) {
      if (!formData.name || !formData.email || !formData.phone) {
        setError('Please fill in all fields');
        return;
      }
      setStep(2);
      return;
    }

    if (step === 2) {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
      setIsSubmitting(true);

      try {
        const student = await register(
          formData.name,
          formData.email,
          formData.password,
          formData.phone
        );
        setStudentId(student.studentId);
        setStep(3);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Registration failed');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (step === 3) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background flex items-center justify-center py-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md bg-card rounded-xl border border-border/20 p-8 sm:p-10 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-6">
              <FaCheck className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Registration Complete!</h1>
            <p className="text-foreground/70 mb-6">
              Your account has been created successfully. Your Student ID is:
            </p>
            <div className="bg-primary/10 border-2 border-primary rounded-lg p-4 mb-8">
              <p className="text-2xl font-bold text-primary font-mono">{studentId}</p>
            </div>
            <p className="text-foreground/60 text-sm mb-8">
              Save this ID for your records. You can now access your dashboard and start learning.
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full px-4 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
            >
              Go to Dashboard
            </button>
          </motion.div>
        </main>
        <Footer />
      </>
    );
  }

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
            {/* Header */}
            <div className="text-center mb-8">
              <img 
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Ifybugsy_Logo_I-removebg-preview-5qm2JA30ii98ZvwJ7DHxszyBR58FTQ.png" 
                alt="Ifybugsy Logo" 
                className="h-80 w-auto mx-auto mb-4"
              />
              <h1 className="text-3xl font-bold text-foreground mb-2">Create Account</h1>
              <p className="text-foreground/60">
                Step {step} of 2: {step === 1 ? 'Personal Information' : 'Set Password'}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="flex gap-2 mb-8">
              <div className={`h-1 flex-1 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-border'}`} />
              <div className={`h-1 flex-1 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-border'}`} />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm">
                  {error}
                </div>
              )}

              {step === 1 ? (
                <>
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                      Full Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full px-4 py-2 rounded-lg bg-secondary border border-border text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full px-4 py-2 rounded-lg bg-secondary border border-border text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="08012345678"
                      className="w-full px-4 py-2 rounded-lg bg-secondary border border-border text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* Password */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full px-4 py-2 rounded-lg bg-secondary border border-border text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
                      Confirm Password
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full px-4 py-2 rounded-lg bg-secondary border border-border text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>

                  {/* Terms */}
                  <div className="flex items-center">
                    <input
                      id="terms"
                      type="checkbox"
                      defaultChecked
                      className="rounded border-border text-primary focus:ring-primary cursor-pointer"
                    />
                    <label htmlFor="terms" className="ml-2 text-sm text-foreground/70 cursor-pointer">
                      I agree to the Terms & Conditions
                    </label>
                  </div>
                </>
              )}

              {/* Navigation */}
              <div className="flex gap-3 pt-4">
                {step === 2 && (
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 px-4 py-2 border border-border text-foreground font-semibold rounded-lg hover:bg-secondary transition-colors"
                  >
                    Back
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  className={`flex-1 px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    step === 2 ? 'col-span-2' : ''
                  }`}
                >
                  {isSubmitting || isLoading
                    ? 'Creating...'
                    : step === 1
                    ? 'Continue'
                    : 'Create Account'}
                </button>
              </div>
            </form>

            {/* Login Link */}
            <p className="text-center text-foreground/70 text-sm mt-6">
              Already have an account?{' '}
              <Link href="/login" className="text-primary font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
