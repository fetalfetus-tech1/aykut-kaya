'use client'

import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getBlogPosts, getForumPosts, getGameReviews } from '@/lib/database'

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState({
    blogPosts: 0,
    forumPosts: 0,
    gameReviews: 0
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
    }
  }, [user, loading, router])

  useEffect(() => {
    async function loadStats() {
      try {
        const [blogs, forums, reviews] = await Promise.all([
          getBlogPosts(),
          getForumPosts(),
          getGameReviews()
        ])
        setStats({
          blogPosts: blogs.length,
          forumPosts: forums.length,
          gameReviews: reviews.length
        })
      } catch (error) {
        console.error('İstatistikler yüklenirken hata:', error)
      }
    }

    if (user) {
      loadStats()
    }
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl text-white">👋</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Hoş Geldin, {user?.email}!
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Ne paylaşmak istiyorsun? Aşağıdaki seçeneklerden birini seç ve içerik oluşturmaya başla!
          </p>
        </div>

        {/* Content Creation Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Blog Yazısı */}
          <Link href="/admin" className="group">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-center">
                <div className="text-4xl mb-4">📝</div>
                <h3 className="text-2xl font-bold text-white mb-2">Blog Yazısı</h3>
                <p className="text-blue-100">Deneyimlerini paylaş</p>
              </div>
              <div className="p-6">
                <ul className="space-y-3 text-gray-600 dark:text-gray-400 mb-6">
                  <li className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span>Kişisel deneyimler</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span>Oyun hikayeleri</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span>Gaming ipuçları</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span>Haberler ve güncellemeler</span>
                  </li>
                </ul>
                <div className="text-center">
                  <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                    Blog Yazısı Oluştur
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* Forum Konusu */}
          <Link href="/forum" className="group">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-center">
                <div className="text-4xl mb-4">💬</div>
                <h3 className="text-2xl font-bold text-white mb-2">Forum Konusu</h3>
                <p className="text-green-100">Tartışma başlat</p>
              </div>
              <div className="p-6">
                <ul className="space-y-3 text-gray-600 dark:text-gray-400 mb-6">
                  <li className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span>Soru sor ve cevap al</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span>Tartışma başlat</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span>Toplulukla etkileşim</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span>Anında geri bildirim</span>
                  </li>
                </ul>
                <div className="text-center">
                  <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-4 py-2 rounded-full text-sm font-semibold group-hover:bg-green-200 dark:group-hover:bg-green-800 transition-colors">
                    Konu Aç
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* Oyun İncelemesi */}
          <Link href="/game-reviews" className="group">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 text-center">
                <div className="text-4xl mb-4">⭐</div>
                <h3 className="text-2xl font-bold text-white mb-2">Oyun İncelemesi</h3>
                <p className="text-purple-100">Profesyonel değerlendirme</p>
              </div>
              <div className="p-6">
                <ul className="space-y-3 text-gray-600 dark:text-gray-400 mb-6">
                  <li className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span>Detaylı puanlama sistemi</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span>Artı ve eksiler</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span>Oyun süreleri ve platform</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span>Görsel medya desteği</span>
                  </li>
                </ul>
                <div className="text-center">
                  <span className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold group-hover:bg-purple-200 dark:group-hover:bg-purple-800 transition-colors">
                    İnceleme Yaz
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            İçerik İstatistiklerin
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">📝</span>
              </div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">-</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Blog Yazıları</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">💬</span>
              </div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">-</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Forum Konuları</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">⭐</span>
              </div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">-</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">İncelemeler</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">👁️</span>
              </div>
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">-</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Toplam Görüntülenme</div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Son Aktiviteler
          </h2>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎮</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Henüz içerik yok
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              İlk içeriğini oluştur ve burada görüntüle
            </p>
            <div className="space-x-4">
              <Link
                href="/admin"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
              >
                Blog Yazısı Yaz
              </Link>
              <Link
                href="/forum"
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors inline-block"
              >
                Forum&apos;a Git
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}