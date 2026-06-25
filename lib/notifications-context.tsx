'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useSocket } from './socket-context';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
}

interface NotificationsContextType {
  notifications: Notification[];
  addNotification: (
    type: Notification['type'],
    title: string,
    message: string
  ) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  clearAll: () => void;
  unreadCount: number;
}

const NotificationsContext = createContext<
  NotificationsContextType | undefined
>(undefined);

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { socket, isConnected } = useSocket();

  // Listen for real-time notifications from backend
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleNotification = (data: any) => {
      addNotification(data.type, data.title, data.message);
    };

    socket.on('notification', handleNotification);
    socket.on('community-post-created', () => {
      addNotification('info', 'New Post', 'A new discussion post has been created');
    });
    socket.on('order-created', () => {
      addNotification('success', 'Order Created', 'Your order has been successfully created');
    });
    socket.on('order-status-updated', (data) => {
      addNotification('info', 'Order Update', `Your order status: ${data.status}`);
    });
    socket.on('course-enrollment-confirmed', () => {
      addNotification('success', 'Enrollment', 'You have successfully enrolled in the course');
    });
    socket.on('course-completion', () => {
      addNotification('success', 'Milestone', 'You have completed a course milestone');
    });

    return () => {
      socket.off('notification', handleNotification);
      socket.off('community-post-created');
      socket.off('order-created');
      socket.off('order-status-updated');
      socket.off('course-enrollment-confirmed');
      socket.off('course-completion');
    };
  }, [socket, isConnected]);

  const addNotification = useCallback(
    (type: Notification['type'], title: string, message: string) => {
      const id = `notif-${Date.now()}`;
      const notification: Notification = {
        id,
        type,
        title,
        message,
        timestamp: Date.now(),
        read: false,
      };

      setNotifications((prev) => [notification, ...prev]);

      // Auto-remove notification after 5 seconds (for non-error types)
      if (type !== 'error') {
        setTimeout(() => {
          removeNotification(id);
        }, 5000);
      }
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        markAsRead,
        clearAll,
        unreadCount,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationsProvider');
  }
  return context;
};
