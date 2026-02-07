'use client';

import { useState, useEffect } from 'react';
import { notFound, useParams } from 'next/navigation';
import { useItems } from '@/hooks/use-items';
import { useAuth } from '@/hooks/use-auth';
import { useNotifications } from '@/hooks/use-notifications';
import { findSimilarItems, type FindSimilarItemsOutput } from '@/ai/flows/find-similar-items';
import type { Item } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, AlertTriangle, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

function MatchCard({ match }: { match: FindSimilarItemsOutput[0] }) {
  const { getItem } = useItems();
  const item = getItem(match.itemId);

  if (!item) return null;

  return (
    <Card>
      <CardHeader className="p-0">
          <div className="relative aspect-video w-full">
              <Image
                  src={match.imageUrl}
                  alt={match.itemDescription}
                  fill
                  className="object-cover rounded-t-lg"
              />
          </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
            <CardTitle className="text-lg">{item.name}</CardTitle>
            <Badge>Similarity: {(match.similarityScore * 100).toFixed(0)}%</Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{match.itemDescription}</p>
        <Button asChild className="w-full">
            <Link href={`/dashboard/found/${match.itemId}`}>View and Claim Item</Link>
        </Button>
      </CardContent>
    </Card>
  );
}


export default function FindMatchesPage() {
  const params = useParams<{ id: string }>();
  const { getItem, items } = useItems();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState<FindSimilarItemsOutput>([]);
  const [error, setError] = useState<string | null>(null);

  const item: Item | undefined = getItem(params.id);

  useEffect(() => {
    if (!item || !user) return;

    const runSearch = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const results = await findSimilarItems({
          photoDataUri: item.imageUrl,
          description: item.description,
          searchSpace: items,
        });

        setMatches(results);

        if (results.length > 0) {
            addNotification({
                userId: user.id,
                message: `We found ${results.length} potential match(es) for your lost item: "${item.name}".`,
            });
        }
      } catch (e) {
        console.error(e);
        setError('An error occurred while searching for similar items. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    runSearch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item?.id]);

  if (!item) {
    if (!loading) {
        notFound();
    }
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
        <div className="space-y-2">
            <Button variant="ghost" asChild>
                <Link href={`/dashboard/lost/${item.id}`} className="text-muted-foreground"><ArrowLeft className="mr-2"/>Back to Item Details</Link>
            </Button>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">AI Match Results for &quot;{item.name}&quot;</h1>
            <p className="text-muted-foreground">Our AI has analyzed the database of found items to find potential matches for your lost item.</p>
        </div>

        {loading && (
             <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 p-12 text-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <h3 className="text-lg font-semibold">Searching for matches...</h3>
                <p className="mt-2 text-sm text-muted-foreground">Our AI is scanning found items. This may take a moment.</p>
            </div>
        )}

        {error && (
             <div className="rounded-lg border-2 border-destructive bg-destructive/10 p-12 text-center">
                <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
                <h3 className="text-lg font-semibold text-destructive">Search Failed</h3>
                <p className="mt-2 text-sm text-destructive/80">{error}</p>
            </div>
        )}

        {!loading && !error && (
            matches.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {matches.map(match => (
                        <MatchCard key={match.itemId} match={match} />
                    ))}
                </div>
            ) : (
                <div className="rounded-lg border-2 border-dashed border-muted-foreground/30 p-12 text-center">
                    <h3 className="text-lg font-semibold">No Matches Found</h3>
                    <p className="mt-2 text-sm text-muted-foreground">We didn&apos;t find any items that strongly match your report at this time. We will keep searching and notify you if a match is found.</p>
                </div>
            )
        )}
    </div>
  );
}
