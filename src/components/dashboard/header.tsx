'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { UserNav } from '@/components/dashboard/user-nav';
import { Bell } from 'lucide-react';
import { Button } from '../ui/button';
import { useNotifications } from '@/hooks/use-notifications';
import Link from 'next/link';
import { Badge } from '../ui/badge';

export function DashboardHeader() {
  const { unreadCount } = useNotifications();

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <SidebarTrigger className="md:hidden" />
      <div className="flex-1">
        {/* Placeholder for maybe a page title or search bar */}
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative rounded-full" asChild>
          <Link href="/dashboard/notifications">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge variant="destructive" className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full p-0">
                {unreadCount}
              </Badge>
            )}
            <span className="sr-only">Notifications</span>
          </Link>
        </Button>
        <UserNav />
      </div>
    </header>
  );
}
