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
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role public.user_role NOT NULL,
  status public.profile_status DEFAULT 'pending_approval',
  -- Engineer-specific fields
  headline TEXT,
  bio TEXT,
  skills JSONB DEFAULT '[]'::jsonb, -- e.g., ["React", "Node.js", "AI"]
  portfolio_url TEXT CHECK (portfolio_url ~ '^https?://'),
  resume_url TEXT CHECK (resume_url ~ '^https?://'), -- Will link to Supabase Storage
  -- Business Owner-specific fields
  company_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  -- Constraints
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT valid_role CHECK (role IN ('engineer', 'business_owner', 'admin')),
  UNIQUE(email)
);

-- 3. PROJECTS TABLE
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL CHECK (length(title) >= 5 AND length(title) <= 200),
  description TEXT NOT NULL CHECK (length(description) >= 50 AND length(description) <= 2000),
  required_skills JSONB NOT NULL DEFAULT '[]'::jsonb,
  status public.project_status DEFAULT 'open',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  -- Constraints
  CONSTRAINT valid_project_status CHECK (status IN ('open', 'matching', 'in_progress', 'closed')),
  CONSTRAINT valid_skills_array CHECK (jsonb_typeof(required_skills) = 'array'),
  CONSTRAINT non_empty_skills CHECK (jsonb_array_length(required_skills) > 0)
);

-- 4. PROJECT INTERESTS TABLE
CREATE TABLE public.project_interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  engineer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status public.interest_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(project_id, engineer_id),
  -- Constraints
  CONSTRAINT valid_interest_status CHECK (status IN ('pending', 'accepted', 'rejected')),
  CONSTRAINT no_self_interest CHECK (engineer_id != (
    SELECT owner_id FROM public.projects WHERE id = project_id
  ))
);

-- 5. INTERVIEWS TABLE
CREATE TABLE public.interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  engineer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scheduled_time TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  status public.interview_status DEFAULT 'scheduled',
  meeting_link TEXT CHECK (meeting_link ~ '^https?://'),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(project_id, engineer_id, scheduled_time),
  -- Constraints
  CONSTRAINT valid_interview_status CHECK (status IN ('scheduled', 'completed', 'cancelled', 'pending_vetting')),
  CONSTRAINT valid_duration CHECK (duration_minutes >= 15 AND duration_minutes <= 240),
  CONSTRAINT future_scheduled_time CHECK (scheduled_time > now()),
  CONSTRAINT valid_meeting_link CHECK (meeting_link IS NULL OR meeting_link ~ '^https?://'),
  CONSTRAINT engineer_owner_different CHECK (engineer_id != owner_id)
);

-- 6. NOTIFICATIONS TABLE
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL CHECK (length(title) >= 5 AND length(title) <= 100),
  message TEXT NOT NULL CHECK (length(message) >= 10 AND length(message) <= 500),
  type TEXT NOT NULL CHECK (type IN ('info', 'warning', 'success', 'error', 'match', 'interview')),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  -- Constraints
  CONSTRAINT valid_notification_type CHECK (type IN ('info', 'warning', 'success', 'error', 'match', 'interview'))
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
-- Profiles indexes
CREATE INDEX idx_profiles_role_status ON public.profiles(role, status);
CREATE INDEX idx_profiles_email ON public.profiles(email) WHERE email IS NOT NULL;
CREATE INDEX idx_profiles_created_at ON public.profiles(created_at DESC);

-- Projects indexes
CREATE INDEX idx_projects_owner_id ON public.projects(owner_id);
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_projects_created_at ON public.projects(created_at DESC);
CREATE INDEX idx_projects_title ON public.projects(title);

-- Project interests indexes
CREATE INDEX idx_project_interests_project_id ON public.project_interests(project_id);
CREATE INDEX idx_project_interests_engineer_id ON public.project_interests(engineer_id);
CREATE INDEX idx_project_interests_status ON public.project_interests(status);
CREATE INDEX idx_project_interests_created_at ON public.project_interests(created_at DESC);

-- Interviews indexes
CREATE INDEX idx_interviews_engineer_id ON public.interviews(engineer_id);
CREATE INDEX idx_interviews_owner_id ON public.interviews(owner_id);
CREATE INDEX idx_interviews_project_id ON public.interviews(project_id);
CREATE INDEX idx_interviews_status ON public.interviews(status);
CREATE INDEX idx_interviews_scheduled_time ON public.interviews(scheduled_time);

-- Notifications indexes
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
