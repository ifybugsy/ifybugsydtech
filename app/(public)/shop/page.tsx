'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { FaShoppingBag, FaArrowRight } from 'react-icons/fa';
import Link from 'next/link';

export default function ShopComingSoonPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-200px)] bg-background flex items-center justify-center">
        <section className="py-20 px-4">
          <div className="max-w-2xl mx-auto text-center">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <FaShoppingBag className="w-12 h-12 text-primary" />
              </div>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-6xl font-bold text-foreground mb-4"
            >
              Tech Store
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-foreground/70 mb-8"
            >
              Coming Soon
            </motion.p>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg text-foreground/60 mb-12 max-w-md mx-auto"
            >
              We're working hard to bring you an amazing selection of premium tech products. Stay tuned for the official launch!
            </motion.p>

            {/* Features Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-3 gap-4 mb-12 text-center"
            >
              <div>
                <div className="text-2xl font-bold text-primary mb-2">1000+</div>
                <p className="text-sm text-foreground/60">Products</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary mb-2">24/7</div>
                <p className="text-sm text-foreground/60">Support</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary mb-2">Free</div>
                <p className="text-sm text-foreground/60">Shipping</p>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                href="/courses"
                className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                Explore Courses
                <FaArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="px-8 py-4 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/10 transition-colors"
              >
                Notify Me
              </Link>
            </motion.div>

            {/* Coming Soon Notice */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-12 text-sm text-foreground/50"
            >
              This section is currently disabled. The shop functionality remains available in the codebase and can be reactivated at any time.
            </motion.p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
