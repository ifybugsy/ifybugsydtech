'use client';

import React from 'react';
import { useNotifications } from '@/lib/notifications-context';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaCheckCircle, FaInfoCircle, FaExclamationTriangle, FaTimesCircle } from 'react-icons/fa';

const NotificationToast: React.FC = () => {
  const { notifications, removeNotification } = useNotifications();

  const getIconAndColor = (type: string) => {
    switch (type) {
      case 'success':
        return { Icon: FaCheckCircle, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' };
      case 'error':
        return { Icon: FaTimesCircle, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' };
      case 'warning':
        return { Icon: FaExclamationTriangle, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20' };
      default:
        return { Icon: FaInfoCircle, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' };
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md space-y-3 pointer-events-none">
      <AnimatePresence>
        {notifications.map((notification) => {
          const { Icon, color, bg } = getIconAndColor(notification.type);

          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20, x: 20 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, y: -20, x: 20 }}
              transition={{ duration: 0.3 }}
              className={`${bg} border border-border rounded-lg p-4 shadow-lg flex items-start gap-3 pointer-events-auto`}
            >
              <Icon className={`${color} w-5 h-5 mt-0.5 flex-shrink-0`} />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground text-sm">{notification.title}</p>
                <p className="text-foreground/70 text-sm mt-1">{notification.message}</p>
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className="text-foreground/50 hover:text-foreground flex-shrink-0 ml-2"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default NotificationToast;
