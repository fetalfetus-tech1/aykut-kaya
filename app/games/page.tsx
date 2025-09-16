'use client';

import { useState, useEffect } from 'react';
import { Game } from '@/types/game';
import SearchBar from '@/components/SearchBar';
import GameList from '@/components/GameList';
import Link from 'next/link';

export default function GamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-lg shadow-lg overflow-hidden">
            <div className="relative">
              <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                REKLAM
              </div>
              <div className="p-6 text-center text-white">
                <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
                  <div className="flex items-center space-x-4">
                    <span className="text-4xl">🎮</span>
                    <div className="text-left">
                      <h3 className="text-2xl font-bold">Gaming Paradise</h3>
                      <p className="text-orange-100">Oyun Dünyasının Kalbi</p>
                    </div>
                  </div>
                  <div className="text-center lg:text-right">
                    <p className="text-lg font-semibold mb-2">En Yeni Oyunlar İlk Buraya Geliyor!</p>
                    <button className="bg-white text-orange-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-lg">
                      🚀 Hemen Keşfet
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
            Tüm Oyunlar
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Koleksiyonumuzdaki tüm oyunları keşfedin. Favori türünüzü bulun ve 
            yeni oyun deneyimlerine hazırlanın!
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
            <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {games.length}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">Toplam Oyun</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
            <h3 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
              {games.filter(game => game.rating >= 9).length}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">Yüksek Puanlı</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
            <h3 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">
              {[...new Set(games.map(game => game.genre))].length}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">Farklı Kategori</p>
          </div>
        </div>

        {/* Search and Filter */}
        <SearchBar games={games} onFilteredGames={handleFilteredGames} />

        {/* Orta Reklam Alanı */}
        <div className="my-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg overflow-hidden">
            <div className="relative">
              <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                REKLAM
              </div>
              <div className="p-6 text-center text-white">
                <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                  <div className="flex items-center space-x-4">
                    <span className="text-3xl">📁</span>
                    <div className="text-left">
                      <h4 className="text-xl font-bold">DosyaKutusu.com</h4>
                      <p className="text-blue-100">Oyun Dosyalarınızı Güvenle Saklayın</p>
                    </div>
                  </div>
                  <div className="text-center md:text-right">
                    <p className="text-lg font-semibold mb-2">Ücretsiz 10GB Depolama</p>
                    <a
                      href="https://dosyakutusu.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                    >
                      📤 Hemen Başla
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Games List */}
        <GameList games={filteredGames} />

        {/* Alt Reklam ve Teklif */}
        <div className="mt-12">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-lg p-8 text-white text-center">
            <div className="max-w-2xl mx-auto">
              <span className="text-3xl block mb-4">📢</span>
              <h3 className="text-xl font-bold mb-4">
                Buraya Reklam Vermek İster misiniz?
              </h3>
              <p className="mb-6 opacity-90">
                Oyun tutkunları tarafından en çok ziyaret edilen sayfamızda markanızı tanıtın!
              </p>
              <div className="space-x-4">
                <a
                  href="mailto:reklam@aykutkaya.com"
                  className="bg-white text-purple-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors inline-block"
                >
                  📧 Reklam Talebi
                </a>
                <Link
                  href="/reklam-paketleri"
                  className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors inline-block"
                >
                  📋 Paketleri Gör
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}