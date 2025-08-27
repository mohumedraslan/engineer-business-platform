// src/lib/store.ts
// Zustand store for global state management

import { create } from 'zustand'
import { createClient } from './supabase/client'
import type { Profile, AuthUser, Session } from './types'

interface AuthState {
  user: AuthUser | null
  profile: Profile | null
  isLoading: boolean
  isAuthenticated: boolean
  
  // Actions
  setUser: (user: AuthUser | null) => void
  setProfile: (profile: Profile | null) => void
  setLoading: (loading: boolean) => void
  signOut: () => Promise<void>
  refreshSession: () => Promise<void>
}

interface UIState {
  sidebarOpen: boolean
  theme: 'light' | 'dark' | 'system'
  
  // Actions
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  setTheme: (theme: 'light' | 'dark' | 'system') => void
}

// Auth Store
export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  isLoading: true,
  isAuthenticated: false,

  setUser: (user) => {
    set({ 
      user, 
      isAuthenticated: !!user,
      isLoading: false 
    })
  },

  setProfile: (profile) => {
    set({ profile })
  },

  setLoading: (loading) => {
    set({ isLoading: loading })
  },

  signOut: async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    set({ 
      user: null, 
      profile: null, 
      isAuthenticated: false,
      isLoading: false 
    })
  },

  refreshSession: async () => {
    const supabase = createClient()
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (session?.user && !error) {
      // Fetch user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      const authUser: AuthUser = {
        id: session.user.id,
        email: session.user.email!,
        role: profile?.role || 'engineer',
        profile: profile
      }

      set({ 
        user: authUser, 
        profile, 
        isAuthenticated: true,
        isLoading: false 
      })
    } else {
      set({ 
        user: null, 
        profile: null, 
        isAuthenticated: false,
        isLoading: false 
      })
    }
  }
}))

// UI Store
export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  theme: 'system',

  toggleSidebar: () => {
    set((state) => ({ sidebarOpen: !state.sidebarOpen }))
  },

  setSidebarOpen: (open) => {
    set({ sidebarOpen: open })
  },

  setTheme: (theme) => {
    set({ theme })
    // Apply theme to document
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
}))

// Combined store selector for components that need both
export const useStore = () => {
  const auth = useAuthStore()
  const ui = useUIStore()
  
  return {
    ...auth,
    ...ui
  }
}
