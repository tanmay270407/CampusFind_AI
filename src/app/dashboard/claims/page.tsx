'use client';
import { claims, users } from '@/lib/data';
import { useItems } from '@/hooks/use-items';
import type { Claim } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import Image from 'next/image';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Component to render a single claim for an admin to review
function ClaimReviewCard({ claim }: { claim: Claim }) {
    const { toast } = useToast();
    const { items } = useItems();
    const claimant = users.find(u => u.id === claim.claimantId);
    const foundItem = items.find(i => i.id === claim.foundItemId);

    if (!claimant || !foundItem) return null;

    const handleApprove = () => {
        // In a real app, this would update the database and trigger notifications
        toast({
            title: 'Claim Approved (Simulated)',
            description: `Claim for "${foundItem.name}" by ${claimant.name} has been approved.`,
        });
    };

    const handleReject = () => {
        // In a real app, this would update the database
        toast({
            variant: 'destructive',
            title: 'Claim Rejected (Simulated)',
            description: `Claim for "${foundItem.name}" by ${claimant.name} has been rejected.`,
        });
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>Claim for: {foundItem.name}</CardTitle>
                        <CardDescription>
                            Claim submitted on {format(new Date(claim.claimDate), 'PPP')}
                        </CardDescription>
                    </div>
                    <Badge variant={claim.status === 'pending' ? 'secondary' : claim.status === 'approved' ? 'default' : 'destructive'} className="capitalize">{claim.status}</Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Claimant Info */}
                <div className="flex items-center gap-4">
                    <Avatar>
                        <AvatarImage src={claimant.avatarUrl} alt={claimant.name} data-ai-hint={claimant.avatarHint} />
                        <AvatarFallback>{claimant.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">{claimant.name}</p>
                        <p className="text-sm text-muted-foreground">{claimant.email}</p>
                    </div>
                </div>

                {/* Item and Claim Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-semibold mb-2">Found Item Details</h4>
                        <div className="relative aspect-video w-full rounded-md overflow-hidden mb-2">
                             <Image src={foundItem.imageUrl} alt={foundItem.description} data-ai-hint={foundItem.imageHint} fill className="object-cover" />
                        </div>
                        <p className="text-sm text-muted-foreground">{foundItem.description}</p>
                    </div>
                     <div>
                        <h4 className="font-semibold mb-2">Claimant's Details</h4>
                        {claim.claimantPhotoUrl && (
                            <div className="relative aspect-video w-full rounded-md overflow-hidden mb-2">
                                <Image src={claim.claimantPhotoUrl} alt="Claimant's photo" data-ai-hint={claim.claimantPhotoHint} fill className="object-cover" />
                            </div>
                        )}
                        <p className="text-sm text-muted-foreground italic">"{claim.claimantDescription}"</p>
                    </div>
                </div>
                
                {/* AI Verification */}
                {claim.verificationDetails && (
                    <div className="border-t pt-4">
                        <h4 className="font-semibold mb-2">AI Verification Analysis</h4>
                        <p className="text-sm text-muted-foreground">{claim.verificationDetails}</p>
                    </div>
                )}
            </CardContent>
            {claim.status === 'pending' && (
                <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline" onClick={handleReject}> <XCircle className="mr-2"/> Reject</Button>
                    <Button onClick={handleApprove}><CheckCircle className="mr-2"/> Approve</Button>
                </CardFooter>
            )}
        </Card>
    )
}

export default function ClaimsPage() {
    const { user } = useAuth();
    
    if (user?.role !== 'admin') {
        return (
            <div className="space-y-6">
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Access Denied</h1>
                <p className="text-muted-foreground">You do not have permission to view this page.</p>
            </div>
        );
    }
    
    const pendingClaims = claims.filter(c => c.status === 'pending');
    const resolvedClaims = claims.filter(c => c.status !== 'pending');

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Manage Claims</h1>
                <p className="text-muted-foreground">Review and manage item claims submitted by users.</p>
            </div>
            
            <div className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2"><AlertCircle className="text-primary"/> Pending Review ({pendingClaims.length})</h2>
                {pendingClaims.length > 0 ? (
                    <div className="space-y-4">
                        {pendingClaims.map(claim => <ClaimReviewCard key={claim.id} claim={claim} />)}
                    </div>
                ) : (
                    <div className="rounded-lg border-2 border-dashed border-muted-foreground/30 p-12 text-center">
                         <p className="text-muted-foreground">There are no pending claims to review.</p>
                    </div>
                )}
            </div>

             <div className="space-y-4">
                <h2 className="text-xl font-semibold">Resolved Claims ({resolvedClaims.length})</h2>
                 {resolvedClaims.length > 0 ? (
                    <div className="space-y-4">
                        {resolvedClaims.map(claim => <ClaimReviewCard key={claim.id} claim={claim} />)}
                    </div>
                ) : (
                    <div className="rounded-lg border-2 border-dashed border-muted-foreground/30 p-12 text-center">
                         <p className="text-muted-foreground">There are no resolved claims.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
