// src/components/dashboard/InterviewActions.tsx
'use client';

import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { updateInterviewStatus } from '@/app/actions';

interface Interview {
  id: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  engineer_id: string;
  owner_id: string;
}

interface InterviewActionsProps {
  interview: Interview;
  currentUserId: string;
}

export default function InterviewActions({ interview, currentUserId }: InterviewActionsProps) {
  const [isPending, startTransition] = useTransition();

  const handleStatusUpdate = (status: 'completed' | 'cancelled') => {
    startTransition(async () => {
      const result = await updateInterviewStatus({ 
        interviewId: interview.id, 
        status 
      });
      
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(`Interview marked as ${status}.`);
        // Refresh the page to update the UI
        window.location.reload();
      }
    });
  };

  // Only show actions if the interview is still scheduled
  if (interview.status !== 'scheduled') {
    return null;
  }

  // Check if the current user is a participant in the interview
  const isParticipant = currentUserId === interview.engineer_id || 
                       currentUserId === interview.owner_id;

  if (!isParticipant) {
    return null;
  }

  return (
    <div className="flex gap-2">
      <Button 
        size="sm" 
        onClick={() => handleStatusUpdate('completed')} 
        disabled={isPending}
        className="bg-green-600 hover:bg-green-700 text-white"
      >
        {isPending ? 'Updating...' : 'Mark as Complete'}
      </Button>
      <Button 
        size="sm" 
        variant="destructive" 
        onClick={() => handleStatusUpdate('cancelled')} 
        disabled={isPending}
      >
        {isPending ? 'Cancelling...' : 'Cancel Interview'}
      </Button>
    </div>
  );
}
