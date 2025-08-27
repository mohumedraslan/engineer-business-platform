// src/components/dashboard/ExpressInterestButton.tsx
'use client';
import { useTransition, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { expressInterest, checkInterest } from '@/app/actions';

export default function ExpressInterestButton({ projectId, engineerId }: { projectId: string; engineerId: string; }) {
  const [isPending, startTransition] = useTransition();
  const [hasExpressedInterest, setHasExpressedInterest] = useState(false);

  useEffect(() => {
    const run = async () => {
      const res = await checkInterest({ projectId, engineerId });
      setHasExpressedInterest(!!res?.hasInterest);
    };
    run();
  }, [projectId, engineerId]);

  const handleClick = () => {
    startTransition(async () => {
      const result = await expressInterest({ projectId, engineerId });
      if ((result as any)?.error) {
        toast.error((result as any).error);
      } else {
        toast.success('Your interest has been registered.');
        setHasExpressedInterest(true);
      }
    });
  };

  return (
    <Button onClick={handleClick} disabled={isPending || hasExpressedInterest} className="w-full">
      {isPending ? 'Submitting...' : hasExpressedInterest ? 'Interest Expressed' : 'Express Interest in this Project'}
    </Button>
  );
}
