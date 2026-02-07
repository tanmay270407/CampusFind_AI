'use client';
import { useContext } from 'react';
import { NotificationsContext, type NotificationsContextType } from '@/app/providers';

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (context === null) {
    throw new Error('useNotifications must be used within an AppProviders');
  }
  return context;
};
