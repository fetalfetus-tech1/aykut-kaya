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
      console.log('🔍 loadUserProfile - Starting for user:', authUser.id, authUser.email)
      // Önce profile var mı kontrol et
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single()

      console.log('🔍 loadUserProfile - Existing profile check result:', existingProfile)

      if (existingProfile) {
        console.log('🔍 loadUserProfile - Profile found, setting user with profile')
        setUser({ ...authUser, profile: existingProfile })
        return
      }

      // Profile yoksa upsert ile oluştur (conflict olursa güncelle)
      console.log('🔍 loadUserProfile - Profile not found, trying upsert...')
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

      console.log('🔍 loadUserProfile - Upsert result:', { newProfile, upsertError })

      if (newProfile) {
        console.log('🔍 loadUserProfile - Profile created, setting user with profile')
        setUser({ ...authUser, profile: newProfile })
      } else {
        console.error('🔍 loadUserProfile - Profile creation failed:', upsertError)
        // Hata durumunda profile olmadan devam et
        setUser(authUser)
      }
    } catch (error) {
      console.error('🔍 loadUserProfile - Exception:', error)
      // Hata durumunda profile olmadan devam et
      setUser(authUser)
    }
  }

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('🔍 useAuth - Initial session:', session)
      if (session?.user) {
        loadUserProfile(session.user)
      } else {
        console.log('🔍 useAuth - No initial session, user is null')
        setUser(null)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('🔍 useAuth - Auth state change:', _event, session)
      if (session?.user) {
        loadUserProfile(session.user)
      } else {
        console.log('🔍 useAuth - Auth state change: user logged out or no session')
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