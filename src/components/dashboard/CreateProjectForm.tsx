// src/components/dashboard/CreateProjectForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ProjectSchema } from '@/lib/validators';
import { createProject } from '@/app/actions';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function CreateProjectForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof ProjectSchema>>({
    resolver: zodResolver(ProjectSchema),
    defaultValues: { title: "", description: "", requiredSkills: "" },
  });

  const onSubmit = (values: z.infer<typeof ProjectSchema>) => {
    startTransition(async () => {
      const result = await createProject(values);
      if ((result as any).error) {
        toast.error((result as any).error);
      } else {
        toast.success("Your project has been posted.");
        router.push('/projects');
      }
    });
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Post a New Project</CardTitle>
        <CardDescription>Describe your project to find the perfect engineering talent.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="p-3 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50" role="alert">
          <span className="font-medium">Posting Guideline:</span> To protect all parties, please do not ask for or include personal contact details in your project description. All initial contact will be managed through the platform's interview system.
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem>
                <FormLabel>Project Title</FormLabel>
                <FormControl><Input placeholder="e.g., AI-Powered Chatbot for E-commerce Site" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>Project Description</FormLabel>
                <FormControl><Textarea rows={6} placeholder="Provide a detailed description of the project, its goals, and the problem you are trying to solve." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="requiredSkills" render={({ field }) => (
              <FormItem>
                <FormLabel>Required Skills</FormLabel>
                <FormControl><Input placeholder="Enter skills separated by commas: React, Python, AWS" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Posting Project..." : "Post Project"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
