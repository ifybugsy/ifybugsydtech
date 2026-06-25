'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { paymentsAPI } from '@/lib/api';
import { motion } from 'framer-motion';
import { FaCreditCard, FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';

declare global {
  interface Window {
    PaystackPop: any;
  }
}

interface PaystackPaymentProps {
  email: string;
  amount: number;
  orderId?: string;
  enrollmentId?: string;
  onSuccess: (reference: string) => void;
  onError?: (error: string) => void;
  isLoading?: boolean;
}

export function PaystackPayment({
  email,
  amount,
  orderId,
  enrollmentId,
  onSuccess,
  onError,
  isLoading = false,
}: PaystackPaymentProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Load Paystack script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    setError(null);
    setIsProcessing(true);

    try {
      // Initialize payment with backend
      const response = await paymentsAPI.initializePayment({
        email,
        amount,
        metadata: {
          orderId,
          enrollmentId,
        },
      });

      const { authorizationUrl, reference } = response.data.data;

      if (window.PaystackPop) {
        // Open Paystack modal
        window.location.href = authorizationUrl;

        // Store reference in localStorage for verification
        localStorage.setItem('paystack_reference', reference);
        localStorage.setItem('paystack_email', email);
      } else {
        setError('Paystack library not loaded');
        setIsProcessing(false);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Payment initialization failed';
      setError(errorMsg);
      onError?.(errorMsg);
      setIsProcessing(false);
    }
  };

  // Handle verification after redirect from Paystack
  useEffect(() => {
    const verifyPayment = async () => {
      const reference = localStorage.getItem('paystack_reference');
      const storedEmail = localStorage.getItem('paystack_email');

      if (reference && storedEmail === email && !success) {
        try {
          const response = await paymentsAPI.verifyPaystackPayment(reference);
          if (response.data.payment.status === 'completed') {
            setSuccess(true);
            onSuccess(reference);
            
            // Clear stored reference
            localStorage.removeItem('paystack_reference');
            localStorage.removeItem('paystack_email');
          }
        } catch (err) {
          console.error('Verification failed:', err);
        }
      }
    };

    verifyPayment();
  }, [email, onSuccess, success]);

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
      >
        <div className="flex items-center gap-3 text-green-700 dark:text-green-400">
          <FaCheckCircle className="w-6 h-6" />
          <div>
            <p className="font-semibold">Payment Successful!</p>
            <p className="text-sm opacity-90">Your transaction has been completed.</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-card rounded-lg border border-border/20"
    >
      <div className="flex items-center gap-3 mb-4">
        <FaCreditCard className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        <h3 className="text-lg font-semibold text-foreground">Secure Payment with Paystack</h3>
      </div>

      <div className="mb-6 p-4 bg-secondary/50 rounded-lg">
        <div className="flex justify-between mb-2">
          <span className="text-foreground/60">Amount to Pay:</span>
          <span className="font-semibold text-foreground">${(amount / 100).toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-foreground/60">Email:</span>
          <span className="font-medium text-foreground">{email}</span>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-red-700 dark:text-red-400 text-sm">
          <FaTimesCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      <button
        onClick={handlePayment}
        disabled={isProcessing || isLoading}
        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isProcessing || isLoading ? (
          <>
            <FaSpinner className="w-4 h-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <FaCreditCard className="w-4 h-4" />
            Pay with Paystack
          </>
        )}
      </button>

      <p className="text-xs text-foreground/50 text-center mt-4">
        Your payment is secured by Paystack. We never store your payment details.
      </p>
    </motion.div>
  );
}
