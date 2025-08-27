// src/lib/validators.ts
// Zod validation schemas for the Engineer-Business Platform

import { z } from 'zod'

// Registration form validation
export const registrationSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters').max(100, 'Full name must be less than 100 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters').regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  role: z.enum(['engineer', 'business_owner'])
})

// Login form validation
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required')
})

// Profile form validation
export const profileSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters').max(100, 'Full name must be less than 100 characters'),
  headline: z.string().max(200, 'Headline must be less than 200 characters').optional(),
  bio: z.string().max(1000, 'Bio must be less than 1000 characters').optional(),
  skills: z.array(z.string().min(1, 'Skill cannot be empty')).max(20, 'Maximum 20 skills allowed').optional(),
  portfolio_url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  company_name: z.string().max(100, 'Company name must be less than 100 characters').optional()
})

// Project form validation
export const projectSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200, 'Title must be less than 200 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters').max(2000, 'Description must be less than 2000 characters'),
  required_skills: z.array(z.string().min(1, 'Skill cannot be empty')).min(1, 'At least one skill is required').max(15, 'Maximum 15 skills allowed')
})

// Interview form validation
export const interviewSchema = z.object({
  project_id: z.string().uuid('Invalid project ID'),
  engineer_id: z.string().uuid('Invalid engineer ID'),
  scheduled_time: z.string().min(1, 'Scheduled time is required'),
  meeting_link: z.string().url('Please enter a valid meeting link').min(1, 'Meeting link is required')
})

// Skills input validation (for comma-separated input)
export const skillsInputSchema = z.object({
  skills: z.string().min(1, 'Skills are required').transform((val) => 
    val.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0)
  )
})

// Search and filter schemas
export const searchSchema = z.object({
  query: z.string().optional(),
  role: z.enum(['engineer', 'business_owner']).optional(),
  skills: z.array(z.string()).optional(),
  status: z.enum(['pending_approval', 'approved', 'rejected']).optional()
})

export const projectFilterSchema = z.object({
  status: z.enum(['open', 'matching', 'in_progress', 'closed']).optional(),
  skills: z.array(z.string()).optional(),
  owner_id: z.string().uuid().optional()
})

// Export types
export type RegistrationFormData = z.infer<typeof registrationSchema>
export type LoginFormData = z.infer<typeof loginSchema>
export type ProfileFormData = z.infer<typeof profileSchema>
export type ProjectFormData = z.infer<typeof projectSchema>
export type InterviewFormData = z.infer<typeof interviewSchema>
export type SkillsInputData = z.infer<typeof skillsInputSchema>
export type SearchData = z.infer<typeof searchSchema>
export type ProjectFilterData = z.infer<typeof projectFilterSchema>
