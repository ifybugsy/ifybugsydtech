'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  FaAward,
  FaBook,
  FaUsers,
  FaBolt,
  FaGlobe,
  FaHeart,
} from 'react-icons/fa';

const features = [
  {
    icon: FaAward,
    title: 'Industry-Recognized',
    description: 'Earn certificates recognized by leading tech companies worldwide.',
  },
  {
    icon: FaBook,
    title: 'Comprehensive Curriculum',
    description: 'From beginner to advanced, covering the latest industry standards.',
  },
  {
    icon: FaUsers,
    title: 'Expert Instructors',
    description: 'Learn from experienced professionals with real-world expertise.',
  },
  {
    icon: FaBolt,
    title: 'Practical Projects',
    description: 'Build real projects and develop practical skills you can use immediately.',
  },
  {
    icon: FaGlobe,
    title: 'Global Community',
    description: 'Connect with learners from around the world and grow your network.',
  },
  {
    icon: FaHeart,
    title: 'Lifetime Support',
    description: 'Get help from our dedicated support team whenever you need it.',
  },
];

export const FeaturesSection = () => {
  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Why Choose Ifybugsy?
          </h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            We provide everything you need to succeed in your learning journey and career growth.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 sm:p-8 rounded-xl bg-card border border-border/20 hover:border-primary/50 hover:shadow-lg transition-all"
              >
                <div className="mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-foreground/70 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
