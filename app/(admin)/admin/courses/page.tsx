'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import Link from 'next/link';

interface Course {
  _id: string;
  title: string;
  description: string;
  instructor: string;
  price: number;
  students: number;
  status: 'active' | 'inactive' | 'archived';
  createdDate: string;
}

export default function CourseManagementPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([
    {
      _id: '1',
      title: 'Web Development Fundamentals',
      description: 'Learn the basics of web development',
      instructor: 'Dr. Sarah Johnson',
      price: 99,
      students: 245,
      status: 'active',
      createdDate: '2025-01-15',
    },
    {
      _id: '2',
      title: 'Advanced React Patterns',
      description: 'Master advanced React concepts and patterns',
      instructor: 'Prof. Michael Chen',
      price: 149,
      students: 182,
      status: 'active',
      createdDate: '2025-02-20',
    },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructor: '',
    price: 0,
  });

  const filtered = courses.filter(c =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.instructor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveCourse = () => {
    if (!formData.title.trim()) return;

    if (editingCourse) {
      setCourses(courses.map(c => c._id === editingCourse._id ? { ...editingCourse, ...formData } : c));
    } else {
      const newCourse: Course = {
        _id: Date.now().toString(),
        ...formData,
        students: 0,
        status: 'active',
        createdDate: new Date().toISOString().split('T')[0],
      };
      setCourses([...courses, newCourse]);
    }
    setShowForm(false);
    setEditingCourse(null);
    setFormData({ title: '', description: '', instructor: '', price: 0 });
  };

  const handleDeleteCourse = (id: string) => {
    setCourses(courses.filter(c => c._id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="p-2 hover:bg-secondary rounded-lg">
              <FaChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Course Management</h1>
              <p className="text-foreground/60 mt-1">Create, edit, and manage all courses</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            <FaPlus className="w-4 h-4" />
            Add Course
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 p-6 bg-card rounded-xl border border-border/20">
            <h2 className="text-xl font-bold text-foreground mb-4">{editingCourse ? 'Edit Course' : 'Add New Course'}</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Course Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground"
              />
              <textarea
                placeholder="Course Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground"
              />
              <input
                type="text"
                placeholder="Instructor Name"
                value={formData.instructor}
                onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground"
              />
              <input
                type="number"
                placeholder="Price"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground"
              />
              <div className="flex gap-2">
                <button onClick={handleSaveCourse} className="px-6 py-2 bg-primary text-primary-foreground rounded-lg">
                  {editingCourse ? 'Update' : 'Create'} Course
                </button>
                <button onClick={() => setShowForm(false)} className="px-6 py-2 bg-secondary text-foreground rounded-lg">
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <FaSearch className="absolute left-4 top-3 w-4 h-4 text-foreground/40" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-2 bg-secondary border border-border rounded-lg text-foreground"
            />
          </div>
        </div>

        {/* Courses List */}
        <div className="grid gap-6">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-foreground/60">No courses found</div>
          ) : (
            filtered.map(course => (
              <motion.div key={course._id} className="p-6 bg-card rounded-xl border border-border/20 hover:border-primary/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-foreground">{course.title}</h3>
                    <p className="text-foreground/70 text-sm mt-1">{course.description}</p>
                    <div className="flex gap-4 mt-3 text-sm text-foreground/60">
                      <span>By {course.instructor}</span>
                      <span>•</span>
                      <span>${course.price}</span>
                      <span>•</span>
                      <span>{course.students} students</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingCourse(course);
                        setFormData(course);
                        setShowForm(true);
                      }}
                      className="p-2 hover:bg-secondary rounded-lg text-foreground/70 hover:text-primary"
                    >
                      <FaEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(course._id)}
                      className="p-2 hover:bg-red-500/20 rounded-lg text-foreground/70 hover:text-red-500"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
