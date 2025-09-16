'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface GameReview {
  id: string;
  gameTitle: string;
  gameSlug: string;
  rating: number;
  title: string;
  content: string;
  summary: string;
  pros: string[];
  cons: string[];
  author: string;
  createdAt: string;
  published: boolean;
  gameImage?: string;
  playTime?: string;
  platform?: string;
}

export default function PublicReviewsPage() {
  const [reviews, setReviews] = useState<GameReview[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<GameReview[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // newest, rating, alphabetical

  useEffect(() => {
    // localStorage'dan yayınlanan incelemeleri yükle
    const savedReviews = localStorage.getItem('aykutkaya_game_reviews');
    if (savedReviews) {
      const allReviews: GameReview[] = JSON.parse(savedReviews);
      const publishedReviews = allReviews.filter(review => review.published);
      setReviews(publishedReviews);
      setFilteredReviews(publishedReviews);
    }
  }, []);

  useEffect(() => {
    let filtered = reviews;

    // Arama filtresi
    if (searchTerm) {
      filtered = filtered.filter(review =>
        review.gameTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.summary.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sıralama
    switch (sortBy) {
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'alphabetical':
        filtered.sort((a, b) => a.gameTitle.localeCompare(b.gameTitle));
        break;
      default: // newest
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    setFilteredReviews(filtered);
  }, [reviews, searchTerm, sortBy]);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating / 2);
    const hasHalfStar = rating % 2 >= 1;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className="text-yellow-400">★</span>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i} className="text-yellow-400">☆</span>);
      } else {
        stars.push(<span key={i} className="text-gray-300">☆</span>);
      }
    }
    return stars;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 9) return 'text-green-600 dark:text-green-400';
    if (rating >= 8) return 'text-blue-600 dark:text-blue-400';
    if (rating >= 7) return 'text-yellow-600 dark:text-yellow-400';
    if (rating >= 6) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getRatingBadge = (rating: number) => {
    if (rating >= 9) return { text: 'Mükemmel', bg: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' };
    if (rating >= 8) return { text: 'Çok İyi', bg: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' };
    if (rating >= 7) return { text: 'İyi', bg: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' };
    if (rating >= 6) return { text: 'Orta', bg: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' };
    return { text: 'Zayıf', bg: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' };
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Oyun İncelemeleri
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Profesyonel oyun incelemelerimizi keşfedin. Her oyun detaylı analiz edilip puanlanmıştır.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Oyun incelemeleri ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="newest">En Yeni</option>
                <option value="rating">En Yüksek Puan</option>
                <option value="alphabetical">A-Z Sırala</option>
              </select>
            </div>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Temizle
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400">{reviews.length}</h3>
            <p className="text-gray-600 dark:text-gray-400">Toplam İnceleme</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-2xl font-bold text-green-600 dark:text-green-400">
              {reviews.length > 0 ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1) : '0'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">Ortalama Puan</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-2xl font-bold text-purple-600 dark:text-purple-400">{filteredReviews.length}</h3>
            <p className="text-gray-600 dark:text-gray-400">Görüntülenen</p>
          </div>
        </div>

        {/* Reviews Grid */}
        {filteredReviews.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 p-12 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {reviews.length === 0 ? 'Henüz oyun incelemesi yok' : 'Arama kriterlerinize uygun inceleme bulunamadı'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {reviews.length === 0 
                ? 'İlk oyun incelemesinin yayınlanmasını bekleyin!'
                : 'Farklı arama terimleri deneyebilirsiniz.'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredReviews.map((review) => {
              const ratingBadge = getRatingBadge(review.rating);
              return (
                <article key={review.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                  {/* Game Image */}
                  {review.gameImage && (
                    <div className="h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={review.gameImage} 
                        alt={review.gameTitle}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  
                  <div className="p-6">
                    {/* Rating and Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          {renderStars(review.rating)}
                        </div>
                        <span className={`text-xl font-bold ${getRatingColor(review.rating)}`}>
                          {review.rating}/10
                        </span>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${ratingBadge.bg}`}>
                        {ratingBadge.text}
                      </span>
                    </div>

                    {/* Game Title */}
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {review.gameTitle}
                    </h2>

                    {/* Review Title */}
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3 line-clamp-2">
                      {review.title}
                    </h3>

                    {/* Summary */}
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                      {review.summary}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <span>👤 {review.author}</span>
                      <span>📅 {formatDate(review.createdAt)}</span>
                    </div>

                    {/* Platform and Play Time */}
                    {(review.platform || review.playTime) && (
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                        {review.platform && <span>🎮 {review.platform}</span>}
                        {review.playTime && <span>⏱️ {review.playTime}</span>}
                      </div>
                    )}

                    {/* Read More Button */}
                    <Link
                      href={`/game-reviews/${review.id}`}
                      className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                    >
                      Detaylı İncelemeyi Oku
                      <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}