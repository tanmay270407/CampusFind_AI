'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Item } from '@/lib/types';
import { notFound, useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Tag, Search, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useItems } from '@/hooks/use-items';

export default function LostItemDetailsPage() {
  const params = useParams<{ id: string }>();
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();
  const { getItem, deleteItem } = useItems();
  
  const item: Item | undefined = getItem(params.id);
  
  if (!item || item.type !== 'lost') {
    notFound();
  }

  const isOwner = user?.id === item.reportedBy;

  const handleDelete = () => {
    deleteItem(item.id);
    toast({
        title: "Report Deleted",
        description: `The report for "${item.name}" has been deleted.`,
    });
    router.push('/dashboard/my-items');
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-3xl font-bold">{item.name}</CardTitle>
              <CardDescription>
                Details about your lost item report.
              </CardDescription>
            </div>
            <Badge variant={item.status === 'open' ? 'destructive' : 'default'} className="capitalize text-base">{item.status}</Badge>
          </div>
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
                 <h3 className="font-semibold text-lg mb-2">Find Matches</h3>
                 <p className="text-muted-foreground text-sm mb-4">Use our AI-powered search to find items that match your description from the found items list.</p>
                <Button asChild>
                  <Link href={`/dashboard/lost/${item.id}/matches`}>
                    <Search className="mr-2" /> Find similar items
                  </Link>
                </Button>
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
                    <span>Last seen at: {item.location}</span>
                </div>
                <div className="flex items-center gap-2 col-span-full">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Reported on: {format(new Date(item.reportedAt), 'PPP')}</span>
                </div>
            </div>
          </div>
        </CardContent>
        {isOwner && (
            <CardFooter className="flex justify-end gap-2 border-t pt-6">
                <Button variant="outline" asChild>
                  <Link href={`/dashboard/lost/${item.id}/edit`}>
                    <Edit className="mr-2" /> Edit Report
                  </Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive"><Trash2 className="mr-2" /> Delete Report</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your report for &quot;{item.name}&quot;.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete}>
                        Yes, delete it
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
            </CardFooter>
        )}
      </Card>
    </div>
  );
}
