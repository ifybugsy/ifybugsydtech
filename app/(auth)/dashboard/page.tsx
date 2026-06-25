'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/lib/auth-context';
import { SAMPLE_ENROLLMENTS, COURSES } from '@/lib/mockData';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FaBookOpen,
  FaAward,
  FaCreditCard,
  FaUser,
  FaChartLine,
  FaClock,
  FaFire,
  FaDownload,
  FaArrowRight,
  FaCheckCircle,
  FaGraduationCap,
  FaStar,
  FaCalendar,
  FaUsers,
  FaComments,
  FaCertificate,
} from 'react-icons/fa';
import { calculateProgressPercentage, formatCurrency } from '@/lib/utils';

export default function DashboardPage() {
  const { user } = useAuth();
  const enrollments = SAMPLE_ENROLLMENTS.filter((e) => e.studentId === user?.id);

  const totalProgress =
    enrollments.length > 0
      ? Math.round(enrollments.reduce((sum, e) => sum + e.progressPercentage, 0) / enrollments.length)
      : 0;

  const completedCourses = enrollments.filter((e) => e.status === 'completed').length;
  const inProgressCourses = enrollments.filter((e) => e.status === 'in_progress').length;
  const streakDays = 15;
  const totalLearningHours = inProgressCourses * 25;

  const dashboardCards = [
    {
      icon: FaBookOpen,
      label: 'Active Courses',
      value: inProgressCourses,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/20 text-blue-600 dark:text-blue-400',
      description: 'Courses in progress',
    },
    {
      icon: FaAward,
      label: 'Certificates Earned',
      value: completedCourses,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/20 text-green-600 dark:text-green-400',
      description: 'Completed courses',
    },
    {
      icon: FaChartLine,
      label: 'Overall Progress',
      value: `${totalProgress}%`,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/20 text-purple-600 dark:text-purple-400',
      description: 'Average completion',
    },
    {
      icon: FaFire,
      label: 'Learning Streak',
      value: `${streakDays}`,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-500/20 text-orange-600 dark:text-orange-400',
      description: 'Days of learning',
    },
  ];

  const sidebarLinks = [
    {
      icon: FaBookOpen,
      label: 'My Courses',
      href: '/dashboard/my-courses',
      color: 'text-blue-600 dark:text-blue-400',
    },
    {
      icon: FaUser,
      label: 'Profile',
      href: '/dashboard/profile',
      color: 'text-purple-600 dark:text-purple-400',
    },
    {
      icon: FaChartLine,
      label: 'Progress',
      href: '/dashboard/progress',
      color: 'text-green-600 dark:text-green-400',
    },
    {
      icon: FaCertificate,
      label: 'Certificates',
      href: '/dashboard/certificates',
      color: 'text-yellow-600 dark:text-yellow-400',
    },
    {
      icon: FaUsers,
      label: 'Community',
      href: '/dashboard/community',
      color: 'text-pink-600 dark:text-pink-400',
    },
    {
      icon: FaComments,
      label: 'Messages',
      href: '/dashboard/messages',
      color: 'text-indigo-600 dark:text-indigo-400',
    },
  ];

  const getUserCourses = () => {
    return enrollments.map((enrollment) => {
      const course = COURSES.find((c) => c.id === enrollment.courseId);
      return { enrollment, course };
    }).filter((item) => item.course);
  };

  const recentCourses = getUserCourses().slice(0, 3);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border-b border-border/20 py-8 sm:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6"
            >
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                  Welcome back, {user?.name?.split(' ')[0]}! 👋
                </h1>
                <p className="text-foreground/70">
                  {inProgressCourses > 0
                    ? `You have ${inProgressCourses} course${inProgressCourses !== 1 ? 's' : ''} in progress. Keep learning!`
                    : 'Explore our courses and start learning today!'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center text-white font-bold text-xl">
                  {user?.name?.charAt(0) || 'S'}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8">
              {/* Stats Cards */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6">Learning Overview</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {dashboardCards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-card rounded-lg border border-border/20 p-4 sm:p-6 hover:border-primary/50 transition-all hover:shadow-lg"
                      >
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg ${card.bgColor} flex items-center justify-center mb-3 sm:mb-4`}>
                          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        <p className="text-foreground/70 text-xs sm:text-sm font-medium mb-1">{card.label}</p>
                        <p className="text-xl sm:text-2xl font-bold text-foreground">{card.value}</p>
                        <p className="text-xs text-foreground/60 mt-1">{card.description}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Active Courses */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-foreground">Active Courses</h2>
                  <Link
                    href="/dashboard/my-courses"
                    className="text-primary hover:text-primary/80 transition-colors flex items-center gap-1 text-sm font-medium"
                  >
                    View All
                    <FaArrowRight className="w-3 h-3" />
                  </Link>
                </div>

                <div className="space-y-4">
                  {recentCourses.length > 0 ? (
                    recentCourses.map((item, index) => {
                      if (!item.course) return null;
                      const progress = item.enrollment.progressPercentage;

                      return (
                        <motion.div
                          key={item.course.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="bg-card rounded-lg border border-border/20 p-6 hover:border-primary/50 transition-all hover:shadow-md"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-bold text-foreground mb-1">{item.course.title}</h3>
                              <p className="text-foreground/70 text-sm flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-primary" />
                                Instructor: {item.course.instructor.name}
                              </p>
                            </div>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-600 dark:text-green-400 flex items-center gap-1">
                              <FaCheckCircle className="w-3 h-3" />
                              {progress}% Complete
                            </span>
                          </div>

                          {/* Progress Bar */}
                          <div className="mb-4">
                            <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ delay: index * 0.05 + 0.3, duration: 0.8 }}
                                className="h-full bg-gradient-to-r from-primary to-primary/50"
                              />
                            </div>
                          </div>

                          {/* Course Info */}
                          <div className="flex flex-wrap gap-4 text-sm text-foreground/70">
                            <div className="flex items-center gap-2">
                              <FaClock className="w-4 h-4 text-primary" />
                              <span>
                                {item.enrollment.completedDays}/{item.enrollment.totalClassDays} days
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FaStar className="w-4 h-4 text-yellow-500" />
                              <span>{item.course.rating} rating</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FaCalendar className="w-4 h-4 text-primary" />
                              <span>Ends {item.enrollment.endDate}</span>
                            </div>
                          </div>

                          <Link
                            href={`/courses/${item.course.id}`}
                            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-colors font-medium text-sm"
                          >
                            Continue Learning
                            <FaArrowRight className="w-3 h-3" />
                          </Link>
                        </motion.div>
                      );
                    })
                  ) : (
                    <div className="text-center py-12 bg-card rounded-lg border border-border/20">
                      <FaBookOpen className="w-12 h-12 text-foreground/30 mx-auto mb-4" />
                      <p className="text-foreground/70 mb-4">You haven&apos;t enrolled in any courses yet</p>
                      <Link
                        href="/courses"
                        className="inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
                      >
                        Explore Courses
                        <FaArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Certificates */}
              {completedCourses > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-6">Your Certificates</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {enrollments
                      .filter((e) => e.status === 'completed')
                      .map((enrollment, index) => {
                        const course = COURSES.find((c) => c.id === enrollment.courseId);
                        return course ? (
                          <motion.div
                            key={enrollment.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/30 p-6 hover:border-yellow-500/50 transition-all hover:shadow-lg"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <FaAward className="w-8 h-8 text-yellow-500" />
                              <span className="text-xs font-semibold bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 px-2 py-1 rounded-full">
                                Completed
                              </span>
                            </div>
                            <h3 className="font-bold text-foreground mb-2">{course.title}</h3>
                            <p className="text-foreground/70 text-sm mb-4">Certificate ID: {enrollment.certificateId || 'GEN-2025-' + index}</p>
                            <button className="w-full px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white transition-colors font-medium flex items-center justify-center gap-2">
                              <FaDownload className="w-4 h-4" />
                              Download Certificate
                            </button>
                          </motion.div>
                        ) : null;
                      })}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Links */}
              <div className="bg-card rounded-lg border border-border/20 p-6">
                <h3 className="font-bold text-foreground mb-4">Quick Access</h3>
                <div className="space-y-2">
                  {sidebarLinks.map((link, index) => {
                    const Icon = link.icon;
                    return (
                      <Link key={index} href={link.href}>
                        <motion.div
                          whileHover={{ x: 4 }}
                          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary transition-colors cursor-pointer"
                        >
                          <Icon className={`w-5 h-5 ${link.color}`} />
                          <span className="text-foreground font-medium">{link.label}</span>
                        </motion.div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Study Plan */}
              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg border border-border/20 p-6">
                <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                  <FaGraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Study Plan
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-foreground/70">This Week&apos;s Goal</span>
                      <span className="text-sm font-bold text-foreground">18/20 hours</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
                      <div className="w-4/5 h-full bg-gradient-to-r from-blue-500 to-cyan-500" />
                    </div>
                  </div>
                  <p className="text-xs text-foreground/70 mt-4">
                    Great pace! You&apos;re ahead of your weekly study goals. Keep it up! 🎉
                  </p>
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-card rounded-lg border border-border/20 p-6">
                <h3 className="font-bold text-foreground mb-4">Recommended</h3>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-secondary/30 hover:bg-secondary transition-colors cursor-pointer">
                    <p className="text-sm font-medium text-foreground mb-1">Advanced React Patterns</p>
                    <p className="text-xs text-foreground/70">Based on your interests</p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/30 hover:bg-secondary transition-colors cursor-pointer">
                    <p className="text-sm font-medium text-foreground mb-1">Cloud Architecture Basics</p>
                    <p className="text-xs text-foreground/70">Trending now</p>
                  </div>
                  <Link
                    href="/courses"
                    className="block text-center px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium mt-4"
                  >
                    Explore All Courses
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
