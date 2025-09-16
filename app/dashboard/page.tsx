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

  console.log('🚨 DASHBOARD DEBUG:', {
    authLoading,
    user: user ? {
      id: user.id,
      email: user.email,
      profile: user.profile,
      hasProfile: !!user.profile,
      profileRole: user.profile?.role
    } : null,
    isAdmin,
    userType: typeof user,
    userKeys: user ? Object.keys(user) : null
  })
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

  // Profil eksik alan kontrolü
  const isProfileIncomplete =
    !user?.profile?.full_name ||
    !user?.profile?.avatar_url ||
    !user?.profile?.bio;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Modern Profil Kartı */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
          <div className="flex items-center gap-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 w-full md:w-auto">
            <div className="flex-shrink-0">
              {user?.profile?.avatar_url ? (
                <img
                  src={user.profile.avatar_url}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full object-cover border-4 border-blue-500 shadow-md"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-4xl text-white font-bold border-4 border-blue-500 shadow-md">
                  {user?.profile?.username?.[0]?.toUpperCase() || '👤'}
                </div>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                {user?.profile?.full_name || user?.profile?.username || user?.email}
                {user?.profile?.role === 'admin' && <span className="ml-2 px-2 py-1 rounded bg-red-600 text-white text-xs">Admin</span>}
                {user?.profile?.role === 'moderator' && <span className="ml-2 px-2 py-1 rounded bg-yellow-500 text-white text-xs">Moderatör</span>}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-2">{user?.profile?.bio || <span className="italic text-gray-400">Henüz biyografi eklenmedi.</span>}</p>
              <div className="flex flex-wrap gap-2">
                <Link href="/profile/edit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Profili Düzenle
                </Link>
                {isProfileIncomplete && (
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded text-xs font-semibold">
                    Profiliniz eksik! <Link href="/profile/edit" className="underline">Tamamla</Link>
                  </span>
                )}
              </div>
            </div>
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