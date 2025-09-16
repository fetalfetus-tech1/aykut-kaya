'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'

interface User {
  id: string
  username: string
  full_name: string
  role: string
  created_at: string
}

interface BlogPost {
  id: string
  title: string
  content: string
  author_id: string
  published: boolean
  created_at: string
  profiles: { username: string }
}

export default function AdminPanel() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('users')
  const [users, setUsers] = useState<User[]>([])
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  // Yeni blog post form
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    tags: '',
    published: false
  })

  useEffect(() => {
    if (user) {
      loadData()
    }
  })

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      if (activeTab === 'users') {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false })
        setUsers(data || [])
      } else if (activeTab === 'posts') {
        const { data } = await supabase
          .from('blog_posts')
          .select(`
            *,
            profiles(username)
          `)
          .order('created_at', { ascending: false })
        setBlogPosts(data || [])
      }
    } catch (error) {
      console.error('Veri yükleme hatası:', error)
    }
    setLoading(false)
  }, [activeTab])

  useEffect(() => {
    if (user) {
      loadData()
    }
  }, [user, activeTab, loadData])

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId)

      if (error) throw error
      loadData()
      alert('Kullanıcı rolü güncellendi!')
    } catch (error) {
      alert('Hata: ' + error)
    }
  }

  const deletePost = async (postId: string) => {
    if (!confirm('Bu yazıyı silmek istediğinizden emin misiniz?')) return

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postId)

      if (error) throw error
      loadData()
      alert('Yazı silindi!')
    } catch (error) {
      alert('Hata: ' + error)
    }
  }

  const createPost = async () => {
    if (!newPost.title || !newPost.content) {
      alert('Başlık ve içerik zorunlu!')
      return
    }

    try {
      const slug = newPost.title
        .toLowerCase()
        .replace(/[^a-zA-Z0-9ğüşöçıĞÜŞÖÇİ]/g, '-')
        .replace(/-+/g, '-')
        .trim()

      const { error } = await supabase
        .from('blog_posts')
        .insert([{
          title: newPost.title,
          content: newPost.content,
          excerpt: newPost.excerpt,
          slug: slug + '-' + Date.now(),
          category: newPost.category,
          tags: newPost.tags.split(',').map(tag => tag.trim()),
          author_id: user?.id,
          published: newPost.published
        }])

      if (error) throw error

      setNewPost({
        title: '',
        content: '',
        excerpt: '',
        category: '',
        tags: '',
        published: false
      })
      loadData()
      alert('Yazı oluşturuldu!')
    } catch (error) {
      alert('Hata: ' + error)
    }
  }

  const togglePostStatus = async (postId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({ published: !currentStatus })
        .eq('id', postId)

      if (error) throw error
      loadData()
      alert('Yazı durumu güncellendi!')
    } catch (error) {
      alert('Hata: ' + error)
    }
  }

  if (!user || user?.profile?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">🚫 Erişim Engellendi</h1>
          <p>Bu sayfaya erişim için admin yetkisi gerekiyor.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">🎮 Admin Panel</h1>

        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-8">
          {[
            { id: 'users', label: '👥 Kullanıcılar', icon: '👥' },
            { id: 'posts', label: '📝 Blog Yazıları', icon: '📝' },
            { id: 'create', label: '✏️ Yazı Oluştur', icon: '✏️' },
            { id: 'games', label: '🎮 Oyunlar', icon: '🎮' },
            { id: 'settings', label: '⚙️ Ayarlar', icon: '⚙️' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <p className="mt-2">Yükleniyor...</p>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && !loading && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">👥 Kullanıcı Yönetimi</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="pb-2">Kullanıcı Adı</th>
                    <th className="pb-2">Ad Soyad</th>
                    <th className="pb-2">Rol</th>
                    <th className="pb-2">Kayıt Tarihi</th>
                    <th className="pb-2">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-700">
                      <td className="py-2">{user.username}</td>
                      <td className="py-2">{user.full_name}</td>
                      <td className="py-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          user.role === 'admin' ? 'bg-red-600' :
                          user.role === 'moderator' ? 'bg-yellow-600' :
                          'bg-green-600'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-2">
                        {new Date(user.created_at).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="py-2">
                        <select
                          value={user.role}
                          onChange={(e) => updateUserRole(user.id, e.target.value)}
                          className="bg-gray-700 text-white rounded px-2 py-1 text-sm"
                        >
                          <option value="user">User</option>
                          <option value="moderator">Moderator</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Posts Tab */}
        {activeTab === 'posts' && !loading && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">📝 Blog Yazıları</h2>
            <div className="space-y-4">
              {blogPosts.map((post) => (
                <div key={post.id} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{post.title}</h3>
                      <p className="text-gray-400 text-sm">
                        Yazar: {post.profiles?.username} | 
                        {new Date(post.created_at).toLocaleDateString('tr-TR')}
                      </p>
                      <p className="text-gray-300 mt-2">
                        {post.content.substring(0, 150)}...
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => togglePostStatus(post.id, post.published)}
                        className={`px-3 py-1 rounded text-sm ${
                          post.published 
                            ? 'bg-green-600 hover:bg-green-700' 
                            : 'bg-yellow-600 hover:bg-yellow-700'
                        }`}
                      >
                        {post.published ? 'Yayından Kaldır' : 'Yayınla'}
                      </button>
                      <button
                        onClick={() => deletePost(post.id)}
                        className="px-3 py-1 rounded text-sm bg-red-600 hover:bg-red-700"
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Create Post Tab */}
        {activeTab === 'create' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">✏️ Yeni Blog Yazısı Oluştur</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Başlık</label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 rounded-lg"
                  placeholder="Yazı başlığı..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Özet</label>
                <input
                  type="text"
                  value={newPost.excerpt}
                  onChange={(e) => setNewPost({...newPost, excerpt: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 rounded-lg"
                  placeholder="Kısa özet..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Kategori</label>
                  <select
                    value={newPost.category}
                    onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 rounded-lg"
                  >
                    <option value="">Kategori Seçin</option>
                    <option value="oyun-incelemeleri">Oyun İncelemeleri</option>
                    <option value="gaming-haberleri">Gaming Haberleri</option>
                    <option value="rehberler">Rehberler</option>
                    <option value="esports">E-Sports</option>
                    <option value="teknoloji">Teknoloji</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Etiketler (virgülle ayırın)</label>
                  <input
                    type="text"
                    value={newPost.tags}
                    onChange={(e) => setNewPost({...newPost, tags: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 rounded-lg"
                    placeholder="etiket1, etiket2, etiket3"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">İçerik</label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  rows={15}
                  className="w-full px-3 py-2 bg-gray-700 rounded-lg"
                  placeholder="Yazı içeriği... (Markdown desteklenir)"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newPost.published}
                    onChange={(e) => setNewPost({...newPost, published: e.target.checked})}
                    className="mr-2"
                  />
                  Hemen yayınla
                </label>
                
                <button
                  onClick={createPost}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium"
                >
                  Yazıyı Oluştur
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Games Tab */}
        {activeTab === 'games' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">🎮 Oyun Yönetimi</h2>
            <p className="text-gray-400">Oyun yönetimi paneli yakında eklenecek...</p>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">⚙️ Site Ayarları</h2>
            <p className="text-gray-400">Site ayarları paneli yakında eklenecek...</p>
          </div>
        )}
      </div>
    </div>
  )
}