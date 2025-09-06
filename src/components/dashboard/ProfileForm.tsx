// src/components/dashboard/ProfileForm.tsx
'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { profileSchema } from '@/lib/validators';
import { updateProfile } from '@/app/actions';
import { Profile } from '@/lib/types';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface ProfileFormProps { user: Profile; }

export type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: user.full_name || "",
      headline: user.headline || "",
      bio: user.bio || "",
      skills: user.skills || [],
      portfolio_url: user.portfolio_url || "",
      company_name: user.company_name || "",
    },
  });

  const onSubmit = (values: ProfileFormData) => {
    startTransition(async () => {
      const result = await updateProfile(user.id, values);
      if ((result as any).error) {
        toast.error((result as any).error);
      } else {
        toast.success("Your profile has been updated.");
        router.refresh();
      }
    });
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Manage Your Profile</CardTitle>
        <CardDescription>Keep your information up to date to attract the best opportunities.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="p-3 mb-4 text-sm text-orange-800 rounded-lg bg-orange-50" role="alert">
          <span className="font-medium">Security Reminder:</span> Do not include personal contact information (email, phone number) in your public profile fields. All communication should be handled through the platform.
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField control={form.control} name="full_name" render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl><Input placeholder="Your full name" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {user.role === 'engineer' && (
              <>
                <FormField control={form.control} name="headline" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Headline</FormLabel>
                    <FormControl><Input placeholder="e.g., Senior Frontend Engineer" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="bio" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl><Textarea placeholder="Tell us about your experience and what you're passionate about." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="skills" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skills</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="React, Node.js, Python, AI" 
                        value={field.value?.join(', ') || ''} 
                        onChange={(e) => {
                          const skills = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                          field.onChange(skills);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="portfolio_url" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Portfolio URL</FormLabel>
                    <FormControl><Input placeholder="https://your-portfolio.com" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </>
            )}
            {user.role === 'business_owner' && (
              <FormField control={form.control} name="company_name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl><Input placeholder="Your company's name" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            )}
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
