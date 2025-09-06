'use server'

import { createClient } from '@/lib/supabase/server'
import { ProjectFormData } from '@/lib/validators'

export async function createProject(data: ProjectFormData, userId: string) {
  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from('projects')
      .insert({
        owner_id: userId,
        title: data.title,
        description: data.description,
        required_skills: data.required_skills,
        status: 'open'
      })

    if (error) {
      return { error: error.message }
    }

    return { success: true }
  } catch (err) {
    return { error: 'Failed to create project. Please try again.' }
  }
}
