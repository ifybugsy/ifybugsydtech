'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

interface ProtectedLayoutProps {
  children: ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'student') {
      router.push('/login');
    }
  }, [isAuthenticated, user?.role, router]);

  if (!isAuthenticated || user?.role !== 'student') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-foreground/70">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
