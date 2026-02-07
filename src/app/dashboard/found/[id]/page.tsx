import Image from 'next/image';
import { items, users } from '@/lib/data';
import type { Item, User } from '@/lib/types';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, User as UserIcon, Tag } from 'lucide-react';
import { format } from 'date-fns';

export default function FoundItemDetailsPage({ params }: { params: { id: string } }) {
  const item: Item | undefined = items.find(i => i.id === params.id && i.type === 'found');
  
  if (!item) {
    notFound();
  }
  
  const reporter: User | undefined = users.find(u => u.id === item.reportedBy);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{item.name}</CardTitle>
          <CardDescription>
            Details about the found item.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="relative aspect-video w-full rounded-lg overflow-hidden">
              <Image
                src={item.imageUrl}
                alt={item.description}
                data-ai-hint={item.imageHint}
                fill
                className="object-cover"
              />
            </div>
            <div className="border-t pt-4">
                <h3 className="font-semibold text-lg mb-2">Status</h3>
                <Badge variant={item.status === 'open' ? 'default' : 'outline'} className="capitalize">{item.status}</Badge>
                {item.status === 'open' && <p className="text-sm text-muted-foreground mt-2">This item is waiting to be claimed.</p>}
                {item.status === 'claimed' && <p className="text-sm text-muted-foreground mt-2">This item has been successfully claimed.</p>}
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Item Details</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <span>Category: <Badge variant="secondary">{item.itemType}</Badge></span>
                </div>
                <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>Found at: {item.location}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Found on: {format(new Date(item.reportedAt), 'PPP')}</span>
                </div>
                {reporter && (
                    <div className="flex items-center gap-2">
                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                        <span>Reported by: {reporter.name}</span>
                    </div>
                )}
            </div>
             {item.status === 'open' && (
                <div className="border-t pt-4">
                    <h3 className="font-semibold text-lg mb-2">Think this is yours?</h3>
                    <p className="text-muted-foreground text-sm mb-4">If you believe this is your lost item, you can submit a claim. Please be prepared to provide details to verify your ownership.</p>
                    <Button>Claim this Item</Button>
                </div>
             )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
