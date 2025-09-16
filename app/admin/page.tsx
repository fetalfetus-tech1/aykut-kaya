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

interface Game {
  id: string
  title: string
  genre: string
  platform: string
  rating: number
  image: string
  description: string
  release_date: string
  developer: string
  price: number
  slug: string
  views: number
  image_url?: string
  status: 'draft' | 'published'
  created_at: string
  platforms: string[]
}

interface AdCampaign {
  id: string
  name: string
  type: string
  status: 'active' | 'inactive'
  budget: number
  spent: number
  clicks: number
  impressions: number
  created_at: string
}

export default function AdminPanel() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('users')
  const [users, setUsers] = useState<User[]>([])
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [games, setGames] = useState<Game[]>([])
  const [adCampaigns, setAdCampaigns] = useState<AdCampaign[]>([])
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

  // Game form states
  const [showGameForm, setShowGameForm] = useState(false)
  const [editingGame, setEditingGame] = useState<Game | null>(null)
  const [gameFormData, setGameFormData] = useState({
    title: '',
    developer: '',
    genre: '',
    description: '',
    image_url: '',
    rating: 0,
    release_date: '',
    platforms: [] as string[],
    status: 'draft' as 'draft' | 'published'
  })

  // Ad form states
  const [showAdForm, setShowAdForm] = useState(false)
  const [editingAd, setEditingAd] = useState<AdCampaign | null>(null)
  const [adFormData, setAdFormData] = useState({
    name: '',
    type: 'banner' as string,
    budget: 0,
    status: 'inactive' as 'active' | 'inactive'
  })

  // Settings state
  const [settings, setSettings] = useState({
    siteTitle: 'GameReview Pro',
    siteDescription: 'En iyi oyun incelemeleri ve haberleri',
    contactEmail: 'info@gamereviewpro.com',
    socialTwitter: '',
    socialDiscord: '',
    socialYoutube: '',
    enableComments: true,
    enableRegistration: true,
    maintenanceMode: false
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
      } else if (activeTab === 'games') {
        // Şimdilik mock data, sonra Supabase'den gelecek
        const mockGames: Game[] = [
          {
            id: '1',
            title: 'Cyberpunk 2077',
            genre: 'RPG',
            platform: 'PC/PS5/Xbox',
            rating: 8.5,
            image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop',
            description: 'Geleceğin şehrinde geçen sürükleyici cyberpunk macerası.',
            release_date: '2020-12-10',
            developer: 'CD Projekt RED',
            price: 299.99,
            slug: 'cyberpunk-2077',
            views: 15420,
            image_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop',
            status: 'published',
            created_at: '2024-01-15T10:00:00Z',
            platforms: ['PC', 'PlayStation', 'Xbox']
          }
        ]
        setGames(mockGames)
      } else if (activeTab === 'ads') {
        // Mock reklam kampanyaları
        const mockAds: AdCampaign[] = [
          {
            id: '1',
            name: 'Ana Sayfa Banner',
            type: 'banner',
            status: 'active',
            budget: 5000,
            spent: 1250,
            clicks: 450,
            impressions: 25000,
            created_at: '2024-01-15'
          }
        ]
        setAdCampaigns(mockAds)
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

  // Game management functions
  const editGame = (game: Game) => {
    setEditingGame(game)
    setGameFormData({
      title: game.title,
      developer: game.developer,
      genre: game.genre,
      description: game.description,
      image_url: game.image_url || '',
      rating: game.rating,
      release_date: game.release_date,
      platforms: game.platforms,
      status: game.status
    })
    setShowGameForm(true)
  }

  const deleteGame = async (gameId: string) => {
    if (!confirm('Bu oyunu silmek istediğinizden emin misiniz?')) return

    try {
      // Şimdilik mock data'dan silme, sonra Supabase'den silinecek
      setGames(games.filter(game => game.id !== gameId))
      alert('Oyun başarıyla silindi!')
    } catch (error) {
      alert('Hata: ' + error)
    }
  }

  const handleGameSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingGame) {
        // Güncelleme - şimdilik mock data
        setGames(games.map(game =>
          game.id === editingGame.id
            ? { ...game, ...gameFormData, updated_at: new Date().toISOString() }
            : game
        ))
        alert('Oyun başarıyla güncellendi!')
      } else {
        // Yeni oyun ekleme - şimdilik mock data
        const newGame: Game = {
          id: Date.now().toString(),
          ...gameFormData,
          platform: gameFormData.platforms.join('/'),
          image: gameFormData.image_url || '',
          price: 0,
          slug: gameFormData.title.toLowerCase().replace(/\s+/g, '-'),
          views: 0,
          created_at: new Date().toISOString()
        }
        setGames([...games, newGame])
        alert('Oyun başarıyla eklendi!')
      }

      // Form'u sıfırla
      setShowGameForm(false)
      setEditingGame(null)
      setGameFormData({
        title: '',
        developer: '',
        genre: '',
        description: '',
        image_url: '',
        rating: 0,
        release_date: '',
        platforms: [],
        status: 'draft'
      })
    } catch (error) {
      alert('Hata: ' + error)
    }
  }

  // Ad management functions
  const editAd = (ad: AdCampaign) => {
    setEditingAd(ad)
    setAdFormData({
      name: ad.name,
      type: ad.type,
      budget: ad.budget,
      status: ad.status
    })
    setShowAdForm(true)
  }

  const toggleAdStatus = async (adId: string) => {
    try {
      const ad = adCampaigns.find(a => a.id === adId)
      if (!ad) return

      const newStatus = ad.status === 'active' ? 'inactive' : 'active'
      setAdCampaigns(adCampaigns.map(a =>
        a.id === adId ? { ...a, status: newStatus } : a
      ))
      alert(`Kampanya ${newStatus === 'active' ? 'aktifleştirildi' : 'durduruldu'}!`)
    } catch (error) {
      alert('Hata: ' + error)
    }
  }

  const handleAdSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingAd) {
        // Güncelleme
        setAdCampaigns(adCampaigns.map(ad =>
          ad.id === editingAd.id
            ? { ...ad, ...adFormData }
            : ad
        ))
        alert('Reklam kampanyası başarıyla güncellendi!')
      } else {
        // Yeni kampanya ekleme
        const newAd: AdCampaign = {
          id: Date.now().toString(),
          ...adFormData,
          spent: 0,
          clicks: 0,
          impressions: 0,
          created_at: new Date().toISOString().split('T')[0]
        }
        setAdCampaigns([...adCampaigns, newAd])
        alert('Reklam kampanyası başarıyla oluşturuldu!')
      }

      // Form'u sıfırla
      setShowAdForm(false)
      setEditingAd(null)
      setAdFormData({
        name: '',
        type: 'banner',
        budget: 0,
        status: 'inactive'
      })
    } catch (error) {
      alert('Hata: ' + error)
    }
  }

  // Settings functions
  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Şimdilik localStorage'a kaydet, sonra Supabase'e kaydedeceğiz
      localStorage.setItem('siteSettings', JSON.stringify(settings))
      alert('Site ayarları başarıyla kaydedildi!')
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
          <div className="space-y-6">
            {/* Games List */}
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">🎮 Oyun Yönetimi</h2>
                <button
                  onClick={() => setShowGameForm(true)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium flex items-center gap-2"
                >
                  <span>+</span> Yeni Oyun Ekle
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4">Oyun</th>
                      <th className="text-left py-3 px-4">Kategori</th>
                      <th className="text-left py-3 px-4">Puan</th>
                      <th className="text-left py-3 px-4">Durum</th>
                      <th className="text-left py-3 px-4">Tarih</th>
                      <th className="text-left py-3 px-4">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {games.map((game) => (
                      <tr key={game.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={game.image_url || '/placeholder-game.jpg'}
                              alt={game.title}
                              className="w-12 h-12 rounded object-cover"
                            />
                            <div>
                              <div className="font-medium">{game.title}</div>
                              <div className="text-sm text-gray-400">{game.developer}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded text-sm">
                            {game.genre}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-400">★</span>
                            <span>{game.rating}/10</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-sm ${
                            game.status === 'published'
                              ? 'bg-green-600/20 text-green-400'
                              : 'bg-yellow-600/20 text-yellow-400'
                          }`}>
                            {game.status === 'published' ? 'Yayınlandı' : 'Taslak'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-400">
                          {new Date(game.created_at).toLocaleDateString('tr-TR')}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => editGame(game)}
                              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                            >
                              Düzenle
                            </button>
                            <button
                              onClick={() => deleteGame(game.id)}
                              className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
                            >
                              Sil
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Game Form Modal */}
            {showGameForm && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">
                      {editingGame ? 'Oyunu Düzenle' : 'Yeni Oyun Ekle'}
                    </h3>
                    <button
                      onClick={() => {
                        setShowGameForm(false)
                        setEditingGame(null)
                        setGameFormData({
                          title: '',
                          developer: '',
                          genre: '',
                          description: '',
                          image_url: '',
                          rating: 0,
                          release_date: '',
                          platforms: [],
                          status: 'draft'
                        })
                      }}
                      className="text-gray-400 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleGameSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Oyun Adı</label>
                        <input
                          type="text"
                          value={gameFormData.title}
                          onChange={(e) => setGameFormData({...gameFormData, title: e.target.value})}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Geliştirici</label>
                        <input
                          type="text"
                          value={gameFormData.developer}
                          onChange={(e) => setGameFormData({...gameFormData, developer: e.target.value})}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Kategori</label>
                      <select
                        value={gameFormData.genre}
                        onChange={(e) => setGameFormData({...gameFormData, genre: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none"
                        required
                      >
                        <option value="">Kategori Seçin</option>
                        <option value="action">Aksiyon</option>
                        <option value="adventure">Macera</option>
                        <option value="rpg">RPG</option>
                        <option value="strategy">Strateji</option>
                        <option value="simulation">Simülasyon</option>
                        <option value="sports">Spor</option>
                        <option value="racing">Yarış</option>
                        <option value="puzzle">Bulmaca</option>
                        <option value="horror">Korku</option>
                        <option value="fps">FPS</option>
                        <option value="fighting">Dövüş</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Açıklama</label>
                      <textarea
                        value={gameFormData.description}
                        onChange={(e) => setGameFormData({...gameFormData, description: e.target.value})}
                        rows={4}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Kapak Görseli URL</label>
                        <input
                          type="url"
                          value={gameFormData.image_url}
                          onChange={(e) => setGameFormData({...gameFormData, image_url: e.target.value})}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Puan (0-10)</label>
                        <input
                          type="number"
                          min="0"
                          max="10"
                          step="0.1"
                          value={gameFormData.rating}
                          onChange={(e) => setGameFormData({...gameFormData, rating: parseFloat(e.target.value)})}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Çıkış Tarihi</label>
                        <input
                          type="date"
                          value={gameFormData.release_date}
                          onChange={(e) => setGameFormData({...gameFormData, release_date: e.target.value})}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Platformlar</label>
                        <div className="space-y-2">
                          {['PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Mobile'].map((platform) => (
                            <label key={platform} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={gameFormData.platforms.includes(platform)}
                                onChange={(e) => {
                                  const updatedPlatforms = e.target.checked
                                    ? [...gameFormData.platforms, platform]
                                    : gameFormData.platforms.filter(p => p !== platform)
                                  setGameFormData({...gameFormData, platforms: updatedPlatforms})
                                }}
                                className="rounded"
                              />
                              {platform}
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Durum</label>
                      <select
                        value={gameFormData.status}
                        onChange={(e) => setGameFormData({...gameFormData, status: e.target.value as 'draft' | 'published'})}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none"
                      >
                        <option value="draft">Taslak</option>
                        <option value="published">Yayınlandı</option>
                      </select>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        type="submit"
                        className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium"
                      >
                        {editingGame ? 'Güncelle' : 'Oluştur'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowGameForm(false)
                          setEditingGame(null)
                          setGameFormData({
                            title: '',
                            developer: '',
                            genre: '',
                            description: '',
                            image_url: '',
                            rating: 0,
                            release_date: '',
                            platforms: [],
                            status: 'draft'
                          })
                        }}
                        className="px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg font-medium"
                      >
                        İptal
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Ads Tab */}
        {activeTab === 'ads' && (
          <div className="space-y-6">
            {/* Ads List */}
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">📢 Reklam Yönetimi</h2>
                <button
                  onClick={() => setShowAdForm(true)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium flex items-center gap-2"
                >
                  <span>+</span> Yeni Kampanya
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4">Kampanya</th>
                      <th className="text-left py-3 px-4">Tür</th>
                      <th className="text-left py-3 px-4">Bütçe</th>
                      <th className="text-left py-3 px-4">Harcanan</th>
                      <th className="text-left py-3 px-4">Tıklamalar</th>
                      <th className="text-left py-3 px-4">Durum</th>
                      <th className="text-left py-3 px-4">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adCampaigns.map((ad) => (
                      <tr key={ad.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium">{ad.name}</div>
                            <div className="text-sm text-gray-400">
                              {new Date(ad.created_at).toLocaleDateString('tr-TR')}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 bg-purple-600/20 text-purple-400 rounded text-sm capitalize">
                            {ad.type}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium">₺{ad.budget.toLocaleString()}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium text-green-400">₺{ad.spent.toLocaleString()}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm">
                            <div className="font-medium">{ad.clicks.toLocaleString()}</div>
                            <div className="text-gray-400">
                              {ad.impressions.toLocaleString()} gösterim
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-sm ${
                            ad.status === 'active'
                              ? 'bg-green-600/20 text-green-400'
                              : 'bg-red-600/20 text-red-400'
                          }`}>
                            {ad.status === 'active' ? 'Aktif' : 'Pasif'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => editAd(ad)}
                              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                            >
                              Düzenle
                            </button>
                            <button
                              onClick={() => toggleAdStatus(ad.id)}
                              className={`px-3 py-1 rounded text-sm ${
                                ad.status === 'active'
                                  ? 'bg-red-600 hover:bg-red-700'
                                  : 'bg-green-600 hover:bg-green-700'
                              }`}
                            >
                              {ad.status === 'active' ? 'Durdur' : 'Başlat'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Ad Form Modal */}
            {showAdForm && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">
                      {editingAd ? 'Kampanyayı Düzenle' : 'Yeni Reklam Kampanyası'}
                    </h3>
                    <button
                      onClick={() => {
                        setShowAdForm(false)
                        setEditingAd(null)
                        setAdFormData({
                          name: '',
                          type: 'banner',
                          budget: 0,
                          status: 'inactive'
                        })
                      }}
                      className="text-gray-400 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleAdSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Kampanya Adı</label>
                        <input
                          type="text"
                          value={adFormData.name}
                          onChange={(e) => setAdFormData({...adFormData, name: e.target.value})}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Reklam Türü</label>
                        <select
                          value={adFormData.type}
                          onChange={(e) => setAdFormData({...adFormData, type: e.target.value})}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none"
                        >
                          <option value="banner">Banner</option>
                          <option value="video">Video</option>
                          <option value="native">Native</option>
                          <option value="popup">Popup</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Bütçe (₺)</label>
                      <input
                        type="number"
                        min="0"
                        step="100"
                        value={adFormData.budget}
                        onChange={(e) => setAdFormData({...adFormData, budget: parseFloat(e.target.value)})}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Durum</label>
                      <select
                        value={adFormData.status}
                        onChange={(e) => setAdFormData({...adFormData, status: e.target.value as 'active' | 'inactive'})}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none"
                      >
                        <option value="inactive">Pasif</option>
                        <option value="active">Aktif</option>
                      </select>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        type="submit"
                        className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium"
                      >
                        {editingAd ? 'Güncelle' : 'Oluştur'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAdForm(false)
                          setEditingAd(null)
                          setAdFormData({
                            name: '',
                            type: 'banner',
                            budget: 0,
                            status: 'inactive'
                          })
                        }}
                        className="px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg font-medium"
                      >
                        İptal
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6">⚙️ Site Ayarları</h2>

              <form onSubmit={handleSettingsSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Site Başlığı</label>
                    <input
                      type="text"
                      value={settings.siteTitle}
                      onChange={(e) => setSettings({...settings, siteTitle: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Site Açıklaması</label>
                    <input
                      type="text"
                      value={settings.siteDescription}
                      onChange={(e) => setSettings({...settings, siteDescription: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">İletişim E-posta</label>
                    <input
                      type="email"
                      value={settings.contactEmail}
                      onChange={(e) => setSettings({...settings, contactEmail: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Sosyal Medya - Twitter</label>
                    <input
                      type="url"
                      value={settings.socialTwitter}
                      onChange={(e) => setSettings({...settings, socialTwitter: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Sosyal Medya - Discord</label>
                    <input
                      type="url"
                      value={settings.socialDiscord}
                      onChange={(e) => setSettings({...settings, socialDiscord: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Sosyal Medya - YouTube</label>
                    <input
                      type="url"
                      value={settings.socialYoutube}
                      onChange={(e) => setSettings({...settings, socialYoutube: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Gelişmiş Ayarlar</h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={settings.enableComments}
                          onChange={(e) => setSettings({...settings, enableComments: e.target.checked})}
                          className="rounded"
                        />
                        <span className="text-sm">Yorumları Etkinleştir</span>
                      </label>
                    </div>

                    <div>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={settings.enableRegistration}
                          onChange={(e) => setSettings({...settings, enableRegistration: e.target.checked})}
                          className="rounded"
                        />
                        <span className="text-sm">Kayıtları Etkinleştir</span>
                      </label>
                    </div>

                    <div>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={settings.maintenanceMode}
                          onChange={(e) => setSettings({...settings, maintenanceMode: e.target.checked})}
                          className="rounded"
                        />
                        <span className="text-sm">Bakım Modu</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium"
                  >
                    Ayarları Kaydet
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      // Reset to defaults
                      setSettings({
                        siteTitle: 'GameReview Pro',
                        siteDescription: 'En iyi oyun incelemeleri ve haberleri',
                        contactEmail: 'info@gamereviewpro.com',
                        socialTwitter: '',
                        socialDiscord: '',
                        socialYoutube: '',
                        enableComments: true,
                        enableRegistration: true,
                        maintenanceMode: false
                      })
                    }}
                    className="px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg font-medium"
                  >
                    Varsayılanlara Dön
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}