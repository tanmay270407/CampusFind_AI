import { ReportItemForm } from '@/components/dashboard/report-item-form';
import { items } from '@/lib/data';
import type { Item } from '@/lib/types';
import { notFound } from 'next/navigation';

export default function EditLostItemPage({ params }: { params: { id: string } }) {
    const item: Item | undefined = items.find(i => i.id === params.id && i.type === 'lost');

    if (!item) {
        notFound();
    }
    
    // In a real app, you would also verify that the logged-in user is the owner of this item.

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Edit Lost Item Report</h1>
                <p className="text-muted-foreground">Update the details for your lost item below.</p>
            </div>
            <ReportItemForm itemType="lost" item={item} />
        </div>
    );
}
