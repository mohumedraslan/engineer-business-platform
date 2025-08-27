-- Fix RLS Policies - Remove Infinite Recursion
-- Run this in your Supabase SQL Editor AFTER running the main schema

-- 1. Drop the problematic policies that cause infinite recursion
DROP POLICY IF EXISTS "Users can view any approved profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can create and update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;

-- 2. Create the fixed policies without circular references
CREATE POLICY "Users can view any approved profile" ON public.profiles 
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Users can create their own profile" ON public.profiles 
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles 
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can delete their own profile" ON public.profiles 
  FOR DELETE USING (auth.uid() = id);

-- 3. Fix project policies if they exist
DROP POLICY IF EXISTS "Anyone can see open projects" ON public.projects;
DROP POLICY IF EXISTS "Owners can manage their own projects" ON public.projects;

CREATE POLICY "Anyone can see open projects" ON public.projects 
  FOR SELECT USING (status = 'open');

CREATE POLICY "Owners can manage their own projects" ON public.projects 
  FOR ALL USING (auth.uid() = owner_id);

-- 4. Fix interview policies if they exist
DROP POLICY IF EXISTS "Involved parties can see their interviews" ON public.interviews;
DROP POLICY IF EXISTS "Admins can see all interviews" ON public.interviews;

CREATE POLICY "Involved parties can see their interviews" ON public.interviews 
  FOR SELECT USING (auth.uid() = engineer_id OR auth.uid() = owner_id);

CREATE POLICY "Project owners can create interviews" ON public.interviews 
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- 5. Verify the policies are working
-- This should return the list of active policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;
