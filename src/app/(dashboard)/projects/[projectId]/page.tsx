// src/app/(dashboard)/projects/[projectId]/page.tsx
import { getCurrentUser } from '@/app/actions';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatSkills, formatDate, getStatusColor } from '@/lib/utils';
import ExpressInterestButton from '@/components/dashboard/ExpressInterestButton';
import InterestedEngineersList from '@/components/dashboard/InterestedEngineersList';
import Link from 'next/link';

// Mock data for now - we'll replace this with real data from Supabase
const mockProject = {
  id: '1',
  title: 'AI-Powered Chatbot for E-commerce',
  description: 'Develop an intelligent chatbot that can handle customer inquiries, process orders, and provide product recommendations. The chatbot should integrate seamlessly with our existing e-commerce platform and provide a natural conversation experience for customers.',
  required_skills: ['Python', 'React', 'Machine Learning', 'AWS', 'NLP', 'API Development'],
  status: 'open',
  created_at: new Date().toISOString(),
  owner: {
    full_name: 'John Smith',
    company_name: 'TechCorp Inc.',
    email: 'john.smith@techcorp.com'
  },
  additional_details: {
    timeline: '3-4 months',
    budget: '$15,000 - $25,000',
    team_size: '2-3 engineers',
    project_type: 'Full-stack development'
  }
};

// Mock interested engineers data
const mockInterests = [
  {
    id: '1',
    engineer: {
      id: 'eng-1',
      full_name: 'Sarah Johnson',
      headline: 'Senior Full-Stack Developer',
      bio: 'Experienced developer with 5+ years in React, Node.js, and Python. Passionate about AI and machine learning applications.',
      skills: ['React', 'Node.js', 'Python', 'Machine Learning', 'AWS'],
      portfolio_url: 'https://sarah-johnson.dev'
    },
    created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    status: 'pending' as const
  },
  {
    id: '2',
    engineer: {
      id: 'eng-2',
      full_name: 'Mike Chen',
      headline: 'AI/ML Engineer',
      bio: 'Specialized in natural language processing and chatbot development. Built multiple production AI systems.',
      skills: ['Python', 'Machine Learning', 'NLP', 'TensorFlow', 'AWS'],
      portfolio_url: 'https://mike-chen.ai'
    },
    created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    status: 'pending' as const
  }
];

interface ProjectDetailsPageProps {
  params: {
    projectId: string;
  };
}

export default async function ProjectDetailsPage({ params }: ProjectDetailsPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  // In a real app, we would fetch the project data from Supabase using params.projectId
  const project = mockProject;
  const interests = mockInterests;

  if (!project) {
    redirect('/projects');
  }

  const isOwner = user.role === 'business_owner' && project.owner.full_name === user.profile?.full_name;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
            <div className="flex items-center gap-3 mt-2">
              <Badge 
                variant="secondary" 
                className={getStatusColor(project.status)}
              >
                {project.status.replace('_', ' ')}
              </Badge>
              <span className="text-gray-500">Posted {formatDate(project.created_at)}</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Link href="/projects">
              <Button variant="outline">Back to Projects</Button>
            </Link>
            {isOwner && (
              <Link href={`/projects/${project.id}/edit`}>
                <Button variant="outline">Edit Project</Button>
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Project Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Project Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{project.description}</p>
              </CardContent>
            </Card>

            {/* Required Skills */}
            <Card>
              <CardHeader>
                <CardTitle>Required Skills</CardTitle>
                <CardDescription>
                  Skills and technologies needed for this project
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {project.required_skills.map((skill) => (
                    <Badge key={skill} variant="outline" className="text-sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Project Details */}
            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Timeline</label>
                    <p className="text-gray-900">{project.additional_details.timeline}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Budget Range</label>
                    <p className="text-gray-900">{project.additional_details.budget}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Team Size</label>
                    <p className="text-gray-900">{project.additional_details.team_size}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Project Type</label>
                    <p className="text-gray-900">{project.additional_details.project_type}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Interested Engineers Section (for project owners) */}
            {isOwner && (
              <InterestedEngineersList 
                projectId={project.id}
                ownerId={user.id}
                interests={interests}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Owner */}
            <Card>
              <CardHeader>
                <CardTitle>Project Owner</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Name</label>
                  <p className="text-gray-900">{project.owner.full_name}</p>
                </div>
                {project.owner.company_name && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Company</label>
                    <p className="text-gray-900">{project.owner.company_name}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-500">Contact</label>
                  <p className="text-gray-900">{project.owner.email}</p>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card>
              <CardHeader>
                <CardTitle>Get Started</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {user.role === 'engineer' && !isOwner ? (
                  <>
                    <ExpressInterestButton 
                      projectId={project.id}
                      engineerId={user.id}
                      hasExpressedInterest={false} // In real app, check from database
                    />
                    <Button variant="outline" className="w-full">
                      Schedule Interview
                    </Button>
                    <p className="text-xs text-gray-500 text-center">
                      Show your interest and start a conversation with the project owner
                    </p>
                  </>
                ) : isOwner ? (
                  <>
                    <Button variant="outline" className="w-full">
                      View Applications
                    </Button>
                    <Button variant="outline" className="w-full">
                      Manage Project
                    </Button>
                  </>
                ) : (
                  <p className="text-sm text-gray-500 text-center">
                    Sign in as an engineer to express interest in this project
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Project Status */}
            <Card>
              <CardHeader>
                <CardTitle>Project Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Status</span>
                    <Badge variant="secondary" className={getStatusColor(project.status)}>
                      {project.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Posted</span>
                    <span className="text-sm text-gray-900">{formatDate(project.created_at)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Applications</span>
                    <span className="text-sm text-gray-900">{interests.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Actions for Engineers */}
        {user.role === 'engineer' && !isOwner && (
          <Card>
            <CardHeader>
              <CardTitle>Ready to Apply?</CardTitle>
              <CardDescription>
                Take the next step to connect with this project
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Express Interest</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Let the project owner know you're interested in working on this project
                  </p>
                  <ExpressInterestButton 
                    projectId={project.id}
                    engineerId={user.id}
                    hasExpressedInterest={false}
                  />
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Schedule Interview</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Set up a meeting to discuss the project details and your qualifications
                  </p>
                  <Button variant="outline" className="w-full">Schedule Interview</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
