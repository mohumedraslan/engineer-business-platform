-- FIX-IT SCRIPT: Run this entire block in your Supabase SQL Editor

-- 1. FIX RLS POLICY FOR PROFILE CREATION
-- Drop potentially conflicting old policies first for a clean slate
DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can create and update their own profile" ON public.profiles;

-- Create the correct, secure policies
CREATE POLICY "Users can create their own profile" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = id);


-- 2. FIX THE PROJECTS FULL-TEXT SEARCH INDEX
-- Drop the old broken index and column if they exist
DROP INDEX IF EXISTS projects_search_idx;
ALTER TABLE public.projects DROP COLUMN IF EXISTS title_description_skills;

-- Re-create the column and index with the correct type casting
ALTER TABLE public.projects
ADD COLUMN title_description_skills tsvector
GENERATED ALWAYS AS (
  to_tsvector(
    'english',
    COALESCE(title, '') || ' ' || COALESCE(description, '') || ' ' || 
    COALESCE(
      (
        SELECT string_agg(elem, ' ')
        FROM (
          SELECT value::text AS elem
          FROM jsonb_array_elements_text(required_skills)
        ) s
      ),
      ''
    )
  )
) STORED;

CREATE INDEX projects_search_idx ON public.projects USING GIN (title_description_skills);

-- Backfill existing rows to ensure the generated column is populated
UPDATE public.projects SET title_description_skills = to_tsvector(
  'english',
  COALESCE(title, '') || ' ' || COALESCE(description, '') || ' ' || 
  COALESCE(
    (
      SELECT string_agg(elem, ' ')
      FROM (
        SELECT value::text AS elem
        FROM jsonb_array_elements_text(required_skills)
      ) s
    ),
    ''
  )
);


-- 3. ADD NEW FEATURES FOR ADMIN VETTING INTERVIEW
-- Add a new value to the interview_status ENUM
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_enum e ON t.oid = e.enumtypid
    WHERE t.typname = 'interview_status' AND e.enumlabel = 'pending_vetting'
  ) THEN
    ALTER TYPE public.interview_status ADD VALUE 'pending_vetting';
  END IF;
END $$;

-- Add a new column to the profiles table to track vetting status
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS vetting_status TEXT DEFAULT 'not_vetted';

-- Add a new column to the interviews table to specify the type
ALTER TABLE public.interviews
ADD COLUMN IF NOT EXISTS interview_type TEXT DEFAULT 'project_interview';


-- 4. FIX NOTIFICATION RLS POLICY
DROP POLICY IF EXISTS "Users can manage their own notifications" ON public.notifications;
CREATE POLICY "Users can view and manage their own notifications" ON public.notifications
FOR ALL USING (auth.uid() = user_id);
