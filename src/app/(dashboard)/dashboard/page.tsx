// src/app/(dashboard)/dashboard/page.tsx
import { getCurrentUser } from '@/app/actions';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Calendar, Briefcase, Users, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { Project, Interview, ProjectInterest, DashboardStats } from '@/lib/types';

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const supabase = await createClient();

  // Fetch data specific to the user's role
  let projects: Project[] = [];
  let interviews: Interview[] = [];
  let projectInterests: ProjectInterest[] = [];
  let stats: Partial<DashboardStats> = {};

  if (user.role === 'business_owner') {
    // Fetch business owner's projects
    const { data: projectsData } = await supabase
      .from('projects')
      .select('*')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false });
    projects = projectsData || [];

    // Fetch project interests for business owner's projects
    const { data: interestsData } = await supabase
      .from('project_interests')
      .select(`
        *,
        profiles!project_interests_engineer_id_fkey(full_name, headline, skills),
        projects!project_interests_project_id_fkey(title)
      `)
      .eq('status', 'pending');
    projectInterests = interestsData || [];
  }

  if (user.role === 'engineer') {
    // Fetch engineer's project interests
    const { data: interestsData } = await supabase
      .from('project_interests')
      .select(`
        *,
        projects!project_interests_project_id_fkey(title, description, required_skills)
      `)
      .eq('engineer_id', user.id)
      .order('created_at', { ascending: false });
    projectInterests = interestsData || [];
  }

  // Fetch upcoming interviews for all users
  const { data: interviewData } = await supabase
    .from('interviews')
    .select(`
      *,
      projects!interviews_project_id_fkey(title),
      profiles!interviews_engineer_id_fkey(full_name),
      profiles!interviews_owner_id_fkey(full_name)
    `)
    .or(`engineer_id.eq.${user.id},owner_id.eq.${user.id}`)
    .eq('status', 'scheduled')
    .order('scheduled_time', { ascending: true })
    .limit(5);
  interviews = interviewData || [];

  // Calculate stats based on user role
  if (user.role === 'business_owner') {
    stats = {
      totalProjects: projects?.length || 0,
      activeProjects: projects?.filter(p => p.status === 'open').length || 0,
      pendingInterests: projectInterests?.length || 0,
      upcomingInterviews: interviews?.length || 0
    };
  } else if (user.role === 'engineer') {
    stats = {
      totalInterests: projectInterests?.length || 0,
      pendingInterests: projectInterests?.filter(i => i.status === 'pending').length || 0,
      acceptedInterests: projectInterests?.filter(i => i.status === 'accepted').length || 0,
      upcomingInterviews: interviews?.length || 0
    };
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 0) return 'Past due';
    return `In ${diffDays} days`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'matching': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-orange-100 text-orange-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.profile?.full_name || user.email}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here&apos;s what&apos;s happening with your {user.role === 'business_owner' ? 'projects' : 'opportunities'} today.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {user.role === 'business_owner' ? (
            <>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                    <Briefcase className="h-4 w-4 mr-2" />
                    Total Projects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{stats.totalProjects}</div>
                  <p className="text-xs text-gray-500 mt-1">Your posted projects</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Active Projects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.activeProjects}</div>
                  <p className="text-xs text-gray-500 mt-1">Currently open</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Pending Interests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{stats.pendingInterests}</div>
                  <p className="text-xs text-gray-500 mt-1">Awaiting review</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Upcoming Interviews
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">{stats.upcomingInterviews}</div>
                  <p className="text-xs text-gray-500 mt-1">Scheduled meetings</p>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                    <Briefcase className="h-4 w-4 mr-2" />
                    Total Interests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{stats.totalInterests}</div>
                  <p className="text-xs text-gray-500 mt-1">Projects you&apos;re interested in</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Pending Review
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{stats.pendingInterests}</div>
                  <p className="text-xs text-gray-500 mt-1">Awaiting response</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Accepted
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.acceptedInterests}</div>
                  <p className="text-xs text-gray-500 mt-1">Successfully matched</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Upcoming Interviews
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">{stats.upcomingInterviews}</div>
                  <p className="text-xs text-gray-500 mt-1">Scheduled meetings</p>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Upcoming Interviews Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Upcoming Interviews
            </CardTitle>
            <CardDescription>
              Your scheduled interviews and meetings
            </CardDescription>
          </CardHeader>
          <CardContent>
            {interviews && interviews.length > 0 ? (
              <div className="space-y-4">
                {interviews.map(interview => (
                  <div key={interview.id} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {interview.project?.title || 'Project'}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {user.role === 'engineer' 
                          ? `with ${interview.owner?.full_name || 'Business Owner'}`
                          : `with ${interview.engineer?.full_name || 'Engineer'}`
                        }
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {interview.scheduled_time ? `${formatDate(interview.scheduled_time)} at ${new Date(interview.scheduled_time).toLocaleTimeString()}` : 'Not scheduled'}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        Scheduled
                      </Badge>
                      {interview.meeting_link && (
                        <Button size="sm" variant="outline" asChild>
                          <Link href={interview.meeting_link} target="_blank">
                            Join Meeting
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">No upcoming interviews</p>
                <p className="text-sm">You&apos;re all caught up!</p>
              </div>
            )}
            <div className="mt-4">
              <Button asChild variant="outline" className="w-full">
                <Link href="/interviews">View All Interviews</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Role-Specific Sections */}
        {user.role === 'business_owner' && (
          <>
            {/* My Projects Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Briefcase className="h-5 w-5 mr-2" />
                  Your Projects
                </CardTitle>
                <CardDescription>
                  Manage your posted projects and review engineer interest
                </CardDescription>
              </CardHeader>
              <CardContent>
                {projects && projects.length > 0 ? (
                  <div className="space-y-4">
                    {projects.slice(0, 5).map(project => (
                      <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            <Link href={`/projects/${project.id}`} className="hover:underline">
                              {project.title}
                            </Link>
                          </h4>
                          <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                            {project.description}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3 ml-4">
                          <Badge className={getStatusColor(project.status)}>
                            {project.status.replace('_', ' ')}
                          </Badge>
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/projects/${project.id}`}>View Details</Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg">No projects yet</p>
                    <p className="text-sm">Start by posting your first project</p>
                  </div>
                )}
                <div className="mt-4 flex space-x-3">
                  <Button asChild className="flex-1">
                    <Link href="/projects/create">Post New Project</Link>
                  </Button>
                  <Button asChild variant="outline" className="flex-1">
                    <Link href="/projects">View All Projects</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Pending Interests Section */}
            {projectInterests && projectInterests.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Pending Engineer Interest
                  </CardTitle>
                  <CardDescription>
                    Engineers interested in your projects
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {projectInterests.slice(0, 3).map(interest => (
                      <div key={interest.id} className="flex items-center justify-between p-4 border rounded-lg bg-orange-50">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {interest.profiles?.full_name || 'Engineer'}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Interested in: {interest.projects?.title || 'Project'}
                          </p>
                          {interest.profiles?.headline && (
                            <p className="text-xs text-gray-500 mt-1">
                              {interest.profiles.headline}
                            </p>
                          )}
                        </div>
                        <Button size="sm" asChild>
                          <Link href={`/projects/${interest.project_id}`}>Review Interest</Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/projects">View All Interests</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Engineer Dashboard Section */}
        {user.role === 'engineer' && (
          <>
            {/* Project Interests Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Briefcase className="h-5 w-5 mr-2" />
                  Your Project Interests
                </CardTitle>
                <CardDescription>
                  Track your project applications and responses
                </CardDescription>
              </CardHeader>
              <CardContent>
                {projectInterests && projectInterests.length > 0 ? (
                  <div className="space-y-4">
                    {projectInterests.slice(0, 5).map(interest => (
                      <div key={interest.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {interest.projects?.title || 'Project'}
                          </h4>
                          <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                            {interest.projects?.description || 'No description available'}
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge className={getStatusColor(interest.status)}>
                              {interest.status}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              Applied {new Date(interest.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/projects/${interest.project_id}`}>View Project</Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg">No project interests yet</p>
                    <p className="text-sm">Start browsing projects to find opportunities</p>
                  </div>
                )}
                <div className="mt-4">
                  <Button asChild className="w-full">
                    <Link href="/projects">Browse Projects</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button asChild variant="outline" className="h-auto p-4 flex-col">
                <Link href="/profile">
                  <div className="text-lg mb-2">👤</div>
                  <span className="font-medium">Update Profile</span>
                  <span className="text-sm text-gray-500 mt-1">Keep your information current</span>
                </Link>
              </Button>
              
              {user.role === 'business_owner' && (
                <Button asChild variant="outline" className="h-auto p-4 flex-col">
                  <Link href="/projects/create">
                    <div className="text-lg mb-2">🚀</div>
                    <span className="font-medium">Post Project</span>
                    <span className="text-sm text-gray-500 mt-1">Find the perfect engineer</span>
                  </Link>
                </Button>
              )}
              
              {user.role === 'engineer' && (
                <Button asChild variant="outline" className="h-auto p-4 flex-col">
                  <Link href="/projects">
                    <div className="text-lg mb-2">🔍</div>
                    <span className="font-medium">Find Projects</span>
                    <span className="text-sm text-gray-500 mt-1">Browse available opportunities</span>
                  </Link>
                </Button>
              )}
              
              <Button asChild variant="outline" className="h-auto p-4 flex-col">
                <Link href="/interviews">
                  <div className="text-lg mb-2">📅</div>
                  <span className="font-medium">Manage Interviews</span>
                  <span className="text-sm text-gray-500 mt-1">View and schedule meetings</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
