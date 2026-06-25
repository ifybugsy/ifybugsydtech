'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useTestimonials } from '@/lib/testimonials-context';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FaChevronLeft,
  FaCheck,
  FaTimes,
  FaTrash,
  FaEye,
  FaStar,
  FaUser,
  FaFilter,
  FaSearch,
} from 'react-icons/fa';

export default function AdminTestimonialsPage() {
  const { testimonials, approveTestimonial, rejectTestimonial, deleteTestimonial } = useTestimonials();
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTestimonial, setSelectedTestimonial] = useState<string | null>(null);

  const filteredTestimonials = testimonials.filter((t) => {
    const matchesFilter = filterStatus === 'all' || t.status === filterStatus;
    const matchesSearch =
      t.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.courseName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = [
    {
      label: 'Total',
      value: testimonials.length,
      color: 'bg-blue-500/20 text-blue-600',
    },
    {
      label: 'Pending',
      value: testimonials.filter((t) => t.status === 'pending').length,
      color: 'bg-yellow-500/20 text-yellow-600',
    },
    {
      label: 'Approved',
      value: testimonials.filter((t) => t.status === 'approved').length,
      color: 'bg-green-500/20 text-green-600',
    },
    {
      label: 'Rejected',
      value: testimonials.filter((t) => t.status === 'rejected').length,
      color: 'bg-red-500/20 text-red-600',
    },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Header */}
        <section className="py-8 border-b border-border/20 bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/admin"
              className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6 w-fit"
            >
              <FaChevronLeft className="w-4 h-4" />
              Back to Admin
            </Link>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Testimonials Management</h1>
            <p className="text-foreground/70 mt-2">Review and manage student testimonials</p>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`${stat.color} rounded-lg p-4`}
                >
                  <p className="text-sm opacity-80 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </motion.div>
              ))}
            </div>

            {/* Filters */}
            <div className="bg-card rounded-lg border border-border/20 p-6 space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <FaSearch className="absolute left-3 top-3 w-5 h-5 text-foreground/50" />
                  <input
                    type="text"
                    placeholder="Search by student or course name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-secondary border border-border text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Filter Status */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="px-4 py-2 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            {/* Testimonials List */}
            <div className="space-y-4">
              {filteredTestimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-card rounded-lg border border-border/20 p-6 hover:border-primary/50 transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    {/* Content */}
                    <div className="flex-1">
                      {/* Header */}
                      <div className="flex items-start gap-4 mb-4">
                        {testimonial.studentImage ? (
                          <img
                            src={testimonial.studentImage}
                            alt={testimonial.studentName}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                            <FaUser className="w-6 h-6 text-primary" />
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="font-bold text-foreground">{testimonial.studentName}</h3>
                          <p className="text-sm text-foreground/60">{testimonial.courseName}</p>
                          <div className="flex items-center gap-2 mt-2">
                            {[...Array(5)].map((_, i) => (
                              <FaStar
                                key={i}
                                className={`w-3 h-3 ${
                                  i < testimonial.rating ? 'text-yellow-400' : 'text-foreground/20'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Text */}
                      <p className="text-foreground/80 mb-4 line-clamp-2">{testimonial.text}</p>

                      {/* Status */}
                      <div>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            testimonial.status === 'pending'
                              ? 'bg-yellow-500/20 text-yellow-600'
                              : testimonial.status === 'approved'
                              ? 'bg-green-500/20 text-green-600'
                              : 'bg-red-500/20 text-red-600'
                          }`}
                        >
                          {testimonial.status.charAt(0).toUpperCase() + testimonial.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 md:flex-col">
                      {testimonial.status === 'pending' && (
                        <>
                          <button
                            onClick={() => approveTestimonial(testimonial.id)}
                            className="flex items-center gap-2 px-3 py-2 bg-green-500/20 text-green-600 rounded-lg hover:bg-green-500/30 transition-colors text-sm font-semibold"
                            title="Approve"
                          >
                            <FaCheck className="w-4 h-4" />
                            Approve
                          </button>
                          <button
                            onClick={() => rejectTestimonial(testimonial.id)}
                            className="flex items-center gap-2 px-3 py-2 bg-red-500/20 text-red-600 rounded-lg hover:bg-red-500/30 transition-colors text-sm font-semibold"
                            title="Reject"
                          >
                            <FaTimes className="w-4 h-4" />
                            Reject
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => deleteTestimonial(testimonial.id)}
                        className="flex items-center gap-2 px-3 py-2 bg-red-500/20 text-red-600 rounded-lg hover:bg-red-500/30 transition-colors text-sm font-semibold"
                        title="Delete"
                      >
                        <FaTrash className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}

              {filteredTestimonials.length === 0 && (
                <div className="text-center py-12 text-foreground/60">
                  <p>No testimonials found matching your criteria</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
