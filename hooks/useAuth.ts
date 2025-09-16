'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

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
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

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
        setUser({ ...authUser, profile: existingProfile })
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
        setUser({ ...authUser, profile: newProfile })
      } else {
        console.error('🔥 loadUserProfile: Failed to create profile, setting user without profile')
        setUser(authUser)
      }
    } catch (error) {
      console.error('🔥 loadUserProfile: Exception:', error)
      setUser(authUser)
    }
  }

  useEffect(() => {
    console.log('🔥 useAuth: Initializing...')

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('🔥 useAuth: Initial session result:', !!session)
      if (session?.user) {
        console.log('🔥 useAuth: Loading profile for user:', session.user.id)
        loadUserProfile(session.user)
      } else {
        console.log('🔥 useAuth: No session, setting user to null')
        setUser(null)
      }
      setLoading(false)
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
        setUser(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
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