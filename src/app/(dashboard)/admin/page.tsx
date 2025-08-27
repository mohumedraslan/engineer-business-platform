// src/app/(dashboard)/admin/page.tsx
import { getCurrentUser } from '@/app/actions';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AdminApprovalButtons from '@/components/dashboard/AdminApprovalButtons';
import ScheduleVettingInterview from '@/components/dashboard/ScheduleVettingInterview';

export default async function AdminPage() {
  const user = await getCurrentUser();
  
  if (!user || user.role !== 'admin') {
    redirect('/dashboard');
  }

  const supabase = await createClient();
  const { data: pendingEngineers, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'engineer')
    .eq('status', 'pending_approval')
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-red-600">Error: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage platform users and ensure quality standards</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{pendingEngineers?.length || 0}</div>
              <p className="text-xs text-gray-500 mt-1">Engineers awaiting review</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Engineers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">-</div>
              <p className="text-xs text-gray-500 mt-1">Approved engineers on platform</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">-</div>
              <p className="text-xs text-gray-500 mt-1">Active projects</p>
            </CardContent>
          </Card>
        </div>

        {/* Pending Approvals */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Engineer Approvals</CardTitle>
            <CardDescription>
              Review new engineer profiles before they can access the platform.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!pendingEngineers || pendingEngineers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="text-lg">No engineers are awaiting approval</p>
              </div>
            ) : (
              pendingEngineers.map((engineer) => (
                <div 
                  key={engineer.id} 
                  className="flex items-center justify-between p-4 border rounded-lg bg-white hover:shadow-sm transition-shadow"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{engineer.full_name}</h3>
                        <p className="text-sm text-gray-500">{engineer.email}</p>
                        {engineer.headline && (
                          <p className="text-sm text-gray-600 mt-1">{engineer.headline}</p>
                        )}
                      </div>
                      <div className="text-right text-xs text-gray-400">
                        <p>Registered</p>
                        <p>{new Date(engineer.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 flex items-center space-x-2">
                    <ScheduleVettingInterview engineerId={engineer.id} engineerName={engineer.full_name || 'Engineer'} adminId={user.id} />
                    <AdminApprovalButtons engineerId={engineer.id} />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Additional Admin Features */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Management</CardTitle>
            <CardDescription>Additional administrative tools and settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">User Management</h4>
                <p className="text-sm text-gray-600 mb-3">View and manage all platform users</p>
                <button className="text-sm text-blue-600 hover:text-blue-800">View All Users →</button>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Platform Analytics</h4>
                <p className="text-sm text-gray-600 mb-3">Monitor platform usage and performance</p>
                <button className="text-sm text-blue-600 hover:text-blue-800">View Analytics →</button>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Content Moderation</h4>
                <p className="text-sm text-gray-600 mb-3">Review and moderate platform content</p>
                <button className="text-sm text-blue-600 hover:text-blue-800">Moderate Content →</button>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">System Settings</h4>
                <p className="text-sm text-gray-600 mb-3">Configure platform settings and policies</p>
                <button className="text-sm text-blue-600 hover:text-blue-800">Configure →</button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
