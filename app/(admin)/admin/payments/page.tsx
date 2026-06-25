'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaSearch, FaDollarSign, FaCheckCircle, FaTimesCircle, FaClock, FaDownload } from 'react-icons/fa';
import Link from 'next/link';

interface Payment {
  _id: string;
  transactionId: string;
  user: any;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  paymentMethod: string;
  createdAt: string;
  order?: any;
  enrollment?: any;
}

export default function PaymentsPage() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filtered, setFiltered] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');
  const [stats, setStats] = useState({ totalRevenue: 0, totalTransactions: 0 });

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/payments', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
      });
      const data = await response.json();
      setPayments(data);
      filterPayments(data, searchTerm, statusFilter);

      // Load stats
      const statsResponse = await fetch('/api/payments/stats', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
      });
      const statsData = await statsResponse.json();
      setStats(statsData);
    } catch (err) {
      console.error('Failed to load payments', err);
    } finally {
      setLoading(false);
    }
  };

  const filterPayments = (data: Payment[], search: string, status: string) => {
    let result = data;

    if (search) {
      result = result.filter(p =>
        p.transactionId.toLowerCase().includes(search.toLowerCase()) ||
        p.user?.email?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status !== 'all') {
      result = result.filter(p => p.status === status);
    }

    setFiltered(result);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    filterPayments(payments, value, statusFilter);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value as any);
    filterPayments(payments, searchTerm, value);
  };

  const handleDownloadReport = () => {
    let csv = 'Transaction ID,User,Amount,Status,Method,Date\n';
    payments.forEach(p => {
      csv += `${p.transactionId},"${p.user?.name || 'N/A'}",${p.amount},${p.status},${p.paymentMethod},${new Date(p.createdAt).toLocaleDateString()}\n`;
    });

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
    element.setAttribute('download', `payments_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <FaCheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending': return <FaClock className="w-5 h-5 text-yellow-500" />;
      case 'failed': return <FaTimesCircle className="w-5 h-5 text-red-500" />;
      default: return null;
    }
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
              <h1 className="text-3xl font-bold text-foreground">Payment Management</h1>
              <p className="text-foreground/60 mt-1">Track all transactions and revenue</p>
            </div>
          </div>
          <button
            onClick={handleDownloadReport}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            <FaDownload className="w-4 h-4" />
            Download Report
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div className="p-6 bg-card rounded-xl border border-border/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-foreground/70 text-sm font-medium">Total Revenue</p>
                <p className="text-3xl font-bold text-foreground mt-2">${(stats.totalRevenue / 100).toFixed(2)}</p>
              </div>
              <FaDollarSign className="w-12 h-12 text-primary/20" />
            </div>
          </motion.div>

          <motion.div className="p-6 bg-card rounded-xl border border-border/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-foreground/70 text-sm font-medium">Total Transactions</p>
                <p className="text-3xl font-bold text-foreground mt-2">{stats.totalTransactions}</p>
              </div>
              <FaDollarSign className="w-12 h-12 text-green-500/20" />
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by transaction ID or email..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => handleStatusFilter(e.target.value)}
            className="px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        {/* Payments Table */}
        <div className="bg-card rounded-xl border border-border/20 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-foreground/60">Loading payments...</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-foreground/60">No payments found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Transaction ID</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">User</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Amount</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Method</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {filtered.map((payment) => (
                    <tr key={payment._id} className="hover:bg-secondary/20 transition-colors">
                      <td className="px-6 py-4 text-foreground font-mono text-sm">{payment.transactionId}</td>
                      <td className="px-6 py-4 text-foreground">{payment.user?.name || 'Unknown'}</td>
                      <td className="px-6 py-4 text-foreground font-semibold">${(payment.amount / 100).toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(payment.status)}
                          <span className="capitalize text-sm">{payment.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-foreground text-sm capitalize">{payment.paymentMethod}</td>
                      <td className="px-6 py-4 text-foreground/70 text-sm">
                        {new Date(payment.createdAt).toLocaleDateString()}
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
