'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <section className="py-16 sm:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">About Ifybugsy</h1>
            <p className="text-lg text-foreground/70 mb-8">
              Ifybugsy Digital Technologies is a leading platform dedicated to providing world-class digital education and technology solutions.
            </p>

            <div className="prose prose-invert max-w-none mb-12">
              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Our Mission</h2>
              <p className="text-foreground/70 leading-relaxed">
                We empower learners to master digital skills and achieve their career goals through comprehensive, industry-aligned courses and cutting-edge technology solutions.
              </p>

              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Our Vision</h2>
              <p className="text-foreground/70 leading-relaxed">
                To be the most trusted platform for digital learning, creating opportunities for millions of learners worldwide.
              </p>

              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Why Choose Us?</h2>
              <ul className="list-disc list-inside space-y-2 text-foreground/70">
                <li>Industry-Recognized Certifications</li>
                <li>Expert Instructors with Real-World Experience</li>
                <li>Comprehensive & Updated Curriculum</li>
                <li>Hands-On Learning with Projects</li>
                <li>Lifetime Access to Learning Materials</li>
                <li>Affordable Pricing</li>
              </ul>
            </div>

            <div className="bg-card border border-border/20 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">Ready to Get Started?</h2>
              <p className="text-foreground/70 mb-6">
                Join thousands of learners who are transforming their careers with Ifybugsy.
              </p>
              <Link
                href="/register"
                className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
              >
                Enroll Now
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
