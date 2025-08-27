// src/components/dashboard/InterestedEngineersList.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatSkills, formatDate } from '@/lib/utils';
import ScheduleInterviewForm from './ScheduleInterviewForm';

interface Engineer {
  id: string;
  full_name: string;
  headline?: string;
  bio?: string;
  skills?: string[];
  portfolio_url?: string;
}

interface ProjectInterest {
  id: string;
  engineer: Engineer;
  created_at: string;
  status: 'pending' | 'accepted' | 'rejected';
}

interface InterestedEngineersListProps {
  projectId: string;
  ownerId: string;
  interests: ProjectInterest[];
}

export default function InterestedEngineersList({ 
  projectId, 
  ownerId, 
  interests 
}: InterestedEngineersListProps) {
  if (interests.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Interested Engineers</CardTitle>
          <CardDescription>
            Engineers who have expressed interest in your project
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <p>No engineers have expressed interest yet.</p>
            <p className="text-sm mt-2">
              Share your project to attract talented engineers!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Interested Engineers ({interests.length})</CardTitle>
        <CardDescription>
          Engineers who have expressed interest in your project
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {interests.map((interest) => (
            <div key={interest.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-lg">{interest.engineer.full_name}</h4>
                  {interest.engineer.headline && (
                    <p className="text-gray-600">{interest.engineer.headline}</p>
                  )}
                </div>
                <Badge variant="secondary">
                  {interest.status}
                </Badge>
              </div>

              {interest.engineer.bio && (
                <p className="text-gray-700 text-sm">{interest.engineer.bio}</p>
              )}

              {interest.engineer.skills && interest.engineer.skills.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Skills:</h5>
                  <div className="flex flex-wrap gap-1">
                    {interest.engineer.skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center pt-2">
                <div className="text-xs text-gray-500">
                  Expressed interest {formatDate(interest.created_at)}
                </div>
                
                <div className="flex gap-2">
                  {interest.engineer.portfolio_url && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(interest.engineer.portfolio_url, '_blank')}
                    >
                      View Portfolio
                    </Button>
                  )}
                  
                  <ScheduleInterviewForm
                    projectId={projectId}
                    engineerId={interest.engineer.id}
                    ownerId={ownerId}
                    engineerName={interest.engineer.full_name}
                    trigger={
                      <Button size="sm">
                        Schedule Interview
                      </Button>
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
