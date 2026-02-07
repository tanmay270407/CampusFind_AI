'use client';

import type { User, Item, Notification, Claim } from '@/lib/types';
import React, { createContext, useState, useMemo, useEffect, useCallback } from 'react';
import { users, items as initialItems, notifications as initialNotifications, claims as initialClaims } from '@/lib/data';
import { findSimilarItems } from '@/ai/flows/find-similar-items';

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

// --- Notifications Context ---
export interface NotificationsContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  unreadCount: number;
}
export const NotificationsContext = createContext<NotificationsContextType | null>(null);

// --- Claims Context ---
export interface ClaimsContextType {
  claims: Claim[];
  addClaim: (claim: Omit<Claim, 'id' | 'claimDate'>) => void;
  approveClaim: (claimId: string) => void;
  rejectClaim: (claimId: string) => void;
}
export const ClaimsContext = createContext<ClaimsContextType | null>(null);


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
    localStorage.removeItem('campusfind-items-v2');
    localStorage.removeItem('campusfind-notifications-v2');
    localStorage.removeItem('campusfind-claims-v2');
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
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    if(!isLoading && user) {
        try {
          const storedItems = localStorage.getItem('campusfind-items-v2');
          if (storedItems) {
            setItems(JSON.parse(storedItems));
          } else {
            localStorage.setItem('campusfind-items-v2', JSON.stringify(initialItems));
            setItems(initialItems);
          }
        } catch (error) {
          console.error('Failed to parse items from localStorage', error);
          setItems(initialItems);
          localStorage.setItem('campusfind-items-v2', JSON.stringify(initialItems));
        }
    } else if(!isLoading && !user) {
        setItems(initialItems);
    }
  }, [isLoading, user]);

  useEffect(() => {
      if(!isLoading && user) {
        localStorage.setItem('campusfind-items-v2', JSON.stringify(items));
      }
  }, [items, isLoading, user]);
  
    // --- Notifications State ---
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  useEffect(() => {
    if(!isLoading && user) {
        try {
          const storedNotifications = localStorage.getItem('campusfind-notifications-v2');
          if (storedNotifications) {
            setNotifications(JSON.parse(storedNotifications));
          } else {
            const userNotifications = initialNotifications.filter(n => n.userId === user.id);
            localStorage.setItem('campusfind-notifications-v2', JSON.stringify(userNotifications));
            setNotifications(userNotifications);
          }
        } catch (error) {
          console.error('Failed to parse notifications from localStorage', error);
          const userNotifications = initialNotifications.filter(n => n.userId === user.id);
          setNotifications(userNotifications);
          localStorage.setItem('campusfind-notifications-v2', JSON.stringify(userNotifications));
        }
    } else if (!isLoading && !user) {
        setNotifications([]);
        localStorage.removeItem('campusfind-notifications-v2');
    }
  }, [isLoading, user]);

  useEffect(() => {
      if(!isLoading && user) {
        localStorage.setItem('campusfind-notifications-v2', JSON.stringify(notifications));
      }
  }, [notifications, isLoading, user]);

  const addNotification = useCallback((notificationData: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const newNotification: Notification = {
      ...notificationData,
      id: `notif-${Date.now()}`,
      createdAt: new Date().toISOString(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

  const notificationsContextValue = useMemo(() => ({
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    unreadCount,
  }), [notifications, addNotification, markAsRead, markAllAsRead, unreadCount]);


  const addItem = useCallback((itemData: Omit<Item, 'id' | 'reportedAt' | 'status' | 'imageHint'> & {imageUrl: string}) => {
      const newItem: Item = {
          ...itemData,
          id: `item-${Date.now()}`,
          reportedAt: new Date().toISOString(),
          status: 'open',
          imageHint: 'user uploaded image'
      };

      if (newItem.type === 'found') {
        const lostItems = items.filter(i => i.type === 'lost' && i.status === 'open');
        lostItems.forEach(async (lostItem) => {
            try {
                const results = await findSimilarItems({
                    photoDataUri: lostItem.imageUrl,
                    description: lostItem.description,
                    searchSpace: [newItem]
                });

                if (results.length > 0 && results[0].similarityScore > 0.7) {
                    addNotification({
                        userId: lostItem.reportedBy,
                        message: `A new potential match for your lost item "${lostItem.name}" has been found!`,
                    });
                }
            } catch (e) {
                console.error("Background item matching failed:", e);
            }
        });
    }

      setItems(prevItems => [newItem, ...prevItems]);
  }, [items, addNotification]);

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

  // --- Claims State ---
  const [claims, setClaims] = useState<Claim[]>([]);

  useEffect(() => {
    if (!isLoading && user) {
      try {
        const storedClaims = localStorage.getItem('campusfind-claims-v2');
        if (storedClaims) {
          setClaims(JSON.parse(storedClaims));
        } else {
          localStorage.setItem('campusfind-claims-v2', JSON.stringify(initialClaims));
          setClaims(initialClaims);
        }
      } catch (error) {
        console.error('Failed to parse claims from localStorage', error);
        setClaims(initialClaims);
        localStorage.setItem('campusfind-claims-v2', JSON.stringify(initialClaims));
      }
    } else if (!isLoading && !user) {
      setClaims(initialClaims);
    }
  }, [isLoading, user]);

  useEffect(() => {
    if (!isLoading && user) {
      localStorage.setItem('campusfind-claims-v2', JSON.stringify(claims));
    }
  }, [claims, isLoading, user]);

  const addClaim = useCallback((claimData: Omit<Claim, 'id' | 'claimDate'>) => {
    const newClaim: Claim = {
      ...claimData,
      id: `claim-${Date.now()}`,
      claimDate: new Date().toISOString(),
    };
    setClaims(prevClaims => [newClaim, ...prevClaims]);
  }, []);

  const approveClaim = useCallback((claimId: string) => {
    let approvedClaim: Claim | undefined;
    const newClaims = claims.map(c => {
      if (c.id === claimId) {
        approvedClaim = { ...c, status: 'approved' };
        return approvedClaim;
      }
      return c;
    });
    setClaims(newClaims);

    if (approvedClaim) {
      const foundItem = items.find(i => i.id === approvedClaim!.foundItemId);
      if(foundItem) {
        updateItem({ ...foundItem, status: 'claimed' });
        addNotification({
          userId: approvedClaim.claimantId,
          message: `Your claim for "${foundItem.name}" has been approved! You can pick it up from the campus security office.`,
        });
      }
    }
  }, [claims, items, updateItem, addNotification]);

  const rejectClaim = useCallback((claimId: string) => {
    let rejectedClaim: Claim | undefined;
     const newClaims = claims.map(c => {
      if (c.id === claimId) {
        rejectedClaim = { ...c, status: 'rejected' };
        return rejectedClaim;
      }
      return c;
    });
    setClaims(newClaims);

    if (rejectedClaim) {
        const foundItem = items.find(i => i.id === rejectedClaim!.foundItemId);
        if(foundItem) {
            addNotification({
                userId: rejectedClaim.claimantId,
                message: `Unfortunately, your claim for "${foundItem.name}" has been rejected.`,
            });
        }
    }
  }, [claims, items, addNotification]);
  
  const claimsContextValue = useMemo(() => ({
    claims,
    addClaim,
    approveClaim,
    rejectClaim,
  }), [claims, addClaim, approveClaim, rejectClaim]);


  return (
    <AuthContext.Provider value={authContextValue}>
      <ItemsContext.Provider value={itemsContextValue}>
        <NotificationsContext.Provider value={notificationsContextValue}>
          <ClaimsContext.Provider value={claimsContextValue}>
            {children}
          </ClaimsContext.Provider>
        </NotificationsContext.Provider>
      </ItemsContext.Provider>
    </AuthContext.Provider>
  );
}
