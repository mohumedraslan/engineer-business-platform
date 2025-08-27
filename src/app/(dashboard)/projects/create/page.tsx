// src/app/(dashboard)/projects/create/page.tsx
import { getCurrentUser } from '@/app/actions';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import CreateProjectForm from '@/components/dashboard/CreateProjectForm';
import Link from 'next/link';

export default async function CreateProjectPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  // Only business owners can create projects
  if (user.role !== 'business_owner') {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create New Project</h1>
            <p className="text-gray-600 mt-2">
              Post a new project to find talented engineers
            </p>
          </div>
          <Link href="/projects">
            <Button variant="outline">Back to Projects</Button>
          </Link>
        </div>

        {/* Project Creation Form */}
        <div className="flex justify-center">
          <CreateProjectForm userId={user.id} />
        </div>

        {/* Help Text */}
        <div className="max-w-2xl mx-auto text-center text-gray-600">
          <p className="text-sm">
            Be specific about your requirements and timeline. The more detail you provide, 
            the better engineers can assess if they're a good fit for your project.
          </p>
        </div>
      </div>
    </div>
  );
}
