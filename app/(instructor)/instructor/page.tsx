'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaUsers, FaBook, FaClipboardList, FaActivity, FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

interface DashboardStats {
  assignedStudents: number;
  activeCourses: number;
  attendanceToday: number;
  recentActivity: Array<any>;
}

export default function InstructorDashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    assignedStudents: 24,
    activeCourses: 3,
    attendanceToday: 18,
    recentActivity: [
      { id: 1, type: 'attendance', student: 'John Doe', action: 'marked present', time: '2 hours ago' },
      { id: 2, type: 'post', student: 'Jane Smith', action: 'posted in community', time: '4 hours ago' },
      { id: 3, type: 'progress', student: 'Mike Johnson', action: 'completed module 3', time: '6 hours ago' },
    ],
  });

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'instructor')) {
      router.push('/instructor-login');
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading || !isAuthenticated || user?.role !== 'instructor') {
    return null;
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Page Header */}
        <section className="py-8 border-b border-border/20 bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">Instructor Dashboard</h1>
                <p className="text-foreground/70">Welcome, {user?.name}</p>
              </div>
              <Link
                href="/instructor/profile"
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Edit Profile
              </Link>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {[
                {
                  icon: FaUsers,
                  label: 'Assigned Students',
                  value: stats.assignedStudents,
                  href: '/instructor/students',
                },
                {
                  icon: FaBook,
                  label: 'Active Courses',
                  value: stats.activeCourses,
                  href: '/instructor/courses',
                },
                {
                  icon: FaClipboardList,
                  label: 'Attendance Today',
                  value: stats.attendanceToday,
                  href: '/instructor/attendance',
                },
                {
                  icon: FaActivity,
                  label: 'Active Sessions',
                  value: 2,
                  href: '/instructor/sessions',
                },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={stat.href}>
                    <div className="p-6 bg-card border border-border/20 rounded-xl hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer h-full">
                      <div className="flex items-center justify-between mb-4">
                        <stat.icon className="w-8 h-8 text-primary" />
                        <span className="text-2xl font-bold text-foreground">{stat.value}</span>
                      </div>
                      <p className="text-foreground/70 text-sm">{stat.label}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="lg:col-span-2 p-6 bg-card border border-border/20 rounded-xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <FaActivity className="w-5 h-5 text-primary" />
                    Recent Activity
                  </h2>
                  <Link href="/instructor/activity" className="text-sm text-primary hover:underline">
                    View All
                  </Link>
                </div>

                <div className="space-y-4">
                  {stats.recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg border border-border/20"
                    >
                      <div>
                        <p className="font-medium text-foreground">{activity.student}</p>
                        <p className="text-sm text-foreground/70">{activity.action}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {activity.type === 'attendance' && (
                          <FaCheckCircle className="w-5 h-5 text-green-500" />
                        )}
                        <span className="text-xs text-foreground/60">{activity.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="p-6 bg-card border border-border/20 rounded-xl"
              >
                <h2 className="text-xl font-bold text-foreground mb-6">Quick Actions</h2>

                <div className="space-y-3">
                  {[
                    { label: 'Mark Attendance', href: '/instructor/attendance' },
                    { label: 'View Students', href: '/instructor/students' },
                    { label: 'My Courses', href: '/instructor/courses' },
                    { label: 'Create Post', href: '/instructor/community' },
                    { label: 'View Messages', href: '/instructor/messages' },
                    { label: 'Profile Settings', href: '/instructor/profile' },
                  ].map((action, i) => (
                    <Link
                      key={i}
                      href={action.href}
                      className="block p-3 bg-secondary/50 hover:bg-secondary border border-border/20 rounded-lg text-foreground font-medium transition-colors"
                    >
                      {action.label}
                    </Link>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
