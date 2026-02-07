import { ReportItemForm } from '@/components/dashboard/report-item-form';

export default function ReportLostItemPage() {
    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Report a Lost Item</h1>
                <p className="text-muted-foreground">Fill out the details below to report an item you've lost. Our AI will help find a match.</p>
            </div>
            <ReportItemForm itemType="lost" />
        </div>
    );
}
