'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
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
  const { user, isAdmin, loading: authLoading } = useAuth()
  const router = useRouter()

  console.log('🚨 DASHBOARD DEBUG:', { authLoading, user, isAdmin })
  const [stats, setStats] = useState<UserStats>({
    totalPosts: 0,
    totalComments: 0,
    totalLikes: 0,
    joinDate: ''
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loadingStats, setLoadingStats] = useState(true)

  // Profil kontrolü - eğer profil yoksa setup sayfasına yönlendir
  useEffect(() => {
    if (!authLoading && user && !user.profile) {
      // Şimdilik profile setup'a yönlendirmiyoruz, dashboard'da uyarı gösteriyoruz
      // router.push('/profile/setup')
      return
    }
  }, [user, authLoading, router])

  const loadUserData = useCallback(async () => {
    if (!user) return

    try {
      setLoadingStats(true)

      // Kullanıcı istatistiklerini yükle - user varsa kullan
      const userId = user.id
      const [postsResult, commentsResult, profileResult] = await Promise.all([
        supabase
          .from('blog_posts')
          .select('id', { count: 'exact' })
          .eq('author_id', userId),
        supabase
          .from('forum_posts')
          .select('id', { count: 'exact' })
          .eq('author_id', userId),
        supabase
          .from('profiles')
          .select('created_at')
          .eq('id', userId)
          .single()
      ])

      setStats({
        totalPosts: postsResult.count || 0,
        totalComments: commentsResult.count || 0,
        totalLikes: 0, // Şimdilik 0
        joinDate: profileResult.data?.created_at ? new Date(profileResult.data.created_at).toLocaleDateString('tr-TR') : ''
      })

      // Son aktiviteleri yükle
      const { data: posts } = await supabase
        .from('blog_posts')
        .select('id, title, created_at')
        .eq('author_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)

      const activities: RecentActivity[] = (posts || []).map(post => ({
        id: post.id,
        type: 'post' as const,
        title: post.title,
        created_at: post.created_at,
        url: `/blog/${post.id}`
      }))

      setRecentActivity(activities)
    } catch (error) {
      console.error('Dashboard verisi yüklenirken hata:', error)
    } finally {
      setLoadingStats(false)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      loadUserData()
    }
  }, [user, loadUserData])

  // Eğer yükleniyor ise loading göster
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Auth kontrolü geri getirildi - artık çalışıyor
  if (!user) {
    router.push('/auth')
    return null
  }

  // Profil kontrolü kaldırıldı - profile yoksa da dashboard'a girebilir

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">👤 Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Hoş geldin, {user?.profile?.username || user?.email || 'Misafir'}!
            </p>
            {user && !user.profile && (
              <div className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                <div className="flex items-center">
                  <span className="text-yellow-800 dark:text-yellow-200 text-sm">
                    ⚠️ Profiliniz henüz tamamlanmamış.
                    <Link href="/profile/setup" className="underline hover:text-yellow-600 dark:hover:text-yellow-300 ml-1">
                      Profilinizi tamamlayın
                    </Link>
                  </span>
                </div>
              </div>
            )}
          </div>

          {user && isAdmin && (
            <Link
              href="/admin"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              ⚙️ Admin Paneli
            </Link>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl mb-2">📝</div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.totalPosts}</div>
            <div className="text-gray-600 dark:text-gray-400">Blog Yazısı</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl mb-2">💬</div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.totalComments}</div>
            <div className="text-gray-600 dark:text-gray-400">Forum Gönderisi</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl mb-2">❤️</div>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.totalLikes}</div>
            <div className="text-gray-600 dark:text-gray-400">Beğeni</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl mb-2">📅</div>
            <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
              {stats.joinDate ? new Date(stats.joinDate).toLocaleDateString('tr-TR') : 'Bilinmiyor'}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Katılma Tarihi</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">⚡ Hızlı İşlemler</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/blog"
              className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg text-center transition-colors"
            >
              <div className="text-2xl mb-2">📝</div>
              <div className="font-medium">Blog Yazısı Yaz</div>
            </Link>

            <Link
              href="/forum"
              className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg text-center transition-colors"
            >
              <div className="text-2xl mb-2">💬</div>
              <div className="font-medium">Forum&apos;da Tartış</div>
            </Link>

            <Link
              href="/oyunlar"
              className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg text-center transition-colors"
            >
              <div className="text-2xl mb-2">🎮</div>
              <div className="font-medium">Oyunları Keşfet</div>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">📈 Son Aktiviteler</h2>

          {loadingStats ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Aktiviteler yükleniyor...</p>
            </div>
          ) : recentActivity.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Henüz aktivite yok</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                İlk blog yazını yazarak başlayabilirsin!
              </p>
              <Link
                href="/blog"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-block"
              >
                Blog Yazısı Yaz
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">
                      {activity.type === 'post' ? '📝' : activity.type === 'comment' ? '💬' : '❤️'}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{activity.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(activity.created_at).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={activity.url}
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                  >
                    Görüntüle →
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