'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaStar, FaUsers, FaBook, FaLinkedin, FaGithub, FaTwitter, FaGlobe, FaAward } from 'react-icons/fa';

export default function InstructorDetailPage({ params }: { params: { id: string } }) {
  // Mock data for the instructor
  const instructor = {
    id: params.id,
    name: 'John Smith',
    bio: 'Full Stack Developer with 8+ years of experience teaching web technologies to thousands of students worldwide. Passionate about making complex concepts simple and accessible to everyone.',
    longBio:
      'I started my journey as a developer over a decade ago and have worked with some of the biggest tech companies in the world. Now, I focus on teaching and mentoring the next generation of developers. My courses have helped over 50,000 students land their dream jobs in tech.',
    skills: ['React', 'Node.js', 'MongoDB', 'AWS', 'TypeScript', 'PostgreSQL'],
    experience: '8+ years in Full Stack Development',
    rating: 4.9,
    students: 2500,
    courses: 5,
    reviews: 1250,
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
    certifications: [
      { name: 'AWS Solutions Architect', issuer: 'Amazon', date: '2022' },
      { name: 'Google Cloud Professional', issuer: 'Google', date: '2021' },
      { name: 'MongoDB Certified Developer', issuer: 'MongoDB', date: '2020' },
    ],
    socialLinks: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
      twitter: 'https://twitter.com',
      portfolio: 'https://portfolio.com',
    },
    courses: [
      { id: '1', title: 'Complete React Course', students: 5000 },
      { id: '2', title: 'Node.js Masterclass', students: 3000 },
      { id: '3', title: 'Full Stack Development', students: 2500 },
      { id: '4', title: 'AWS for Developers', students: 2000 },
      { id: '5', title: 'TypeScript Advanced', students: 1500 },
    ],
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Header with back button */}
        <section className="py-6 border-b border-border/20 bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/instructors"
              className="inline-flex items-center gap-2 text-primary hover:underline mb-4"
            >
              <FaArrowLeft className="w-4 h-4" />
              Back to Instructors
            </Link>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Left Column - Profile Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Profile Header */}
                <div className="bg-card border border-border/20 rounded-xl p-8 flex flex-col sm:flex-row gap-6">
                  <img
                    src={instructor.profileImage}
                    alt={instructor.name}
                    className="w-32 h-32 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h1 className="text-4xl font-bold text-foreground mb-2">
                      {instructor.name}
                    </h1>
                    <p className="text-foreground/70 mb-4">{instructor.experience}</p>

                    {/* Rating */}
                    <div className="flex items-center gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-1">
                        <FaStar className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                        <span className="font-semibold text-foreground">{instructor.rating}</span>
                        <span className="text-foreground/60">({instructor.reviews} reviews)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaUsers className="w-5 h-5 text-primary" />
                        <span className="text-foreground">{instructor.students}+ students</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaBook className="w-5 h-5 text-primary" />
                        <span className="text-foreground">{instructor.courses} courses</span>
                      </div>
                    </div>

                    {/* Social Links */}
                    <div className="flex gap-3">
                      {Object.entries(instructor.socialLinks).map(([platform, url]) => (
                        <a
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-secondary hover:bg-primary/20 text-foreground hover:text-primary rounded-lg transition-colors"
                          title={platform}
                        >
                          {platform === 'linkedin' && <FaLinkedin className="w-5 h-5" />}
                          {platform === 'github' && <FaGithub className="w-5 h-5" />}
                          {platform === 'twitter' && <FaTwitter className="w-5 h-5" />}
                          {platform === 'portfolio' && <FaGlobe className="w-5 h-5" />}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div className="bg-card border border-border/20 rounded-xl p-6">
                  <h2 className="text-2xl font-bold text-foreground mb-4">About</h2>
                  <p className="text-foreground/70 leading-relaxed">{instructor.longBio}</p>
                </div>

                {/* Skills */}
                <div className="bg-card border border-border/20 rounded-xl p-6">
                  <h2 className="text-2xl font-bold text-foreground mb-4">Skills & Expertise</h2>
                  <div className="flex flex-wrap gap-3">
                    {instructor.skills.map((skill) => (
                      <div
                        key={skill}
                        className="px-4 py-2 bg-primary/20 text-primary rounded-lg font-medium"
                      >
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Certifications */}
                <div className="bg-card border border-border/20 rounded-xl p-6">
                  <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <FaAward className="w-6 h-6 text-primary" />
                    Certifications
                  </h2>
                  <div className="space-y-3">
                    {instructor.certifications.map((cert, i) => (
                      <div
                        key={i}
                        className="p-4 bg-secondary/50 border border-border/20 rounded-lg"
                      >
                        <p className="font-semibold text-foreground">{cert.name}</p>
                        <p className="text-sm text-foreground/60">
                          {cert.issuer} • {cert.date}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Courses */}
                <div className="bg-card border border-border/20 rounded-xl p-6">
                  <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <FaBook className="w-6 h-6 text-primary" />
                    Courses Taught
                  </h2>
                  <div className="space-y-3">
                    {instructor.courses.map((course) => (
                      <Link
                        key={course.id}
                        href={`/courses/${course.id}`}
                        className="flex items-center justify-between p-4 bg-secondary/50 border border-border/20 rounded-lg hover:border-primary/50 transition-colors"
                      >
                        <p className="font-medium text-foreground hover:text-primary">
                          {course.title}
                        </p>
                        <p className="text-sm text-foreground/60">{course.students} students</p>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Sidebar */}
              <div className="lg:col-span-1">
                {/* CTA Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="sticky top-24 bg-card border border-primary/30 rounded-xl p-6 space-y-4"
                >
                  <h3 className="text-xl font-bold text-foreground">Ready to Learn?</h3>
                  <p className="text-sm text-foreground/70">
                    Enroll in one of {instructor.name}&apos;s courses today.
                  </p>
                  <Link
                    href="/courses"
                    className="block w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold text-center hover:bg-primary/90 transition-colors"
                  >
                    View Courses
                  </Link>
                  <Link
                    href="/contact"
                    className="block w-full py-3 border-2 border-primary text-primary rounded-lg font-semibold text-center hover:bg-primary/10 transition-colors"
                  >
                    Contact Instructor
                  </Link>
                </motion.div>

                {/* Stats Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-6 bg-card border border-border/20 rounded-xl p-6 space-y-4"
                >
                  <h3 className="font-semibold text-foreground mb-4">Quick Stats</h3>
                  {[
                    { label: 'Total Students', value: `${instructor.students}+` },
                    { label: 'Active Courses', value: instructor.courses },
                    { label: 'Student Rating', value: `${instructor.rating}/5` },
                    { label: 'Years Experience', value: '8+' },
                  ].map((stat, i) => (
                    <div key={i} className="flex justify-between">
                      <span className="text-foreground/70">{stat.label}</span>
                      <span className="font-semibold text-foreground">{stat.value}</span>
                    </div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
