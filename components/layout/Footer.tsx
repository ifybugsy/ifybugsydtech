'use client';

import Link from 'next/link';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="mb-4">
              <img 
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Ifybugsy_Logo_I-removebg-preview-5qm2JA30ii98ZvwJ7DHxszyBR58FTQ.png" 
                alt="Ifybugsy Logo" 
                className="h-60 w-auto"
              />
            </div>
            <p className="text-foreground/60 text-sm mb-4">
              Empowering learners with world-class digital education and technology solutions.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-foreground/60 hover:text-primary transition-colors"
              >
                <FaFacebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-foreground/60 hover:text-primary transition-colors"
              >
                <FaTwitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-foreground/60 hover:text-primary transition-colors"
              >
                <FaLinkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-foreground/60 hover:text-primary transition-colors"
              >
                <FaInstagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/courses" className="text-foreground/60 hover:text-primary transition-colors">
                  All Courses
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-foreground/60 hover:text-primary transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-foreground/60 hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-foreground/60 hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="text-foreground/60 hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-foreground/60 hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className="text-foreground/60 hover:text-primary transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#" className="text-foreground/60 hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <FaEnvelope className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-foreground/60">contact@ifybugsy.com</span>
              </li>
              <li className="flex items-start gap-2">
                <FaPhone className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-foreground/60">+234 (0) 800 000 0000</span>
              </li>
              <li className="flex items-start gap-2">
                <FaMapMarkerAlt className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-foreground/60">Lagos, Nigeria</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border/20 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-foreground/60 text-sm">
              © {currentYear} Ifybugsy Digital Technologies. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="#" className="text-foreground/60 hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-foreground/60 hover:text-primary transition-colors">
                Terms of Use
              </Link>
              <Link href="#" className="text-foreground/60 hover:text-primary transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
