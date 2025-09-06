// src/app/(dashboard)/projects/page.tsx
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import ProjectSearch from '@/components/dashboard/ProjectSearch';
import { Briefcase, Building, Clock } from 'lucide-react';

interface ProjectOwner {
  full_name: string;
  company_name?: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  required_skills: string[];
  created_at: string;
  owner: ProjectOwner;
  status: string;
}

export default async function ProjectsPage({ 
  searchParams 
}: { 
  searchParams?: { query?: string; }; 
}) {
  const supabase = await createClient();
  const query = searchParams?.query || '';

  let queryBuilder = supabase
    .from('projects')
    .select(`
      id,
      title,
      description,
      required_skills,
      created_at,
      owner:profiles!owner_id ( full_name, company_name )
    `)
    .eq('status', 'open')
    .order('created_at', { ascending: false });

  if (query.trim()) {
    // If you created the full-text search index, switch this to textSearch
    // queryBuilder = queryBuilder.textSearch('title_description_skills', query, { type: 'websearch', config: 'english' });
    queryBuilder = queryBuilder.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
  }

  const { data: projects, error } = await queryBuilder as { data: Project[] | null; error: any };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <p className="p-8 text-red-600">Error: {error.message}</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Open Projects</h1>
              <p className="text-gray-600 mt-2">
                Find your next opportunity from {projects?.length || 0} available projects
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {projects?.length || 0} Projects
              </Badge>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col items-center space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Find Your Perfect Project</h2>
            <ProjectSearch />
            {query && (
              <p className="text-sm text-gray-600">
                Showing results for: <span className="font-medium">&ldquo;{query}&rdquo;</span>
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects && projects.length > 0 ? (
            projects.map((project: Project) => (
              <Link href={`/projects/${project.id}`} key={project.id} className="block">
                <Card className="h-full hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg leading-tight group-hover:text-blue-600 transition-colors">
                          {project.title}
                        </CardTitle>
                        <CardDescription className="mt-2 flex items-center text-sm">
                          <Building className="h-4 w-4 mr-2 text-gray-400" />
                          {project.owner?.company_name || project.owner?.full_name || 'A Business Owner'}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                        Open
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-gray-600 line-clamp-3 mb-4 leading-relaxed">
                      {project.description}
                    </p>
                    <div className="mb-4">
                      <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Required Skills</h4>
                      <div className="flex flex-wrap gap-1">
                        {(project.required_skills as string[])?.slice(0, 4).map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs px-2 py-1">
                            {skill}
                          </Badge>
                        ))}
                        {(project.required_skills as string[])?.length > 4 && (
                          <Badge variant="outline" className="text-xs px-2 py-1">
                            +{(project.required_skills as string[]).length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-3">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDate(project.created_at)}
                      </div>
                      <div className="flex items-center">
                        <Briefcase className="h-3 w-3 mr-1" />
                        {project.required_skills ? (project.required_skills as string[]).length : 0} skills
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            <div className="col-span-full">
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <Briefcase className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {query ? 'No projects found' : 'No projects available'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {query 
                    ? `No projects match your search for "${query}". Try different keywords or browse all projects.`
                    : 'There are currently no open projects. Check back later for new opportunities.'
                  }
                </p>
                {query && (
                  <Link href="/projects">
                    <Badge variant="outline" className="cursor-pointer hover:bg-gray-50">
                      View All Projects
                    </Badge>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
