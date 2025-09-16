'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'

interface ForumPost {
  id: string
  title: string
  content: string
  category: string
  author_id: string
  replies_count: number
  views: number
  created_at: string
  profiles: { username: string }
}

export default function ForumPage() {
  const { user } = useAuth()
  const [posts, setPosts] = useState<ForumPost[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: ''
  })

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('forum_posts')
        .select(`
          *,
          profiles(username)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setPosts(data || [])
    } catch (error) {
      console.error('Forum postları yüklenirken hata:', error)
    }
    setLoading(false)
  }

  const createPost = async () => {
    if (!user) {
      alert('Forum\'da yazı yazmak için giriş yapmalısınız!')
      return
    }

    if (!newPost.title || !newPost.content || !newPost.category) {
      alert('Tüm alanları doldurmanız gerekiyor!')
      return
    }

    try {
      const { error } = await supabase
        .from('forum_posts')
        .insert([{
          title: newPost.title,
          content: newPost.content,
          category: newPost.category,
          author_id: user.id
        }])

      if (error) throw error

      setNewPost({ title: '', content: '', category: '' })
      setShowCreateForm(false)
      loadPosts()
      alert('Forum yazısı oluşturuldu!')
    } catch (error) {
      alert('Hata: ' + error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <p className="mt-2">Forum yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">💬 Forum</h1>
          
          {user ? (
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
            >
              + Yeni Konu Aç
            </button>
          ) : (
            <Link
              href="/auth"
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
            >
              Giriş Yap
            </Link>
          )}
        </div>

        {/* Yeni Konu Oluşturma Formu */}
        {showCreateForm && (
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">✏️ Yeni Konu Oluştur</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Başlık</label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 rounded-lg"
                  placeholder="Konu başlığı..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Kategori</label>
                <select
                  value={newPost.category}
                  onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 rounded-lg"
                >
                  <option value="">Kategori Seçin</option>
                  <option value="genel">Genel Tartışma</option>
                  <option value="oyun-onerileri">Oyun Önerileri</option>
                  <option value="teknik-destek">Teknik Destek</option>
                  <option value="esports">E-Sports</option>
                  <option value="diger">Diğer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">İçerik</label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  rows={6}
                  className="w-full px-3 py-2 bg-gray-700 rounded-lg"
                  placeholder="Konu içeriği..."
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg"
                >
                  İptal
                </button>
                <button
                  onClick={createPost}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
                >
                  Konuyu Oluştur
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Forum Postları */}
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">💬</div>
            <h2 className="text-2xl font-bold mb-4">Henüz forum konusu yok</h2>
            <p className="text-gray-400 mb-8">
              İlk konu sizden gelsin! Hemen bir konu açın.
            </p>
            {!user && (
              <Link
                href="/auth"
                className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
              >
                Giriş Yap
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs bg-purple-600 px-2 py-1 rounded">
                        {post.category}
                      </span>
                      <span className="text-gray-400 text-sm">
                        {post.profiles?.username}
                      </span>
                      <span className="text-gray-400 text-sm">•</span>
                      <span className="text-gray-400 text-sm">
                        {new Date(post.created_at).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                    <p className="text-gray-300 mb-3">
                      {post.content.substring(0, 200)}...
                    </p>
                  </div>
                  
                  <div className="text-right text-sm text-gray-400">
                    <div>{post.replies_count} yanıt</div>
                    <div>{post.views} görüntüleme</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}