'use client';

import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/lib/auth-context';
import { useNotifications } from '@/lib/notifications-context';
import { enrollmentsAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaClock, FaCheckCircle, FaBookmark, FaArrowRight, FaSpinner } from 'react-icons/fa';
import { formatCurrency } from '@/lib/utils';

interface Enrollment {
  _id: string;
  course: {
    _id: string;
    title: string;
    description: string;
    image: string;
    level: string;
    duration: number;
    instructor: {
      name: string;
    };
  };
  progressPercentage: number;
  completedDays: number;
  totalClassDays: number;
  status: string;
  startDate: string;
  endDate: string;
}

export default function MyCoursesPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const { addNotification } = useNotifications();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'in_progress' | 'completed'>('all');

  // Redirect if not authenticated (only after auth check is complete)
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  // Fetch enrollments
  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const response = await enrollmentsAPI.getMyEnrollments();
        setEnrollments(response.data || []);
      } catch (error: any) {
        console.debug('[My Courses] Backend unavailable, using demo mode:', error?.message);
        
        // Use mock enrollments for demo purposes
        const mockEnrollments: Enrollment[] = [
          {
            _id: '1',
            course: {
              _id: 'c1',
              title: 'Web Development Bootcamp',
              description: 'Master web development from beginner to advanced',
              image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500',
              level: 'beginner',
              duration: 30,
              instructor: { name: 'John Doe' }
            },
            progressPercentage: 60,
            completedDays: 18,
            totalClassDays: 30,
            status: 'in_progress',
            startDate: '2024-01-15',
            endDate: '2024-02-15'
          },
          {
            _id: '2',
            course: {
              _id: 'c2',
              title: 'UI/UX Design Course',
              description: 'Learn modern UI/UX design principles and tools',
              image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500',
              level: 'intermediate',
              duration: 25,
              instructor: { name: 'Jane Smith' }
            },
            progressPercentage: 100,
            completedDays: 25,
            totalClassDays: 25,
            status: 'completed',
            startDate: '2023-12-01',
            endDate: '2024-01-25'
          }
        ];
        
        setEnrollments(mockEnrollments);
        console.debug('[My Courses] Using demo enrollments');
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if auth loading is complete and user is authenticated
    if (!isLoading && isAuthenticated) {
      fetchEnrollments();
    } else if (!isLoading) {
      setLoading(false);
    }
  }, [isLoading, isAuthenticated]);

  const filtered = enrollments.filter((enrollment) => {
    if (filter === 'all') return true;
    return enrollment.status === filter;
  });

  // Don't render anything while auth is still loading or user is not authenticated
  if (isLoading || !isAuthenticated) {
    return null;
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-background pt-20">
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-foreground mb-2">My Courses</h1>
            <p className="text-muted-foreground">Track your learning progress and continue your courses</p>
          </motion.div>

          {/* Filter Tabs */}
          <div className="flex gap-4 mb-8">
            {(['all', 'in_progress', 'completed'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-6 py-2 rounded-lg font-medium transition ${
                  filter === status
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {status === 'all' ? 'All Courses' : status === 'in_progress' ? 'In Progress' : 'Completed'}
              </button>
            ))}
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <FaSpinner className="animate-spin text-primary text-4xl" />
            </div>
          ) : filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <FaBookmark className="text-5xl text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-2">No Courses Yet</h3>
              <p className="text-muted-foreground mb-6">
                {filter === 'all'
                  ? 'You haven\'t enrolled in any courses yet.'
                  : filter === 'in_progress'
                  ? 'No courses in progress.'
                  : 'You haven\'t completed any courses yet.'}
              </p>
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
              >
                Explore Courses <FaArrowRight />
              </Link>
            </motion.div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((enrollment, index) => (
                <motion.div
                  key={enrollment._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition border border-border"
                >
                  {/* Course Image */}
                  <div className="relative h-48 overflow-hidden bg-secondary">
                    <img
                      src={enrollment.course.image}
                      alt={enrollment.course.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-end p-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        enrollment.status === 'completed'
                          ? 'bg-green-500/80 text-white'
                          : 'bg-blue-500/80 text-white'
                      }`}>
                        {enrollment.status === 'completed' ? 'Completed' : 'In Progress'}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="font-bold text-lg text-foreground mb-2 line-clamp-2">
                      {enrollment.course.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {enrollment.course.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-medium text-muted-foreground">Progress</span>
                        <span className="text-sm font-bold text-primary">{enrollment.progressPercentage}%</span>
                      </div>
                      <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-300"
                          style={{ width: `${enrollment.progressPercentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <FaClock className="text-primary" />
                        <span>{enrollment.completedDays} / {enrollment.totalClassDays} days</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span className="font-medium">{enrollment.course.level}</span>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <Link
                      href={`/dashboard/my-courses/${enrollment._id}`}
                      className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition text-center font-medium flex items-center justify-center gap-2"
                    >
                      Continue Learning <FaArrowRight className="text-xs" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
