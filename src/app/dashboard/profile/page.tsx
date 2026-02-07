import { EditProfileForm } from '@/components/dashboard/edit-profile-form';

export default function ProfilePage() {
    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">My Profile</h1>
                <p className="text-muted-foreground">Update your name and profile picture.</p>
            </div>
            <EditProfileForm />
        </div>
    );
}
