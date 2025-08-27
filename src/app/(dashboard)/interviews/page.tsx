// src/app/(dashboard)/interviews/page.tsx
import { getCurrentUser } from '@/app/actions';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate, getStatusColor } from '@/lib/utils';
import Link from 'next/link';
import InterviewActions from '@/components/dashboard/InterviewActions';

// Mock data for now - we'll replace this with real data from Supabase
const mockInterviews = [
  {
    id: '1',
    project: {
      id: 'proj-1',
      title: 'AI-Powered Chatbot for E-commerce',
      owner: {
        full_name: 'John Smith',
        company_name: 'TechCorp Inc.'
      }
    },
    engineer: {
      id: 'eng-1',
      full_name: 'Sarah Johnson',
      headline: 'Senior Full-Stack Developer'
    },
    scheduled_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    meeting_link: 'https://meet.google.com/abc-defg-hij',
    status: 'scheduled' as const
  },
  {
    id: '2',
    project: {
      id: 'proj-2',
      title: 'Mobile App for Food Delivery',
      owner: {
        full_name: 'Mike Chen',
        company_name: 'FoodTech Solutions'
      }
    },
    engineer: {
      id: 'eng-2',
      full_name: 'Alex Rodriguez',
      headline: 'React Native Specialist'
    },
    scheduled_time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // Day after tomorrow
    meeting_link: 'https://zoom.us/j/123456789',
    status: 'scheduled' as const
  },
  {
    id: '3',
    project: {
      id: 'proj-3',
      title: 'Blockchain Supply Chain Platform',
      owner: {
        full_name: 'Emily Davis',
        company_name: 'BlockChain Logistics'
      }
    },
    engineer: {
      id: 'eng-3',
      full_name: 'David Kim',
      headline: 'Blockchain Developer'
    },
    scheduled_time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
    meeting_link: 'https://teams.microsoft.com/l/meetup-join/...',
    status: 'completed' as const
  },
  {
    id: '4',
    project: {
      id: 'proj-4',
      title: 'E-commerce Platform Redesign',
      owner: {
        full_name: 'Lisa Wang',
        company_name: 'Digital Commerce Co.'
      }
    },
    engineer: {
      id: 'eng-4',
      full_name: 'Michael Brown',
      headline: 'UI/UX Designer & Developer'
    },
    scheduled_time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    meeting_link: 'https://meet.google.com/xyz-123-456',
    status: 'cancelled' as const
  }
];

export default async function InterviewsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  // Filter interviews based on user role
  const userInterviews = mockInterviews.filter(interview => {
    if (user.role === 'engineer') {
      return interview.engineer.id === user.id;
    } else if (user.role === 'business_owner') {
      return interview.project.owner.full_name === user.profile?.full_name;
    }
    return false;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Interviews</h1>
            <p className="text-gray-600 mt-2">
              {user.role === 'engineer' 
                ? 'Manage your scheduled interviews with business owners'
                : 'Manage interviews with engineers for your projects'
              }
            </p>
          </div>
          
          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>

        {/* Interviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userInterviews.map((interview) => (
            <Card key={interview.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <CardTitle className="text-lg line-clamp-2">
                      <Link 
                        href={`/projects/${interview.project.id}`}
                        className="hover:text-blue-600 transition-colors"
                      >
                        {interview.project.title}
                      </Link>
                    </CardTitle>
                    <CardDescription>
                      {user.role === 'engineer' 
                        ? `with ${interview.project.owner.full_name}`
                        : `with ${interview.engineer.full_name}`
                      }
                    </CardDescription>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={getStatusColor(interview.status)}
                  >
                    {interview.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Interview Details */}
                <div className="space-y-2">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Scheduled Time</label>
                    <p className="text-gray-900">{formatDate(interview.scheduled_time)}</p>
                  </div>
                  
                  {user.role === 'engineer' && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Company</label>
                      <p className="text-gray-900">{interview.project.owner.company_name}</p>
                    </div>
                  )}
                  
                  {user.role === 'business_owner' && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Engineer</label>
                      <p className="text-gray-900">{interview.engineer.full_name}</p>
                      {interview.engineer.headline && (
                        <p className="text-gray-600 text-sm">{interview.engineer.headline}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {interview.meeting_link && (
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => window.open(interview.meeting_link, '_blank')}
                    >
                      Join Meeting
                    </Button>
                  )}
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      // Copy meeting link to clipboard
                      if (interview.meeting_link) {
                        navigator.clipboard.writeText(interview.meeting_link);
                      }
                    }}
                  >
                    Copy Link
                  </Button>
                </div>

                {/* Interview Actions */}
                <InterviewActions 
                  interview={{
                    id: interview.id,
                    status: interview.status,
                    engineer_id: interview.engineer.id,
                    owner_id: interview.project.owner.full_name === user.profile?.full_name ? user.id : 'mock-owner-id'
                  }}
                  currentUserId={user.id}
                />

                {interview.status === 'completed' && (
                  <div className="text-center">
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      ✓ Completed
                    </Badge>
                  </div>
                )}

                {interview.status === 'cancelled' && (
                  <div className="text-center">
                    <Badge variant="outline" className="text-red-600 border-red-600">
                      ✗ Cancelled
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {userInterviews.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-gray-500">
                <h3 className="text-lg font-medium mb-2">No interviews scheduled</h3>
                <p className="mb-4">
                  {user.role === 'engineer' 
                    ? 'Start by expressing interest in projects to get scheduled for interviews.'
                    : 'Schedule interviews with engineers who have expressed interest in your projects.'
                  }
                </p>
                <Link href="/projects">
                  <Button>
                    {user.role === 'engineer' ? 'Browse Projects' : 'View Projects'}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upcoming vs Past Interviews */}
        {userInterviews.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Upcoming Interviews */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Interviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {userInterviews
                    .filter(interview => new Date(interview.scheduled_time) > new Date())
                    .map(interview => (
                      <div key={interview.id} className="flex justify-between items-center p-2 border rounded">
                        <div>
                          <p className="font-medium">{interview.project.title}</p>
                          <p className="text-sm text-gray-600">
                            {formatDate(interview.scheduled_time)}
                          </p>
                        </div>
                        <Badge variant="secondary">
                          {interview.status}
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Past Interviews */}
            <Card>
              <CardHeader>
                <CardTitle>Past Interviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {userInterviews
                    .filter(interview => new Date(interview.scheduled_time) <= new Date())
                    .map(interview => (
                      <div key={interview.id} className="flex justify-between items-center p-2 border rounded">
                        <div>
                          <p className="font-medium">{interview.project.title}</p>
                          <p className="text-sm text-gray-600">
                            {formatDate(interview.scheduled_time)}
                          </p>
                        </div>
                        <Badge variant="outline">
                          {interview.status}
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
