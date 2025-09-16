'use client';

import { useState, useEffect } from 'react';
import { Game } from '@/types/game';
import Link from 'next/link';

const ReviewCard = ({ game }: { game: Game }) => {
  const normalizedRating = Math.max(0, Math.min(5, game.rating / 2));
  const fullStars = Math.floor(normalizedRating);
  const hasHalfStar = normalizedRating % 1 !== 0;
  const emptyStars = Math.max(0, 5 - fullStars - (hasHalfStar ? 1 : 0));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="md:flex">
        <div className="md:w-1/3">
          <img 
            src={game.image} 
            alt={game.title}
            className="w-full h-48 md:h-full object-cover"
          />
        </div>
        <div className="md:w-2/3 p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {game.title}
            </h3>
            <div className="flex items-center space-x-1">
              {[...Array(fullStars)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              ))}
              {hasHalfStar && (
                <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77V2z"/>
                </svg>
              )}
              {[...Array(emptyStars)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-gray-300 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              ))}
              <span className="ml-2 text-sm font-semibold text-gray-600 dark:text-gray-400">
                {game.rating.toFixed(1)}/10
              </span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-3">
            <span
              className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded"
            >
              {game.genre}
            </span>
          </div>
          
          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
            {game.description}
          </p>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              İnceleme Tarihi: {new Date().toLocaleDateString('tr-TR')}
            </span>
            <Link 
              href={`/games/${game.slug}`}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Detayları Gör
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ReviewsPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'rating' | 'title' | 'newest'>('rating');

  useEffect(() => {
    async function fetchGames() {
      try {
        const response = await fetch('/api/games');
        if (!response.ok) {
          throw new Error('İncelemeler yüklenirken hata oluştu');
        }
        const gamesData = await response.json();
        setGames(gamesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Bir hata oluştu');
      } finally {
        setLoading(false);
      }
    }

    fetchGames();
  }, []);

  const sortedGames = [...games].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'title':
        return a.title.localeCompare(b.title, 'tr');
      case 'newest':
        return parseInt(b.id) - parseInt(a.id);
      default:
        return 0;
    }
  });

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
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Oyun İncelemeleri
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            En yeni ve en popüler oyunlar hakkında detaylı incelemelerimizi keşfedin. 
            Hangi oyunun size uygun olduğunu öğrenin!
          </p>
        </div>

        {/* Sort Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-0">
            {games.length} İnceleme Bulundu
          </h2>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">Sırala:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'rating' | 'title' | 'newest')}
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="rating">En Yüksek Puan</option>
              <option value="title">Alfabetik</option>
              <option value="newest">En Yeni</option>
            </select>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {sortedGames.map((game) => (
            <ReviewCard key={game.id} game={game} />
          ))}
        </div>
      </div>
    </div>
  );
}