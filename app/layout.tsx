'use client';

import { Analytics } from '@vercel/analytics/next';
import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { AuthProvider } from '@/lib/auth-context';
import { CartProvider } from '@/lib/cart-context';
import { WishlistProvider } from '@/lib/wishlist-context';
import { TestimonialsProvider } from '@/lib/testimonials-context';
import { SocketProvider } from '@/lib/socket-context';
import { NotificationsProvider } from '@/lib/notifications-context';
import { ThemeProvider } from '@/lib/theme-context';
import NotificationToast from '@/components/NotificationToast';
import './globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

function ClientLayout({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <html
      lang="en"
      className={`bg-background ${geistSans.variable} ${geistMono.variable}`}
    >
      <head>
        <link rel="icon" href="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Ifybugsy_Logo_I-removebg-preview-k2hmHcsgESeqfwrIGVfB71PGSGOeJ9.png" type="image/png" />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <SocketProvider>
                  <NotificationsProvider>
                    <TestimonialsProvider>
                      {children}
                      <NotificationToast />
                      {process.env.NODE_ENV === 'production' && <Analytics />}
                    </TestimonialsProvider>
                  </NotificationsProvider>
                </SocketProvider>
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

export default ClientLayout;
