'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaLock, FaUnlock, FaEye } from 'react-icons/fa';
import { useNotifications } from '@/lib/notifications-context';

interface Instructor {
  id: string;
  name: string;
  email: string;
  phone: string;
  courses: number;
  students: number;
  rating: number;
  status: 'active' | 'suspended';
  joinDate: string;
}

export default function AdminInstructorsPage() {
  const { addNotification } = useNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'suspended'>('all');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [instructors, setInstructors] = useState<Instructor[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john@instructor.com',
      phone: '+1234567890',
      courses: 5,
      students: 2500,
      rating: 4.9,
      status: 'active',
      joinDate: '2023-01-15',
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@instructor.com',
      phone: '+1234567891',
      courses: 4,
      students: 1800,
      rating: 4.8,
      status: 'active',
      joinDate: '2023-02-20',
    },
    {
      id: '3',
      name: 'Mike Chen',
      email: 'mike@instructor.com',
      phone: '+1234567892',
      courses: 3,
      students: 1200,
      rating: 4.7,
      status: 'suspended',
      joinDate: '2023-03-10',
    },
  ]);

  const [newInstructor, setNewInstructor] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const filtered = instructors.filter((instructor) => {
    const matchesSearch =
      instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || instructor.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const handleCreateInstructor = () => {
    if (!newInstructor.name || !newInstructor.email || !newInstructor.phone) {
      addNotification('Please fill all fields', 'error');
      return;
    }

    const instructor: Instructor = {
      id: String(instructors.length + 1),
      ...newInstructor,
      courses: 0,
      students: 0,
      rating: 0,
      status: 'active',
      joinDate: new Date().toISOString().split('T')[0],
    };

    setInstructors([...instructors, instructor]);
    setNewInstructor({ name: '', email: '', phone: '' });
    setShowCreateForm(false);
    addNotification('Instructor created successfully', 'success');
  };

  const handleToggleSuspend = (id: string) => {
    setInstructors(
      instructors.map((i) =>
        i.id === id
          ? {
              ...i,
              status: i.status === 'active' ? 'suspended' : 'active',
            }
          : i
      )
    );
    addNotification('Instructor status updated', 'success');
  };

  const handleDeleteInstructor = (id: string) => {
    if (window.confirm('Are you sure? This action cannot be undone.')) {
      setInstructors(instructors.filter((i) => i.id !== id));
      addNotification('Instructor deleted', 'success');
    }
  };

  return (
    <>
      {/* Navigation Sidebar */}
      <div className="hidden md:flex w-64 bg-secondary fixed left-0 top-16 bottom-0 border-r border-border/20 flex-col">
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="space-y-2">
            {[
              { label: 'Dashboard', href: '/admin' },
              { label: 'Users', href: '/admin/users' },
              { label: 'Courses', href: '/admin/courses' },
              { label: 'Instructors', href: '/admin/instructors', active: true },
              { label: 'Attendance', href: '/admin/attendance' },
              { label: 'Payments', href: '/admin/payments' },
              { label: 'Blog', href: '/admin/blog' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-4 py-2 rounded-lg transition-colors ${
                  item.active
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground/70 hover:text-foreground'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="md:ml-64 min-h-screen bg-background">
        {/* Header */}
        <section className="py-8 border-b border-border/20 bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold text-foreground">Instructor Management</h1>
                <p className="text-foreground/70">Manage instructors, assign students, and control access</p>
              </div>
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2"
              >
                <FaPlus className="w-4 h-4" />
                Add Instructor
              </button>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Create Form */}
            {showCreateForm && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-6 bg-card border border-border/20 rounded-xl"
              >
                <h2 className="text-xl font-bold text-foreground mb-4">Create New Instructor</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={newInstructor.name}
                    onChange={(e) =>
                      setNewInstructor({ ...newInstructor, name: e.target.value })
                    }
                    className="px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={newInstructor.email}
                    onChange={(e) =>
                      setNewInstructor({ ...newInstructor, email: e.target.value })
                    }
                    className="px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={newInstructor.phone}
                    onChange={(e) =>
                      setNewInstructor({ ...newInstructor, phone: e.target.value })
                    }
                    className="px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleCreateInstructor}
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="px-6 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}

            {/* Search and Filter */}
            <div className="mb-8 flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-3 top-3.5 w-5 h-5 text-foreground/50" />
                <input
                  type="text"
                  placeholder="Search instructors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-secondary border border-border rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-4 py-3 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>

            {/* Instructors Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border/20 rounded-xl overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/20 bg-secondary/50">
                      <th className="text-left px-6 py-4 font-semibold text-foreground">Name</th>
                      <th className="text-left px-6 py-4 font-semibold text-foreground">Email</th>
                      <th className="text-left px-6 py-4 font-semibold text-foreground">Courses</th>
                      <th className="text-left px-6 py-4 font-semibold text-foreground">Students</th>
                      <th className="text-left px-6 py-4 font-semibold text-foreground">Rating</th>
                      <th className="text-left px-6 py-4 font-semibold text-foreground">Status</th>
                      <th className="text-left px-6 py-4 font-semibold text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20">
                    {filtered.map((instructor) => (
                      <tr key={instructor.id} className="hover:bg-secondary/30 transition-colors">
                        <td className="px-6 py-4 font-medium text-foreground">{instructor.name}</td>
                        <td className="px-6 py-4 text-foreground/70">{instructor.email}</td>
                        <td className="px-6 py-4 text-foreground">{instructor.courses}</td>
                        <td className="px-6 py-4 text-foreground">{instructor.students}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-yellow-500/20 text-yellow-600 rounded-full text-sm font-medium">
                            {instructor.rating}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              instructor.status === 'active'
                                ? 'bg-green-500/20 text-green-600'
                                : 'bg-red-500/20 text-red-600'
                            }`}
                          >
                            {instructor.status.charAt(0).toUpperCase() + instructor.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleToggleSuspend(instructor.id)}
                              className="p-2 text-foreground/60 hover:text-primary transition-colors"
                              title={instructor.status === 'active' ? 'Suspend' : 'Activate'}
                            >
                              {instructor.status === 'active' ? (
                                <FaLock className="w-4 h-4" />
                              ) : (
                                <FaUnlock className="w-4 h-4" />
                              )}
                            </button>
                            <Link
                              href={`/instructor/${instructor.id}`}
                              className="p-2 text-foreground/60 hover:text-primary transition-colors"
                              title="View Profile"
                            >
                              <FaEye className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDeleteInstructor(instructor.id)}
                              className="p-2 text-foreground/60 hover:text-red-500 transition-colors"
                              title="Delete"
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
            </motion.div>

            {/* Stats */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'Total Instructors', value: instructors.length },
                { label: 'Active', value: instructors.filter((i) => i.status === 'active').length },
                { label: 'Suspended', value: instructors.filter((i) => i.status === 'suspended').length },
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
    </>
  );
}
