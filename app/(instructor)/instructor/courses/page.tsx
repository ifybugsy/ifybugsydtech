'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FaArrowLeft, FaBook } from 'react-icons/fa';

export default function InstructorCoursesPage() {
  const courses = [
    { id: '1', title: 'React Basics', students: 500, modules: 12, status: 'Active' },
    { id: '2', title: 'Node.js Advanced', students: 300, modules: 15, status: 'Active' },
    { id: '3', title: 'Full Stack Development', students: 250, modules: 20, status: 'Active' },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <section className="py-8 border-b border-border/20 bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              <Link href="/instructor" className="p-2 hover:bg-secondary rounded-lg">
                <FaArrowLeft className="w-5 h-5 text-foreground" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-foreground">My Courses</h1>
                <p className="text-foreground/70">Manage your course content and students</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div key={course.id} className="p-6 bg-card border border-border/20 rounded-xl">
                  <div className="flex items-start justify-between mb-4">
                    <FaBook className="w-8 h-8 text-primary" />
                    <span className="px-3 py-1 bg-green-500/20 text-green-600 text-xs font-semibold rounded">
                      {course.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{course.title}</h3>
                  <p className="text-sm text-foreground/70 mb-4">
                    {course.students} students • {course.modules} modules
                  </p>
                  <Link
                    href={`/instructor/courses/${course.id}`}
                    className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    Manage
                  </Link>
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
