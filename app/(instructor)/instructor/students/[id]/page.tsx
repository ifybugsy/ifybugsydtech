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
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendar,
  FaCheckCircle,
  FaTimesCircle,
  FaBook,
  FaChartBar,
  FaSpinner,
  FaDownload
} from 'react-icons/fa';

interface StudentDetail {
  id: string;
  name: string;
  email: string;
  phone: string;
  profileImage: string;
  studentId: string;
  joinDate: string;
  status: 'active' | 'inactive';
  enrolledCourses: Array<{
    id: string;
    title: string;
    progress: number;
    status: 'completed' | 'in_progress';
    enrollmentDate: string;
  }>;
  attendance: number;
  overallProgress: number;
  totalHoursLearned: number;
  completedAssignments: number;
  totalAssignments: number;
}

export default function StudentDetailPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const studentId = params.id as string;

  const [student, setStudent] = useState<StudentDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'instructor')) {
      router.push('/instructor-login');
    }
  }, [isLoading, isAuthenticated, user, router]);

  useEffect(() => {
    // Mock student data - replace with API call
    if (!isLoading && isAuthenticated) {
      setTimeout(() => {
        const mockStudent: StudentDetail = {
          id: studentId,
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1 (555) 123-4567',
          profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
          studentId: 'IFY-STU-00001',
          joinDate: '2024-01-10',
          status: 'active',
          enrolledCourses: [
            {
              id: '1',
              title: 'React Basics',
              progress: 85,
              status: 'in_progress',
              enrollmentDate: '2024-01-10'
            },
            {
              id: '2',
              title: 'Node.js Advanced',
              progress: 100,
              status: 'completed',
              enrollmentDate: '2023-12-01'
            },
            {
              id: '3',
              title: 'Full Stack Development',
              progress: 45,
              status: 'in_progress',
              enrollmentDate: '2024-01-15'
            }
          ],
          attendance: 92,
          overallProgress: 76,
          totalHoursLearned: 120,
          completedAssignments: 18,
          totalAssignments: 20
        };
        setStudent(mockStudent);
        setLoading(false);
      }, 500);
    }
  }, [isLoading, isAuthenticated, studentId]);

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

  if (!student) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background pt-20">
          <div className="container mx-auto px-4 py-12 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Student not found</h1>
            <Link href="/instructor/students" className="text-primary hover:underline">
              Back to Students
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
            href="/instructor/students"
            className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
          >
            <FaArrowLeft className="w-4 h-4" />
            Back to Students
          </Link>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Student Header */}
              <div className="bg-card border border-border/20 rounded-xl p-8">
                <div className="flex items-center gap-6 mb-6">
                  <img
                    src={student.profileImage}
                    alt={student.name}
                    className="w-24 h-24 rounded-full"
                  />
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">{student.name}</h1>
                    <p className="text-foreground/70 mb-3">{student.studentId}</p>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                        student.status === 'active'
                          ? 'bg-green-500/20 text-green-600'
                          : 'bg-red-500/20 text-red-600'
                      }`}>
                        {student.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                      <span className="text-sm text-foreground/70 flex items-center gap-1">
                        <FaCalendar className="w-4 h-4" />
                        Joined {new Date(student.joinDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border/20">
                  <div className="flex items-center gap-3">
                    <FaEnvelope className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-xs text-foreground/70">Email</p>
                      <p className="font-medium text-foreground">{student.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaPhone className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-xs text-foreground/70">Phone</p>
                      <p className="font-medium text-foreground">{student.phone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  {
                    label: 'Overall Progress',
                    value: `${student.overallProgress}%`,
                    icon: FaChartBar,
                    color: 'text-blue-500'
                  },
                  {
                    label: 'Attendance',
                    value: `${student.attendance}%`,
                    icon: FaCheckCircle,
                    color: 'text-green-500'
                  },
                  {
                    label: 'Hours Learned',
                    value: student.totalHoursLearned,
                    icon: FaBook,
                    color: 'text-purple-500'
                  },
                  {
                    label: 'Assignments',
                    value: `${student.completedAssignments}/${student.totalAssignments}`,
                    icon: FaCheckCircle,
                    color: 'text-orange-500'
                  }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-card border border-border/20 rounded-lg text-center"
                  >
                    <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
                    <p className="text-2xl font-bold text-foreground mb-1">{stat.value}</p>
                    <p className="text-xs text-foreground/70">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Enrolled Courses */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-card border border-border/20 rounded-xl p-6"
              >
                <h2 className="text-xl font-bold text-foreground mb-6">Enrolled Courses</h2>
                <div className="space-y-4">
                  {student.enrolledCourses.map((course, index) => (
                    <div
                      key={course.id}
                      className="p-4 bg-secondary/20 border border-border/20 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-foreground">{course.title}</h3>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                          course.status === 'completed'
                            ? 'bg-green-500/20 text-green-600'
                            : 'bg-blue-500/20 text-blue-600'
                        }`}>
                          {course.status === 'completed' ? 'Completed' : 'In Progress'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-foreground/70 mb-2">
                        <span>{course.progress}% Complete</span>
                        <span>Enrolled {new Date(course.enrollmentDate).toLocaleDateString()}</span>
                      </div>
                      <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>
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
              {/* Quick Actions */}
              <div className="bg-card border border-border/20 rounded-xl p-6 sticky top-24">
                <h3 className="font-bold text-foreground mb-4">Actions</h3>
                <div className="space-y-3">
                  <button className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium">
                    Send Message
                  </button>
                  <button className="w-full py-3 px-4 border border-border/20 text-foreground hover:bg-secondary rounded-lg transition font-medium">
                    View Submissions
                  </button>
                  <button className="w-full py-3 px-4 border border-border/20 text-foreground hover:bg-secondary rounded-lg transition font-medium">
                    Schedule Meeting
                  </button>
                  <button className="w-full py-3 px-4 border border-border/20 text-foreground hover:bg-secondary rounded-lg transition font-medium flex items-center justify-center gap-2">
                    <FaDownload className="w-4 h-4" />
                    Download Report
                  </button>
                </div>
              </div>

              {/* Learning Status */}
              <div className="bg-card border border-border/20 rounded-xl p-6">
                <h3 className="font-bold text-foreground mb-4">Learning Status</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm font-medium text-foreground/70">Engagement Level</p>
                      <span className="text-lg font-bold text-primary">High</span>
                    </div>
                    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full w-4/5 bg-green-500" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm font-medium text-foreground/70">Assignment Completion</p>
                      <span className="text-lg font-bold text-primary">90%</span>
                    </div>
                    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full w-9/10 bg-blue-500" />
                    </div>
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
