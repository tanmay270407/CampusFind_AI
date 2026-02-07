import { ReportItemForm } from '@/components/dashboard/report-item-form';

export default function ReportFoundItemPage() {
    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Report a Found Item</h1>
                <p className="text-muted-foreground">Thank you for helping! Please provide details about the item you found.</p>
            </div>
            <ReportItemForm itemType="found" />
        </div>
    );
}
