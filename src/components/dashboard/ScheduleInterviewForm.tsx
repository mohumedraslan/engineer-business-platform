// src/components/dashboard/ScheduleInterviewForm.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTransition } from 'react';
import { scheduleInterview } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface ScheduleInterviewFormProps {
  projectId: string;
  engineerId: string;
  ownerId: string;
  engineerName: string;
  trigger?: React.ReactNode;
}

const ScheduleInterviewSchema = z.object({
  meetingLink: z.string().url({ message: "Please enter a valid meeting URL." }),
  scheduledTime: z.string().refine((val) => {
    const date = new Date(val);
    return !isNaN(date.getTime()) && date > new Date();
  }, { message: "Please select a valid future date and time." }),
});

type ScheduleInterviewFormData = z.infer<typeof ScheduleInterviewSchema>;

export default function ScheduleInterviewForm({ 
  projectId, 
  engineerId, 
  ownerId, 
  engineerName,
  trigger 
}: ScheduleInterviewFormProps) {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<ScheduleInterviewFormData>({
    resolver: zodResolver(ScheduleInterviewSchema),
    defaultValues: {
      meetingLink: '',
      scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16), // Default to tomorrow
    },
  });

  const onSubmit = (values: ScheduleInterviewFormData) => {
    startTransition(async () => {
      const result = await scheduleInterview({
        projectId,
        engineerId,
        ownerId,
        meetingLink: values.meetingLink,
        scheduledTime: new Date(values.scheduledTime)
      });

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(`Interview with ${engineerName} has been scheduled successfully!`);
        setIsOpen(false);
        form.reset();
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>Schedule Interview</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule Interview with {engineerName}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField 
              control={form.control} 
              name="scheduledTime" 
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interview Date and Time</FormLabel>
                  <FormControl>
                    <Input 
                      type="datetime-local" 
                      {...field} 
                      min={new Date().toISOString().slice(0, 16)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} 
            />
            
            <FormField 
              control={form.control} 
              name="meetingLink" 
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meeting Link</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://meet.google.com/..." 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} 
            />
            
            <div className="flex gap-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isPending} 
                className="flex-1"
              >
                {isPending ? 'Scheduling...' : 'Confirm Interview'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
