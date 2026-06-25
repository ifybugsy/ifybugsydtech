'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { motion } from 'framer-motion';
import { FaPlus, FaChevronLeft, FaDownload, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import Link from 'next/link';

interface OfflineStudent {
  id?: string;
  name: string;
  email: string;
  phone: string;
  temporaryPassword?: string;
}

export default function OfflineStudentsPage() {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<OfflineStudent>({
    name: '',
    email: '',
    phone: '',
  });
  const [students, setStudents] = useState<OfflineStudent[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [csvData, setCsvData] = useState('');
  const [showBulkImport, setShowBulkImport] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegisterStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/auth/offline-student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to register student');
      }

      setMessage(`Student registered successfully! Temporary password: ${data.user.temporaryPassword}`);
      setStudents(prev => [...prev, data.user]);
      setFormData({ name: '', email: '', phone: '' });
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkImport = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const lines = csvData.trim().split('\n');
      const studentsArray = [];

      for (let i = 1; i < lines.length; i++) {
        const [name, email, phone] = lines[i].split(',').map(s => s.trim());
        if (name && email && phone) {
          studentsArray.push({ name, email, phone });
        }
      }

      const response = await fetch('/api/auth/bulk-offline-students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({ students: studentsArray })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Bulk import failed');
      }

      setMessage(`Successfully registered ${data.summary.created} students. ${data.summary.failed} failed.`);
      setStudents(prev => [...prev, ...data.createdStudents]);
      setCsvData('');
      setShowBulkImport(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bulk import failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTemplate = () => {
    const template = 'Name,Email,Phone\nJohn Doe,john@example.com,1234567890\nJane Smith,jane@example.com,0987654321';
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(template));
    element.setAttribute('download', 'offline_students_template.csv');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDeleteStudent = (index: number) => {
    setStudents(prev => prev.filter((_, i) => i !== index));
  };

  const handleCopyPassword = (password: string | undefined) => {
    if (password) {
      navigator.clipboard.writeText(password);
      setMessage('Password copied to clipboard');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <FaChevronLeft className="w-5 h-5 text-foreground/70" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Offline Student Registration</h1>
              <p className="text-foreground/60 mt-1">Register students who joined offline</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowBulkImport(!showBulkImport)}
              className="flex items-center gap-2 px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors"
            >
              <FaDownload className="w-4 h-4" />
              Bulk Import
            </button>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <FaPlus className="w-4 h-4" />
              Add Student
            </button>
          </div>
        </div>

        {/* Messages */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg flex items-center gap-2"
          >
            <FaCheck className="w-5 h-5" />
            {message}
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg flex items-center gap-2"
          >
            <FaTimes className="w-5 h-5" />
            {error}
          </motion.div>
        )}

        {/* Add Student Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 bg-card rounded-xl border border-border/20"
          >
            <h2 className="text-xl font-bold text-foreground mb-4">Add New Student</h2>
            <form onSubmit={handleRegisterStudent} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="1234567890"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Registering...' : 'Register Student'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Bulk Import Form */}
        {showBulkImport && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 bg-card rounded-xl border border-border/20"
          >
            <h2 className="text-xl font-bold text-foreground mb-4">Bulk Import Students</h2>
            <form onSubmit={handleBulkImport} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">CSV Format: Name,Email,Phone</label>
                <textarea
                  value={csvData}
                  onChange={(e) => setCsvData(e.target.value)}
                  placeholder="John Doe,john@example.com,1234567890"
                  className="w-full h-32 px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading || !csvData.trim()}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Importing...' : 'Import Students'}
                </button>
                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="px-6 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors flex items-center gap-2"
                >
                  <FaDownload className="w-4 h-4" />
                  Download Template
                </button>
                <button
                  type="button"
                  onClick={() => setShowBulkImport(false)}
                  className="px-6 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Students List */}
        <div className="bg-card rounded-xl border border-border/20 overflow-hidden">
          <div className="px-6 py-4 border-b border-border/20">
            <h2 className="text-lg font-bold text-foreground">Registered Offline Students ({students.length})</h2>
          </div>
          
          {students.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-foreground/60">No students registered yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Phone</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Temporary Password</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {students.map((student, index) => (
                    <tr key={index} className="hover:bg-secondary/20 transition-colors">
                      <td className="px-6 py-4 text-foreground">{student.name}</td>
                      <td className="px-6 py-4 text-foreground text-sm">{student.email}</td>
                      <td className="px-6 py-4 text-foreground text-sm">{student.phone}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <code className="px-3 py-1 bg-secondary rounded text-sm text-foreground/80 font-mono">
                            {student.temporaryPassword || 'N/A'}
                          </code>
                          {student.temporaryPassword && (
                            <button
                              onClick={() => handleCopyPassword(student.temporaryPassword)}
                              className="px-2 py-1 bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors text-xs"
                            >
                              Copy
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDeleteStudent(index)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
