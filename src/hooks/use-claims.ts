'use client';
import { useContext } from 'react';
import { ClaimsContext, type ClaimsContextType } from '@/app/providers';

export const useClaims = () => {
  const context = useContext(ClaimsContext);
  if (context === null) {
    throw new Error('useClaims must be used within an AppProviders');
  }
  return context;
};
