'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/lib/auth-context';
import { SAMPLE_STUDENTS, COURSES, PRODUCTS, SAMPLE_PAYMENTS } from '@/lib/mockData';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FaUsers,
  FaBookOpen,
  FaShoppingCart,
  FaCreditCard,
  FaUser,
  FaSearch,
  FaEllipsisV,
  FaTrash,
  FaEdit,
  FaCheckCircle,
  FaTimesCircle,
  FaBlog,
  FaComments,
  FaGraduationCap,
} from 'react-icons/fa';
import { formatCurrency } from '@/lib/utils';

interface AdminCard {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
  description: string;
}

interface AdminMenuItem {
  title: string;
  icon: React.ReactNode;
  href: string;
  description: string;
  color: string;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'payments' | 'content'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const totalRevenue = SAMPLE_PAYMENTS.reduce((sum, p) => sum + p.amount, 0);
  const totalUsers = SAMPLE_STUDENTS.length;
  const activePayments = SAMPLE_PAYMENTS.filter((p) => p.status === 'completed').length;

  const filteredStudents = SAMPLE_STUDENTS.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const adminCards: AdminCard[] = [
    {
      icon: <FaUsers className="w-6 h-6" />,
      label: 'Total Students',
      value: totalUsers,
      color: 'bg-blue-500/20 text-blue-600 dark:text-blue-400',
      description: 'Active learners on platform',
    },
    {
      icon: <FaBookOpen className="w-6 h-6" />,
      label: 'Total Courses',
      value: COURSES.length,
      color: 'bg-purple-500/20 text-purple-600 dark:text-purple-400',
      description: 'Published courses',
    },
    {
      icon: <FaShoppingCart className="w-6 h-6" />,
      label: 'Total Products',
      value: PRODUCTS.length,
      color: 'bg-orange-500/20 text-orange-600 dark:text-orange-400',
      description: 'Items in store',
    },
    {
      icon: <FaCreditCard className="w-6 h-6" />,
      label: 'Total Revenue',
      value: formatCurrency(totalRevenue),
      color: 'bg-green-500/20 text-green-600 dark:text-green-400',
      description: 'From all transactions',
    },
  ];

  const menuItems: AdminMenuItem[] = [
    {
      title: 'User Management',
      icon: '👥',
      href: '/admin/users',
      description: 'Manage student accounts, roles, and permissions',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Payment Management',
      icon: '💳',
      href: '/admin/payments',
      description: 'View, track, and manage student payments',
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Blog Management',
      icon: '📝',
      href: '/admin/blog',
      description: 'Write, edit, and publish blog posts',
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Community Moderation',
      icon: '🛡️',
      href: '/admin/moderation',
      description: 'Moderate discussions and manage reports',
      color: 'from-red-500 to-orange-500',
    },
    {
      title: 'Course Management',
      icon: '📚',
      href: '/admin/courses',
      description: 'Create and manage courses',
      color: 'from-indigo-500 to-blue-500',
    },
    {
      title: 'Shop Management',
      icon: '🛍️',
      href: '/admin/shop',
      description: 'Manage products and inventory',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      title: 'Testimonials Management',
      icon: '⭐',
      href: '/admin/testimonials',
      description: 'Manage and feature student testimonials',
      color: 'from-pink-500 to-red-500',
    },
    {
      title: 'Attendance Management',
      icon: '✓',
      href: '/admin/attendance',
      description: 'Mark and track student attendance in real-time',
      color: 'from-cyan-500 to-blue-500',
    },
    {
      title: 'Offline Student Registration',
      icon: <FaUsers className="w-8 h-8" />,
      href: '/admin/offline-students',
      description: 'Register students offline',
      color: 'bg-gradient-to-br from-indigo-500/20 to-indigo-600/20',
    },
    {
      title: 'Instructor Management',
      icon: <FaGraduationCap className="w-8 h-8" />,
      href: '/admin/instructors',
      description: 'Manage instructors and assignments',
      color: 'bg-gradient-to-br from-teal-500/20 to-teal-600/20',
    },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary/20 to-primary/10 border-b border-border/20 py-8 sm:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
                <p className="text-foreground/70">Manage your Ifybugsy platform with powerful admin tools</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center text-white font-bold">
                  {user?.name?.charAt(0) || 'A'}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{user?.name || 'Admin'}</p>
                  <p className="text-sm text-foreground/70 capitalize">{user?.role || 'Administrator'}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="py-8 sm:py-12 border-b border-border/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {adminCards.map((card, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-lg border border-border/20 p-6 hover:border-primary/50 transition-all"
                >
                  <div className={`w-12 h-12 rounded-lg ${card.color} flex items-center justify-center mb-4`}>
                    {card.icon}
                  </div>
                  <p className="text-foreground/70 text-sm font-medium mb-1">{card.label}</p>
                  <p className="text-2xl sm:text-3xl font-bold text-foreground mb-2">{card.value}</p>
                  <p className="text-xs text-foreground/60">{card.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Tabs */}
        <section className="border-b border-border/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-4 overflow-x-auto">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'students', label: 'Students' },
                { id: 'payments', label: 'Payments' },
                { id: 'content', label: 'Content' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-4 font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-foreground/70 hover:text-foreground'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-8 sm:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-6">Management Tools</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {menuItems.map((item, index) => (
                      <Link key={index} href={item.href}>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="h-full bg-gradient-to-br from-card to-card/50 rounded-lg border border-border/20 p-6 hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer group"
                        >
                          <div className="text-4xl mb-4">{item.icon}</div>
                          <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-foreground/70 text-sm">{item.description}</p>
                          <div className={`mt-4 h-1 rounded-full bg-gradient-to-r ${item.color} transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left`} />
                        </motion.div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-6">Recent Payments</h2>
                  <div className="bg-card rounded-lg border border-border/20 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="border-b border-border/20 bg-secondary/30">
                          <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Student</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Amount</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/20">
                          {SAMPLE_PAYMENTS.slice(0, 5).map((payment, index) => (
                            <tr key={index} className="hover:bg-secondary/30 transition-colors">
                              <td className="px-6 py-4 text-foreground text-sm">{payment.studentName}</td>
                              <td className="px-6 py-4 text-foreground font-semibold text-sm">{formatCurrency(payment.amount)}</td>
                              <td className="px-6 py-4">
                                <span
                                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                                    payment.status === 'completed'
                                      ? 'bg-green-500/20 text-green-600 dark:text-green-400'
                                      : payment.status === 'pending'
                                      ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400'
                                      : 'bg-red-500/20 text-red-600 dark:text-red-400'
                                  }`}
                                >
                                  {payment.status === 'completed' && <FaCheckCircle className="w-3 h-3" />}
                                  {payment.status === 'pending' && <FaTimesCircle className="w-3 h-3" />}
                                  {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-foreground/70 text-sm">{payment.date}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Students Tab */}
            {activeTab === 'students' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="mb-6">
                  <div className="relative">
                    <FaSearch className="absolute left-4 top-3.5 w-4 h-4 text-foreground/40" />
                    <input
                      type="text"
                      placeholder="Search students by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="bg-card rounded-lg border border-border/20 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b border-border/20 bg-secondary/30">
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Name</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Email</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Courses</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/20">
                        {filteredStudents.map((student, index) => (
                          <tr key={index} className="hover:bg-secondary/30 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                                  {student.name.charAt(0)}
                                </div>
                                <span className="font-medium text-foreground">{student.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-foreground/70 text-sm">{student.email}</td>
                            <td className="px-6 py-4">
                              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-600 dark:text-green-400">
                                Active
                              </span>
                            </td>
                            <td className="px-6 py-4 text-foreground text-sm">{student.enrolledCourses.length}</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <button className="p-2 hover:bg-secondary rounded-lg transition-colors text-foreground/70 hover:text-primary">
                                  <FaEdit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setDeleteConfirm(student.id)}
                                  className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-foreground/70 hover:text-red-500"
                                >
                                  <FaTrash className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Payments Tab */}
            {activeTab === 'payments' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-2xl font-bold text-foreground mb-6">Payment Management</h2>
                <div className="bg-card rounded-lg border border-border/20 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b border-border/20 bg-secondary/30">
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Student</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Item</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Amount</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Date</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/20">
                        {SAMPLE_PAYMENTS.map((payment, index) => (
                          <tr key={index} className="hover:bg-secondary/30 transition-colors">
                            <td className="px-6 py-4 text-foreground font-medium">{payment.studentName}</td>
                            <td className="px-6 py-4 text-foreground/70 text-sm">{payment.item}</td>
                            <td className="px-6 py-4 text-foreground font-semibold">{formatCurrency(payment.amount)}</td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                                  payment.status === 'completed'
                                    ? 'bg-green-500/20 text-green-600 dark:text-green-400'
                                    : 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400'
                                }`}
                              >
                                {payment.status === 'completed' ? <FaCheckCircle className="w-3 h-3" /> : <FaTimesCircle className="w-3 h-3" />}
                                {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-foreground/70 text-sm">{payment.date}</td>
                            <td className="px-6 py-4">
                              <button className="text-primary hover:text-primary/80 transition-colors text-sm font-medium">
                                View Invoice
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Content Tab */}
            {activeTab === 'content' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-2xl font-bold text-foreground mb-6">Content Management</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Link href="/admin/blog">
                    <motion.div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg border border-border/20 p-8 cursor-pointer hover:border-primary/50 transition-all hover:shadow-lg">
                      <FaBlog className="w-12 h-12 text-purple-600 dark:text-purple-400 mb-4" />
                      <h3 className="text-xl font-bold text-foreground mb-2">Blog Posts</h3>
                      <p className="text-foreground/70 mb-4">Write, edit, and manage blog posts for your platform</p>
                      <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium">
                        Manage Blog
                      </button>
                    </motion.div>
                  </Link>

                  <Link href="/admin/moderation">
                    <motion.div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-lg border border-border/20 p-8 cursor-pointer hover:border-primary/50 transition-all hover:shadow-lg">
                      <FaComments className="w-12 h-12 text-red-600 dark:text-red-400 mb-4" />
                      <h3 className="text-xl font-bold text-foreground mb-2">Community Moderation</h3>
                      <p className="text-foreground/70 mb-4">Moderate discussions and delete posts that violate community standards</p>
                      <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium">
                        Moderate Community
                      </button>
                    </motion.div>
                  </Link>
                </div>
              </motion.div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
