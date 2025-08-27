-- Engineer-Business Platform Database Schema
-- This file contains the complete SQL script to set up the Supabase PostgreSQL database
-- for the Engineer-Business Platform

-- 1. ENUMS (for consistent roles and statuses)
CREATE TYPE public.user_role AS ENUM ('engineer', 'business_owner', 'admin');
CREATE TYPE public.profile_status AS ENUM ('pending_approval', 'approved', 'rejected');
CREATE TYPE public.project_status AS ENUM ('open', 'matching', 'in_progress', 'closed');
CREATE TYPE public.interview_status AS ENUM ('scheduled', 'completed', 'cancelled');
CREATE TYPE public.interest_status AS ENUM ('pending', 'accepted', 'rejected');

-- 2. PROFILES TABLE (linked to Supabase Auth users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  role public.user_role NOT NULL,
  status public.profile_status DEFAULT 'pending_approval',
  -- Engineer-specific fields
  headline TEXT,
  bio TEXT,
  skills JSONB, -- e.g., ["React", "Node.js", "AI"]
  portfolio_url TEXT,
  resume_url TEXT, -- Will link to Supabase Storage
  -- Business Owner-specific fields
  company_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. PROJECTS TABLE
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  required_skills JSONB NOT NULL,
  status public.project_status DEFAULT 'open',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. PROJECT INTERESTS TABLE
CREATE TABLE public.project_interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  engineer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status public.interest_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(project_id, engineer_id)
);

-- 5. INTERVIEWS TABLE
CREATE TABLE public.interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  engineer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scheduled_time TIMESTAMPTZ,
  meeting_link TEXT, -- Business owner will paste a Google Meet/Jitsi link here
  status public.interview_status DEFAULT 'scheduled'
);

-- 6. NOTIFICATIONS TABLE
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  link TEXT, -- Optional link to the relevant page (e.g., a project)
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. ROW LEVEL SECURITY (RLS) - CRITICAL FOR PRIVACY
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Profiles
CREATE POLICY "Users can view any approved profile" ON public.profiles FOR SELECT USING (status = 'approved');
CREATE POLICY "Users can create their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can manage all profiles" ON public.profiles FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- RLS Policies for Projects
CREATE POLICY "Anyone can see open projects" ON public.projects FOR SELECT USING (status = 'open');
CREATE POLICY "Owners can manage their own projects" ON public.projects FOR ALL USING (auth.uid() = owner_id);

-- RLS Policies for Project Interests
CREATE POLICY "Engineers can view their own interests" ON public.project_interests FOR SELECT USING (auth.uid() = engineer_id);
CREATE POLICY "Project owners can view interests for their projects" ON public.project_interests FOR SELECT USING (EXISTS (SELECT 1 FROM projects WHERE id = project_interests.project_id AND owner_id = auth.uid()));
CREATE POLICY "Engineers can create interests" ON public.project_interests FOR INSERT WITH CHECK (auth.uid() = engineer_id);
CREATE POLICY "Project owners can update interest status" ON public.project_interests FOR UPDATE USING (EXISTS (SELECT 1 FROM projects WHERE id = project_interests.project_id AND owner_id = auth.uid()));

-- RLS Policies for Interviews
CREATE POLICY "Involved parties can see their interviews" ON public.interviews FOR SELECT USING (auth.uid() = engineer_id OR auth.uid() = owner_id);
CREATE POLICY "Admins can see all interviews" ON public.interviews FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- RLS Policies for Notifications
CREATE POLICY "Users can manage their own notifications" ON public.notifications FOR ALL USING (auth.uid() = user_id);

-- 8. INDEXES for better performance
CREATE INDEX idx_profiles_role_status ON public.profiles(role, status);
CREATE INDEX idx_projects_owner_id ON public.projects(owner_id);
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_project_interests_project_id ON public.project_interests(project_id);
CREATE INDEX idx_project_interests_engineer_id ON public.project_interests(engineer_id);
CREATE INDEX idx_interviews_engineer_id ON public.interviews(engineer_id);
CREATE INDEX idx_interviews_owner_id ON public.interviews(owner_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);

-- 9. Enable Realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- 10. Comments for documentation
COMMENT ON TABLE public.profiles IS 'User profiles with role-specific information';
COMMENT ON TABLE public.projects IS 'Projects posted by business owners';
COMMENT ON TABLE public.project_interests IS 'Engineer interest in projects';
COMMENT ON TABLE public.interviews IS 'Scheduled interviews between engineers and business owners';
COMMENT ON TABLE public.notifications IS 'Real-time notifications for users';
COMMENT ON TYPE public.user_role IS 'User roles: engineer, business_owner, admin';
COMMENT ON TYPE public.profile_status IS 'Profile approval status';
COMMENT ON TYPE public.project_status IS 'Project lifecycle status';
COMMENT ON TYPE public.interview_status IS 'Interview status';
COMMENT ON TYPE public.interest_status IS 'Interest expression status';

-- 11. GRANTS (if using custom roles)
-- GRANT USAGE ON SCHEMA public TO authenticated;
-- GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
-- GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
