'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

// Global auth state shared across all hook instances
let globalUser: AuthUser | null = null
let globalLoading = true
let globalInitialized = false
const authListeners = new Set<(user: AuthUser | null, loading: boolean) => void>()

// Helper function to update global state and notify all listeners
function updateGlobalState(user: AuthUser | null, loading: boolean) {
  globalUser = user
  globalLoading = loading
  authListeners.forEach(listener => listener(user, loading))
}

// Global profile loading function
const loadUserProfile = async (authUser: User) => {
  try {
    console.log('🔥 loadUserProfile: Starting for user:', authUser.id)

    // Önce profile var mı kontrol et
    const { data: existingProfile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single()

    console.log('🔥 loadUserProfile: Profile query result:', { profile: !!existingProfile, error })

    if (existingProfile) {
      console.log('🔥 loadUserProfile: Setting user with profile')
      updateGlobalState({ ...authUser, profile: existingProfile }, false)
      return
    }

    console.log('🔥 loadUserProfile: Profile not found, creating...')
    // Profile yoksa upsert ile oluştur (conflict olursa güncelle)
    const { data: newProfile, error: upsertError } = await supabase
      .from('profiles')
      .upsert({
        id: authUser.id,
        username: authUser.email?.split('@')[0] || `user_${authUser.id.slice(0, 8)}`,
        full_name: '',
        role: 'user'
      }, {
        onConflict: 'id'
      })
      .select()
      .single()

    console.log('🔥 loadUserProfile: Upsert result:', { profile: !!newProfile, error: upsertError })

    if (newProfile) {
      console.log('🔥 loadUserProfile: Setting user with new profile')
      updateGlobalState({ ...authUser, profile: newProfile }, false)
    } else {
      console.error('🔥 loadUserProfile: Failed to create profile, error:', upsertError)
      // 401 hatası varsa, sadece user'ı profile olmadan set et
      if (upsertError?.code === 'PGRST301' || upsertError?.message?.includes('401')) {
        console.log('🔥 loadUserProfile: Auth error, setting user without profile')
        updateGlobalState(authUser, false)
      } else {
        // Diğer hatalarda da user'ı set et
        updateGlobalState(authUser, false)
      }
    }
  } catch (error) {
    console.error('🔥 loadUserProfile: Exception:', error)
    // Exception durumunda da user'ı profile olmadan set et
    updateGlobalState(authUser, false)
  }
}

interface Profile {
  id: string
  username: string
  full_name: string
  role: string
  avatar_url: string
}

interface AuthUser extends User {
  profile?: Profile
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(globalUser)
  const [loading, setLoading] = useState(globalLoading)

  useEffect(() => {
    // Subscribe to global auth state changes
    const updateState = (newUser: AuthUser | null, newLoading: boolean) => {
      setUser(newUser)
      setLoading(newLoading)
    }

    authListeners.add(updateState)

    // If not initialized, initialize now
    if (!globalInitialized) {
      console.log('🔥 useAuth: Initializing...')
      globalInitialized = true

      // Get initial session
      supabase.auth.getSession().then(({ data: { session } }) => {
        console.log('🔥 useAuth: Initial session result:', !!session)
        if (session?.user) {
          console.log('🔥 useAuth: Loading profile for user:', session.user.id)
          loadUserProfile(session.user)
        } else {
          console.log('🔥 useAuth: No session, setting user to null')
          updateGlobalState(null, false)
        }
      })

      // Listen for auth changes
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((event, session) => {
        console.log('🔥 useAuth: Auth change event:', event, !!session)
        if (session?.user) {
          console.log('🔥 useAuth: Loading profile for user:', session.user.id)
          loadUserProfile(session.user)
        } else {
          console.log('🔥 useAuth: No session in change event, setting user to null')
          updateGlobalState(null, false)
        }
      })

      return () => {
        subscription.unsubscribe()
        authListeners.delete(updateState)
      }
    } else {
      // Already initialized, just sync with global state
      setUser(globalUser)
      setLoading(globalLoading)
    }

    return () => {
      authListeners.delete(updateState)
    }
  }, [])

  const isAuthenticated = !!user
  const isAdmin = user?.profile?.role === 'admin'
  const isModerator = user?.profile?.role === 'moderator' || isAdmin

  return { 
    user, 
    loading, 
    isAuthenticated, 
    isAdmin, 
    isModerator,
    profile: user?.profile 
  }
}

export function useProfile(userId?: string) {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    async function getProfile() {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single()

        if (error) throw error
        setProfile(data)
      } catch (error) {
        console.error('Error fetching profile:', error)
      } finally {
        setLoading(false)
      }
    }

    getProfile()
  }, [userId])

  return { profile, loading }
}