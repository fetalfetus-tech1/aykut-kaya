'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface PopularGame {
  id: string
  title: string
  rating: number
  image: string
  genre: string
  views: number
}

interface PopularPost {
  id: string
  title: string
  excerpt: string
  slug: string
  views: number
  created_at: string
  profiles: { username: string }
}

export default function HomePage() {
  const { user, isAuthenticated, isAdmin, loading } = useAuth()
  const [popularGames, setPopularGames] = useState<PopularGame[]>([])
  const [popularPosts, setPopularPosts] = useState<PopularPost[]>([])
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPosts: 0,
    totalGames: 0
  })

  useEffect(() => {
    loadPopularContent()
    loadStats()
  }, [])

  const loadPopularContent = async () => {
    try {
      // En popüler blog yazıları (gerçek veriler)
      const { data: posts } = await supabase
        .from('blog_posts')
        .select(`
          *,
          profiles(username)
        `)
        .eq('published', true)
        .order('views', { ascending: false })
        .limit(5)

      setPopularPosts(posts || [])

      // Örnek popüler oyunlar (daha sonra veritabanından gelecek)
      const mockGames = [
        {
          id: '1',
          title: 'Cyberpunk 2077',
          rating: 8.5,
          image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop',
          genre: 'RPG',
          views: 15420
        },
        {
          id: '2',
          title: 'The Witcher 3',
          rating: 9.8,
          image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop',
          genre: 'RPG',
          views: 12380
        },
        {
          id: '3',
          title: 'God of War',
          rating: 9.2,
          image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
          genre: 'Action',
          views: 11250
        },
        {
          id: '4',
          title: 'Red Dead Redemption 2',
          rating: 9.0,
          image: 'https://images.unsplash.com/photo-1560743173-567a3b5658b1?w=400&h=300&fit=crop',
          genre: 'Adventure',
          views: 10890
        },
        {
          id: '5',
          title: 'Elden Ring',
          rating: 9.5,
          image: 'https://images.unsplash.com/photo-1556438064-2d7646166914?w=400&h=300&fit=crop',
          genre: 'Souls-like',
          views: 9670
        }
      ]
      setPopularGames(mockGames)

    } catch (error) {
      console.error('İçerik yüklenirken hata:', error)
    }
  }

  const loadStats = async () => {
    try {
      const [
        { count: usersCount },
        { count: postsCount }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('blog_posts').select('*', { count: 'exact', head: true }).eq('published', true)
      ])

      setStats({
        totalUsers: usersCount || 0,
        totalPosts: postsCount || 0,
        totalGames: 156 // Mock değer
      })
    } catch (error) {
      console.error('İstatistikler yüklenirken hata:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-purple-900 to-gray-900 py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            🎮 Aykut Kaya
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Gaming dünyasının en güncel haberleri, incelemeler ve rehberler burada!
          </p>
          
          {/* User Welcome Section */}
          {isAuthenticated ? (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-3">
                Hoş geldin, {user?.profile?.username || user?.email}! 🎮
              </h2>
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  user?.profile?.role === 'admin' ? 'bg-red-500/20 text-red-300 border border-red-500' :
                  user?.profile?.role === 'moderator' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500' :
                  'bg-green-500/20 text-green-300 border border-green-500'
                }`}>
                  {user?.profile?.role === 'admin' ? '👑 Site Yöneticisi' :
                   user?.profile?.role === 'moderator' ? '🛡️ Moderatör' :
                   '👤 Üye'}
                </span>
              </div>
              
              <div className="flex flex-wrap justify-center gap-4">
                {isAdmin && (
                  <Link 
                    href="/admin" 
                    className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 flex items-center gap-2"
                  >
                    <span>👑</span>
                    <span>Admin Panel</span>
                  </Link>
                )}
                
                <Link 
                  href="/blog" 
                  className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 flex items-center gap-2"
                >
                  <span>📝</span>
                  <span>Blog</span>
                </Link>
                
                <Link 
                  href="/forum" 
                  className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 flex items-center gap-2"
                >
                  <span>💬</span>
                  <span>Forum</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex justify-center gap-4 mb-8">
              <Link 
                href="/auth" 
                className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105"
              >
                Giriş Yap / Kayıt Ol
              </Link>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-3xl font-bold text-blue-400">{stats.totalUsers}</div>
              <div className="text-gray-300">Aktif Üye</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-3xl font-bold text-green-400">{stats.totalPosts}</div>
              <div className="text-gray-300">Blog Yazısı</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-3xl font-bold text-purple-400">{stats.totalGames}</div>
              <div className="text-gray-300">Oyun İncelemesi</div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* En Popüler Oyunlar */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <h2 className="text-3xl font-bold">🏆 En Popüler Oyunlar</h2>
            </div>
            
            <div className="space-y-4">
              {popularGames.map((game, index) => (
                <div key={game.id} className="bg-gray-800 rounded-xl p-4 hover:bg-gray-750 transition-all duration-300 transform hover:scale-[1.02]">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center text-black font-bold text-lg">
                        #{index + 1}
                      </div>
                    </div>
                    
                    <img 
                      src={game.image} 
                      alt={game.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{game.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span className="bg-blue-600 px-2 py-1 rounded text-xs text-white">
                          {game.genre}
                        </span>
                        <span>👁️ {game.views.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-yellow-400">
                        <span>⭐</span>
                        <span className="font-bold text-lg">{game.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <Link 
                href="/oyunlar" 
                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-semibold"
              >
                <span>Tüm Oyunları Gör</span>
                <span>→</span>
              </Link>
            </div>
          </section>

          {/* En Popüler Blog Yazıları */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <h2 className="text-3xl font-bold">📝 En Popüler Blog Yazıları</h2>
            </div>
            
            {popularPosts.length === 0 ? (
              <div className="text-center py-12 bg-gray-800 rounded-xl">
                <div className="text-4xl mb-4">📝</div>
                <p className="text-gray-400 mb-4">Henüz blog yazısı yok</p>
                {isAdmin && (
                  <Link 
                    href="/admin" 
                    className="text-blue-400 hover:text-blue-300"
                  >
                    İlk yazıyı sen oluştur!
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {popularPosts.map((post, index) => (
                  <div key={post.id} className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-all duration-300 transform hover:scale-[1.02]">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                          #{index + 1}
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-2 line-clamp-2">{post.title}</h3>
                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{post.excerpt}</p>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center gap-3">
                            <span>✍️ {post.profiles?.username}</span>
                            <span>👁️ {post.views}</span>
                          </div>
                          <span>{new Date(post.created_at).toLocaleDateString('tr-TR')}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
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
            
            <div className="mt-6 text-center">
              <Link 
                href="/blog" 
                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-semibold"
              >
                <span>Tüm Blog Yazılarını Gör</span>
                <span>→</span>
              </Link>
            </div>
          </section>
        </div>

        {/* Call to Action */}
        <section className="mt-20 text-center">
          <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-2xl p-12 border border-blue-500/20">
            <h2 className="text-3xl font-bold mb-4">Gaming Topluluğuna Katıl! 🎮</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              En son gaming haberlerini kaçırma, incelemelerimizi oku ve topluluğumuzda tartışmalara katıl!
            </p>
            
            {!isAuthenticated && (
              <Link 
                href="/auth" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 inline-block"
              >
                Hemen Katıl! 🚀
              </Link>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}