// src/lib/types.ts
// TypeScript types and interfaces for the rabt Platform

export type UserRole = 'engineer' | 'business_owner' | 'admin'
export type ProfileStatus = 'pending_approval' | 'approved' | 'rejected'
export type ProjectStatus = 'open' | 'matching' | 'in_progress' | 'closed'
export type InterviewStatus = 'scheduled' | 'completed' | 'cancelled'

export interface Profile {
  id: string
  email: string | null
  full_name: string | null
  role: UserRole
  status: ProfileStatus
  // Engineer-specific fields
  headline: string | null
  bio: string | null
  skills: string[] | null
  portfolio_url: string | null
  resume_url: string | null
  // Business Owner-specific fields
  company_name: string | null
  created_at?: string
  updated_at?: string
}

export interface Project {
  id: string
  owner_id: string
  title: string
  description: string
  required_skills: string[]
  status: ProjectStatus
  created_at: string
  owner?: Profile // Joined data
}

export interface Interview {
  id: string;
  project_id: string;
  engineer_id: string;
  owner_id: string;
  scheduled_time: string;  // Changed from string | null since we're only displaying scheduled interviews
  meeting_link: string | null;
  status: InterviewStatus;
  project?: Project;
  engineer?: Profile;
  owner?: Profile;
  projects?: {
    title: string;
  };
  profiles?: {
    engineer_id?: {
      full_name: string;
    };
    owner_id?: {
      full_name: string;
    };
  };
}

export interface MatchedEngineer {
  engineer_id: string
  full_name: string | null
  headline: string | null
  skills: string[] | null
  match_score: number
}

// Form types for data input
export interface RegistrationFormData {
  full_name: string
  email: string
  password: string
  role: UserRole
}

export interface LoginFormData {
  email: string
  password: string
}

export interface ProfileFormData {
  full_name: string
  headline?: string
  bio?: string
  skills?: string[]
  portfolio_url?: string
  company_name?: string
}

export interface ProjectFormData {
  title: string
  description: string
  required_skills: string[]
}

export interface InterviewFormData {
  project_id: string
  engineer_id: string
  scheduled_time: string
  meeting_link: string
}

// API Response types
export interface ApiResponse<T> {
  data: T | null
  error: string | null
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  limit: number
  total_pages: number
}

// Auth types
export interface AuthUser {
  id: string
  email: string
  role: UserRole
  profile: Profile | null
}

export interface Session {
  user: AuthUser | null
  isLoading: boolean
}

// Navigation types
export interface NavItem {
  title: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
  requiresAuth?: boolean
  requiredRole?: UserRole[]
}

// Dashboard stats
export interface DashboardStats {
  totalProjects?: number;
  activeProjects?: number;
  pendingInterests?: number;
  upcomingInterviews?: number;
  totalInterests?: number;
  acceptedInterests?: number;
  totalEngineers?: number;
  totalBusinessOwners?: number;
  pendingApprovals?: number;
  activeInterviews?: number;
}

export interface ProjectInterest {
  id: string;
  project_id: string;
  engineer_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  projects?: {
    title: string;
    description: string;
    required_skills: string[];
  };
  profiles?: Profile;
}
