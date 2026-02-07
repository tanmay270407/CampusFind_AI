'use client';

import { useAuth } from '@/hooks/use-auth';
import { useItems } from '@/hooks/use-items';
import { ItemCard } from '@/components/dashboard/item-card';
import type { Item } from '@/lib/types';
import { SquareStack } from 'lucide-react';

export default function MyItemsPage() {
    const { user } = useAuth();
    const { items } = useItems();

    if (!user) {
        return null; // Or a loading state
    }

    const myItems = items.filter(item => item.reportedBy === user.id);
    const lostItems = myItems.filter(item => item.type === 'lost');
    const foundItems = myItems.filter(item => item.type === 'found');

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">My Reported Items</h1>
                <p className="text-muted-foreground">A list of items you have reported as lost or found.</p>
            </div>

            {myItems.length === 0 ? (
                 <div className="rounded-lg border-2 border-dashed border-muted-foreground/30 p-12 text-center mt-12">
                    <SquareStack className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">You haven't reported any items yet</h3>
                    <p className="mt-2 text-sm text-muted-foreground">When you report a lost or found item, it will appear here.</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {lostItems.length > 0 && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold">My Reported Lost Items ({lostItems.length})</h2>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                {lostItems.map((item: Item) => (
                                    <ItemCard key={item.id} item={item} />
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {foundItems.length > 0 && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold">My Reported Found Items ({foundItems.length})</h2>
                             <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                {foundItems.map((item: Item) => (
                                    <ItemCard key={item.id} item={item} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
