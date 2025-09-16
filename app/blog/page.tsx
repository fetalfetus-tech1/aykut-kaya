'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  slug: string
  category: string
  tags: string[]
  created_at: string
  profiles: { username: string }
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          profiles(username)
        `)
        .eq('published', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      setPosts(data || [])
    } catch (error) {
      console.error('Blog yazıları yüklenirken hata:', error)
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <p className="mt-2">Blog yazıları yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">📝 Blog</h1>
        
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-bold mb-4">Henüz blog yazısı yok</h2>
            <p className="text-gray-400 mb-8">
              İlk blog yazıları için admin panelini kullanın!
            </p>
            <Link
              href="/admin"
              className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
            >
              Admin Paneline Git
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div key={post.id} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors">
                <h2 className="text-xl font-bold mb-3">{post.title}</h2>
                
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                  <span>{post.profiles?.username}</span>
                  <span>•</span>
                  <span>{new Date(post.created_at).toLocaleDateString('tr-TR')}</span>
                </div>

                <p className="text-gray-300 mb-4">{post.excerpt}</p>

                <div className="flex items-center justify-between">
                  <span className="text-xs bg-blue-600 px-2 py-1 rounded">
                    {post.category}
                  </span>
                  
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                  >
                    Devamını Oku →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}