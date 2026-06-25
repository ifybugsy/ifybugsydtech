'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/lib/auth-context';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaChevronLeft, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaLock, FaCamera } from 'react-icons/fa';

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    // In a real app, this would save to the backend
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Header */}
        <section className="py-8 border-b border-border/20 bg-card">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6 w-fit"
            >
              <FaChevronLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Profile Settings</h1>
            <p className="text-foreground/70 mt-2">Manage your account information and preferences</p>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Profile Card */}
              <div className="rounded-lg bg-card border border-border/20 p-8 mb-8">
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">Account Information</h2>
                    <p className="text-foreground/70">Your personal details and account settings</p>
                  </div>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                  >
                    {isEditing ? 'Cancel' : 'Edit'}
                  </button>
                </div>

                {/* Profile Picture */}
                <div className="mb-8 flex items-center gap-6">
                  <div className="relative">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt={formData.name}
                        className="w-24 h-24 rounded-full object-cover border-4 border-primary/20"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center border-4 border-primary/20">
                        <FaUser className="w-10 h-10 text-primary/60" />
                      </div>
                    )}
                    {isEditing && (
                      <label className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-primary/90 transition-colors">
                        <FaCamera className="w-4 h-4" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  <div>
                    <p className="text-foreground font-semibold mb-1">{formData.name}</p>
                    <p className="text-foreground/60 text-sm">{user?.role}</p>
                    <p className="text-foreground/60 text-sm mt-2">{formData.email}</p>
                  </div>
                </div>

                {/* Profile Info */}
                <div className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="flex items-center gap-2 text-foreground/70 text-sm font-medium mb-2">
                      <FaUser className="w-4 h-4" />
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    ) : (
                      <p className="text-lg font-semibold text-foreground">{formData.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="flex items-center gap-2 text-foreground/70 text-sm font-medium mb-2">
                      <FaEnvelope className="w-4 h-4" />
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    ) : (
                      <p className="text-lg font-semibold text-foreground">{formData.email}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="flex items-center gap-2 text-foreground/70 text-sm font-medium mb-2">
                      <FaPhone className="w-4 h-4" />
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    ) : (
                      <p className="text-lg font-semibold text-foreground">{formData.phone}</p>
                    )}
                  </div>

                  {/* Address */}
                  <div>
                    <label className="flex items-center gap-2 text-foreground/70 text-sm font-medium mb-2">
                      <FaMapMarkerAlt className="w-4 h-4" />
                      Address (Optional)
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Your address"
                        className="w-full px-4 py-2 rounded-lg bg-secondary border border-border text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    ) : (
                      <p className="text-lg font-semibold text-foreground">
                        {formData.address || 'Not provided'}
                      </p>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <button
                    onClick={handleSave}
                    className="w-full mt-8 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
                  >
                    Save Changes
                  </button>
                )}
              </div>

              {/* Security */}
              <div className="rounded-lg bg-card border border-border/20 p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <FaLock className="w-6 h-6" />
                  Security
                </h2>

                <button className="w-full px-4 py-3 border border-border text-foreground rounded-lg hover:bg-secondary transition-colors font-medium text-left flex items-center justify-between group">
                  <span>Change Password</span>
                  <span className="text-foreground/40 group-hover:text-foreground/60">→</span>
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
