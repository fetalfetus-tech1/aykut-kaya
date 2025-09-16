'use client'

import React, { useState, useEffect, useRef } from 'react'
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
  author_name: string
  author_avatar: string
  stars?: number
}

export default function ForumPage() {
  const { user } = useAuth()
  const [posts, setPosts] = useState<ForumPost[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: '',
    image_url: ''
  })
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      // forum_stars ve profiles join
      const { data, error } = await supabase
        .from('forum_posts')
        .select('*, profiles:author_id(username), forum_stars!fk_forum_stars_post(*)')
        .order('created_at', { ascending: false })

      if (error) throw error

      // Posts'ları dönüştür (profil join ile yazar adı)
      const transformedPosts = (data || []).map(post => ({
        ...post,
        author_name: post.profiles?.username || 'Anonim',
        author_avatar: post.profiles?.avatar_url || '/avatars/default.png',
        stars: Array.isArray(post.forum_stars) ? post.forum_stars.length : 0,
        replies_count: 0,
      }))

      setPosts(transformedPosts)
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
      const { data, error } = await supabase
        .from('forum_posts')
        .insert([{
          title: newPost.title,
          content: newPost.content,
          category: newPost.category,
          image_url: newPost.image_url || null,
          author_id: user.id
        }])
        .select()
      if (error) {
        console.error('Supabase error:', error)
        throw error
      }
      setNewPost({ title: '', content: '', category: '', image_url: '' })
      setShowCreateForm(false)
      loadPosts()
      alert('Forum yazısı oluşturuldu!')
    } catch (error: any) {
      console.error('Full error details:', error)
      alert('Hata oluştu: ' + (error.message || error.details || 'Bilinmeyen hata'))
    }
  }

  // Görsel yükleme
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return
    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `forum_${user.id}_${Date.now()}.${fileExt}`
      const { data, error } = await supabase.storage.from('forum-images').upload(fileName, file, { upsert: true })
      if (error) throw error
      const { data: publicUrlData } = supabase.storage.from('forum-images').getPublicUrl(fileName)
      setNewPost(prev => ({ ...prev, image_url: publicUrlData.publicUrl }))
    } catch (err) {
      alert('Görsel yüklenemedi. Lütfen tekrar deneyin.')
    } finally {
      setUploading(false)
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
          <div className="bg-gray-800 rounded-xl p-8 mb-8 shadow-lg border border-gray-700/40 max-w-xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">✏️ Yeni Konu Oluştur</h2>
            <div className="grid gap-5">
              <div>
                <label className="block text-sm font-medium mb-2">Başlık</label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 text-white"
                  placeholder="Konu başlığı..."
                  maxLength={100}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Kategori</label>
                <select
                  value={newPost.category}
                  onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 text-white"
                  required
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
                  className="w-full px-4 py-3 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 text-white"
                  placeholder="Konu içeriği..."
                  maxLength={2000}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Görsel (isteğe bağlı)</label>
                <div className="flex items-center gap-4">
                  {newPost.image_url && (
                    <img src={newPost.image_url} alt="Konu görseli" className="w-24 h-24 object-cover rounded-lg border-2 border-blue-500 bg-gray-900" />
                  )}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                    disabled={uploading}
                  >
                    {uploading ? 'Yükleniyor...' : (newPost.image_url ? 'Değiştir' : 'Görsel Yükle')}
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  {newPost.image_url && (
                    <button
                      type="button"
                      className="ml-2 px-2 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded"
                      onClick={() => setNewPost(prev => ({ ...prev, image_url: '' }))}
                    >
                      Kaldır
                    </button>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg"
                >
                  İptal
                </button>
                <button
                  type="button"
                  onClick={createPost}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold"
                  disabled={uploading}
                >
                  {uploading ? 'Yükleniyor...' : 'Konuyu Oluştur'}
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
              <Link key={post.id} href={`/forum/topic/${post.id}`} className="block">
                <div className="bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition-colors cursor-pointer shadow-lg border border-gray-700/40">
                  <div className="flex items-start gap-4">
                    <img
                      src={post.author_avatar}
                      alt={post.author_name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-blue-500 shadow-md bg-gray-900"
                      style={{ minWidth: 56 }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs bg-purple-600 px-2 py-1 rounded">{post.category}</span>
                        <span className="text-gray-200 font-semibold text-sm">{post.author_name}</span>
                        <span className="text-gray-400 text-sm">•</span>
                        <span className="text-gray-400 text-sm">{new Date(post.created_at).toLocaleDateString('tr-TR')}</span>
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-white line-clamp-1">{post.title}</h3>
                      <p className="text-gray-300 mb-3 line-clamp-2">{post.content.substring(0, 200)}...</p>
                      <div className="flex gap-4 text-xs text-gray-400 mt-2">
                        <span className="flex items-center gap-1"><span className="text-yellow-400">⭐</span> {post.stars || 0}</span>
                        <span>{post.replies_count} yanıt</span>
                        <span>{post.views} görüntüleme</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}