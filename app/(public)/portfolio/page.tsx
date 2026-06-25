'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaExternalLinkAlt, FaGithub, FaStar, FaUsers, FaCode, FaArrowRight } from 'react-icons/fa';

interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  category: string;
  image: string;
  technologies: string[];
  features: string[];
  link?: string;
  github?: string;
  stats: {
    label: string;
    value: string;
  }[];
}

const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: '1',
    title: 'Ifybugsy LMS Platform',
    description: 'A comprehensive learning management system built for digital education',
    longDescription:
      'Ifybugsy is a modern, full-featured Learning Management System designed to transform digital education. Built with cutting-edge technologies, it combines course management, e-commerce, and community features in a seamless platform.',
    category: 'SaaS / LMS',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500',
    technologies: ['Next.js', 'React', 'TypeScript', 'TailwindCSS', 'Framer Motion'],
    features: [
      'Complete course management system',
      'Student enrollment and progress tracking',
      'E-commerce integration for products and services',
      'Community forum for peer learning',
      'Admin dashboard for full platform control',
      'Blog publishing system',
      'Certificate generation',
      'Payment management',
    ],
    link: 'https://ifybugsy.app',
    stats: [
      { label: 'Active Students', value: '5,000+' },
      { label: 'Courses', value: '50+' },
      { label: 'Instructors', value: '25+' },
    ],
  },
  {
    id: '2',
    title: 'E-Commerce Platform',
    description: 'A full-featured online store with inventory management',
    longDescription:
      'A sophisticated e-commerce solution featuring advanced product filtering, real-time inventory management, and secure payment processing. Built for scalability and user experience.',
    category: 'E-Commerce',
    image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=500',
    technologies: ['Next.js', 'Node.js', 'MongoDB', 'Stripe', 'Redis'],
    features: [
      'Product catalog with advanced filtering',
      'Real-time inventory tracking',
      'Secure payment processing',
      'Order management system',
      'Customer reviews and ratings',
      'Wishlist functionality',
      'Admin analytics dashboard',
    ],
    link: '#',
    stats: [
      { label: 'Daily Users', value: '10,000+' },
      { label: 'Products', value: '5,000+' },
      { label: 'Transactions', value: '$1M+' },
    ],
  },
  {
    id: '3',
    title: 'Business Analytics Dashboard',
    description: 'Real-time analytics and reporting for enterprise clients',
    longDescription:
      'An enterprise-grade analytics solution providing real-time insights, custom reporting, and predictive analytics. Helps businesses make data-driven decisions with intuitive visualizations.',
    category: 'Business Software',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=500',
    technologies: ['React', 'D3.js', 'PostgreSQL', 'Python', 'WebSocket'],
    features: [
      'Real-time data visualization',
      'Custom report generation',
      'Predictive analytics',
      'User role-based access control',
      'Data export in multiple formats',
      'Automated email reports',
      'API for third-party integration',
    ],
    link: '#',
    stats: [
      { label: 'Data Points', value: '1B+' },
      { label: 'Enterprise Clients', value: '200+' },
      { label: 'Uptime', value: '99.9%' },
    ],
  },
  {
    id: '4',
    title: 'Social Learning Network',
    description: 'A vibrant community platform for collaborative learning',
    longDescription:
      'A social network designed specifically for learners to connect, collaborate, and grow together. Features peer-to-peer learning, study groups, and knowledge sharing.',
    category: 'Social Platform',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500',
    technologies: ['Next.js', 'Firebase', 'React Native', 'WebSocket', 'GraphQL'],
    features: [
      'User profiles and social connections',
      'Study groups and collaborative projects',
      'Knowledge sharing through posts and articles',
      'Real-time messaging and notifications',
      'Gamification with badges and leaderboards',
      'Search and discovery features',
      'Mobile app support',
    ],
    link: '#',
    stats: [
      { label: 'Community Members', value: '50,000+' },
      { label: 'Posts Shared', value: '100,000+' },
      { label: 'Average Daily Active', value: '8,500+' },
    ],
  },
  {
    id: '5',
    title: 'Mobile Learning App',
    description: 'Cross-platform mobile app for on-the-go learning',
    longDescription:
      'A native mobile application enabling students to learn anytime, anywhere. Features offline access, push notifications, and seamless synchronization with the web platform.',
    category: 'Mobile App',
    image: 'https://images.unsplash.com/photo-1512941691920-25bef266e0a5?w=500',
    technologies: ['React Native', 'Firebase', 'Redux', 'Expo', 'Push Notifications'],
    features: [
      'iOS and Android compatibility',
      'Offline learning content access',
      'Push notifications for course updates',
      'Video streaming and caching',
      'Progress synchronization',
      'Personalized learning recommendations',
      'Biometric authentication',
    ],
    link: '#',
    stats: [
      { label: 'Downloads', value: '100K+' },
      { label: 'App Rating', value: '4.8/5' },
      { label: 'Daily Active Users', value: '15K+' },
    ],
  },
  {
    id: '6',
    title: 'Content Management System',
    description: 'Headless CMS for modern content delivery',
    longDescription:
      'A flexible, headless content management system designed for developers and content creators. Supports multi-channel content delivery with powerful APIs and a user-friendly interface.',
    category: 'CMS',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500',
    technologies: ['Next.js', 'PostgreSQL', 'GraphQL', 'AWS S3', 'Vercel'],
    features: [
      'Flexible content modeling',
      'Multi-channel publishing',
      'Version control and content history',
      'API-first architecture',
      'Rich media management',
      'Collaborative editing',
      'SEO optimization tools',
    ],
    link: '#',
    stats: [
      { label: 'Content Publishers', value: '500+' },
      { label: 'Published Content', value: '1M+' },
      { label: 'API Calls/Month', value: '10B+' },
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function PortfolioPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/20 to-transparent border-b border-border/20 py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">Our Portfolio</h1>
              <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
                Explore the innovative applications and platforms we&apos;ve built to transform digital education and business solutions
              </p>
            </motion.div>
          </div>
        </section>

        {/* Projects Section */}
        <section className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-12"
            >
              {PORTFOLIO_PROJECTS.map((project, index) => (
                <motion.div
                  key={project.id}
                  variants={itemVariants}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${index % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}
                >
                  {/* Image */}
                  <div className={`relative group ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-primary/10 rounded-lg blur-2xl transform group-hover:scale-110 transition-transform duration-500 opacity-0 group-hover:opacity-100" />
                    <div className="relative rounded-lg overflow-hidden border border-border/20 hover:border-primary/50 transition-all h-80 sm:h-96">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                    <div className="space-y-4 mb-6">
                      <div className="inline-block">
                        <span className="px-4 py-2 rounded-full text-sm font-semibold bg-primary/20 text-primary">
                          {project.category}
                        </span>
                      </div>
                      <h2 className="text-3xl sm:text-4xl font-bold text-foreground">{project.title}</h2>
                      <p className="text-lg text-foreground/70">{project.longDescription}</p>
                    </div>

                    {/* Features */}
                    <div className="mb-6">
                      <h3 className="font-bold text-foreground mb-3">Key Features</h3>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {project.features.slice(0, 4).map((feature, i) => (
                          <li key={i} className="flex items-start gap-2 text-foreground/80">
                            <span className="text-primary mt-1">✓</span>
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Technologies */}
                    <div className="mb-6">
                      <h3 className="font-bold text-foreground mb-3">Technologies Used</h3>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, i) => (
                          <span key={i} className="px-3 py-1 rounded-full text-xs font-medium bg-secondary text-foreground">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 py-6 border-y border-border/20 mb-6">
                      {project.stats.map((stat, i) => (
                        <div key={i} className="text-center">
                          <p className="text-2xl font-bold text-primary">{stat.value}</p>
                          <p className="text-xs text-foreground/70">{stat.label}</p>
                        </div>
                      ))}
                    </div>

                    {/* Links */}
                    <div className="flex gap-4">
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-semibold"
                        >
                          <FaExternalLinkAlt className="w-4 h-4" />
                          Visit Project
                        </a>
                      )}
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border bg-card text-foreground hover:bg-secondary transition-colors font-semibold"
                        >
                          <FaGithub className="w-4 h-4" />
                          View Code
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="border-t border-border/20 py-12 sm:py-16 bg-gradient-to-b from-primary/10 to-transparent">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Ready to Transform Your Business?
            </h2>
            <p className="text-lg text-foreground/70 mb-8">
              We build custom solutions tailored to your specific needs. Let&apos;s discuss your next project.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-semibold"
              >
                Get In Touch
                <FaArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/courses"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg border border-border bg-card text-foreground hover:bg-secondary transition-colors font-semibold"
              >
                <FaCode className="w-4 h-4" />
                Learn Our Tech Stack
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
