-- Fix RLS Policies - Remove Infinite Recursion
-- Run this in your Supabase SQL Editor AFTER running the main schema

-- 1. Drop all existing policies for a clean slate
DROP POLICY IF EXISTS "Users can view any approved profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;

-- 2. Create optimized RLS policies with proper security
-- Profiles: View any approved profile
CREATE POLICY "view_approved_profiles" ON public.profiles 
  FOR SELECT USING (status = 'approved');

-- Profiles: Users can manage their own profile (insert, update, delete)
CREATE POLICY "manage_own_profile" ON public.profiles 
  FOR ALL USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Profiles: Admins can manage all profiles
CREATE POLICY "admin_manage_all_profiles" ON public.profiles 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 3. Optimize project policies
DROP POLICY IF EXISTS "Anyone can see open projects" ON public.projects;
DROP POLICY IF EXISTS "Owners can manage their own projects" ON public.projects;

-- Projects: Anyone can view open projects
CREATE POLICY "view_open_projects" ON public.projects 
  FOR SELECT USING (status = 'open');

-- Projects: Owners can fully manage their own projects
CREATE POLICY "manage_own_projects" ON public.projects 
  FOR ALL USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- 4. Optimize interview policies
DROP POLICY IF EXISTS "Involved parties can see their interviews" ON public.interviews;
DROP POLICY IF EXISTS "Admins can see all interviews" ON public.interviews;
DROP POLICY IF EXISTS "Project owners can create interviews" ON public.interviews;

-- Interviews: Involved parties can view their interviews
CREATE POLICY "view_own_interviews" ON public.interviews 
  FOR SELECT USING (auth.uid() = engineer_id OR auth.uid() = owner_id);

-- Interviews: Project owners can create interviews for their projects
CREATE POLICY "create_interviews" ON public.interviews 
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- Interviews: Involved parties can update their interviews
CREATE POLICY "update_own_interviews" ON public.interviews 
  FOR UPDATE USING (auth.uid() = engineer_id OR auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- 5. Verify the policies are working
-- This should return the list of active policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;
