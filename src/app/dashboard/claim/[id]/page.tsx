import { items } from '@/lib/data';
import type { Item } from '@/lib/types';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ClaimItemForm } from '@/components/dashboard/claim-item-form';

export default function ClaimItemPage({ params }: { params: { id: string } }) {
  const item: Item | undefined = items.find(i => i.id === params.id && i.type === 'found');

  if (!item) {
    notFound();
  }
  
  if (item.status !== 'open') {
      return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div className="text-center">
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Item Not Available</h1>
                <p className="text-muted-foreground mt-2">This item has already been claimed or is no longer available.</p>
            </div>
        </div>
      )
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
        <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Claim Item</h1>
            <p className="text-muted-foreground">You are about to claim the item shown below. Please provide details to verify your ownership.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
                <h2 className="font-semibold text-xl">Item You Are Claiming</h2>
                 <Card>
                    <CardHeader className="p-0">
                        <div className="relative aspect-video w-full">
                            <Image
                                src={item.imageUrl}
                                alt={item.description}
                                data-ai-hint={item.imageHint}
                                fill
                                className="object-cover rounded-t-lg"
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="p-4">
                        <CardTitle className="mb-2 text-lg">{item.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                    </CardContent>
                </Card>
            </div>
            <div className="space-y-4">
                <h2 className="font-semibold text-xl">Your Ownership Details</h2>
                <ClaimItemForm foundItem={item} />
            </div>
        </div>
    </div>
  );
}
