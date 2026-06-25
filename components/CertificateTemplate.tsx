'use client';

import React from 'react';
import { Certificate } from '@/types/index';

interface CertificateTemplateProps {
  certificate: Certificate;
  printMode?: boolean;
}

export const CertificateTemplate: React.FC<CertificateTemplateProps> = ({
  certificate,
  printMode = false,
}) => {
  return (
    <div
      ref={(el) => {
        if (printMode && el) {
          window.print();
        }
      }}
      className="w-full max-w-4xl mx-auto bg-white text-gray-900"
      style={{
        aspectRatio: '4/3',
        padding: '40px',
        border: printMode ? 'none' : '2px solid #d4a574',
      }}
    >
      {/* Certificate Background Pattern */}
      <div className="relative h-full flex flex-col items-center justify-center">
        {/* Decorative borders */}
        <div className="absolute inset-0 border-8 border-double" style={{ borderColor: '#d4a574' }} />
        <div className="absolute inset-4 border-2" style={{ borderColor: '#d4a574' }} />

        {/* Certificate Content */}
        <div className="relative z-10 text-center space-y-6">
          {/* Logo/Header */}
          <div className="mb-8">
            <img 
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Ifybugsy_Logo_I-removebg-preview-5qm2JA30ii98ZvwJ7DHxszyBR58FTQ.png" 
              alt="Ifybugsy Logo" 
              className="h-20 w-auto mx-auto"
            />
          </div>

          {/* Certificate Title */}
          <div className="mb-8">
            <p className="text-sm tracking-widest mb-2">THIS IS TO CERTIFY THAT</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{certificate.studentName}</h2>
            <p className="text-sm tracking-widest">HAS SUCCESSFULLY COMPLETED</p>
          </div>

          {/* Course Information */}
          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-2">{certificate.courseName}</h3>
            <div className="flex justify-center gap-8 text-sm">
              <div>
                <p className="text-xs tracking-widest mb-1">DURATION</p>
                <p className="font-semibold">{certificate.courseDuration} Days</p>
              </div>
              <div>
                <p className="text-xs tracking-widest mb-1">CERTIFICATE NO.</p>
                <p className="font-semibold">{certificate.certificateNumber}</p>
              </div>
            </div>
          </div>

          {/* Signature & Date */}
          <div className="mt-12 flex justify-between">
            <div className="w-40 text-center">
              <div className="border-t border-gray-400 mb-2" />
              <p className="text-sm">Instructor</p>
              <p className="text-xs font-semibold">{certificate.instructorName}</p>
            </div>
            <div className="w-40 text-center">
              <p className="text-sm mb-2">{new Date(certificate.issuedAt).toLocaleDateString()}</p>
              <div className="border-t border-gray-400" />
              <p className="text-sm">Date Issued</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
