'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useCart } from '@/lib/cart-context';
import { FaBars, FaTimes, FaSun, FaMoon, FaSignOutAlt } from 'react-icons/fa';
import { useEffect } from 'react';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { cart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setIsDark(savedTheme === 'dark');
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const toggleDarkMode = () => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);
    const theme = newDarkMode ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', newDarkMode);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const navLinks = [
    { href: '/courses', label: 'Courses' },
    { href: '/shop', label: 'Tech Store (Coming Soon)' },
    { href: '/community', label: 'Community' },
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/about', label: 'About' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-2 sm:py-2.5 md:py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <img 
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Ifybugsy_Logo_I-removebg-preview-k2hmHcsgESeqfwrIGVfB71PGSGOeJ9.png" 
              alt="Ifybugsy Logo" 
              className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-foreground/80 hover:text-primary transition-colors text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-secondary transition-colors duration-200"
              aria-label="Toggle dark mode"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? (
                <FaSun className="w-5 h-5 text-primary transition-transform duration-200" />
              ) : (
                <FaMoon className="w-5 h-5 text-foreground/60 transition-transform duration-200" />
              )}
            </button>

            {/* Auth Buttons - Desktop */}
            {!isAuthenticated ? (
              <div className="hidden sm:flex gap-3 items-center">
                <div className="relative group">
                  <button className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center gap-1">
                    Sign In
                    <span className="text-xs">▼</span>
                  </button>
                  <div className="absolute right-0 mt-0 w-48 bg-background border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    <Link
                      href="/login"
                      className="block px-4 py-3 text-sm font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-colors border-b border-border/20 first:rounded-t-lg"
                    >
                      Student Login
                    </Link>
                    <Link
                      href="/instructor-login"
                      className="block px-4 py-3 text-sm font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-colors last:rounded-b-lg"
                    >
                      Instructor Login
                    </Link>
                  </div>
                </div>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="hidden sm:flex gap-3 items-center">
                <span className="text-sm font-medium text-foreground/80">
                  {user?.name}
                </span>
                {user?.role === 'student' && (
                  <Link
                    href="/dashboard"
                    className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Dashboard
                  </Link>
                )}
                {user?.role === 'instructor' && (
                  <Link
                    href="/instructor"
                    className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Instructor
                  </Link>
                )}
                {user?.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="p-2 text-foreground/60 hover:text-foreground transition-colors"
                  aria-label="Logout"
                >
                  <FaSignOutAlt className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <FaTimes className="w-5 h-5 text-foreground transition-transform duration-200" />
              ) : (
                <FaBars className="w-5 h-5 text-foreground transition-transform duration-200" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-border/20">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-0 py-3 text-foreground/80 hover:text-primary transition-colors text-sm font-medium border-b border-border/10"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {!isAuthenticated ? (
              <div className="flex flex-col gap-2 mt-4 sm:hidden">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-center text-foreground hover:text-primary transition-colors border border-border rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Student Login
                </Link>
                <Link
                  href="/instructor-login"
                  className="px-4 py-2 text-sm font-medium text-center text-foreground hover:text-primary transition-colors border border-border rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Instructor Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-medium text-center bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="sm:hidden mt-4 space-y-2">
                <div className="px-0 py-3 text-sm font-medium text-foreground/80">
                  {user?.name}
                </div>
                {user?.role === 'student' && (
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                )}
                {user?.role === 'instructor' && (
                  <Link
                    href="/instructor"
                    className="block px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Instructor
                  </Link>
                )}
                {user?.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="block px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors border border-border rounded-lg text-left flex items-center gap-2"
                >
                  <FaSignOutAlt className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
