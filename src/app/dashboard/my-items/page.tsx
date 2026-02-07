export default function MyItemsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">My Items</h1>
            <p className="text-muted-foreground">A list of items you have reported as lost or found.</p>
            {/* Placeholder Content */}
            <div className="rounded-lg border-2 border-dashed border-muted-foreground/30 p-12 text-center">
                <p className="text-muted-foreground">Item list will be displayed here.</p>
            </div>
        </div>
    );
}
