'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/lib/auth-context';
import { useNotifications } from '@/lib/notifications-context';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaCheckCircle, FaTimesCircle, FaClock, FaClipboardList } from 'react-icons/fa';

interface StudentAttendance {
  id: string;
  name: string;
  studentId: string;
  status: 'present' | 'absent' | 'late' | 'excused' | null;
}

export default function AttendanceMarkingPage() {
  const { user, isAuthenticated } = useAuth();
  const { addNotification } = useNotifications();
  const [selectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedCourse, setSelectedCourse] = useState('all-courses');
  const [students, setStudents] = useState<StudentAttendance[]>([
    { id: '1', name: 'John Doe', studentId: 'IFY-STU-00001', status: null },
    { id: '2', name: 'Jane Smith', studentId: 'IFY-STU-00002', status: null },
    { id: '3', name: 'Mike Johnson', studentId: 'IFY-STU-00003', status: null },
    { id: '4', name: 'Sarah Williams', studentId: 'IFY-STU-00004', status: null },
    { id: '5', name: 'David Brown', studentId: 'IFY-STU-00005', status: null },
  ]);

  const handleStatusChange = (studentId: string, status: 'present' | 'absent' | 'late' | 'excused') => {
    setStudents(
      students.map((s) => (s.id === studentId ? { ...s, status } : s))
    );
  };

  const handleSubmitAttendance = () => {
    const markedCount = students.filter((s) => s.status !== null).length;
    if (markedCount === 0) {
      addNotification('Please mark attendance for at least one student', 'error');
      return;
    }

    // Here you would submit to the backend and emit via Socket.io
    addNotification(`Attendance marked for ${markedCount} student(s)`, 'success');
    
    // Emit Socket.io event for real-time updates
    console.log('[Attendance] Emitting attendance update via Socket.io');
  };

  const handleMarkAll = (status: 'present' | 'absent' | 'late' | 'excused') => {
    setStudents(students.map((s) => ({ ...s, status })));
    addNotification(`All students marked as ${status}`, 'info');
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'present':
        return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case 'absent':
        return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      case 'late':
        return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
      case 'excused':
        return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
      default:
        return 'text-foreground/50 bg-secondary';
    }
  };

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case 'present':
        return <FaCheckCircle className="w-4 h-4" />;
      case 'absent':
        return <FaTimesCircle className="w-4 h-4" />;
      case 'late':
        return <FaClock className="w-4 h-4" />;
      case 'excused':
        return <FaClipboardList className="w-4 h-4" />;
      default:
        return null;
    }
  };

  if (!isAuthenticated || user?.role !== 'instructor') {
    return null;
  }

  const statusStats = {
    present: students.filter((s) => s.status === 'present').length,
    absent: students.filter((s) => s.status === 'absent').length,
    late: students.filter((s) => s.status === 'late').length,
    excused: students.filter((s) => s.status === 'excused').length,
    unmarked: students.filter((s) => s.status === null).length,
  };

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
              >
                <FaArrowLeft className="w-5 h-5 text-foreground" />
              </Link>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-foreground">Mark Attendance</h1>
                <p className="text-foreground/70">Date: {new Date(selectedDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Course Selection and Stats */}
            <div className="mb-8 grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">Select Course</label>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all-courses">All Courses</option>
                  <option value="react-basics">React Basics</option>
                  <option value="node-js">Node.js Advanced</option>
                  <option value="web-design">Web Design</option>
                </select>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-2 lg:col-span-2">
                {[
                  { label: 'Present', value: statusStats.present, color: 'text-green-600' },
                  { label: 'Absent', value: statusStats.absent, color: 'text-red-600' },
                  { label: 'Late', value: statusStats.late, color: 'text-yellow-600' },
                  { label: 'Unmarked', value: statusStats.unmarked, color: 'text-foreground/60' },
                ].map((stat, i) => (
                  <div key={i} className="p-3 bg-card border border-border/20 rounded-lg text-center">
                    <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
                    <p className="text-xs text-foreground/70">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 flex flex-wrap gap-2"
            >
              {[
                { label: 'Mark All Present', action: 'present', color: 'bg-green-500' },
                { label: 'Mark All Absent', action: 'absent', color: 'bg-red-500' },
                { label: 'Mark All Late', action: 'late', color: 'bg-yellow-500' },
              ].map((btn, i) => (
                <button
                  key={i}
                  onClick={() => handleMarkAll(btn.action as any)}
                  className={`px-4 py-2 ${btn.color} text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity`}
                >
                  {btn.label}
                </button>
              ))}
            </motion.div>

            {/* Student List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border/20 rounded-xl p-6"
            >
              <h2 className="text-xl font-bold text-foreground mb-6">Students</h2>

              <div className="space-y-3">
                {students.map((student, index) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg border border-border/20 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{student.name}</p>
                      <p className="text-sm text-foreground/60">{student.studentId}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {['present', 'absent', 'late', 'excused'].map((status) => (
                        <button
                          key={status}
                          onClick={() =>
                            handleStatusChange(student.id, status as any)
                          }
                          className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                            student.status === status
                              ? getStatusColor(status)
                              : 'text-foreground/50 bg-secondary hover:bg-secondary/80'
                          }`}
                        >
                          {getStatusIcon(status)}
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8 flex gap-4"
            >
              <button
                onClick={handleSubmitAttendance}
                className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Submit Attendance
              </button>
              <Link
                href="/instructor"
                className="px-8 py-3 border-2 border-border text-foreground rounded-lg font-semibold hover:bg-secondary transition-colors"
              >
                Cancel
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
