'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CoursePaymentModal } from '@/components/CoursePaymentModal';
import { COURSES } from '@/lib/mockData';
import { useAuth } from '@/lib/auth-context';
import { useNotifications } from '@/lib/notifications-context';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaStar, FaUsers, FaClock, FaGraduationCap, FaCheckCircle } from 'react-icons/fa';
import { formatCurrency } from '@/lib/utils';

interface CourseDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { isAuthenticated } = useAuth();
  const { addNotification } = useNotifications();
  const router = useRouter();
  const resolvedParams = React.use(params);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const course = COURSES.find((c) => c.id === resolvedParams.id);

  if (!course) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <p className="text-foreground/70 text-lg mb-4">Course not found</p>
            <Link href="/courses" className="text-primary hover:underline font-semibold">
              Back to Courses
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const handleEnroll = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (paymentMethod: string) => {
    addNotification(
      'success',
      'Enrollment Successful',
      `You have successfully enrolled in ${course?.title}!`
    );
    router.push('/dashboard/my-courses');
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Course Hero */}
        <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-12 border-b border-border/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Course Info */}
              <div className="md:col-span-2">
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 text-sm font-semibold bg-primary/10 text-primary rounded capitalize">
                    {course.level}
                  </span>
                </div>
                <h1 className="text-4xl font-bold text-foreground mb-4">{course.title}</h1>
                <p className="text-foreground/70 text-lg mb-6">{course.description}</p>

                {/* Rating & Reviews */}
                <div className="flex items-center gap-6 mb-6">
                  <div className="flex items-center gap-2">
                    <FaStar className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span className="text-lg font-semibold text-foreground">{course.rating}</span>
                    <span className="text-foreground/60">({course.reviews.toLocaleString()} reviews)</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground/60">
                    <FaUsers className="w-5 h-5" />
                    <span>{course.studentsEnrolled.toLocaleString()} students enrolled</span>
                  </div>
                </div>

                {/* Instructor */}
                <div className="flex items-center gap-4 p-4 bg-card rounded-lg border border-border/20">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">
                      {course.instructor.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60">Instructor</p>
                    <h4 className="font-semibold text-foreground">{course.instructor.name}</h4>
                    <p className="text-sm text-foreground/70">{course.instructor.specialization}</p>
                  </div>
                </div>
              </div>

              {/* Pricing Card */}
              <div className="md:col-span-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card rounded-lg border border-border/20 p-6 sticky top-20"
                >
                  <div className="mb-6">
                    <p className="text-sm text-foreground/60 mb-2">Price</p>
                    <p className="text-3xl font-bold text-primary mb-2">{formatCurrency(course.price)}</p>
                  </div>

                  <button
                    onClick={handleEnroll}
                    className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors mb-4"
                  >
                    {isAuthenticated ? 'Enroll Now' : 'Sign In to Enroll'}
                  </button>

                  <button className="w-full py-3 border border-primary text-primary font-semibold rounded-lg hover:bg-primary/10 transition-colors">
                    Add to Wishlist
                  </button>

                  {/* Quick Info */}
                  <div className="mt-6 space-y-3 border-t border-border/20 pt-6">
                    <div className="flex items-center gap-3">
                      <FaClock className="w-5 h-5 text-primary" />
                      <span className="text-foreground/70">{course.duration} days</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FaGraduationCap className="w-5 h-5 text-primary" />
                      <span className="text-foreground/70 capitalize">{course.level} Level</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Curriculum */}
        <section className="py-16 sm:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground mb-8">Course Curriculum</h2>

            <div className="space-y-4">
              {course.curriculum.map((module, index) => (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-lg border border-border/20 p-6 hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      <FaCheckCircle className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-3">{module.title}</h3>
                      <div className="flex flex-wrap gap-2">
                        {module.topics.map((topic, idx) => (
                          <span key={idx} className="text-sm bg-primary/10 text-primary px-3 py-1 rounded">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* What You'll Learn */}
        <section className="py-16 sm:py-24 bg-card border-y border-border/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground mb-8">What You'll Learn</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                'Master all fundamentals from scratch',
                'Build real-world projects',
                'Learn industry best practices',
                'Get lifetime access to materials',
                'Earn a recognized certificate',
                'Join our community for support',
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-start gap-4"
                >
                  <FaCheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <p className="text-foreground/70">{item}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-6">Ready to Start Learning?</h2>
            <p className="text-foreground/70 text-lg mb-8">
              Join thousands of students who are already learning {course.title}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={handleEnroll}
              className="px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
            >
              Enroll Now for {formatCurrency(course.price)}
            </motion.button>
          </div>
        </section>
      </main>
      <Footer />
      <CoursePaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        course={{
          id: course?.id || '',
          title: course?.title || '',
          price: course?.price || 0,
        }}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </>
  );
}
