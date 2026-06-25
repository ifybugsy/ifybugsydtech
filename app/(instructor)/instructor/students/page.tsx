'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaSearch, FaFilter, FaUser, FaCheckCircle, FaTimesCircle, FaEye } from 'react-icons/fa';

interface Student {
  id: string;
  name: string;
  email: string;
  studentId: string;
  enrolledCourses: number;
  attendance: number;
  progress: number;
  status: 'active' | 'inactive';
}

export default function StudentManagementPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  // Mock data
  const [students] = useState<Student[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      studentId: 'IFY-STU-00001',
      enrolledCourses: 3,
      attendance: 92,
      progress: 85,
      status: 'active',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      studentId: 'IFY-STU-00002',
      enrolledCourses: 2,
      attendance: 88,
      progress: 78,
      status: 'active',
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      studentId: 'IFY-STU-00003',
      enrolledCourses: 1,
      attendance: 45,
      progress: 32,
      status: 'inactive',
    },
    {
      id: '4',
      name: 'Sarah Williams',
      email: 'sarah@example.com',
      studentId: 'IFY-STU-00004',
      enrolledCourses: 4,
      attendance: 96,
      progress: 92,
      status: 'active',
    },
  ]);

  const filtered = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || student.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  if (!isAuthenticated || user?.role !== 'instructor') {
    return null;
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Header */}
        <section className="py-8 border-b border-border/20 bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 mb-6">
              <Link
                href="/instructor"
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
                title="Back to Dashboard"
              >
                <FaArrowLeft className="w-5 h-5 text-foreground" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Student Management</h1>
                <p className="text-foreground/70">Manage and view your assigned students</p>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Search and Filter */}
            <div className="mb-8 flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-3 top-3.5 w-5 h-5 text-foreground/50" />
                <input
                  type="text"
                  placeholder="Search by name, email, or student ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-secondary border border-border rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="px-4 py-3 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Students Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border/20 rounded-xl overflow-hidden"
            >
              {filtered.length === 0 ? (
                <div className="p-12 text-center">
                  <FaUser className="w-12 h-12 text-foreground/30 mx-auto mb-4" />
                  <p className="text-foreground/70">No students found matching your criteria</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border/20 bg-secondary/50">
                        <th className="text-left px-6 py-4 font-semibold text-foreground">Name</th>
                        <th className="text-left px-6 py-4 font-semibold text-foreground">Student ID</th>
                        <th className="text-left px-6 py-4 font-semibold text-foreground">Courses</th>
                        <th className="text-left px-6 py-4 font-semibold text-foreground">Attendance</th>
                        <th className="text-left px-6 py-4 font-semibold text-foreground">Progress</th>
                        <th className="text-left px-6 py-4 font-semibold text-foreground">Status</th>
                        <th className="text-left px-6 py-4 font-semibold text-foreground">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20">
                      {filtered.map((student) => (
                        <tr key={student.id} className="hover:bg-secondary/30 transition-colors">
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium text-foreground">{student.name}</p>
                              <p className="text-sm text-foreground/60">{student.email}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-foreground">{student.studentId}</td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">
                              {student.enrolledCourses} courses
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-2 bg-secondary rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-green-500"
                                  style={{ width: `${student.attendance}%` }}
                                />
                              </div>
                              <span className="text-sm text-foreground">{student.attendance}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-2 bg-secondary rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-blue-500"
                                  style={{ width: `${student.progress}%` }}
                                />
                              </div>
                              <span className="text-sm text-foreground">{student.progress}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {student.status === 'active' ? (
                                <>
                                  <FaCheckCircle className="w-4 h-4 text-green-500" />
                                  <span className="text-sm font-medium text-green-600">Active</span>
                                </>
                              ) : (
                                <>
                                  <FaTimesCircle className="w-4 h-4 text-red-500" />
                                  <span className="text-sm font-medium text-red-600">Inactive</span>
                                </>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Link
                              href={`/instructor/students/${student.id}`}
                              className="inline-flex items-center gap-2 px-3 py-1 text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                            >
                              <FaEye className="w-4 h-4" />
                              View
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>

            {/* Stats Footer */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'Total Students', value: students.length },
                { label: 'Active Students', value: students.filter((s) => s.status === 'active').length },
                { label: 'Avg Attendance', value: `${Math.round(students.reduce((sum, s) => sum + s.attendance, 0) / students.length)}%` },
              ].map((stat, i) => (
                <div key={i} className="p-4 bg-card border border-border/20 rounded-lg">
                  <p className="text-foreground/70 text-sm mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
