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
  FaUsers,
  FaBook,
  FaChartBar,
  FaEdit,
  FaTrash,
  FaSpinner,
  FaPlus,
  FaEye,
  FaCheckCircle
} from 'react-icons/fa';

interface Module {
  id: string;
  title: string;
  lessons: number;
  duration: number;
  students: number;
  completionRate: number;
}

interface CourseDetail {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'draft' | 'archived';
  students: number;
  modules: Module[];
  totalEnrollments: number;
  totalViews: number;
  avgRating: number;
  createdDate: string;
  lastModified: string;
}

export default function InstructorCourseDetailPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'instructor')) {
      router.push('/instructor-login');
    }
  }, [isLoading, isAuthenticated, user, router]);

  useEffect(() => {
    // Mock course data - replace with API call
    if (!isLoading && isAuthenticated) {
      setTimeout(() => {
        const mockCourse: CourseDetail = {
          id: courseId,
          title: 'React Basics',
          description: 'Learn React fundamentals from scratch. Build modern web applications with React.',
          status: 'active',
          students: 500,
          totalEnrollments: 650,
          totalViews: 12500,
          avgRating: 4.8,
          createdDate: '2024-01-01',
          lastModified: '2024-01-20',
          modules: [
            {
              id: '1',
              title: 'Getting Started with React',
              lessons: 8,
              duration: 120,
              students: 500,
              completionRate: 95
            },
            {
              id: '2',
              title: 'Components & Props',
              lessons: 10,
              duration: 150,
              students: 480,
              completionRate: 88
            },
            {
              id: '3',
              title: 'State & Lifecycle',
              lessons: 12,
              duration: 180,
              students: 420,
              completionRate: 75
            },
            {
              id: '4',
              title: 'Hooks Deep Dive',
              lessons: 15,
              duration: 200,
              students: 320,
              completionRate: 58
            }
          ]
        };
        setCourse(mockCourse);
        setLoading(false);
      }, 500);
    }
  }, [isLoading, isAuthenticated, courseId]);

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

  if (!course) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background pt-20">
          <div className="container mx-auto px-4 py-12 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Course not found</h1>
            <Link href="/instructor/courses" className="text-primary hover:underline">
              Back to Courses
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
            href="/instructor/courses"
            className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
          >
            <FaArrowLeft className="w-4 h-4" />
            Back to Courses
          </Link>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">{course.title}</h1>
                <p className="text-foreground/70 mb-4">{course.description}</p>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    course.status === 'active'
                      ? 'bg-green-500/20 text-green-600'
                      : course.status === 'draft'
                      ? 'bg-yellow-500/20 text-yellow-600'
                      : 'bg-gray-500/20 text-gray-600'
                  }`}>
                    {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                  </span>
                  <span className="text-sm text-foreground/70">
                    Created {new Date(course.createdDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="p-3 border border-border/20 text-foreground hover:bg-secondary rounded-lg transition">
                  <FaEdit className="w-5 h-5" />
                </button>
                <button className="p-3 border border-border/20 text-foreground hover:bg-secondary rounded-lg transition">
                  <FaTrash className="w-5 h-5 text-red-500" />
                </button>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { label: 'Students', value: course.students, icon: FaUsers },
                  { label: 'Total Views', value: course.totalViews, icon: FaEye },
                  { label: 'Avg Rating', value: `${course.avgRating}⭐`, icon: FaCheckCircle },
                  { label: 'Modules', value: course.modules.length, icon: FaBook },
                  { label: 'Enrollments', value: course.totalEnrollments, icon: FaChartBar }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + index * 0.05 }}
                    className="p-4 bg-card border border-border/20 rounded-lg text-center"
                  >
                    <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold text-foreground mb-1">{stat.value}</p>
                    <p className="text-xs text-foreground/70">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Modules */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-card border border-border/20 rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-foreground">Course Modules</h2>
                  <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition text-sm font-medium">
                    <FaPlus className="w-4 h-4" />
                    Add Module
                  </button>
                </div>

                <div className="space-y-4">
                  {course.modules.map((module, index) => (
                    <motion.div
                      key={module.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="p-4 bg-secondary/20 border border-border/20 rounded-lg hover:border-primary/50 transition"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-bold text-foreground mb-2">{module.title}</h3>
                          <p className="text-sm text-foreground/70">
                            {module.lessons} lessons • {module.duration} mins
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary mb-1">{module.completionRate}%</p>
                          <p className="text-xs text-foreground/70">completion</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex-1 mr-4">
                          <div className="flex justify-between items-center text-xs mb-1">
                            <span className="text-foreground/70">{module.students} students</span>
                            <span className="text-foreground/70">{module.completionRate}%</span>
                          </div>
                          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all"
                              style={{ width: `${module.completionRate}%` }}
                            />
                          </div>
                        </div>
                        <button className="p-2 border border-border/20 text-foreground hover:bg-secondary rounded-lg transition flex-shrink-0">
                          <FaEdit className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Quick Stats */}
              <div className="bg-card border border-border/20 rounded-xl p-6 sticky top-24">
                <h3 className="font-bold text-foreground mb-4">Course Performance</h3>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm font-medium text-foreground/70">Avg Completion Rate</p>
                      <p className="text-lg font-bold text-primary">76.5%</p>
                    </div>
                    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-primary" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm font-medium text-foreground/70">Student Satisfaction</p>
                      <p className="text-lg font-bold text-green-500">4.8/5</p>
                    </div>
                    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: '96%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm font-medium text-foreground/70">Engagement Level</p>
                      <p className="text-lg font-bold text-blue-500">High</p>
                    </div>
                    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: '85%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-card border border-border/20 rounded-xl p-6">
                <h3 className="font-bold text-foreground mb-4">Actions</h3>
                <div className="space-y-3">
                  <button className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium text-sm">
                    Edit Course
                  </button>
                  <button className="w-full py-3 px-4 border border-border/20 text-foreground hover:bg-secondary rounded-lg transition font-medium text-sm">
                    View Student List
                  </button>
                  <button className="w-full py-3 px-4 border border-border/20 text-foreground hover:bg-secondary rounded-lg transition font-medium text-sm">
                    Generate Report
                  </button>
                </div>
              </div>

              {/* Course Info */}
              <div className="bg-card border border-border/20 rounded-xl p-6">
                <h3 className="font-bold text-foreground mb-4">Course Info</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-foreground/70 mb-1">Created</p>
                    <p className="font-medium text-foreground">
                      {new Date(course.createdDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-foreground/70 mb-1">Last Modified</p>
                    <p className="font-medium text-foreground">
                      {new Date(course.lastModified).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-foreground/70 mb-1">Status</p>
                    <p className="font-medium text-foreground capitalize">{course.status}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
