'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaCheck, FaMoneyBillWave, FaCreditCard } from 'react-icons/fa';
import { formatCurrency } from '@/lib/utils';

interface CoursePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: {
    id: string;
    title: string;
    price: number;
  };
  onPaymentSuccess: (paymentMethod: string) => void;
}

export function CoursePaymentModal({
  isOpen,
  onClose,
  course,
  onPaymentSuccess,
}: CoursePaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'paystack' | 'transfer'>('paystack');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const bankDetails = {
    accountName: 'IFYBUGSY DIGITAL TECHNOLOGIES LIMITED',
    bank: 'UBA',
    accountNumber: '1028301845',
  };

  const handlePaystackPayment = async () => {
    if (!email.trim() || !email.includes('@')) {
      setErrors({ email: 'Valid email is required' });
      return;
    }

    setLoading(true);
    try {
      // Initialize Paystack payment
      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      document.body.appendChild(script);

      script.onload = () => {
        const PaystackPop = (window as any).PaystackPop;
        PaystackPop.setup({
          key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
          email: email,
          amount: Math.round(course.price * 100),
          currency: 'NGN',
          ref: `COURSE-${course.id}-${Date.now()}`,
          onClose: () => {
            setLoading(false);
          },
          callback: (response: any) => {
            if (response.status === 'success') {
              onPaymentSuccess('paystack');
              onClose();
            }
            setLoading(false);
          },
        });
        PaystackPop.openIframe();
      };
    } catch (error) {
      console.error('Paystack error:', error);
      setErrors({ payment: 'Failed to process payment. Please try again.' });
      setLoading(false);
    }
  };

  const handleBankTransferPayment = () => {
    if (!email.trim() || !email.includes('@')) {
      setErrors({ email: 'Valid email is required' });
      return;
    }
    
    onPaymentSuccess('bank_transfer');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-background rounded-xl max-w-md w-full border border-border/20 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/20">
              <h2 className="text-2xl font-bold text-foreground">Enroll in Course</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-foreground/10 rounded-lg transition-colors"
              >
                <FaTimes className="w-5 h-5 text-foreground/60" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {/* Course Summary */}
              <div className="p-4 bg-primary/10 rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">{course.title}</h3>
                <p className="text-2xl font-bold text-primary">{formatCurrency(course.price)}</p>
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({});
                  }}
                  placeholder="your@email.com"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Payment Method Selection */}
              <div className="space-y-3">
                {/* Paystack Option */}
                <div
                  onClick={() => {
                    setPaymentMethod('paystack');
                    setErrors({});
                  }}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'paystack'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        paymentMethod === 'paystack'
                          ? 'bg-primary border-primary'
                          : 'border-border'
                      }`}
                    >
                      {paymentMethod === 'paystack' && (
                        <FaCheck className="w-3 h-3 text-primary-foreground" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground flex items-center gap-2">
                        <FaCreditCard className="w-4 h-4" />
                        Pay with Paystack
                      </h4>
                      <p className="text-sm text-foreground/60 mt-1">
                        Secure payment with debit card
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bank Transfer Option */}
                <div
                  onClick={() => {
                    setPaymentMethod('transfer');
                    setErrors({});
                  }}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'transfer'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        paymentMethod === 'transfer'
                          ? 'bg-primary border-primary'
                          : 'border-border'
                      }`}
                    >
                      {paymentMethod === 'transfer' && (
                        <FaCheck className="w-3 h-3 text-primary-foreground" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground flex items-center gap-2">
                        <FaMoneyBillWave className="w-4 h-4" />
                        Bank Transfer
                      </h4>
                      <p className="text-sm text-foreground/60 mt-1">
                        Transfer directly to our account
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bank Details (shown when transfer is selected) */}
              {paymentMethod === 'transfer' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 bg-foreground/5 rounded-lg border border-border/20"
                >
                  <p className="text-sm font-semibold text-foreground mb-3">
                    Bank Transfer Details:
                  </p>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-foreground/60">Account Name</p>
                      <p className="font-semibold text-foreground">{bankDetails.accountName}</p>
                    </div>
                    <div>
                      <p className="text-foreground/60">Bank</p>
                      <p className="font-semibold text-foreground">{bankDetails.bank}</p>
                    </div>
                    <div>
                      <p className="text-foreground/60">Account Number</p>
                      <p className="font-semibold text-foreground">{bankDetails.accountNumber}</p>
                    </div>
                    <div>
                      <p className="text-foreground/60">Amount</p>
                      <p className="font-semibold text-primary text-lg">{formatCurrency(course.price)}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {errors.payment && (
                <p className="text-red-500 text-sm">{errors.payment}</p>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-border/20 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-border rounded-lg text-foreground hover:bg-foreground/5 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={
                  paymentMethod === 'paystack'
                    ? handlePaystackPayment
                    : handleBankTransferPayment
                }
                disabled={loading}
                className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : paymentMethod === 'paystack' ? 'Pay Now' : 'Confirm Transfer'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
