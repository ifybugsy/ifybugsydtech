'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/lib/auth-context';
import { SAMPLE_ENROLLMENTS, COURSES } from '@/lib/mockData';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaChevronLeft } from 'react-icons/fa';

export default function ProgressPage() {
  const { user } = useAuth();
  const enrollments = SAMPLE_ENROLLMENTS.filter((e) => e.studentId === user?.id);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Header */}
        <section className="py-8 border-b border-border/20 bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6 w-fit"
            >
              <FaChevronLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Progress Tracking</h1>
            <p className="text-foreground/70 mt-2">Monitor your learning progress and course completion</p>
          </div>
        </section>

        {/* Content */}
        <section className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-6">
              {enrollments.map((enrollment, index) => {
                const course = COURSES.find((c) => c.id === enrollment.courseId);
                if (!course) return null;

                return (
                  <motion.div
                    key={enrollment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="rounded-lg bg-card border border-border/20 p-8"
                  >
                    <h3 className="text-2xl font-bold text-foreground mb-6">{course.title}</h3>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                      <div>
                        <p className="text-foreground/70 text-sm mb-2">Progress</p>
                        <p className="text-3xl font-bold text-primary">{enrollment.progressPercentage}%</p>
                      </div>
                      <div>
                        <p className="text-foreground/70 text-sm mb-2">Days Completed</p>
                        <p className="text-3xl font-bold text-foreground">
                          {enrollment.completedDays}/{enrollment.totalClassDays}
                        </p>
                      </div>
                      <div>
                        <p className="text-foreground/70 text-sm mb-2">Attendance</p>
                        <p className="text-3xl font-bold text-foreground">{enrollment.attendancePercentage}%</p>
                      </div>
                      <div>
                        <p className="text-foreground/70 text-sm mb-2">Status</p>
                        <p className="text-xl font-bold capitalize text-primary">{enrollment.status.replace('_', ' ')}</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-8">
                      <p className="text-foreground font-semibold mb-3">Overall Progress</p>
                      <div className="h-3 bg-secondary rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${enrollment.progressPercentage}%` }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                          className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full"
                        />
                      </div>
                    </div>

                    {/* Daily Tracker */}
                    <div>
                      <p className="text-foreground font-semibold mb-4">Daily Progress</p>
                      <div className="grid grid-cols-10 sm:grid-cols-20 gap-2">
                        {enrollment.dailyProgress.slice(0, 30).map((completed, day) => (
                          <div
                            key={day}
                            title={`Day ${day + 1}`}
                            className={`aspect-square rounded-lg flex items-center justify-center text-xs font-bold cursor-pointer transition-colors ${
                              completed
                                ? 'bg-primary text-white'
                                : day < enrollment.completedDays
                                ? 'bg-green-500 text-white'
                                : 'bg-secondary text-foreground/40'
                            }`}
                          >
                            {day + 1 <= 9 ? day + 1 : day + 1 - 9}
                          </div>
                        ))}
                      </div>
                      <p className="text-foreground/70 text-xs mt-3">Showing first 30 days</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
