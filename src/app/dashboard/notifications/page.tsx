'use client';

import { useNotifications } from '@/hooks/use-notifications';
import { Card, CardContent } from '@/components/ui/card';
import { Bell, Check, Mail } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';

export default function NotificationsPage() {
    const { notifications, markAsRead, markAllAsRead } = useNotifications();
    const { user } = useAuth();
    
    // Sort by date, newest first, and filter for the current user
    const userNotifications = [...notifications]
        .filter((notif) => user && notif.userId === user.id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Notifications</h1>
                    <p className="text-muted-foreground">Recent updates about your items and claims.</p>
                </div>
                <Button variant="outline" onClick={markAllAsRead}><Check className="mr-2"/> Mark all as read</Button>
            </div>
           
            {userNotifications.length > 0 ? (
                <Card>
                    <CardContent className="p-0">
                       <ul className="divide-y">
                           {userNotifications.map((notif) => (
                               <li key={notif.id} className={cn("flex items-start gap-4 p-4 transition-colors", !notif.read && "bg-secondary/50")}>
                                   <div className="rounded-full bg-primary/10 p-2 mt-1">
                                       <Bell className="h-5 w-5 text-primary" />
                                   </div>
                                   <div className="flex-1 space-y-1">
                                       <p className="text-sm">{notif.message}</p>
                                       <p className="text-xs text-muted-foreground">
                                           {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                                       </p>
                                   </div>
                                   {!notif.read && (
                                    <Button variant="ghost" size="sm" onClick={() => markAsRead(notif.id)}>
                                        <Mail className="mr-2" /> Mark as read
                                    </Button>
                                   )}
                               </li>
                           ))}
                       </ul>
                    </CardContent>
                </Card>
            ) : (
                 <div className="rounded-lg border-2 border-dashed border-muted-foreground/30 p-12 text-center mt-12">
                    <Bell className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">No new notifications</h3>
                    <p className="mt-2 text-sm text-muted-foreground">You're all caught up. We'll let you know when something new happens.</p>
                </div>
            )}
        </div>
    );
}
