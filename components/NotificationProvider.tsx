'use client';

import { ReactNode } from 'react';
import { useNotification } from '@/hooks/useNotification';
import Notification from '@/components/Notification';

export default function NotificationProvider({ children }: { children: ReactNode }) {
  const { notifications, removeNotification } = useNotification();

  return (
    <>
      {children}
      
      {/* عرض جميع الإشعارات */}
      <div className="fixed top-4 right-4 z-[9999] space-y-2">
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            message={notification.message}
            type={notification.type}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>
    </>
  );
}
