'use client';

import { useState, useCallback } from 'react';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface Notification {
  id: number;
  message: string;
  type: NotificationType;
}

export function useNotification() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = useCallback((message: string, type: NotificationType = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    
    // إزالة الإشعار بعد 3 ثوانٍ
    setTimeout(() => {
      setNotifications(prev => prev.filter(notification => notification.id !== id));
    }, 3000);
  }, []);

  const removeNotification = useCallback((id: number) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  return {
    notifications,
    showNotification,
    removeNotification,
  };
}
