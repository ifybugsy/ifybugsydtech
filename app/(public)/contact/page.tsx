'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <section className="py-16 sm:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">Contact Us</h1>
            <p className="text-lg text-foreground/70 mb-12">
              Have questions? We&apos;d love to hear from you. Get in touch with us today.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div className="bg-card border border-border/20 rounded-lg p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Send us a Message</h2>
                {submitted && (
                  <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 text-green-700 rounded-lg">
                    Thank you for your message! We&apos;ll get back to you soon.
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg bg-secondary border border-border text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg bg-secondary border border-border text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                  <textarea
                    name="message"
                    placeholder="Your Message"
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg bg-secondary border border-border text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
                  >
                    Send Message
                  </button>
                </form>
              </div>

              {/* Contact Info */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6">Get in Touch</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Email</h3>
                    <a href="mailto:contact@ifybugsy.com" className="text-primary hover:underline">
                      contact@ifybugsy.com
                    </a>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Phone</h3>
                    <a href="tel:+2348000000000" className="text-primary hover:underline">
                      +234 (0) 800 000 0000
                    </a>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Address</h3>
                    <p className="text-foreground/70">Lagos, Nigeria</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Business Hours</h3>
                    <p className="text-foreground/70">Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p className="text-foreground/70">Saturday: 10:00 AM - 4:00 PM</p>
                    <p className="text-foreground/70">Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
