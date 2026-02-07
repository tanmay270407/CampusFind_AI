import { Button } from '@/components/ui/button';
import { ItemCard } from '@/components/dashboard/item-card';
import { items } from '@/lib/data';
import type { Item } from '@/lib/types';
import { FilePlus, Search } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const foundItems = items.filter((item) => item.type === 'found' && item.status === 'open').slice(0, 8);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's been found recently on campus.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/dashboard/lost/new"><Search />Report a Lost Item</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/dashboard/found/new"><FilePlus />Report a Found Item</Link>
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Recently Found Items</h2>
        {foundItems.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {foundItems.map((item: Item) => (
                <ItemCard key={item.id} item={item} />
            ))}
            </div>
        ) : (
            <p className="text-muted-foreground">No items have been reported as found yet.</p>
        )}
      </div>
    </div>
  );
}
