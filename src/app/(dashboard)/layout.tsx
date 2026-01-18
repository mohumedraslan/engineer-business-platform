// src/app/(dashboard)/layout.tsx
import { getCurrentUser } from '@/app/actions';
import { redirect } from 'next/navigation';
import { Toaster } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const NotificationComponent = dynamic(() => import('@/components/dashboard/NotificationComponent'), {
  ssr: false,
});

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center">
            <div className="mr-4 flex items-center space-x-8">
              <Link href="/dashboard" className="flex items-center space-x-2">
                <span className="font-bold inline-block">rabt Platform</span>
              </Link>
              
              <nav className="hidden md:flex items-center space-x-6">
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button variant="ghost" size="sm">
                    Profile
                  </Button>
                </Link>
                <Link href="/projects">
                  <Button variant="ghost" size="sm">
                    {user.role === 'business_owner' ? 'Projects' : 'Browse Projects'}
                  </Button>
                </Link>
                <Link href="/interviews">
                  <Button variant="ghost" size="sm">
                    Interviews
                  </Button>
                </Link>
                {user.role === 'admin' && (
                  <Link href="/admin">
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive/90">
                      Admin
                    </Button>
                  </Link>
                )}
              </nav>
            </div>
            
            <div className="flex-1" />
            
            <div className="flex items-center space-x-4">
              <NotificationComponent />
              <span className="text-sm text-muted-foreground">
                Welcome, {user.profile?.full_name || user.email}
              </span>
              <form action="/api/auth/logout" method="post">
                <Button type="submit" variant="outline" size="sm">
                  Sign Out
                </Button>
              </form>
            </div>
          </div>
        </header>

        <main className="container py-6">
          {children}
        </main>
      </div>
      <Toaster />
    </>
  );
}
