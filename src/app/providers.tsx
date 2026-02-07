'use client';

import type { User, Item } from '@/lib/types';
import React, { createContext, useState, useMemo, useEffect, useCallback } from 'react';
import { users, items as initialItems } from '@/lib/data';

// --- Auth Context ---
export interface AuthContextType {
  user: User | null;
  login: (email: string) => boolean;
  logout: () => void;
  isLoading: boolean;
  updateUser: (data: Partial<Pick<User, 'name' | 'avatarUrl' | 'avatarHint'>>) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);


// --- Items Context ---
export interface ItemsContextType {
    items: Item[];
    addItem: (item: Omit<Item, 'id' | 'reportedAt' | 'status' | 'imageHint'> & {imageUrl: string}) => void;
    updateItem: (item: Item) => void;
    deleteItem: (itemId: string) => void;
    getItem: (id: string) => Item | undefined;
}

export const ItemsContext = createContext<ItemsContextType | null>(null);


export function AppProviders({ children }: { children: React.ReactNode }) {
  // --- Auth State ---
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('campusfind-user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to parse user from localStorage', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (email: string): boolean => {
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('campusfind-user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('campusfind-user');
    localStorage.removeItem('campusfind-items'); // Clear items on logout
  };

  const updateUser = useCallback((data: Partial<Pick<User, 'name' | 'avatarUrl' | 'avatarHint'>>) => {
      setUser(currentUser => {
          if (!currentUser) return null;
          const updatedUser = { ...currentUser, ...data };
          localStorage.setItem('campusfind-user', JSON.stringify(updatedUser));
          return updatedUser;
      });
  }, []);

  const authContextValue = useMemo(() => ({
    user,
    login,
    logout,
    isLoading,
    updateUser
  }), [user, isLoading, updateUser]);

  // --- Items State ---
  const [items, setItems] = useState<Item[]>(initialItems);

  useEffect(() => {
    // On mount, check local storage for items
    if(!isLoading && user) {
        try {
          const storedItems = localStorage.getItem('campusfind-items');
          if (storedItems) {
            setItems(JSON.parse(storedItems));
          } else {
            // If nothing in local storage, use initial data and set it.
            localStorage.setItem('campusfind-items', JSON.stringify(initialItems));
            setItems(initialItems);
          }
        } catch (error) {
          console.error('Failed to parse items from localStorage', error);
          // Fallback to initial data if parsing fails
          setItems(initialItems);
          localStorage.setItem('campusfind-items', JSON.stringify(initialItems));
        }
    } else if(!isLoading && !user) {
        // If logged out, reset to initial data
        setItems(initialItems);
    }
  }, [isLoading, user]);

  // Persist items to local storage whenever they change
  useEffect(() => {
      if(!isLoading && user) {
        localStorage.setItem('campusfind-items', JSON.stringify(items));
      }
  }, [items, isLoading, user]);

  const addItem = useCallback((itemData: Omit<Item, 'id' | 'reportedAt' | 'status' | 'imageHint'> & {imageUrl: string}) => {
      const newItem: Item = {
          ...itemData,
          id: `item-${Date.now()}`,
          reportedAt: new Date().toISOString(),
          status: 'open',
          imageHint: 'user uploaded image'
      };
      setItems(prevItems => [newItem, ...prevItems]);
  }, []);

  const updateItem = useCallback((updatedItem: Item) => {
      setItems(prevItems => prevItems.map(item => item.id === updatedItem.id ? updatedItem : item));
  }, []);

  const deleteItem = useCallback((itemId: string) => {
      setItems(prevItems => prevItems.filter(item => item.id !== itemId));
  }, []);
    
  const getItem = useCallback((id: string) => {
    return items.find(i => i.id === id);
  }, [items]);

  const itemsContextValue = useMemo(() => ({
      items,
      addItem,
      updateItem,
      deleteItem,
      getItem,
  }), [items, addItem, updateItem, deleteItem, getItem]);

  return (
    <AuthContext.Provider value={authContextValue}>
      <ItemsContext.Provider value={itemsContextValue}>
        {!isLoading && children}
      </ItemsContext.Provider>
    </AuthContext.Provider>
  );
}
