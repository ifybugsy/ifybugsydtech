'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';
import { useTestimonials } from '@/lib/testimonials-context';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

export const TestimonialsSection = () => {
  const { getApprovedTestimonials, addTestimonial } = useTestimonials();
  const { user, isAuthenticated } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('course-001');

  const approvedTestimonials = getApprovedTestimonials();

  const handleSubmitTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user) {
      alert('Please login to submit a testimonial');
      return;
    }

    addTestimonial({
      studentId: user.id,
      studentName: user.name,
      studentImage: user.profileImage,
      courseId: selectedCourse,
      courseName: 'Completed Course',
      rating,
      text,
    });

    setText('');
    setRating(5);
    setShowForm(false);
    alert('Testimonial submitted! It will appear after admin approval.');
  };

  return (
    <section className="py-16 bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            What Our Students Say
          </h2>
          <p className="text-foreground/60 text-lg max-w-2xl mx-auto">
            Real experiences from real students who transformed their careers with Ifybugsy
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {approvedTestimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-card rounded-lg border border-border/20 p-6 hover:border-primary/50 transition-all"
            >
              {/* Quote Icon */}
              <FaQuoteLeft className="w-8 h-8 text-primary/40 mb-4" />

              {/* Text */}
              <p className="text-foreground/80 mb-6 line-clamp-4">{testimonial.text}</p>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`w-4 h-4 ${
                      i < testimonial.rating ? 'text-yellow-400' : 'text-foreground/20'
                    }`}
                  />
                ))}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3">
                {testimonial.studentImage ? (
                  <img
                    src={testimonial.studentImage}
                    alt={testimonial.studentName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    {testimonial.studentName.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-foreground text-sm">{testimonial.studentName}</p>
                  <p className="text-foreground/60 text-xs">{testimonial.courseName}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Add Testimonial Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-card rounded-lg border border-border/20 p-8 max-w-2xl mx-auto"
        >
          <h3 className="text-2xl font-bold text-foreground mb-4">Share Your Experience</h3>
          
          {!isAuthenticated ? (
            <div className="text-center py-6">
              <p className="text-foreground/60 mb-4">Login to share your testimonial</p>
              <Link
                href="/login"
                className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Login Now
              </Link>
            </div>
          ) : !showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
            >
              Add Your Testimonial
            </button>
          ) : (
            <form onSubmit={handleSubmitTestimonial} className="space-y-4">
              {/* Course Select */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Course Completed
                </label>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="course-001">Complete Web Development Bootcamp</option>
                  <option value="course-002">Data Science with Python</option>
                  <option value="course-003">iOS App Development</option>
                  <option value="course-004">Cloud Architecture on AWS</option>
                </select>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRating(r)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <FaStar
                        className={`w-6 h-6 ${
                          r <= rating ? 'text-yellow-400' : 'text-foreground/20'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Testimonial Text */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Your Experience
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Share your experience with Ifybugsy..."
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  rows={4}
                  required
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
                >
                  Submit Testimonial
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-6 py-2 border border-border rounded-lg hover:bg-secondary transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
};
