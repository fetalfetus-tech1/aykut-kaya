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
      // Önce profile var mı kontrol et
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (existingProfile) {
        setUser({ ...authUser, profile: existingProfile })
        return
      }

      // Profile yoksa upsert ile oluştur (conflict olursa güncelle)
      console.log('Profile bulunamadı, upsert ile oluşturuluyor...')
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

      if (newProfile) {
        setUser({ ...authUser, profile: newProfile })
      } else {
        console.error('Profile upsert hatası:', upsertError)
        // Hata durumunda profile olmadan devam et
        setUser(authUser)
      }
    } catch (error) {
      console.error('Profile yüklenirken hata:', error)
      // Hata durumunda profile olmadan devam et
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