'use client';

import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  FaChevronLeft,
  FaDownload,
  FaCheckCircle,
  FaLock,
  FaSpinner,
  FaAward,
} from 'react-icons/fa';

interface Certificate {
  _id: string;
  certificateNumber: string;
  course: {
    _id: string;
    title: string;
    duration: number;
    instructor: {
      name: string;
    };
  };
  enrollment: {
    _id: string;
    progressPercentage: number;
    status: string;
    completedDays: number;
    totalClassDays: number;
  };
  issuedAt: string;
}

interface CompletedEnrollment {
  _id: string;
  course: {
    _id: string;
    title: string;
    duration: number;
    instructor: {
      name: string;
    };
  };
  progressPercentage: number;
  status: string;
  completedDays: number;
  totalClassDays: number;
  startDate: string;
  endDate: string;
}

export default function CertificatesPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [completedEnrollments, setCompletedEnrollments] = useState<CompletedEnrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      loadCertificates();
    }
  }, [isAuthenticated, router]);

  const loadCertificates = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      
      // Fetch certificates (only for completed courses)
      const certificatesRes = await fetch('/api/certificates/my-certificates', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (certificatesRes.ok) {
        const data = await certificatesRes.json();
        setCertificates(data);
      }

      // Fetch completed enrollments
      const enrollmentsRes = await fetch('/api/enrollments/completed', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (enrollmentsRes.ok) {
        const data = await enrollmentsRes.json();
        setCompletedEnrollments(data);
      }
    } catch (error) {
      console.error('Failed to load certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCertificate = async (certificate: Certificate) => {
    try {
      const element = document.getElementById(`certificate-${certificate._id}`);
      if (element) {
        // Dynamically import html2canvas and jsPDF at runtime to avoid SSR issues
        const html2canvas = (await import('html2canvas')).default;
        const { jsPDF: PDFClass } = await import('jspdf');
        
        const canvas = await html2canvas(element);
        
        const pdf = new PDFClass('landscape', 'mm', 'a4');
        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', 0, 0, 297, 210);
        pdf.save(`Certificate-${certificate.certificateNumber}.pdf`);
      }
    } catch (error) {
      console.error('Error downloading certificate:', error);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center">
          <FaSpinner className="w-8 h-8 animate-spin text-primary" />
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Header */}
        <section className="py-8 border-b border-border/20 bg-card">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6 w-fit"
            >
              <FaChevronLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <div className="flex items-center gap-3 mb-2">
              <FaAward className="w-8 h-8 text-yellow-500" />
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">My Certificates</h1>
            </div>
            <p className="text-foreground/70 mt-2">
              Certificates are issued only after completing your course. You must complete 100% of the course duration to receive your certificate.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {selectedCertificate ? (
              // Certificate Detail View
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                <button
                  onClick={() => setSelectedCertificate(null)}
                  className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                >
                  <FaChevronLeft className="w-4 h-4" />
                  Back to Certificates
                </button>

                {/* Certificate Preview */}
                <div
                  id={`certificate-${selectedCertificate._id}`}
                  className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20 rounded-lg border-4 border-yellow-600 p-12 text-center aspect-video flex flex-col items-center justify-center relative overflow-hidden"
                >
                  {/* Decorative elements */}
                  <div className="absolute top-4 left-4 text-6xl opacity-10">✦</div>
                  <div className="absolute bottom-4 right-4 text-6xl opacity-10">✦</div>

                  <div className="space-y-6 relative z-10">
                    <div className="text-yellow-700 dark:text-yellow-300">
                      <FaAward className="w-16 h-16 mx-auto mb-4" />
                    </div>

                    <div>
                      <h2 className="text-4xl font-bold text-yellow-900 dark:text-yellow-100 mb-2">
                        Certificate of Completion
                      </h2>
                      <p className="text-yellow-800 dark:text-yellow-200">
                        This is to certify that
                      </p>
                    </div>

                    <div>
                      <p className="text-3xl font-bold text-yellow-900 dark:text-yellow-100">
                        {user?.name}
                      </p>
                      <p className="text-yellow-800 dark:text-yellow-200 mt-2">
                        has successfully completed the course
                      </p>
                    </div>

                    <div>
                      <p className="text-2xl font-semibold text-yellow-900 dark:text-yellow-100">
                        {selectedCertificate.course.title}
                      </p>
                      <p className="text-yellow-800 dark:text-yellow-200">
                        Instructor: {selectedCertificate.course.instructor.name}
                      </p>
                    </div>

                    <div className="border-t-2 border-yellow-600 pt-4">
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        Certificate ID: {selectedCertificate.certificateNumber}
                      </p>
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        Issued: {new Date(selectedCertificate.issuedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Download Button */}
                <div className="flex justify-center">
                  <button
                    onClick={() => handleDownloadCertificate(selectedCertificate)}
                    className="flex items-center gap-2 px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    <FaDownload className="w-4 h-4" />
                    Download Certificate
                  </button>
                </div>
              </motion.div>
            ) : (
              // Certificates List
              <div className="space-y-8">
                {certificates.length > 0 ? (
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-6">
                      Completed Courses ({certificates.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {certificates.map((cert, index) => (
                        <motion.div
                          key={cert._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/30 p-6 hover:border-yellow-500/50 transition-all hover:shadow-lg cursor-pointer"
                          onClick={() => setSelectedCertificate(cert)}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <FaAward className="w-8 h-8 text-yellow-500" />
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 flex items-center gap-1">
                              <FaCheckCircle className="w-3 h-3" />
                              Completed
                            </span>
                          </div>

                          <h3 className="text-lg font-bold text-foreground mb-2">
                            {cert.course.title}
                          </h3>

                          <p className="text-sm text-foreground/70 mb-4">
                            Instructor: {cert.course.instructor.name}
                          </p>

                          <div className="space-y-2 mb-4">
                            <p className="text-xs text-foreground/60">
                              Certificate ID: {cert.certificateNumber}
                            </p>
                            <p className="text-xs text-foreground/60">
                              Issued: {new Date(cert.issuedAt).toLocaleDateString()}
                            </p>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCertificate(cert);
                            }}
                            className="w-full px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white transition-colors font-medium flex items-center justify-center gap-2 text-sm"
                          >
                            <FaDownload className="w-3 h-3" />
                            View & Download
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-card rounded-lg border border-border/20">
                    <FaLock className="w-12 h-12 text-foreground/30 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-foreground mb-2">No Certificates Yet</h2>
                    <p className="text-foreground/70 mb-6">
                      Complete a course to earn your certificate. You must finish 100% of the course duration.
                    </p>
                    <Link
                      href="/dashboard/my-courses"
                      className="inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
                    >
                      View My Courses
                    </Link>
                  </div>
                )}

                {/* Ongoing Courses Section */}
                {completedEnrollments.length === 0 && (
                  <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-2">
                      How to earn a certificate
                    </h3>
                    <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                      <li>1. Enroll in a course from our catalog</li>
                      <li>2. Complete all lessons and assignments</li>
                      <li>3. Achieve 100% course completion</li>
                      <li>4. Your certificate will be automatically issued</li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
