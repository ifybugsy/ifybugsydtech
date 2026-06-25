'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const slides = [
  {
    id: 1,
    title: 'Master Digital Skills',
    description: 'Learn from industry experts and advance your career with our comprehensive courses.',
    cta: 'Explore Courses',
    image: 'linear-gradient(135deg, #00cfc8 0%, #00a89a 100%)',
  },
  {
    id: 2,
    title: 'Premium Tech Products',
    description: 'Get the best laptops, phones, and accessories at competitive prices.',
    cta: 'Shop Now',
    image: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
  },
  {
    id: 3,
    title: 'Community & Support',
    description: 'Join thousands of learners achieving their goals with world-class education.',
    cta: 'Get Started',
    image: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
  },
];

export const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const slide = slides[currentSlide];

  return (
    <section className="relative w-full h-screen min-h-[500px] md:min-h-[600px] overflow-hidden bg-background">
      {/* Slides */}
      {slides.map((s, index) => (
        <motion.div
          key={s.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: index === currentSlide ? 1 : 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
          style={{
            background: s.image,
            pointerEvents: index === currentSlide ? 'auto' : 'none',
          }}
        />
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8">
        <motion.div
          key={`content-${currentSlide}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            {slide.title}
          </h1>
          <p className="text-lg sm:text-xl text-white/90 mb-8">
            {slide.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={slide.id === 1 ? '/courses' : slide.id === 2 ? '/shop' : '/register'}
              className="px-8 py-3 bg-white text-foreground font-semibold rounded-lg hover:bg-white/90 transition-colors"
            >
              {slide.cta}
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Navigation */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentSlide ? 'bg-white w-8' : 'bg-white/40 w-2'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
        aria-label="Previous slide"
      >
        <FaChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
        aria-label="Next slide"
      >
        <FaChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
      </button>
    </section>
  );
};
