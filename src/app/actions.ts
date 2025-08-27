// src/app/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { registrationSchema, loginSchema } from '@/lib/validators';
import { z } from 'zod';

// --- REGISTRATION ACTION ---
export async function register(values: z.infer<typeof registrationSchema>) {
  const supabase = await createClient();

  const validatedFields = registrationSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields provided." };
  }

  const { full_name, email, password, role } = validatedFields.data;

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: full_name,
        role: role,
      }
    }
  });

  if (authError) {
    console.error("Supabase auth error:", authError.message);
    return { error: authError.message };
  }

  if (!authData.user) {
    return { error: "User could not be created." };
  }

  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: authData.user.id,
      full_name: full_name,
      email: email,
      role: role,
    });

  if (profileError) {
    console.error("Supabase profile error:", profileError.message);
    return { error: "Could not create user profile." };
  }

  revalidatePath('/');
  return { success: "Registration successful! Please check your email to verify your account." };
}

// --- LOGIN ACTION ---
export async function login(values: z.infer<typeof loginSchema>) {
  const supabase = await createClient();

  const validatedFields = loginSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields provided." };
  }

  const { email, password } = validatedFields.data;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: "Invalid login credentials." };
  }

  revalidatePath('/dashboard', 'layout');
  redirect('/dashboard');
}

// --- LOGOUT ACTION ---
export async function logout() {
  const supabase = await createClient();
  
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error("Logout error:", error.message);
    return { error: "Failed to logout." };
  }

  revalidatePath('/', 'layout');
  redirect('/');
}

// --- GET CURRENT USER ACTION ---
export async function getCurrentUser() {
  const supabase = await createClient();
  
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return null;
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return {
    id: user.id,
    email: user.email!,
    role: profile?.role || 'engineer',
    profile: profile
  };
}

// --- UPDATE PROFILE ACTION ---
export async function updateProfile(userId: string, profileData: {
  full_name?: string;
  headline?: string;
  bio?: string;
  skills?: string[];
  portfolio_url?: string;
  resume_url?: string;
  company_name?: string;
}) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('profiles')
    .update(profileData)
    .eq('id', userId);

  if (error) {
    console.error("Profile update error:", error.message);
    return { error: "Failed to update profile." };
  }

  revalidatePath('/profile');
  return { success: "Profile updated successfully!" };
}

// --- CREATE PROJECT ACTION ---
export async function createProject(projectData: {
  title: string;
  description: string;
  required_skills: string[];
  status?: 'open' | 'matching' | 'in_progress' | 'closed';
}, userId: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('projects')
    .insert({
      ...projectData,
      owner_id: userId,
    });

  if (error) {
    console.error("Project creation error:", error.message);
    return { error: "Failed to create project." };
  }

  revalidatePath('/projects');
  return { success: "Project created successfully!" };
}

// --- SCHEDULE INTERVIEW ACTION ---
export async function scheduleInterview(values: { projectId: string; engineerId: string; ownerId: string; meetingLink: string; scheduledTime: Date; }) {
  const supabase = await createClient();
  const { projectId, engineerId, ownerId, meetingLink, scheduledTime } = values;

  try {
    const { data: interview, error } = await supabase
      .from('interviews')
      .insert({
        project_id: projectId,
        engineer_id: engineerId,
        owner_id: ownerId,
        meeting_link: meetingLink,
        scheduled_time: scheduledTime.toISOString(),
        status: 'scheduled',
        interview_type: 'project_interview',
      })
      .select()
      .single();

    if (error) {
      return { error: 'Database error: ' + error.message };
    }

    // Notify the engineer
    await createNotification({
      userId: engineerId,
      message: 'You have been invited to an interview! Check your interviews page for details.',
      link: '/interviews'
    });

    revalidatePath(`/projects/${projectId}`);
    return { success: true, interviewId: interview.id };
  } catch (e: any) {
    return { error: 'Unexpected error scheduling interview.' };
  }
}

// --- EXPRESS INTEREST ACTION ---
export async function expressInterest(data: {
  projectId: string;
  engineerId: string;
}) {
  const supabase = await createClient();
  
  try {
    // First, check if interest has already been expressed
    const { data: existingInterest, error: checkError } = await supabase
      .from('project_interests')
      .select('*')
      .eq('project_id', data.projectId)
      .eq('engineer_id', data.engineerId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error("Error checking existing interest:", checkError);
      return { error: "Failed to check existing interest." };
    }

    if (existingInterest) {
      return { error: "You have already expressed interest in this project." };
    }

    // Insert the interest
    const { error: insertError } = await supabase
      .from('project_interests')
      .insert({
        project_id: data.projectId,
        engineer_id: data.engineerId,
        status: 'pending'
      });

    if (insertError) {
      console.error("Error expressing interest:", insertError);
      return { error: "Failed to express interest in project." };
    }

    // Get project details for notification
    const { data: project } = await supabase
      .from('projects')
      .select('title, owner_id')
      .eq('id', data.projectId)
      .single();

    // Get engineer details for notification
    const { data: engineer } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', data.engineerId)
      .single();

    // Create notification for project owner
    if (project && engineer) {
      await createNotification({
        userId: project.owner_id,
        message: `${engineer.full_name} has expressed interest in your project "${project.title}"`,
        link: `/projects/${data.projectId}`
      });
    }

    revalidatePath('/projects');
    return { success: "Interest expressed successfully!" };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { error: "An unexpected error occurred." };
  }
}

// --- GET PROJECT INTERESTS ACTION ---
export async function getProjectInterests(projectId: string) {
  const supabase = await createClient();
  
  const { data: interests, error } = await supabase
    .from('project_interests')
    .select(`
      *,
      engineer:profiles!project_interests_engineer_id_fkey (
        id,
        full_name,
        headline,
        bio,
        skills,
        portfolio_url
      )
    `)
    .eq('project_id', projectId)
    .eq('status', 'pending');

  if (error) {
    console.error("Error fetching project interests:", error);
    return { error: "Failed to fetch project interests." };
  }

  return { interests: interests || [] };
}

// --- CHECK IF USER HAS EXPRESSED INTEREST ---
export async function checkUserInterest(projectId: string, engineerId: string) {
  const supabase = await createClient();
  
  const { data: interest, error } = await supabase
    .from('project_interests')
    .select('*')
    .eq('project_id', projectId)
    .eq('engineer_id', engineerId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error("Error checking user interest:", error);
    return { error: "Failed to check user interest." };
  }

  return { hasExpressedInterest: !!interest };
}

// --- UPDATE INTERVIEW STATUS ACTION ---
export async function updateInterviewStatus(data: { 
  interviewId: string; 
  status: 'completed' | 'cancelled'; 
}) {
  const supabase = await createClient();
  
  try {
    // Check if the current user is authenticated
    const { data: currentUser } = await supabase.auth.getUser();
    if (!currentUser.user) {
      return { error: "Not authenticated." };
    }

    // Get the interview details to check permissions
    const { data: interview, error: interviewError } = await supabase
      .from('interviews')
      .select('*')
      .eq('id', data.interviewId)
      .single();

    if (interviewError) {
      console.error("Error fetching interview:", interviewError);
      return { error: "Interview not found." };
    }

    // Check if the current user is a participant in the interview
    const isParticipant = currentUser.user.id === interview.engineer_id || 
                         currentUser.user.id === interview.owner_id;

    if (!isParticipant) {
      return { error: "You can only update interviews you are participating in." };
    }

    // Update the interview status
    const { error: updateError } = await supabase
      .from('interviews')
      .update({ status: data.status })
      .eq('id', data.interviewId);

    if (updateError) {
      console.error("Error updating interview status:", updateError);
      return { error: "Failed to update interview status." };
    }

    revalidatePath('/interviews');
    return { success: `Interview status updated to ${data.status}.` };
  } catch (error) {
    console.error("Error updating interview status:", error);
    return { error: "An unexpected error occurred." };
  }
}

// --- APPROVE ENGINEER ACTION ---
export async function approveEngineer(engineerId: string) {
  const supabase = await createClient();
  
  try {
    // Check if the current user is an admin
    const { data: currentUser } = await supabase.auth.getUser();
    if (!currentUser.user) {
      return { error: "Not authenticated." };
    }

    const { data: adminProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', currentUser.user.id)
      .single();

    if (!adminProfile || adminProfile.role !== 'admin') {
      return { error: "Only admins can approve engineers." };
    }

    // Update the engineer's status to approved
    const { error } = await supabase
      .from('profiles')
      .update({ status: 'approved' })
      .eq('id', engineerId)
      .eq('role', 'engineer');

    if (error) {
      console.error("Supabase update error:", error.message);
      return { error: "Failed to approve engineer." };
    }

    revalidatePath('/admin');
    return { success: "Engineer approved successfully!" };
  } catch (error) {
    console.error("Error approving engineer:", error);
    return { error: "An unexpected error occurred." };
  }
}

// --- REJECT ENGINEER ACTION ---
export async function rejectEngineer(engineerId: string) {
  const supabase = await createClient();
  
  try {
    // Check if the current user is an admin
    const { data: currentUser } = await supabase.auth.getUser();
    if (!currentUser.user) {
      return { error: "Not authenticated." };
    }

    const { data: adminProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', currentUser.user.id)
      .single();

    if (!adminProfile || adminProfile.role !== 'admin') {
      return { error: "Only admins can reject engineers." };
    }

    // Update the engineer's status to rejected
    const { error } = await supabase
      .from('profiles')
      .update({ status: 'rejected' })
      .eq('id', engineerId)
      .eq('role', 'engineer');

    if (error) {
      console.error("Supabase update error:", error.message);
      return { error: "Failed to reject engineer." };
    }

    revalidatePath('/admin');
    return { success: "Engineer rejected successfully!" };
  } catch (error) {
    console.error("Error rejecting engineer:", error);
    return { error: "An unexpected error occurred." };
  }
}

// --- DATABASE CONNECTION TEST ---
export async function testDatabaseConnection() {
  try {
    const supabase = await createClient();
    
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return { 
        success: false, 
        error: "Missing Supabase environment variables",
        details: {
          hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        }
      };
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);

    if (error) {
      if (error.message.includes('relation "profiles" does not exist')) {
        return { 
          success: false, 
          error: "Profiles table does not exist. Please run the database schema.",
          details: error
        };
      }
      
      if (error.message.includes('permission denied')) {
        return { 
          success: false, 
          error: "Permission denied. Check RLS policies and user permissions.",
          details: error
        };
      }
      
      return { 
        success: false, 
        error: "Database connection failed",
        details: error
      };
    }

    return { 
      success: true, 
      message: "Database connection successful",
      details: { data }
    };
  } catch (error) {
    return { 
      success: false, 
      error: "Unexpected error during connection test",
      details: error
    };
  }
}

// --- CREATE NOTIFICATION ACTION ---
export async function createNotification(data: {
  userId: string;
  message: string;
  link?: string;
}) {
  const supabase = await createClient();
  
  try {
    const { error } = await supabase
      .from('notifications')
      .insert({
        user_id: data.userId,
        message: data.message,
        link: data.link
      });

    if (error) {
      console.error("Error creating notification:", error);
      return { error: "Failed to create notification." };
    }

    return { success: "Notification created successfully!" };
  } catch (error) {
    console.error("Error creating notification:", error);
    return { error: "An unexpected error occurred." };
  }
}

// --- MARK NOTIFICATION AS READ ACTION ---
export async function markNotificationAsRead(notificationId: string) {
  const supabase = await createClient();
  
  try {
    // Check if the current user is authenticated
    const { data: currentUser } = await supabase.auth.getUser();
    if (!currentUser.user) {
      return { error: "Not authenticated." };
    }

    // Update the notification to mark it as read
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
      .eq('user_id', currentUser.user.id);

    if (error) {
      console.error("Error marking notification as read:", error);
      return { error: "Failed to mark notification as read." };
    }

    return { success: "Notification marked as read." };
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return { error: "An unexpected error occurred." };
  }
}

// --- GET USER NOTIFICATIONS ACTION ---
export async function getUserNotifications() {
  const supabase = await createClient();
  
  try {
    const { data: currentUser } = await supabase.auth.getUser();
    if (!currentUser.user) {
      return { error: "Not authenticated." };
    }

    const { data: notifications, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', currentUser.user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error("Error fetching notifications:", error);
      return { error: "Failed to fetch notifications." };
    }

    return { notifications: notifications || [] };
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return { error: "An unexpected error occurred." };
  }
}

// --- SCHEDULE VETTING INTERVIEW ACTION ---
export async function scheduleVettingInterview(values: { engineerId: string; adminId: string; }) {
  const supabase = await createClient();
  const { engineerId, adminId } = values;

  try {
    // Create a placeholder vetting interview
    const { data: interview, error } = await supabase
      .from('interviews')
      .insert({
        engineer_id: engineerId,
        owner_id: adminId,
        status: 'pending_vetting',
        interview_type: 'vetting_interview',
      })
      .select()
      .single();

    if (error) {
      return { error: 'Database error: ' + error.message };
    }

    // Update the engineer profile vetting status
    await supabase
      .from('profiles')
      .update({ vetting_status: 'pending' })
      .eq('id', engineerId);

    // Notify engineer
    await createNotification({
      userId: engineerId,
      message: 'An admin scheduled a vetting interview for your profile. Check your interviews page.',
      link: '/interviews'
    });

    revalidatePath('/admin');
    return { success: true, interviewId: interview.id };
  } catch (e: any) {
    return { error: 'Unexpected error scheduling vetting interview.' };
  }
}

// --- CHECK INTEREST ACTION (alias convenient for client) ---
export async function checkInterest(values: { projectId: string; engineerId: string; }) {
  const supabase = await createClient();
  const { projectId, engineerId } = values;
  const { data, error } = await supabase
    .from('project_interests')
    .select('id')
    .eq('project_id', projectId)
    .eq('engineer_id', engineerId)
    .maybeSingle();

  if (error && error.code !== 'PGRST116') {
    return { hasInterest: false };
  }

  return { hasInterest: !!data };
}
