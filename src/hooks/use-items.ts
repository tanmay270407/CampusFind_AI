'use client';
import { useContext } from 'react';
import { ItemsContext, type ItemsContextType } from '@/app/providers';

export const useItems = () => {
  const context = useContext(ItemsContext);
  if (context === null) {
    throw new Error('useItems must be used within an AppProviders');
  }
  return context;
};
