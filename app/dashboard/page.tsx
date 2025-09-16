'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface UserStats {
  totalPosts: number
  totalComments: number
  totalLikes: number
  joinDate: string
}

interface RecentActivity {
  id: string
  type: 'post' | 'comment' | 'like'
  title: string
  created_at: string
  url: string
}

export default function DashboardPage() {
  const { user, isAdmin } = useAuth()
  const [stats, setStats] = useState<UserStats>({
    totalPosts: 0,
    totalComments: 0,
    totalLikes: 0,
    joinDate: ''
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadUserData()
    }
  })

  const loadUserData = useCallback(async () => {
    try {
      // Kullanıcı istatistiklerini yükle
      const [postsResult, commentsResult, profileResult] = await Promise.all([
        supabase
          .from('blog_posts')
          .select('id', { count: 'exact' })
          .eq('author_id', user?.id),
        supabase
          .from('forum_posts')
          .select('id', { count: 'exact' })
          .eq('author_id', user?.id),
        supabase
          .from('profiles')
          .select('created_at')
          .eq('id', user?.id)
          .single()
      ])

      setStats({
        totalPosts: postsResult.count || 0,
        totalComments: commentsResult.count || 0,
        totalLikes: 0, // Şimdilik 0
        joinDate: profileResult.data?.created_at || ''
      })

      // Son aktiviteleri yükle
      const recentPosts = await supabase
        .from('blog_posts')
        .select('id, title, created_at')
        .eq('author_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5)

      const activities: RecentActivity[] = []
      if (recentPosts.data) {
        recentPosts.data.forEach(post => {
          activities.push({
            id: post.id,
            type: 'post',
            title: post.title,
            created_at: post.created_at,
            url: `/blog/${post.id}`
          })
        })
      }

      setRecentActivity(activities)
    } catch (error) {
      console.error('Kullanıcı verisi yüklenirken hata:', error)
    }
    setLoading(false)
  }, [user?.id])

  useEffect(() => {
    if (user) {
      loadUserData()
    }
  }, [user, loadUserData])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <p className="mt-2">Dashboard yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">👤 Dashboard</h1>
            <p className="text-gray-400">Hoş geldin, {user?.user_metadata?.username || 'Kullanıcı'}!</p>
          </div>

          {isAdmin && (
            <Link
              href="/admin"
              className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              ⚙️ Admin Paneli
            </Link>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <div className="text-3xl mb-2">📝</div>
            <div className="text-2xl font-bold text-blue-400">{stats.totalPosts}</div>
            <div className="text-gray-400">Blog Yazısı</div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <div className="text-3xl mb-2">💬</div>
            <div className="text-2xl font-bold text-green-400">{stats.totalComments}</div>
            <div className="text-gray-400">Forum Gönderisi</div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <div className="text-3xl mb-2">❤️</div>
            <div className="text-2xl font-bold text-red-400">{stats.totalLikes}</div>
            <div className="text-gray-400">Beğeni</div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <div className="text-3xl mb-2">📅</div>
            <div className="text-lg font-bold text-purple-400">
              {stats.joinDate ? new Date(stats.joinDate).toLocaleDateString('tr-TR') : 'Bilinmiyor'}
            </div>
            <div className="text-gray-400">Katılma Tarihi</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">⚡ Hızlı İşlemler</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/blog"
              className="bg-blue-600 hover:bg-blue-700 p-4 rounded-lg text-center transition-colors"
            >
              <div className="text-2xl mb-2">📝</div>
              <div className="font-medium">Blog Yazısı Yaz</div>
            </Link>

            <Link
              href="/forum"
              className="bg-green-600 hover:bg-green-700 p-4 rounded-lg text-center transition-colors"
            >
              <div className="text-2xl mb-2">💬</div>
              <div className="font-medium">Forum&apos;da Tartış</div>
            </Link>

            <Link
              href="/oyunlar"
              className="bg-purple-600 hover:bg-purple-700 p-4 rounded-lg text-center transition-colors"
            >
              <div className="text-2xl mb-2">🎮</div>
              <div className="font-medium">Oyunları Keşfet</div>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">📈 Son Aktiviteler</h2>

          {recentActivity.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-bold mb-2">Henüz aktivite yok</h3>
              <p className="text-gray-400 mb-4">
                İlk blog yazını yazarak başlayabilirsin!
              </p>
              <Link
                href="/blog"
                className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition-colors inline-block"
              >
                Blog Yazısı Yaz
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">
                      {activity.type === 'post' && '📝'}
                      {activity.type === 'comment' && '💬'}
                      {activity.type === 'like' && '❤️'}
                    </div>
                    <div>
                      <Link
                        href={activity.url}
                        className="font-medium hover:text-blue-400 transition-colors"
                      >
                        {activity.title}
                      </Link>
                      <div className="text-sm text-gray-400">
                        {new Date(activity.created_at).toLocaleDateString('tr-TR')}
                      </div>
                    </div>
                  </div>
                  <Link
                    href={activity.url}
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}