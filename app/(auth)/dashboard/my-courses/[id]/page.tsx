'use client';

import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/lib/auth-context';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaPlay, FaBookmark, FaClock, FaCheckCircle, FaSpinner, FaDownload } from 'react-icons/fa';

interface CourseDetail {
  _id: string;
  title: string;
  description: string;
  image: string;
  instructor: {
    name: string;
    bio: string;
  };
  progressPercentage: number;
  modules: Array<{
    id: string;
    title: string;
    duration: number;
    completed: boolean;
    lessons: Array<{
      id: string;
      title: string;
      duration: number;
      completed: boolean;
    }>;
  }>;
  certificateUrl?: string;
}

export default function CourseDetailPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    // Mock course data - replace with API call
    if (!isLoading && isAuthenticated) {
      setTimeout(() => {
        const mockCourse: CourseDetail = {
          _id: courseId,
          title: 'Web Development Bootcamp',
          description: 'Master web development from beginner to advanced. Learn HTML, CSS, JavaScript, React, Node.js and more.',
          image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
          instructor: {
            name: 'John Doe',
            bio: 'Senior Full-Stack Developer with 10+ years of experience'
          },
          progressPercentage: 60,
          modules: [
            {
              id: '1',
              title: 'HTML Fundamentals',
              duration: 120,
              completed: true,
              lessons: [
                { id: '1-1', title: 'Introduction to HTML', duration: 25, completed: true },
                { id: '1-2', title: 'HTML Tags & Attributes', duration: 35, completed: true },
                { id: '1-3', title: 'Forms & Input', duration: 30, completed: true },
                { id: '1-4', title: 'Semantic HTML', duration: 30, completed: true }
              ]
            },
            {
              id: '2',
              title: 'CSS Styling',
              duration: 150,
              completed: true,
              lessons: [
                { id: '2-1', title: 'CSS Basics', duration: 40, completed: true },
                { id: '2-2', title: 'Flexbox & Grid', duration: 50, completed: true },
                { id: '2-3', title: 'Responsive Design', duration: 35, completed: true },
                { id: '2-4', title: 'CSS Animations', duration: 25, completed: true }
              ]
            },
            {
              id: '3',
              title: 'JavaScript Advanced',
              duration: 200,
              completed: false,
              lessons: [
                { id: '3-1', title: 'JS Fundamentals', duration: 50, completed: true },
                { id: '3-2', title: 'DOM Manipulation', duration: 45, completed: true },
                { id: '3-3', title: 'Async & Promises', duration: 55, completed: false },
                { id: '3-4', title: 'Fetch & APIs', duration: 50, completed: false }
              ]
            }
          ],
          certificateUrl: 'https://example.com/certificates/sample.pdf'
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
            <Link href="/dashboard/my-courses" className="text-primary hover:underline">
              Back to My Courses
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const completedModules = course.modules.filter(m => m.completed).length;
  const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const completedLessons = course.modules.reduce((sum, m) => sum + m.lessons.filter(l => l.completed).length, 0);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-background pt-20">
        {/* Back Button */}
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/dashboard/my-courses"
            className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
          >
            <FaArrowLeft className="w-4 h-4" />
            Back to My Courses
          </Link>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2"
            >
              {/* Course Header */}
              <div className="mb-8">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-64 object-cover rounded-xl mb-6"
                />
                <h1 className="text-4xl font-bold text-foreground mb-3">{course.title}</h1>
                <p className="text-foreground/70 text-lg mb-4">{course.description}</p>

                {/* Instructor Info */}
                <div className="flex items-center gap-4 p-4 bg-secondary/30 rounded-lg border border-border/20">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {course.instructor.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{course.instructor.name}</p>
                    <p className="text-sm text-foreground/70">{course.instructor.bio}</p>
                  </div>
                </div>
              </div>

              {/* Course Modules */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Course Content</h2>
                <div className="space-y-4">
                  {course.modules.map((module, moduleIndex) => (
                    <motion.div
                      key={module.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: moduleIndex * 0.1 }}
                      className="border border-border/20 rounded-lg overflow-hidden bg-card hover:border-primary/50 transition"
                    >
                      {/* Module Header */}
                      <div className="p-4 bg-secondary/20 border-b border-border/20 flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-foreground mb-1">{module.title}</h3>
                          <p className="text-sm text-foreground/70 flex items-center gap-2">
                            <FaClock className="w-3 h-3" />
                            {module.duration} minutes
                          </p>
                        </div>
                        <div>
                          {module.completed ? (
                            <FaCheckCircle className="w-6 h-6 text-green-500" />
                          ) : (
                            <span className="text-xs font-bold text-muted-foreground">In Progress</span>
                          )}
                        </div>
                      </div>

                      {/* Lessons */}
                      <div className="divide-y divide-border/20">
                        {module.lessons.map((lesson) => (
                          <div
                            key={lesson.id}
                            className="p-4 flex items-center justify-between hover:bg-secondary/30 transition"
                          >
                            <div className="flex items-center gap-3 flex-1">
                              {lesson.completed ? (
                                <FaCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                              ) : (
                                <FaPlay className="w-5 h-5 text-primary flex-shrink-0" />
                              )}
                              <div>
                                <p className={`font-medium ${lesson.completed ? 'text-foreground/70 line-through' : 'text-foreground'}`}>
                                  {lesson.title}
                                </p>
                                <p className="text-xs text-foreground/50">{lesson.duration} min</p>
                              </div>
                            </div>
                            {!lesson.completed && (
                              <button className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition text-sm font-medium">
                                Continue
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Progress Card */}
              <div className="p-6 bg-card border border-border/20 rounded-xl sticky top-24">
                <h3 className="font-bold text-foreground mb-4">Your Progress</h3>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-foreground/70">Overall Progress</span>
                    <span className="text-lg font-bold text-primary">{course.progressPercentage}%</span>
                  </div>
                  <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-500"
                      style={{ width: `${course.progressPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground/70">Modules Completed</span>
                    <span className="font-bold text-foreground">{completedModules} / {course.modules.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground/70">Lessons Completed</span>
                    <span className="font-bold text-foreground">{completedLessons} / {totalLessons}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <button className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium mb-3 flex items-center justify-center gap-2">
                  <FaPlay className="w-4 h-4" />
                  Continue Learning
                </button>

                {course.progressPercentage === 100 && course.certificateUrl && (
                  <button className="w-full py-3 px-4 bg-green-500/10 text-green-600 border border-green-500/30 rounded-lg hover:bg-green-500/20 transition font-medium flex items-center justify-center gap-2">
                    <FaDownload className="w-4 h-4" />
                    Download Certificate
                  </button>
                )}

                <button className="w-full py-2 px-4 border border-border/20 text-foreground rounded-lg hover:bg-secondary transition font-medium flex items-center justify-center gap-2 mt-3">
                  <FaBookmark className="w-4 h-4" />
                  Save Course
                </button>
              </div>

              {/* Course Info */}
              <div className="p-6 bg-card border border-border/20 rounded-xl">
                <h3 className="font-bold text-foreground mb-4">Course Details</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-foreground/70 mb-1">Level</p>
                    <p className="font-medium text-foreground">Beginner</p>
                  </div>
                  <div>
                    <p className="text-foreground/70 mb-1">Total Duration</p>
                    <p className="font-medium text-foreground flex items-center gap-2">
                      <FaClock className="w-4 h-4" />
                      {course.modules.reduce((sum, m) => sum + m.duration, 0)} minutes
                    </p>
                  </div>
                  <div>
                    <p className="text-foreground/70 mb-1">Modules</p>
                    <p className="font-medium text-foreground">{course.modules.length} modules</p>
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
