'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Stat {
  label: string;
  value: number;
  suffix: string;
}

const stats: Stat[] = [
  { label: 'Active Students', value: 50000, suffix: '+' },
  { label: 'Expert Instructors', value: 500, suffix: '+' },
  { label: 'Courses Available', value: 1000, suffix: '+' },
  { label: 'Course Completion Rate', value: 95, suffix: '%' },
];

const AnimatedCounter: React.FC<{ stat: Stat }> = ({ stat }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = stat.value;
    const duration = 2;
    const increment = end / (duration * 60);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [stat.value]);

  return (
    <div className="text-center">
      <div className="text-4xl sm:text-5xl font-bold text-primary mb-2">
        {count.toLocaleString()}{stat.suffix}
      </div>
      <p className="text-foreground/70 text-sm sm:text-base">{stat.label}</p>
    </div>
  );
};

export const StatsSection = () => {
  return (
    <section className="py-16 sm:py-24 bg-card border-y border-border/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Our Impact
          </h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Join thousands of learners transforming their careers with our platform.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <AnimatedCounter stat={stat} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
