// src/app/(dashboard)/layout.tsx
import { getCurrentUser } from '@/app/actions';
import { redirect } from 'next/navigation';
import { Toaster } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import NotificationBell from '@/components/dashboard/NotificationBell';

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
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-8">
                <Link href="/dashboard">
                  <h1 className="text-xl font-semibold text-gray-900 hover:text-gray-700">
                    Engineer-Business Platform
                  </h1>
                </Link>
                
                <nav className="hidden md:flex space-x-6">
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
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        Admin
                      </Button>
                    </Link>
                  )}
                </nav>
              </div>
              
              <div className="flex items-center space-x-4">
                <NotificationBell />
                <span className="text-sm text-gray-600">
                  Welcome, {user.profile?.full_name || user.email}
                </span>
                <form action="/api/auth/logout" method="post">
                  <Button type="submit" variant="outline" size="sm">
                    Sign Out
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </header>

        <main>{children}</main>
      </div>
      <Toaster />
    </>
  );
}
