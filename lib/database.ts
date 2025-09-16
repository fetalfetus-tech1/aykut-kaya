import { supabase } from './supabase'

// Blog Posts Functions
export async function getBlogPosts() {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export async function createBlogPost(post: {
  title: string
  content: string
  excerpt: string
  image_url?: string
  category: string
}) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  const { data, error } = await supabase
    .from('blog_posts')
    .insert({
      ...post,
      author_id: user.id,
      slug: post.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Forum Posts Functions
export async function getForumPosts() {
  const { data, error } = await supabase
    .from('forum_posts')
    .select(`
      *,
      profiles:author_id (
        username,
        avatar_url
      )
    `)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export async function createForumPost(post: {
  title: string
  content: string
  category: string
}) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  const { data, error } = await supabase
    .from('forum_posts')
    .insert({
      ...post,
      author_id: user.id
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Game Reviews Functions
export async function getGameReviews() {
  const { data, error } = await supabase
    .from('game_reviews')
    .select(`
      *,
      profiles:author_id (
        username,
        avatar_url
      )
    `)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export async function createGameReview(review: {
  game_title: string
  rating: number
  content: string
  pros: string[]
  cons: string[]
  game_image?: string
  platform: string
  genre: string
}) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  const { data, error } = await supabase
    .from('game_reviews')
    .insert({
      ...review,
      author_id: user.id
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

// User Profile Functions
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) throw error
  return data
}

export async function updateUserProfile(userId: string, updates: {
  username?: string
  full_name?: string
  avatar_url?: string
  bio?: string
}) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Comments Functions
export async function getCommentsByPostId(postId: string, postType: 'blog' | 'forum' | 'review') {
  let tableName = ''
  let foreignKey = ''
  
  switch (postType) {
    case 'blog':
      tableName = 'blog_posts'
      foreignKey = 'blog_post_id'
      break
    case 'forum':
      tableName = 'forum_posts'
      foreignKey = 'forum_post_id'
      break
    case 'review':
      tableName = 'game_reviews'
      foreignKey = 'game_review_id'
      break
  }

  const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      profiles:author_id (
        username,
        avatar_url
      )
    `)
    .eq(foreignKey, postId)
    .order('created_at', { ascending: true })
  
  if (error) throw error
  return data
}

export async function createComment(comment: {
  content: string
  blog_post_id?: string
  forum_post_id?: string
  game_review_id?: string
}) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  const { data, error } = await supabase
    .from('comments')
    .insert({
      ...comment,
      author_id: user.id
    })
    .select(`
      *,
      profiles:author_id (
        username,
        avatar_url
      )
    `)
    .single()
  
  if (error) throw error
  return data
}

// Authentication Helper Functions
export async function signUp(email: string, password: string, username: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username
      }
    }
  })
  
  if (error) throw error
  return data
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}