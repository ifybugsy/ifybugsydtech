'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useCart } from '@/lib/cart-context';
import { PRODUCTS } from '@/lib/mockData';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaTruck, FaCreditCard } from 'react-icons/fa';
import { formatCurrency } from '@/lib/utils';

interface OrderConfirmationPageProps {
  params: Promise<{
    orderId: string;
  }>;
}

export default function OrderConfirmationPage({
  params,
}: OrderConfirmationPageProps) {
  const { orders } = useCart();
  const resolvedParams = React.use(params);

  const order = orders.find((o) => o.orderId === resolvedParams.orderId);

  if (!order) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background">
          <section className="py-24">
            <div className="max-w-2xl mx-auto px-4 text-center">
              <h1 className="text-2xl font-bold text-foreground mb-4">
                Order Not Found
              </h1>
              <p className="text-foreground/70 mb-8">
                The order you are looking for does not exist.
              </p>
              <Link href="/shop">
                <button className="px-8 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors">
                  Continue Shopping
                </button>
              </Link>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  const cartItems = order.items
    .map((item) => {
      const product = PRODUCTS.find((p) => p.id === item.productId);
      return { ...item, product };
    })
    .filter((item) => item.product !== undefined);

  const subtotal = order.total;
  const shipping = order.total > 50000 ? 0 : 1000;
  const tax = order.total * 0.1;
  const total = order.total + shipping + tax;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Header */}
        <section className="py-12 border-b border-border/20 bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
              Order Confirmation
            </h1>
          </div>
        </section>

        {/* Confirmation Message */}
        <section className="py-12 bg-green-50 dark:bg-green-900/10 border-b border-green-200 dark:border-green-900/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-start gap-4">
              <FaCheckCircle className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold text-green-900 dark:text-green-100 mb-2">
                  Thank you for your order!
                </h2>
                <p className="text-green-800 dark:text-green-200">
                  We&apos;ve received your order and will start processing it right away.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Order Details */}
        <section className="py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Order Number & Status */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-6 rounded-lg bg-card border border-border/20"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div>
                      <p className="text-sm text-foreground/70 mb-1">Order Number</p>
                      <p className="text-2xl font-bold text-primary">{order.orderId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-foreground/70 mb-1">Order Date</p>
                      <p className="text-lg text-foreground">{order.createdAt}</p>
                    </div>
                  </div>
                </motion.div>

                {/* Tracking Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="p-6 rounded-lg bg-card border border-border/20"
                >
                  <h3 className="text-lg font-bold text-foreground mb-6">
                    Delivery Status
                  </h3>

                  <div className="flex items-center gap-4 mb-8">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white">
                          ✓
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">Order Confirmed</p>
                          <p className="text-sm text-foreground/70">{order.createdAt}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <FaTruck className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-foreground mb-1">Shipping</p>
                      <p className="text-sm text-foreground/70">
                        Your order is being prepared for shipment. You will receive a
                        tracking number via email once it ships.
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Order Items */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="p-6 rounded-lg bg-card border border-border/20"
                >
                  <h3 className="text-lg font-bold text-foreground mb-6">
                    Order Items
                  </h3>

                  <div className="space-y-4">
                    {cartItems.map((item, index) => (
                      <motion.div
                        key={item.productId}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
                        className="flex gap-4 p-4 rounded-lg bg-secondary border border-border/20"
                      >
                        <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-semibold text-primary/70">
                            {item.product?.category.substring(0, 3).toUpperCase()}
                          </span>
                        </div>

                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground mb-1">
                            {item.product?.name}
                          </h4>
                          <p className="text-sm text-foreground/70">
                            Quantity: {item.quantity}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="font-semibold text-foreground">
                            {formatCurrency(item.price * item.quantity)}
                          </p>
                          <p className="text-xs text-foreground/70">
                            {formatCurrency(item.price)} each
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Summary & Payment */}
              <div className="lg:col-span-1">
                {/* Order Summary */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  className="p-6 rounded-lg bg-card border border-border/20 sticky top-24 mb-6"
                >
                  <h3 className="text-lg font-bold text-foreground mb-6">
                    Order Summary
                  </h3>

                  <div className="space-y-3 mb-6 pb-6 border-b border-border/20">
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground/70">Subtotal</span>
                      <span className="text-foreground">{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground/70">Shipping</span>
                      <span className="text-foreground">
                        {shipping === 0 ? 'Free' : formatCurrency(shipping)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground/70">Tax (10%)</span>
                      <span className="text-foreground">{formatCurrency(tax)}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-8">
                    <span className="font-bold text-foreground">Total</span>
                    <span className="text-2xl font-bold text-primary">
                      {formatCurrency(total)}
                    </span>
                  </div>

                  <div className="pt-6 border-t border-border/20">
                    <p className="text-sm text-foreground/70 mb-3">Payment Status</p>
                    <div className="flex items-center gap-3">
                      <FaCreditCard className="w-5 h-5 text-green-500" />
                      <span className="text-sm font-semibold text-foreground capitalize">
                        {order.paymentStatus === 'paid' ? 'Paid' : order.paymentStatus}
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Link href="/shop" className="block">
                    <button className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors">
                      Continue Shopping
                    </button>
                  </Link>
                  <Link href="/dashboard" className="block">
                    <button className="w-full py-3 rounded-lg bg-secondary text-foreground font-semibold hover:bg-border transition-colors">
                      View My Orders
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Additional Info */}
        <section className="py-16 bg-secondary/30 border-t border-border/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="text-center"
              >
                <FaTruck className="w-8 h-8 text-primary mx-auto mb-3" />
                <h4 className="font-semibold text-foreground mb-2">Fast Shipping</h4>
                <p className="text-sm text-foreground/70">
                  Your order will be shipped within 2-3 business days
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.45 }}
                className="text-center"
              >
                <FaCreditCard className="w-8 h-8 text-primary mx-auto mb-3" />
                <h4 className="font-semibold text-foreground mb-2">Secure Payment</h4>
                <p className="text-sm text-foreground/70">
                  Your payment information is encrypted and secure
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
                className="text-center"
              >
                <FaCheckCircle className="w-8 h-8 text-primary mx-auto mb-3" />
                <h4 className="font-semibold text-foreground mb-2">
                  30-Day Returns
                </h4>
                <p className="text-sm text-foreground/70">
                  Not satisfied? Return within 30 days for a full refund
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
