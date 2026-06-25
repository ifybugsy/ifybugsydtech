'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaCheck, FaTimes, FaClock, FaExclamationCircle, FaDownload } from 'react-icons/fa';
import Link from 'next/link';

interface Student {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

interface AttendanceRecord {
  studentId: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  remarks?: string;
}

export default function AttendancePage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Map<string, AttendanceRecord>>(new Map());
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Load courses
  useEffect(() => {
    const loadCourses = async () => {
      try {
        const response = await fetch('/api/courses', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
        });
        const data = await response.json();
        setCourses(data.courses || []);
      } catch (err) {
        console.error('Failed to load courses', err);
      }
    };
    loadCourses();
  }, []);

  // Load students when course selected
  useEffect(() => {
    if (!selectedCourse) return;

    const loadStudents = async () => {
      try {
        const response = await fetch(`/api/courses/${selectedCourse}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
        });
        const course = await response.json();
        setStudents(course.enrolledStudents || []);
        setAttendance(new Map());
      } catch (err) {
        console.error('Failed to load students', err);
      }
    };
    loadStudents();
  }, [selectedCourse]);

  const handleStatusChange = (studentId: string, status: string) => {
    const newAttendance = new Map(attendance);
    newAttendance.set(studentId, {
      studentId,
      status: status as any,
      remarks: newAttendance.get(studentId)?.remarks || '',
    });
    setAttendance(newAttendance);
  };

  const handleRemarksChange = (studentId: string, remarks: string) => {
    const newAttendance = new Map(attendance);
    const existing = newAttendance.get(studentId) || { studentId, status: 'absent' };
    newAttendance.set(studentId, { ...existing, remarks });
    setAttendance(newAttendance);
  };

  const handleMarkAll = async (status: string) => {
    const newAttendance = new Map(attendance);
    students.forEach(student => {
      newAttendance.set(student._id, {
        studentId: student._id,
        status: status as any,
        remarks: newAttendance.get(student._id)?.remarks || '',
      });
    });
    setAttendance(newAttendance);
  };

  const handleSubmit = async () => {
    if (!selectedCourse) {
      setError('Please select a course');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const attendanceData = Array.from(attendance.values());
      const response = await fetch('/api/attendance/bulk-mark', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({ courseId: selectedCourse, attendanceData })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setMessage(`Attendance marked for ${data.marked} students`);
      setAttendance(new Map());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark attendance');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async () => {
    try {
      const response = await fetch(`/api/attendance/course-report/${selectedCourse}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
      });
      const data = await response.json();

      let csv = 'Student Name,Email,Total Days,Present,Absent,Late,Excused,Percentage\n';
      data.studentStats.forEach((stat: any) => {
        csv += `${stat.studentName},${stat.studentEmail},${stat.totalDays},${stat.presentDays},${stat.absentDays},${stat.lateDays},${stat.excusedDays},${stat.attendancePercentage}%\n`;
      });

      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
      element.setAttribute('download', `attendance_report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } catch (err) {
      console.error('Failed to download report', err);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return <FaCheck className="w-5 h-5 text-green-500" />;
      case 'absent': return <FaTimes className="w-5 h-5 text-red-500" />;
      case 'late': return <FaClock className="w-5 h-5 text-yellow-500" />;
      case 'excused': return <FaExclamationCircle className="w-5 h-5 text-blue-500" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="p-2 hover:bg-secondary rounded-lg">
            <FaChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Attendance Management</h1>
            <p className="text-foreground/60 mt-1">Mark and track student attendance in real-time</p>
          </div>
        </div>

        {/* Messages */}
        {message && (
          <motion.div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 text-green-700 rounded-lg">
            {message}
          </motion.div>
        )}
        {error && (
          <motion.div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 rounded-lg">
            {error}
          </motion.div>
        )}

        {/* Course Selection */}
        <div className="mb-8 p-6 bg-card rounded-xl border border-border/20">
          <label className="block text-sm font-medium text-foreground mb-2">Select Course</label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">-- Select a course --</option>
            {courses.map((course: any) => (
              <option key={course._id} value={course._id}>{course.title}</option>
            ))}
          </select>
        </div>

        {selectedCourse && students.length > 0 && (
          <>
            {/* Quick Actions */}
            <div className="mb-6 flex gap-2">
              <button
                onClick={() => handleMarkAll('present')}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Mark All Present
              </button>
              <button
                onClick={() => handleMarkAll('absent')}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Mark All Absent
              </button>
              <button
                onClick={handleDownloadReport}
                className="px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 flex items-center gap-2"
              >
                <FaDownload className="w-4 h-4" />
                Download Report
              </button>
            </div>

            {/* Attendance Table */}
            <div className="bg-card rounded-xl border border-border/20 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Student Name</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Email</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20">
                    {students.map((student) => (
                      <tr key={student._id} className="hover:bg-secondary/20">
                        <td className="px-6 py-4 text-foreground font-medium">{student.name}</td>
                        <td className="px-6 py-4 text-foreground/70 text-sm">{student.email}</td>
                        <td className="px-6 py-4">
                          <select
                            value={attendance.get(student._id)?.status || 'absent'}
                            onChange={(e) => handleStatusChange(student._id, e.target.value)}
                            className="px-3 py-1 bg-secondary border border-border rounded text-foreground text-sm"
                          >
                            <option value="present">Present</option>
                            <option value="absent">Absent</option>
                            <option value="late">Late</option>
                            <option value="excused">Excused</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            value={attendance.get(student._id)?.remarks || ''}
                            onChange={(e) => handleRemarksChange(student._id, e.target.value)}
                            placeholder="Add remarks"
                            className="px-3 py-1 bg-secondary border border-border rounded text-foreground text-sm w-full"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex gap-2">
              <button
                onClick={handleSubmit}
                disabled={loading || attendance.size === 0}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Attendance'}
              </button>
              <button
                onClick={() => setAttendance(new Map())}
                className="px-6 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80"
              >
                Clear
              </button>
            </div>
          </>
        )}

        {selectedCourse && students.length === 0 && !loading && (
          <div className="p-8 text-center text-foreground/60">
            No students enrolled in this course yet
          </div>
        )}
      </div>
    </div>
  );
}
