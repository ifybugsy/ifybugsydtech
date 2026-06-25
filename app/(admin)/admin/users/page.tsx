'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/lib/auth-context';
import { SAMPLE_STUDENTS } from '@/lib/mockData';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FaChevronLeft,
  FaSearch,
  FaTrash,
  FaEdit,
  FaShieldAlt,
  FaCheck,
  FaTimes,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaToggleOn,
  FaToggleOff,
  FaFilter,
  FaDownload,
  FaEye,
} from 'react-icons/fa';
import { User, UserRole } from '@/types/index';

interface UserWithStatus extends User {
  status: 'active' | 'inactive' | 'suspended';
  totalSpent?: number;
  enrolledCourses?: number;
}

export default function AdminUsersPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<UserRole | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'suspended'>('all');
  const [selectedUser, setSelectedUser] = useState<UserWithStatus | null>(null);
  const [users, setUsers] = useState<UserWithStatus[]>(
    SAMPLE_STUDENTS.map((s) => ({
      ...s,
      status: 'active' as const,
      totalSpent: Math.floor(Math.random() * 100000),
      enrolledCourses: Math.floor(Math.random() * 5) + 1,
    }))
  );

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || u.role === filterRole;
    const matchesStatus = filterStatus === 'all' || u.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleChangeRole = (userId: string, newRole: UserRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
  };

  const handleToggleStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const newStatus = u.status === 'active' ? 'suspended' : 'active';
          return { ...u, status: newStatus };
        }
        return u;
      })
    );
  };

  const handleDeleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  const stats = [
    {
      label: 'Total Users',
      value: users.length,
      color: 'bg-blue-500/20 text-blue-600',
    },
    {
      label: 'Active',
      value: users.filter((u) => u.status === 'active').length,
      color: 'bg-green-500/20 text-green-600',
    },
    {
      label: 'Suspended',
      value: users.filter((u) => u.status === 'suspended').length,
      color: 'bg-red-500/20 text-red-600',
    },
    {
      label: 'Administrators',
      value: users.filter((u) => u.role === 'admin').length,
      color: 'bg-purple-500/20 text-purple-600',
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
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">User Management</h1>
            <p className="text-foreground/70 mt-2">Manage user accounts, roles, and permissions</p>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {selectedUser ? (
              // User Detail View
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Back Button */}
                <button
                  onClick={() => setSelectedUser(null)}
                  className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                >
                  <FaChevronLeft className="w-4 h-4" />
                  Back to Users
                </button>

                {/* User Detail Card */}
                <div className="bg-card rounded-lg border border-border/20 p-8">
                  <div className="grid md:grid-cols-3 gap-8">
                    {/* Profile Section */}
                    <div className="md:col-span-1 text-center">
                      {selectedUser.profileImage ? (
                        <img
                          src={selectedUser.profileImage}
                          alt={selectedUser.name}
                          className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-primary/20"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-primary/20 flex items-center justify-center border-4 border-primary/20">
                          <FaUser className="w-10 h-10 text-primary/60" />
                        </div>
                      )}
                      <h2 className="text-2xl font-bold text-foreground mb-2">{selectedUser.name}</h2>
                      <span
                        className={`inline-block px-4 py-1 rounded-full text-sm font-semibold ${
                          selectedUser.status === 'active'
                            ? 'bg-green-500/20 text-green-600'
                            : 'bg-red-500/20 text-red-600'
                        }`}
                      >
                        {selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)}
                      </span>
                    </div>

                    {/* Details Section */}
                    <div className="md:col-span-2 space-y-6">
                      {/* Info */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <FaEnvelope className="w-5 h-5 text-primary" />
                          <div>
                            <p className="text-foreground/60 text-sm">Email</p>
                            <p className="text-foreground font-semibold">{selectedUser.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <FaPhone className="w-5 h-5 text-primary" />
                          <div>
                            <p className="text-foreground/60 text-sm">Phone</p>
                            <p className="text-foreground font-semibold">{selectedUser.phone}</p>
                          </div>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-secondary/50 rounded-lg p-4">
                          <p className="text-foreground/60 text-sm">Total Spent</p>
                          <p className="text-xl font-bold text-foreground">₦{selectedUser.totalSpent?.toLocaleString()}</p>
                        </div>
                        <div className="bg-secondary/50 rounded-lg p-4">
                          <p className="text-foreground/60 text-sm">Enrolled Courses</p>
                          <p className="text-xl font-bold text-foreground">{selectedUser.enrolledCourses}</p>
                        </div>
                      </div>

                      {/* Role & Actions */}
                      <div className="space-y-4 pt-4 border-t border-border/20">
                        <div>
                          <label className="flex items-center gap-2 text-foreground font-semibold mb-3">
                            <FaShieldAlt className="w-4 h-4" />
                            User Role
                          </label>
                          <select
                            value={selectedUser.role}
                            onChange={(e) =>
                              handleChangeRole(selectedUser.id, e.target.value as UserRole)
                            }
                            className="w-full px-4 py-2 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          >
                            <option value="student">Student</option>
                            <option value="instructor">Instructor</option>
                            <option value="admin">Admin</option>
                          </select>
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={() => handleToggleStatus(selectedUser.id)}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
                              selectedUser.status === 'active'
                                ? 'bg-red-500/20 text-red-600 hover:bg-red-500/30'
                                : 'bg-green-500/20 text-green-600 hover:bg-green-500/30'
                            }`}
                          >
                            {selectedUser.status === 'active' ? (
                              <>
                                <FaToggleOn className="w-4 h-4" />
                                Suspend User
                              </>
                            ) : (
                              <>
                                <FaToggleOff className="w-4 h-4" />
                                Activate User
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => {
                              handleDeleteUser(selectedUser.id);
                              setSelectedUser(null);
                            }}
                            className="flex items-center justify-center gap-2 px-6 py-2 bg-red-500/20 text-red-600 rounded-lg hover:bg-red-500/30 font-semibold transition-colors"
                          >
                            <FaTrash className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              // Users List View
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Stats Cards */}
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

                {/* Filters & Search */}
                <div className="bg-card rounded-lg border border-border/20 p-6 space-y-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                      <FaSearch className="absolute left-3 top-3 w-5 h-5 text-foreground/50" />
                      <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-secondary border border-border text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    {/* Filter Role */}
                    <select
                      value={filterRole}
                      onChange={(e) => setFilterRole(e.target.value as UserRole | 'all')}
                      className="px-4 py-2 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="all">All Roles</option>
                      <option value="student">Student</option>
                      <option value="instructor">Instructor</option>
                      <option value="admin">Admin</option>
                    </select>

                    {/* Filter Status */}
                    <select
                      value={filterStatus}
                      onChange={(e) =>
                        setFilterStatus(e.target.value as 'all' | 'active' | 'inactive' | 'suspended')
                      }
                      className="px-4 py-2 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="suspended">Suspended</option>
                    </select>

                    {/* Export Button */}
                    <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold flex items-center gap-2">
                      <FaDownload className="w-4 h-4" />
                      Export
                    </button>
                  </div>
                </div>

                {/* Users Table */}
                <div className="bg-card rounded-lg border border-border/20 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-secondary/50 border-b border-border/20">
                        <tr>
                          <th className="px-6 py-3 text-left font-semibold text-foreground">Name</th>
                          <th className="px-6 py-3 text-left font-semibold text-foreground">Email</th>
                          <th className="px-6 py-3 text-left font-semibold text-foreground">Role</th>
                          <th className="px-6 py-3 text-left font-semibold text-foreground">Status</th>
                          <th className="px-6 py-3 text-left font-semibold text-foreground">Spent</th>
                          <th className="px-6 py-3 text-left font-semibold text-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((u, i) => (
                          <motion.tr
                            key={u.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="border-b border-border/20 hover:bg-secondary/50 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                {u.profileImage ? (
                                  <img
                                    src={u.profileImage}
                                    alt={u.name}
                                    className="w-8 h-8 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                    <FaUser className="w-4 h-4 text-primary" />
                                  </div>
                                )}
                                <span className="font-semibold text-foreground">{u.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-foreground/80">{u.email}</td>
                            <td className="px-6 py-4">
                              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/20 text-primary">
                                {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                  u.status === 'active'
                                    ? 'bg-green-500/20 text-green-600'
                                    : 'bg-red-500/20 text-red-600'
                                }`}
                              >
                                {u.status.charAt(0).toUpperCase() + u.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 font-semibold text-foreground">
                              ₦{u.totalSpent?.toLocaleString()}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => setSelectedUser(u)}
                                  className="p-2 hover:bg-secondary rounded transition-colors"
                                  title="View Details"
                                >
                                  <FaEye className="w-4 h-4 text-primary" />
                                </button>
                                <button
                                  onClick={() => handleToggleStatus(u.id)}
                                  className="p-2 hover:bg-secondary rounded transition-colors"
                                  title={u.status === 'active' ? 'Suspend' : 'Activate'}
                                >
                                  {u.status === 'active' ? (
                                    <FaToggleOn className="w-4 h-4 text-orange-500" />
                                  ) : (
                                    <FaToggleOff className="w-4 h-4 text-foreground/60" />
                                  )}
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(u.id)}
                                  className="p-2 hover:bg-secondary rounded transition-colors"
                                  title="Delete"
                                >
                                  <FaTrash className="w-4 h-4 text-red-500" />
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {filteredUsers.length === 0 && (
                    <div className="text-center py-12 text-foreground/60">
                      <p>No users found matching your criteria</p>
                    </div>
                  )}
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
