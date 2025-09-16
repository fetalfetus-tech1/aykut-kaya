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

interface GameReview {
  id: string
  title: string
  content: string
  game_title: string
  rating: number
  author_id: string
  published: boolean
  created_at: string
  profiles: { username: string }
}

interface ForumPost {
  id: string
  title: string
  content: string
  author_id: string
  created_at: string
  profiles: { username: string }
}

export default function AdminPanel() {
  const { user, isAdmin, loading: authLoading } = useAuth()
  const [activeTab, setActiveTab] = useState('users')
  const [users, setUsers] = useState<User[]>([])
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [gameReviews, setGameReviews] = useState<GameReview[]>([])
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([])
  const [loading, setLoading] = useState(true)

  // Blog post form
  const [showBlogForm, setShowBlogForm] = useState(false)
  const [editingBlogPost, setEditingBlogPost] = useState<BlogPost | null>(null)
  const [blogFormData, setBlogFormData] = useState({
    title: '',
    content: '',
    published: false
  })

  // Game review form
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [editingReview, setEditingReview] = useState<GameReview | null>(null)
  const [reviewFormData, setReviewFormData] = useState({
    title: '',
    content: '',
    game_title: '',
    rating: 5,
    published: false
  })

  // Load data based on active tab
  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      if (activeTab === 'users') {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Profiles loading error:', error)
          setUsers([])
        } else {
          setUsers(data || [])
        }
      } else if (activeTab === 'blog') {
        const { data, error } = await supabase
          .from('blog_posts')
          .select(`
            *,
            profiles(username)
          `)
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Blog posts loading error:', error)
          setBlogPosts([])
        } else {
          setBlogPosts(data || [])
        }
      } else if (activeTab === 'reviews') {
        const { data, error } = await supabase
          .from('game_reviews')
          .select(`
            *,
            profiles(username)
          `)
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Game reviews loading error:', error)
          setGameReviews([])
        } else {
          setGameReviews(data || [])
        }
      } else if (activeTab === 'forum') {
        const { data, error } = await supabase
          .from('forum_posts')
          .select(`
            *,
            profiles(username)
          `)
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Forum posts loading error:', error)
          setForumPosts([])
        } else {
          setForumPosts(data || [])
        }
      }
    } catch (error) {
      console.error('Load data error:', error)
    } finally {
      setLoading(false)
    }
  }, [activeTab])

  useEffect(() => {
    if (user && isAdmin) {
      loadData()
    }
  }, [user, isAdmin, loadData])

  // Auth kontrolü
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">🚫 Erişim Reddedildi</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Bu sayfaya erişim yetkiniz yok.
          </p>
          <a
            href="/dashboard"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Dashboard&apos;a Dön
          </a>
        </div>
      </div>
    )
  }

  // Blog post handlers
  const handleSaveBlogPost = async () => {
    if (!blogFormData.title || !blogFormData.content) return

    try {
      if (editingBlogPost) {
        const { error } = await supabase
          .from('blog_posts')
          .update({
            title: blogFormData.title,
            content: blogFormData.content,
            published: blogFormData.published
          })
          .eq('id', editingBlogPost.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .insert({
            title: blogFormData.title,
            content: blogFormData.content,
            published: blogFormData.published,
            author_id: user?.id
          })

        if (error) throw error
      }

      setShowBlogForm(false)
      setEditingBlogPost(null)
      setBlogFormData({ title: '', content: '', published: false })
      loadData()
    } catch (error) {
      console.error('Save blog post error:', error)
    }
  }

  const handleEditBlogPost = (post: BlogPost) => {
    setEditingBlogPost(post)
    setBlogFormData({
      title: post.title,
      content: post.content,
      published: post.published
    })
    setShowBlogForm(true)
  }

  const handleDeleteBlogPost = async (id: string) => {
    if (!confirm('Bu blog postunu silmek istediğinizden emin misiniz?')) return

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id)

      if (error) throw error
      loadData()
    } catch (error) {
      console.error('Delete blog post error:', error)
    }
  }

  // Game review handlers
  const handleSaveReview = async () => {
    if (!reviewFormData.title || !reviewFormData.content || !reviewFormData.game_title) return

    try {
      if (editingReview) {
        const { error } = await supabase
          .from('game_reviews')
          .update({
            title: reviewFormData.title,
            content: reviewFormData.content,
            game_title: reviewFormData.game_title,
            rating: reviewFormData.rating,
            published: reviewFormData.published
          })
          .eq('id', editingReview.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('game_reviews')
          .insert({
            title: reviewFormData.title,
            content: reviewFormData.content,
            game_title: reviewFormData.game_title,
            rating: reviewFormData.rating,
            published: reviewFormData.published,
            author_id: user?.id
          })

        if (error) throw error
      }

      setShowReviewForm(false)
      setEditingReview(null)
      setReviewFormData({ title: '', content: '', game_title: '', rating: 5, published: false })
      loadData()
    } catch (error) {
      console.error('Save review error:', error)
    }
  }

  const handleEditReview = (review: GameReview) => {
    setEditingReview(review)
    setReviewFormData({
      title: review.title,
      content: review.content,
      game_title: review.game_title,
      rating: review.rating,
      published: review.published
    })
    setShowReviewForm(true)
  }

  const handleDeleteReview = async (id: string) => {
    if (!confirm('Bu oyun incelemeyi silmek istediğinizden emin misiniz?')) return

    try {
      const { error } = await supabase
        .from('game_reviews')
        .delete()
        .eq('id', id)

      if (error) throw error
      loadData()
    } catch (error) {
      console.error('Delete review error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">🎮 Admin Panel</h1>

        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-8 border-b border-gray-700">
          {[
            { id: 'users', label: '👥 Kullanıcılar', count: users.length },
            { id: 'blog', label: '📝 Blog', count: blogPosts.length },
            { id: 'reviews', label: '🎮 Oyun İncelemeleri', count: gameReviews.length },
            { id: 'forum', label: '💬 Forum', count: forumPosts.length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-t-lg ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-gray-800 rounded-lg p-6">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              {/* Users Tab */}
              {activeTab === 'users' && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">Kullanıcı Yönetimi</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="px-4 py-2">Kullanıcı Adı</th>
                          <th className="px-4 py-2">Rol</th>
                          <th className="px-4 py-2">Kayıt Tarihi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map(user => (
                          <tr key={user.id} className="border-b border-gray-700">
                            <td className="px-4 py-2">{user.username}</td>
                            <td className="px-4 py-2">
                              <span className={`px-2 py-1 rounded text-xs ${
                                user.role === 'admin' ? 'bg-red-600' :
                                user.role === 'moderator' ? 'bg-yellow-600' : 'bg-green-600'
                              }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="px-4 py-2">
                              {new Date(user.created_at).toLocaleDateString('tr-TR')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Blog Tab */}
              {activeTab === 'blog' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Blog Yönetimi</h2>
                    <button
                      onClick={() => setShowBlogForm(true)}
                      className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
                    >
                      ➕ Yeni Blog Postu
                    </button>
                  </div>
                  <div className="space-y-4">
                    {blogPosts.map(post => (
                      <div key={post.id} className="bg-gray-700 p-4 rounded">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold">{post.title}</h3>
                            <p className="text-sm text-gray-400">
                              {post.profiles?.username} • {new Date(post.created_at).toLocaleDateString('tr-TR')}
                            </p>
                            <p className="text-sm mt-2">{post.content.substring(0, 100)}...</p>
                          </div>
                          <div className="flex space-x-2">
                            <span className={`px-2 py-1 rounded text-xs ${
                              post.published ? 'bg-green-600' : 'bg-yellow-600'
                            }`}>
                              {post.published ? 'Yayınlandı' : 'Taslak'}
                            </span>
                            <button
                              onClick={() => handleEditBlogPost(post)}
                              className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
                            >
                              Düzenle
                            </button>
                            <button
                              onClick={() => handleDeleteBlogPost(post.id)}
                              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
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

              {/* Reviews Tab */}
              {activeTab === 'reviews' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Oyun İnceleme Yönetimi</h2>
                    <button
                      onClick={() => setShowReviewForm(true)}
                      className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
                    >
                      ➕ Yeni İnceleme
                    </button>
                  </div>
                  <div className="space-y-4">
                    {gameReviews.map(review => (
                      <div key={review.id} className="bg-gray-700 p-4 rounded">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold">{review.title}</h3>
                            <p className="text-sm text-gray-400">
                              {review.game_title} • {review.profiles?.username} • {new Date(review.created_at).toLocaleDateString('tr-TR')}
                            </p>
                            <div className="flex items-center mt-1">
                              <span className="text-yellow-400">⭐</span>
                              <span className="ml-1">{review.rating}/10</span>
                            </div>
                            <p className="text-sm mt-2">{review.content.substring(0, 100)}...</p>
                          </div>
                          <div className="flex space-x-2">
                            <span className={`px-2 py-1 rounded text-xs ${
                              review.published ? 'bg-green-600' : 'bg-yellow-600'
                            }`}>
                              {review.published ? 'Yayınlandı' : 'Taslak'}
                            </span>
                            <button
                              onClick={() => handleEditReview(review)}
                              className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
                            >
                              Düzenle
                            </button>
                            <button
                              onClick={() => handleDeleteReview(review.id)}
                              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
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

              {/* Forum Tab */}
              {activeTab === 'forum' && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">Forum Yönetimi</h2>
                  <div className="space-y-4">
                    {forumPosts.map(post => (
                      <div key={post.id} className="bg-gray-700 p-4 rounded">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold">{post.title}</h3>
                            <p className="text-sm text-gray-400">
                              {post.profiles?.username} • {new Date(post.created_at).toLocaleDateString('tr-TR')}
                            </p>
                            <p className="text-sm mt-2">{post.content.substring(0, 100)}...</p>
                          </div>
                          <div className="flex space-x-2">
                            <button className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm">
                              Sil
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Blog Post Modal */}
        {showBlogForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-gray-800 p-6 rounded-lg w-full max-w-2xl">
              <h3 className="text-xl font-bold mb-4">
                {editingBlogPost ? 'Blog Postunu Düzenle' : 'Yeni Blog Postu'}
              </h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Başlık"
                  value={blogFormData.title}
                  onChange={(e) => setBlogFormData({...blogFormData, title: e.target.value})}
                  className="w-full p-2 bg-gray-700 rounded"
                />
                <textarea
                  placeholder="İçerik"
                  value={blogFormData.content}
                  onChange={(e) => setBlogFormData({...blogFormData, content: e.target.value})}
                  className="w-full p-2 bg-gray-700 rounded h-32"
                />
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={blogFormData.published}
                    onChange={(e) => setBlogFormData({...blogFormData, published: e.target.checked})}
                    className="mr-2"
                  />
                  Yayınla
                </label>
              </div>
              <div className="flex space-x-2 mt-4">
                <button
                  onClick={handleSaveBlogPost}
                  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
                >
                  Kaydet
                </button>
                <button
                  onClick={() => {
                    setShowBlogForm(false)
                    setEditingBlogPost(null)
                    setBlogFormData({ title: '', content: '', published: false })
                  }}
                  className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
                >
                  İptal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Game Review Modal */}
        {showReviewForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-gray-800 p-6 rounded-lg w-full max-w-2xl">
              <h3 className="text-xl font-bold mb-4">
                {editingReview ? 'İncelemeyi Düzenle' : 'Yeni Oyun İncelemesi'}
              </h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="İnceleme Başlığı"
                  value={reviewFormData.title}
                  onChange={(e) => setReviewFormData({...reviewFormData, title: e.target.value})}
                  className="w-full p-2 bg-gray-700 rounded"
                />
                <input
                  type="text"
                  placeholder="Oyun Adı"
                  value={reviewFormData.game_title}
                  onChange={(e) => setReviewFormData({...reviewFormData, game_title: e.target.value})}
                  className="w-full p-2 bg-gray-700 rounded"
                />
                <div className="flex items-center">
                  <label className="mr-2">Puan:</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={reviewFormData.rating}
                    onChange={(e) => setReviewFormData({...reviewFormData, rating: parseInt(e.target.value)})}
                    className="w-16 p-2 bg-gray-700 rounded"
                  />
                  <span className="ml-2">/10</span>
                </div>
                <textarea
                  placeholder="İnceleme içeriği"
                  value={reviewFormData.content}
                  onChange={(e) => setReviewFormData({...reviewFormData, content: e.target.value})}
                  className="w-full p-2 bg-gray-700 rounded h-32"
                />
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={reviewFormData.published}
                    onChange={(e) => setReviewFormData({...reviewFormData, published: e.target.checked})}
                    className="mr-2"
                  />
                  Yayınla
                </label>
              </div>
              <div className="flex space-x-2 mt-4">
                <button
                  onClick={handleSaveReview}
                  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
                >
                  Kaydet
                </button>
                <button
                  onClick={() => {
                    setShowReviewForm(false)
                    setEditingReview(null)
                    setReviewFormData({ title: '', content: '', game_title: '', rating: 5, published: false })
                  }}
                  className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
                >
                  İptal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}