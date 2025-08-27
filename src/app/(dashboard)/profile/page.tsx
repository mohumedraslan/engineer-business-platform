// src/app/(dashboard)/profile/page.tsx
import { getCurrentUser } from '@/app/actions';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ProfileForm from '@/components/dashboard/ProfileForm';
import { formatSkills, getStatusColor } from '@/lib/utils';
import Link from 'next/link';

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            <p className="text-gray-600 mt-2">
              Manage your profile information and preferences
            </p>
          </div>
          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Information Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Your current profile details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Full Name</label>
                  <p className="text-gray-900">{user.profile?.full_name || 'Not set'}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900">{user.email}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Role</label>
                  <p className="text-gray-900 capitalize">{user.role}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.profile?.status || 'pending_approval')}`}>
                    {user.profile?.status?.replace('_', ' ') || 'pending approval'}
                  </span>
                </div>

                {user.role === 'engineer' && (
                  <>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Headline</label>
                      <p className="text-gray-900">{user.profile?.headline || 'Not set'}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-500">Skills</label>
                      <p className="text-gray-900">{formatSkills(user.profile?.skills)}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-500">Portfolio</label>
                      {user.profile?.portfolio_url ? (
                        <a 
                          href={user.profile.portfolio_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View Portfolio
                        </a>
                      ) : (
                        <p className="text-gray-500">Not set</p>
                      )}
                    </div>
                  </>
                )}

                {user.role === 'business_owner' && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Company</label>
                    <p className="text-gray-900">{user.profile?.company_name || 'Not set'}</p>
                  </div>
                )}

                {user.profile?.bio && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Bio</label>
                    <p className="text-gray-900">{user.profile.bio}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <ProfileForm user={user.profile || user} />
          </div>
        </div>

        {/* Status Information */}
        {user.profile?.status === 'pending_approval' && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="text-yellow-800">Profile Pending Approval</CardTitle>
              <CardDescription className="text-yellow-700">
                Your profile is currently under review by our team. This usually takes 24-48 hours.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-yellow-700 text-sm">
                Once approved, you'll be able to:
                {user.role === 'engineer' 
                  ? ' browse projects, get matched with opportunities, and schedule interviews.'
                  : ' post projects, view engineer profiles, and start connecting with talent.'
                }
              </p>
            </CardContent>
          </Card>
        )}

        {user.profile?.status === 'rejected' && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800">Profile Rejected</CardTitle>
              <CardDescription className="text-red-700">
                Your profile was not approved. Please review and update your information.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-red-700 text-sm">
                Common reasons for rejection include incomplete information, inappropriate content, 
                or missing required fields. Please update your profile and try again.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
