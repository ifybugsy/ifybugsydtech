'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Testimonial } from '@/types/index';
import { TESTIMONIALS } from './mockData';

interface TestimonialsContextType {
  testimonials: Testimonial[];
  addTestimonial: (testimonial: Omit<Testimonial, 'id' | 'createdAt' | 'status'>) => void;
  approveTestimonial: (id: string) => void;
  rejectTestimonial: (id: string) => void;
  deleteTestimonial: (id: string) => void;
  getApprovedTestimonials: () => Testimonial[];
}

const TestimonialsContext = createContext<TestimonialsContextType | undefined>(undefined);

export const TestimonialsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(TESTIMONIALS);

  const addTestimonial = useCallback((testimonial: Omit<Testimonial, 'id' | 'createdAt' | 'status'>) => {
    const newTestimonial: Testimonial = {
      ...testimonial,
      id: `test-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'pending',
    };
    setTestimonials(prev => [newTestimonial, ...prev]);
  }, []);

  const approveTestimonial = useCallback((id: string) => {
    setTestimonials(prev =>
      prev.map(t => (t.id === id ? { ...t, status: 'approved' } : t))
    );
  }, []);

  const rejectTestimonial = useCallback((id: string) => {
    setTestimonials(prev =>
      prev.map(t => (t.id === id ? { ...t, status: 'rejected' } : t))
    );
  }, []);

  const deleteTestimonial = useCallback((id: string) => {
    setTestimonials(prev => prev.filter(t => t.id !== id));
  }, []);

  const getApprovedTestimonials = useCallback(() => {
    return testimonials.filter(t => t.status === 'approved');
  }, [testimonials]);

  return (
    <TestimonialsContext.Provider
      value={{
        testimonials,
        addTestimonial,
        approveTestimonial,
        rejectTestimonial,
        deleteTestimonial,
        getApprovedTestimonials,
      }}
    >
      {children}
    </TestimonialsContext.Provider>
  );
};

export const useTestimonials = () => {
  const context = useContext(TestimonialsContext);
  if (!context) {
    throw new Error('useTestimonials must be used within TestimonialsProvider');
  }
  return context;
};
