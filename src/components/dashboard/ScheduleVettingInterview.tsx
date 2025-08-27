// src/components/dashboard/ScheduleVettingInterview.tsx
'use client';

import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { scheduleVettingInterview } from '@/app/actions';

export default function ScheduleVettingInterview({ engineerId, engineerName, adminId }: { engineerId: string; engineerName: string; adminId: string; }) {
  const [isPending, startTransition] = useTransition();

  const handleSchedule = () => {
    startTransition(async () => {
      const result = await scheduleVettingInterview({ engineerId, adminId });
      if ((result as any)?.error) {
        toast.error((result as any).error);
      } else {
        toast.success(`Vetting interview scheduled for ${engineerName}.`);
        window.location.reload();
      }
    });
  };

  return (
    <Button size="sm" variant="outline" onClick={handleSchedule} disabled={isPending}>
      {isPending ? 'Scheduling…' : 'Schedule Vetting'}
    </Button>
  );
}
