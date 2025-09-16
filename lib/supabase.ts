import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database türleri
export interface User {
  id: string
  email: string
  username: string
  full_name?: string
  avatar_url?: string
  role: 'user' | 'admin' | 'moderator'
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  summary?: string
  tags: string[]
  author_id: string
  published: boolean
  featured_image?: string
  view_count: number
  created_at: string
  updated_at: string
  author?: User
}

export interface ForumPost {
  id: string
  title: string
  content: string
  category: string
  author_id: string
  is_sticky: boolean
  is_locked: boolean
  view_count: number
  reply_count: number
  last_reply_at?: string
  last_reply_user_id?: string
  created_at: string
  updated_at: string
  author?: User
}

export interface ForumReply {
  id: string
  post_id: string
  content: string
  author_id: string
  parent_reply_id?: string
  created_at: string
  updated_at: string
  author?: User
}

export interface GameReview {
  id: string
  game_title: string
  game_slug: string
  rating: number
  title: string
  content: string
  summary?: string
  pros: string[]
  cons: string[]
  author_id: string
  published: boolean
  game_image?: string
  play_time?: string
  platform?: string
  view_count: number
  created_at: string
  updated_at: string
  author?: User
}

export interface Game {
  id: string
  title: string
  slug: string
  description?: string
  genre?: string
  categories: string[]
  release_date?: string
  developer?: string
  publisher?: string
  platforms: string[]
  rating?: number
  metacritic_score?: number
  image_url?: string
  trailer_url?: string
  price?: number
  is_free: boolean
  created_at: string
  updated_at: string
}