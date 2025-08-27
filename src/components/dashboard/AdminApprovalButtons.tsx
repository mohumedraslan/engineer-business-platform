// src/components/dashboard/AdminApprovalButtons.tsx
'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { approveEngineer, rejectEngineer } from '@/app/actions';

interface AdminApprovalButtonsProps {
  engineerId: string;
}

export default function AdminApprovalButtons({ engineerId }: AdminApprovalButtonsProps) {
  const [isPending, startTransition] = useTransition();
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);

  const handleApprove = () => {
    setAction('approve');
    startTransition(async () => {
      const result = await approveEngineer(engineerId);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success('Engineer approved successfully!');
        // Refresh the page to update the list
        window.location.reload();
      }
    });
  };

  const handleReject = () => {
    setAction('reject');
    startTransition(async () => {
      const result = await rejectEngineer(engineerId);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success('Engineer rejected successfully!');
        // Refresh the page to update the list
        window.location.reload();
      }
    });
  };

  return (
    <div className="flex space-x-2">
      <Button 
        onClick={handleApprove} 
        disabled={isPending} 
        size="sm" 
        className="bg-green-600 hover:bg-green-700 text-white"
      >
        {action === 'approve' && isPending ? 'Approving...' : 'Approve'}
      </Button>
      <Button 
        onClick={handleReject} 
        disabled={isPending} 
        size="sm" 
        variant="destructive"
      >
        {action === 'reject' && isPending ? 'Rejecting...' : 'Reject'}
      </Button>
    </div>
  );
}
