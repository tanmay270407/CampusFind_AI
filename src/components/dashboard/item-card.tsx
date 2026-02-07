import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Item } from '@/lib/types';
import { MapPin, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ItemCardProps {
  item: Item;
}

export function ItemCard({ item }: ItemCardProps) {
  const timeAgo = formatDistanceToNow(new Date(item.reportedAt), { addSuffix: true });

  return (
    <Link href={`/dashboard/${item.type}/${item.id}`}>
        <Card className="flex h-full flex-col overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
            <CardHeader className="p-0">
                <div className="relative aspect-video w-full">
                    <Image
                        src={item.imageUrl}
                        alt={item.description}
                        data-ai-hint={item.imageHint}
                        fill
                        className="object-cover"
                    />
                </div>
            </CardHeader>
            <CardContent className="flex-1 p-4">
                <CardTitle className="mb-2 text-lg leading-tight">{item.name}</CardTitle>
                <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{item.type === 'found' ? 'Found at:' : 'Lost at:'} {item.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{timeAgo}</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
                <Badge variant={item.type === 'found' ? 'secondary' : 'outline'} className="capitalize">{item.itemType}</Badge>
            </CardFooter>
        </Card>
    </Link>
  );
}
