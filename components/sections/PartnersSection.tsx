'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PARTNERS } from '@/lib/mockData';
import Link from 'next/link';

export const PartnersSection = () => {
  const activePartners = PARTNERS.filter(p => p.status === 'active');

  return (
    <section className="py-16 bg-background border-t border-border/20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Our Partners
          </h2>
          <p className="text-foreground/60 text-lg max-w-2xl mx-auto">
            We collaborate with industry leaders to bring you the best learning experience
          </p>
        </motion.div>

        {/* Partners Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {activePartners.map((partner, index) => (
            <motion.a
              key={partner.id}
              href={partner.website}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              whileHover={{ scale: 1.05 }}
              className="bg-card rounded-lg border border-border/20 p-6 flex items-center justify-center min-h-24 hover:border-primary/50 transition-all group"
              title={partner.description}
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="max-w-full h-12 object-contain opacity-60 group-hover:opacity-100 transition-opacity"
              />
            </motion.a>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <p className="text-foreground/60 mb-4">
            Interested in partnering with Ifybugsy? Let&apos;s collaborate!
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
          >
            Contact Our Partnership Team
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
