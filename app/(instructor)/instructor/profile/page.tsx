'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/lib/auth-context';
import { useNotifications } from '@/lib/notifications-context';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaCamera, FaTrash, FaPlus, FaGithub, FaLinkedin, FaTwitter, FaFacebook, FaInstagram, FaGlobe, FaYoutube } from 'react-icons/fa';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  bio: string;
  profileImage: string;
  skills: string[];
  experience: string;
  certifications: Array<{
    name: string;
    issuer: string;
    date: string;
  }>;
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
    portfolio?: string;
    youtube?: string;
  };
}

export default function InstructorProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const { addNotification } = useNotifications();
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [newCert, setNewCert] = useState({ name: '', issuer: '', date: '' });

  const [formData, setFormData] = useState<ProfileData>({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    profileImage: user?.profileImage || '',
    skills: ['React', 'Node.js', 'MongoDB'],
    experience: '5 years in Full Stack Development',
    certifications: [
      { name: 'AWS Solutions Architect', issuer: 'Amazon', date: '2022' },
    ],
    socialLinks: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      portfolio: 'https://portfolio.com',
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSocialChange = (platform: string, value: string) => {
    setFormData({
      ...formData,
      socialLinks: {
        ...formData.socialLinks,
        [platform]: value,
      },
    });
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill],
      });
      setNewSkill('');
      addNotification('Skill added', 'success');
    }
  };

  const handleRemoveSkill = (index: number) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((_, i) => i !== index),
    });
  };

  const handleAddCertification = () => {
    if (newCert.name && newCert.issuer && newCert.date) {
      setFormData({
        ...formData,
        certifications: [...formData.certifications, newCert],
      });
      setNewCert({ name: '', issuer: '', date: '' });
      addNotification('Certification added', 'success');
    }
  };

  const handleRemoveCertification = (index: number) => {
    setFormData({
      ...formData,
      certifications: formData.certifications.filter((_, i) => i !== index),
    });
  };

  const handleSaveProfile = () => {
    addNotification('Profile updated successfully', 'success');
    setIsEditing(false);
  };

  const socialPlatforms = [
    { key: 'github', label: 'GitHub', icon: FaGithub },
    { key: 'linkedin', label: 'LinkedIn', icon: FaLinkedin },
    { key: 'twitter', label: 'Twitter', icon: FaTwitter },
    { key: 'facebook', label: 'Facebook', icon: FaFacebook },
    { key: 'instagram', label: 'Instagram', icon: FaInstagram },
    { key: 'portfolio', label: 'Portfolio', icon: FaGlobe },
    { key: 'youtube', label: 'YouTube', icon: FaYoutube },
  ];

  if (!isAuthenticated || user?.role !== 'instructor') {
    return null;
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Header */}
        <section className="py-8 border-b border-border/20 bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link
                  href="/instructor"
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  <FaArrowLeft className="w-5 h-5 text-foreground" />
                </Link>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
                  <p className="text-foreground/70">Manage your instructor profile and information</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  isEditing
                    ? 'bg-secondary text-foreground hover:bg-secondary/80'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                }`}
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Profile Picture Section */}
              <div className="bg-card border border-border/20 rounded-xl p-6">
                <h2 className="text-xl font-bold text-foreground mb-4">Profile Picture</h2>
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    {formData.profileImage ? (
                      <img
                        src={formData.profileImage}
                        alt="Profile"
                        className="w-full h-full rounded-lg object-cover"
                      />
                    ) : (
                      <FaCamera className="w-12 h-12 text-primary/50" />
                    )}
                  </div>
                  {isEditing && (
                    <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium">
                      Upload Photo
                    </button>
                  )}
                </div>
              </div>

              {/* Personal Information */}
              <div className="bg-card border border-border/20 rounded-xl p-6">
                <h2 className="text-xl font-bold text-foreground mb-4">Personal Information</h2>
                <div className="space-y-4">
                  {[
                    { label: 'Full Name', name: 'name' },
                    { label: 'Email', name: 'email', type: 'email' },
                    { label: 'Phone', name: 'phone' },
                  ].map((field) => (
                    <div key={field.name}>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        {field.label}
                      </label>
                      {isEditing ? (
                        <input
                          type={field.type || 'text'}
                          name={field.name}
                          value={formData[field.name as keyof ProfileData] as string}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      ) : (
                        <p className="text-foreground/70">
                          {formData[field.name as keyof ProfileData] as string}
                        </p>
                      )}
                    </div>
                  ))}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Bio</label>
                    {isEditing ? (
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    ) : (
                      <p className="text-foreground/70">{formData.bio}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="bg-card border border-border/20 rounded-xl p-6">
                <h2 className="text-xl font-bold text-foreground mb-4">Professional Information</h2>

                {/* Experience */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Years of Experience
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  ) : (
                    <p className="text-foreground/70">{formData.experience}</p>
                  )}
                </div>

                {/* Skills */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-foreground mb-3">Skills</label>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {formData.skills.map((skill, i) => (
                      <div
                        key={i}
                        className="px-4 py-2 bg-primary/20 text-primary rounded-lg text-sm font-medium flex items-center gap-2"
                      >
                        {skill}
                        {isEditing && (
                          <button
                            onClick={() => handleRemoveSkill(i)}
                            className="text-primary hover:text-red-500 transition-colors"
                          >
                            <FaTrash className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  {isEditing && (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="Add new skill..."
                        className="flex-1 px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <button
                        onClick={handleAddSkill}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        <FaPlus className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Certifications */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Certifications
                  </label>
                  <div className="space-y-2 mb-4">
                    {formData.certifications.map((cert, i) => (
                      <div
                        key={i}
                        className="p-3 bg-secondary/50 border border-border/20 rounded-lg flex items-center justify-between"
                      >
                        <div>
                          <p className="font-medium text-foreground">{cert.name}</p>
                          <p className="text-sm text-foreground/60">
                            {cert.issuer} • {cert.date}
                          </p>
                        </div>
                        {isEditing && (
                          <button
                            onClick={() => handleRemoveCertification(i)}
                            className="text-foreground/60 hover:text-red-500 transition-colors"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  {isEditing && (
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={newCert.name}
                        onChange={(e) =>
                          setNewCert({ ...newCert, name: e.target.value })
                        }
                        placeholder="Certification name"
                        className="px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <input
                        type="text"
                        value={newCert.issuer}
                        onChange={(e) =>
                          setNewCert({ ...newCert, issuer: e.target.value })
                        }
                        placeholder="Issuer"
                        className="px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newCert.date}
                          onChange={(e) =>
                            setNewCert({ ...newCert, date: e.target.value })
                          }
                          placeholder="Year"
                          className="flex-1 px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <button
                          onClick={handleAddCertification}
                          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                        >
                          <FaPlus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Social Links */}
              <div className="bg-card border border-border/20 rounded-xl p-6">
                <h2 className="text-xl font-bold text-foreground mb-4">Social Links</h2>
                <div className="space-y-4">
                  {socialPlatforms.map(({ key, label, icon: Icon }) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        {label}
                      </label>
                      {isEditing ? (
                        <input
                          type="url"
                          value={formData.socialLinks[key as keyof typeof formData.socialLinks] || ''}
                          onChange={(e) => handleSocialChange(key, e.target.value)}
                          placeholder={`https://${key}.com/yourprofile`}
                          className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      ) : formData.socialLinks[key as keyof typeof formData.socialLinks] ? (
                        <Link
                          href={formData.socialLinks[key as keyof typeof formData.socialLinks] || '#'}
                          target="_blank"
                          className="text-primary hover:underline"
                        >
                          {formData.socialLinks[key as keyof typeof formData.socialLinks]}
                        </Link>
                      ) : (
                        <p className="text-foreground/50">Not provided</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Save Button */}
              {isEditing && (
                <button
                  onClick={handleSaveProfile}
                  className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  Save Changes
                </button>
              )}
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
