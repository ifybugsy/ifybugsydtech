'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FaArrowLeft, FaEnvelope } from 'react-icons/fa';

export default function InstructorMessagesPage() {
  const [messages] = useState([
    { id: '1', from: 'John Doe', subject: 'Question about React hooks', time: '2 hours ago', read: false },
    { id: '2', from: 'Jane Smith', subject: 'Course feedback', time: '5 hours ago', read: true },
  ]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <section className="py-8 border-b border-border/20 bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              <Link href="/instructor" className="p-2 hover:bg-secondary rounded-lg">
                <FaArrowLeft className="w-5 h-5 text-foreground" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Messages</h1>
                <p className="text-foreground/70">Communicate with your students</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="bg-card border border-border/20 rounded-xl overflow-hidden">
              {messages.map((msg) => (
                <Link
                  key={msg.id}
                  href={`/instructor/messages/${msg.id}`}
                  className={`block p-4 border-b border-border/20 hover:bg-secondary/30 transition-colors cursor-pointer last:border-b-0 ${
                    !msg.read ? 'bg-primary/5' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3 flex-1">
                      <FaEnvelope className={`w-5 h-5 ${msg.read ? 'text-foreground/50' : 'text-primary'}`} />
                      <h3 className={`font-medium ${msg.read ? 'text-foreground/70' : 'text-foreground font-bold'}`}>
                        {msg.from}
                      </h3>
                    </div>
                    <span className="text-xs text-foreground/50">{msg.time}</span>
                  </div>
                  <p className="text-sm text-foreground/60 ml-8">{msg.subject}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
