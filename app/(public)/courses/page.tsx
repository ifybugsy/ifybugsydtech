'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { COURSES } from '@/lib/mockData';
import { coursesAPI } from '@/lib/api';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaStar, FaUsers } from "react-icons/fa";
import { formatCurrency } from '@/lib/utils';

export default function CoursesPage() {
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [courses, setCourses] = useState(COURSES);
  const [loading, setLoading] = useState(true);

  // Fetch courses from backend
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await coursesAPI.getAll({
          level: selectedLevel === 'all' ? undefined : selectedLevel,
          search: searchTerm || undefined,
        });
        setCourses(response.data);
      } catch (error) {
        console.warn('[Courses] Failed to fetch from backend, using mock data:', error);
        // Use mock data as fallback
        setCourses(COURSES);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [selectedLevel, searchTerm]);

  const filtered = courses.filter((course) => {
    const levelMatch = selectedLevel === 'all' || course.level === selectedLevel;
    const searchMatch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    return levelMatch && searchMatch;
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Header */}
        <section className="py-12 border-b border-border/20 bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Our Courses
            </h1>
            <p className="text-foreground/70 max-w-2xl">
              Explore our comprehensive collection of courses designed to help you master in-demand skills.
            </p>
          </div>
        </section>

        {/* Filters & Search */}
        <section className="py-8 border-b border-border/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg bg-secondary border border-border text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <div className="flex gap-2 flex-wrap">
                {['all', 'beginner', 'intermediate', 'advanced'].map((level) => (
                  <button
                    key={level}
                    onClick={() => setSelectedLevel(level)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                      selectedLevel === level
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-foreground hover:bg-border'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Courses Grid */}
        <section className="py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {filtered.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-foreground/70 text-lg">No courses found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((course, index) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Link href={`/courses/${course.id}`}>
                      <div className="rounded-lg overflow-hidden bg-card border border-border/20 hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer h-full flex flex-col">
                        {/* Course Image */}
                        <div className="h-40 bg-gradient-to-br from-primary/20 to-primary/10 overflow-hidden flex items-center justify-center">
                          {course.image ? (
                            <img 
                              src={course.image} 
                              alt={course.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-5 sm:p-6 flex-1 flex flex-col">
                          {/* Level Badge */}
                          <div className="mb-3">
                            <span className="inline-block px-2 py-1 text-xs font-semibold bg-primary/10 text-primary rounded capitalize">
                              {course.level}
                            </span>
                          </div>

                          {/* Title & Description */}
                          <h3 className="text-lg font-semibold text-foreground mb-2">
                            {course.title}
                          </h3>
                          <p className="text-foreground/70 text-sm mb-4 flex-1">
                            {course.description.substring(0, 100)}...
                          </p>

                          {/* Instructor */}
                          <div className="mb-4 pb-4 border-b border-border/20">
                            <p className="text-sm text-foreground/60">
                              By <span className="font-medium text-foreground">{course.instructor.name}</span>
                            </p>
                          </div>

                          {/* Stats */}
                          <div className="flex items-center justify-between mb-4 text-sm">
                            <div className="flex items-center gap-1 text-foreground/70">
                              <FaStar className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                              <span>{course.rating}</span>
                              <span className="text-foreground/50">({course.reviews})</span>
                            </div>
                            <div className="flex items-center gap-1 text-foreground/70">
                              <FaUsers className="w-4 h-4" />
                              <span>{course.studentsEnrolled.toLocaleString()}</span>
                            </div>
                          </div>

                          {/* Footer */}
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-primary">
                              {formatCurrency(course.price)}
                            </span>
                            <span className="text-sm text-foreground/60">{course.duration} days</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
