'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaSearch, FaStar, FaUsers, FaBook, FaLinkedin, FaGithub, FaTwitter, FaGlobe } from 'react-icons/fa';

interface Instructor {
  id: string;
  name: string;
  bio: string;
  skills: string[];
  experience: string;
  rating: number;
  students: number;
  courses: number;
  profileImage: string;
  socialLinks: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    portfolio?: string;
  };
}

export default function InstructorsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('all');

  const [instructors] = useState<Instructor[]>([
    {
      id: '1',
      name: 'John Smith',
      bio: 'Full Stack Developer with 8+ years of experience teaching web technologies to thousands of students worldwide.',
      skills: ['React', 'Node.js', 'MongoDB', 'AWS'],
      experience: '8+ years in Full Stack Development',
      rating: 4.9,
      students: 2500,
      courses: 5,
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      socialLinks: {
        linkedin: 'https://linkedin.com',
        github: 'https://github.com',
      },
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      bio: 'UX/UI Designer and Front-end Expert. Passionate about creating beautiful and functional user experiences.',
      skills: ['React', 'Vue.js', 'Tailwind CSS', 'Figma'],
      experience: '6+ years in UI/UX Design',
      rating: 4.8,
      students: 1800,
      courses: 4,
      profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      socialLinks: {
        portfolio: 'https://portfolio.com',
        linkedin: 'https://linkedin.com',
      },
    },
    {
      id: '3',
      name: 'Mike Chen',
      bio: 'Data Science and Python expert. Helping students master machine learning and data analysis.',
      skills: ['Python', 'Data Science', 'TensorFlow', 'SQL'],
      experience: '5+ years in Data Science',
      rating: 4.7,
      students: 1200,
      courses: 3,
      profileImage: 'https://images.unsplash.com/photo-150784272343-583f20270319?w=400',
      socialLinks: {
        github: 'https://github.com',
        twitter: 'https://twitter.com',
      },
    },
    {
      id: '4',
      name: 'Emma Davis',
      bio: 'Cloud Architecture Specialist and DevOps Engineer. Teaching modern infrastructure and deployment strategies.',
      skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
      experience: '7+ years in DevOps',
      rating: 4.9,
      students: 2000,
      courses: 6,
      profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      socialLinks: {
        linkedin: 'https://linkedin.com',
        portfolio: 'https://portfolio.com',
      },
    },
  ]);

  const allSkills = Array.from(
    new Set(instructors.flatMap((i) => i.skills))
  );

  const filtered = instructors.filter((instructor) => {
    const matchesSearch =
      instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.bio.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSkill =
      selectedSkill === 'all' || instructor.skills.includes(selectedSkill);

    return matchesSearch && matchesSkill;
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-12 border-b border-border/20 bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Meet Our Instructors
            </h1>
            <p className="text-foreground/70 max-w-2xl mb-8">
              Learn from experienced professionals who are passionate about teaching and mentoring the next generation of developers.
            </p>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-3 top-3.5 w-5 h-5 text-foreground/50" />
                <input
                  type="text"
                  placeholder="Search instructors by name or expertise..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-secondary border border-border rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="px-4 py-3 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Skills</option>
                {allSkills.map((skill) => (
                  <option key={skill} value={skill}>
                    {skill}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Instructors Grid */}
        <section className="py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {filtered.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-foreground/70 text-lg">
                  No instructors found matching your criteria.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filtered.map((instructor, index) => (
                  <motion.div
                    key={instructor.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Link href={`/instructors/${instructor.id}`}>
                      <div className="rounded-lg overflow-hidden bg-card border border-border/20 hover:border-primary/50 hover:shadow-lg transition-all h-full flex flex-col">
                        {/* Profile Image */}
                        <div className="h-40 bg-gradient-to-br from-primary/20 to-primary/10 overflow-hidden">
                          <img
                            src={instructor.profileImage}
                            alt={instructor.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                          />
                        </div>

                        {/* Content */}
                        <div className="p-5 flex-1 flex flex-col">
                          {/* Name */}
                          <h3 className="text-lg font-bold text-foreground mb-1">
                            {instructor.name}
                          </h3>

                          {/* Rating */}
                          <div className="flex items-center gap-1 mb-3 text-sm">
                            <FaStar className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-foreground">{instructor.rating}</span>
                          </div>

                          {/* Experience */}
                          <p className="text-sm text-foreground/70 mb-3 flex-1">
                            {instructor.experience}
                          </p>

                          {/* Stats */}
                          <div className="flex gap-3 mb-4 text-sm">
                            <div className="flex items-center gap-1 text-foreground/60">
                              <FaUsers className="w-4 h-4" />
                              {instructor.students}+
                            </div>
                            <div className="flex items-center gap-1 text-foreground/60">
                              <FaBook className="w-4 h-4" />
                              {instructor.courses}
                            </div>
                          </div>

                          {/* Skills */}
                          <div className="flex flex-wrap gap-1 mb-4">
                            {instructor.skills.slice(0, 2).map((skill) => (
                              <span
                                key={skill}
                                className="text-xs px-2 py-1 bg-primary/20 text-primary rounded"
                              >
                                {skill}
                              </span>
                            ))}
                            {instructor.skills.length > 2 && (
                              <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded">
                                +{instructor.skills.length - 2}
                              </span>
                            )}
                          </div>

                          {/* Social Links */}
                          <div className="flex gap-2 pt-4 border-t border-border/20">
                            {Object.entries(instructor.socialLinks).map(
                              ([platform, url]) =>
                                url && (
                                  <a
                                    key={platform}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 text-foreground/60 hover:text-primary transition-colors"
                                    title={platform}
                                  >
                                    {platform === 'linkedin' && <FaLinkedin className="w-4 h-4" />}
                                    {platform === 'github' && <FaGithub className="w-4 h-4" />}
                                    {platform === 'twitter' && <FaTwitter className="w-4 h-4" />}
                                    {platform === 'portfolio' && <FaGlobe className="w-4 h-4" />}
                                  </a>
                                )
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
