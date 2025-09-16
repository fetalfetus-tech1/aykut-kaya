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
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (profile) {
        setUser({ ...authUser, profile })
      } else {
        setUser(authUser)
      }
    } catch (error) {
      console.error('Profile yüklenirken hata:', error)
      setUser(authUser)
    }
  }

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUserProfile(session.user)
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadUserProfile(session.user)
      } else {
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