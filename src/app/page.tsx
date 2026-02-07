import { LoginForm } from '@/components/auth/login-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SearchCode } from 'lucide-react';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl">
          <CardHeader className="items-center text-center">
            <div className="mb-4 rounded-full bg-primary p-4 text-primary-foreground">
                <SearchCode className="h-10 w-10" />
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight">CampusFind AI</CardTitle>
            <CardDescription className="text-base">Welcome back! Please log in to your account.</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
