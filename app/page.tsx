'use client';

import { useState, useEffect } from 'react';
import { Game } from '@/types/game';
import SearchBar from '@/components/SearchBar';
import GameList from '@/components/GameList';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function HomePage() {
  const [games, setGames] = useState<Game[]>([]);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    async function fetchGames() {
      try {
        const response = await fetch('/api/games');
        if (!response.ok) {
          throw new Error('Oyunlar yüklenirken hata oluştu');
        }
        const gamesData = await response.json();
        setGames(gamesData);
        setFilteredGames(gamesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Bir hata oluştu');
      } finally {
        setLoading(false);
      }
    }

    fetchGames();
  }, []);

  const handleFilteredGames = (filtered: Game[]) => {
    setFilteredGames(filtered);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400 text-lg">
              Hata: {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Üst Banner Reklam */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-lg shadow-lg overflow-hidden">
            <div className="relative">
              <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                REKLAM
              </div>
              <div className="p-6 text-center text-white">
                <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
                  <div className="flex items-center space-x-4">
                    <span className="text-4xl">🎮</span>
                    <div className="text-left">
                      <h3 className="text-2xl font-bold">GameStore Pro</h3>
                      <p className="text-pink-100">En İyi Oyun Fiyatları Burada!</p>
                    </div>
                  </div>
                  <div className="text-center lg:text-right">
                    <p className="text-lg font-semibold mb-2">%50&apos;ye Varan İndirimler</p>
                    <button className="bg-white text-red-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-lg">
                      🛒 Hemen Alışveriş Yap
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Muhteşem Oyunları Keşfedin
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Tüm türlerde en iyi oyunlardan oluşan özenle seçilmiş koleksiyonumuzu keşfedin. 
            Bir sonraki oyun maceranızı bulun!
          </p>
        </div>

        {/* Quick Content Creation - Only for logged in users */}
        {isAuthenticated && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Hoş geldin, {user?.username}! 🎮
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                İçerik oluşturmak için dashboard&apos;a git
              </p>
            </div>
            
            <div className="text-center">
              <Link 
                href="/dashboard" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 inline-flex items-center space-x-2 font-semibold shadow-lg"
              >
                <span className="text-xl">📋</span>
                <span>Dashboard&apos;a Git</span>
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">📝</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Blog Yazıları</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">💬</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Forum Konuları</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">⭐</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">İncelemeler</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">🎮</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Oyun Koleksiyonu</div>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <SearchBar games={games} onFilteredGames={handleFilteredGames} />

        {/* Orta Reklam Alanı */}
        <div className="my-8">
          <div className="bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div className="absolute top-2 left-2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                REKLAM ALANI
              </div>
              <div className="text-center w-full pt-4">
                <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
                  <div className="flex items-center space-x-4">
                    <span className="text-3xl">💻</span>
                    <div className="text-left">
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white">DosyaKutusu.com</h4>
                      <p className="text-gray-600 dark:text-gray-400">Dosyalarınızı Güvenle Paylaşın</p>
                    </div>
                  </div>
                  <div className="text-center lg:text-right">
                    <p className="text-gray-700 dark:text-gray-300 mb-2">10GB Ücretsiz Alan</p>
                    <a
                      href="https://dosyakutusu.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      📤 Dosya Yükle
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Games List */}
        <GameList games={filteredGames} />

        {/* Alt Banner ve Reklam Verme Teklifi */}
        <div className="mt-12 space-y-6">
          {/* Alt Reklam Banner */}
          <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-lg shadow-lg overflow-hidden">
            <div className="relative">
              <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                REKLAM
              </div>
              <div className="p-6 text-center text-white">
                <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                  <div className="flex items-center space-x-4">
                    <span className="text-3xl">🎯</span>
                    <div className="text-left">
                      <h3 className="text-xl font-bold">TechGear Store</h3>
                      <p className="text-green-100">Gaming Donanımları</p>
                    </div>
                  </div>
                  <div className="text-center md:text-right">
                    <p className="text-lg font-semibold mb-2">Yeni Nesil Gaming Ekipmanları</p>
                    <button className="bg-white text-green-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                      🖱️ Keşfet
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reklam Verme Teklifi */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow-lg p-8 text-white text-center">
            <div className="max-w-3xl mx-auto">
              <span className="text-4xl block mb-4">📢</span>
              <h3 className="text-2xl font-bold mb-4">
                Buraya Reklam Vermek İster misiniz?
              </h3>
              <p className="text-lg mb-6 opacity-90">
                Binlerce oyunsever tarafından görülen sitemizde markanızı tanıtın! 
                Etkili reklam çözümleri ile hedef kitlenize ulaşın.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <div className="text-2xl mb-2">👥</div>
                  <div className="font-semibold">10K+ Günlük Ziyaretçi</div>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <div className="text-2xl mb-2">🎮</div>
                  <div className="font-semibold">Gaming Odaklı Kitle</div>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <div className="text-2xl mb-2">📊</div>
                  <div className="font-semibold">Yüksek Etkileşim</div>
                </div>
              </div>
              <div className="space-y-4 md:space-y-0 md:space-x-4 md:flex md:justify-center">
                <a
                  href="mailto:reklam@aykutkaya.com"
                  className="bg-white text-purple-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors inline-block"
                >
                  📧 Reklam Talebi Gönder
                </a>
                <Link
                  href="/reklam-paketleri"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors inline-block"
                >
                  📋 Reklam Paketleri
                </Link>
              </div>
              <p className="text-sm mt-4 opacity-75">
                Profesyonel reklam çözümleri için bizimle iletişime geçin
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}