'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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

export default function GameReviewDetailPage() {
  const [review, setReview] = useState<GameReview | null>(null);
  const [relatedReviews, setRelatedReviews] = useState<GameReview[]>([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const router = useRouter();
  const reviewId = params.id as string;

  useEffect(() => {
    if (!reviewId) return;

    // localStorage'dan incelemeyi yükle
    const savedReviews = localStorage.getItem('aykutkaya_game_reviews');
    if (savedReviews) {
      const allReviews: GameReview[] = JSON.parse(savedReviews);
      const currentReview = allReviews.find(r => r.id === reviewId && r.published);
      
      if (currentReview) {
        setReview(currentReview);
        
        // İlgili incelemeleri bul (aynı yazar veya yakın puan)
        const related = allReviews
          .filter(r => 
            r.id !== reviewId && 
            r.published && 
            (r.author === currentReview.author || Math.abs(r.rating - currentReview.rating) <= 1)
          )
          .slice(0, 3);
        setRelatedReviews(related);
      }
    }
    setLoading(false);
  }, [reviewId]);

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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatContent = (content: string) => {
    return content.split('\n').map((paragraph, index) => (
      <p key={index} className="mb-4 leading-relaxed">
        {paragraph}
      </p>
    ));
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">İnceleme bulunamadı</p>
          <Link
            href="/reviews-public"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            İncelemelere Dön
          </Link>
        </div>
      </div>
    );
  }

  const ratingBadge = getRatingBadge(review.rating);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sol Reklam Alanı - Desktop'ta görünür */}
          <div className="hidden xl:block w-60 flex-shrink-0">
            <div className="sticky top-8 space-y-6">
              {/* Reklam Alanı 1 */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 text-center border-2 border-dashed border-gray-300 dark:border-gray-600">
                <div className="h-60 flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-lg">
                  <div className="text-center">
                    <div className="text-3xl mb-2">📢</div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Reklam Alanı
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      300x250px
                    </p>
                  </div>
                </div>
              </div>

              {/* Reklam Alanı 2 */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 text-center border-2 border-dashed border-gray-300 dark:border-gray-600">
                <div className="h-60 flex items-center justify-center bg-gradient-to-br from-green-100 to-teal-100 dark:from-green-900 dark:to-teal-900 rounded-lg">
                  <div className="text-center">
                    <div className="text-3xl mb-2">🎮</div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Oyun Reklamı
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      300x250px
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ana İçerik */}
          <div className="flex-1 max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav className="mb-8">
              <ol className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <li>
                  <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">
                    Ana Sayfa
                  </Link>
                </li>
                <li>/</li>
                <li>
                  <Link href="/reviews-public" className="hover:text-blue-600 dark:hover:text-blue-400">
                    İncelemeler
                  </Link>
                </li>
                <li>/</li>
                <li className="text-gray-900 dark:text-white truncate">{review.gameTitle}</li>
              </ol>
            </nav>

        {/* Review Article */}
        <article className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {/* Header Image */}
          {review.gameImage && (
            <div className="h-64 md:h-96 bg-gray-200 dark:bg-gray-700 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={review.gameImage} 
                alt={review.gameTitle}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="p-8">
            {/* Game Title and Rating */}
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {review.gameTitle}
              </h1>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center text-2xl">
                      {renderStars(review.rating)}
                    </div>
                    <span className={`text-3xl font-bold ${getRatingColor(review.rating)}`}>
                      {review.rating}/10
                    </span>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${ratingBadge.bg}`}>
                    {ratingBadge.text}
                  </span>
                </div>
              </div>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
                <span className="flex items-center">
                  👤 <span className="ml-1">İnceleme: {review.author}</span>
                </span>
                <span className="flex items-center">
                  📅 <span className="ml-1">{formatDate(review.createdAt)}</span>
                </span>
                {review.platform && (
                  <span className="flex items-center">
                    🎮 <span className="ml-1">{review.platform}</span>
                  </span>
                )}
                {review.playTime && (
                  <span className="flex items-center">
                    ⏱️ <span className="ml-1">{review.playTime}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Review Title */}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {review.title}
            </h2>

            {/* Summary */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg mb-8 border-l-4 border-blue-500">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-2">
                📝 Özet
              </h3>
              <p className="text-blue-800 dark:text-blue-200 text-lg">
                {review.summary}
              </p>
            </div>

            {/* Detailed Review */}
            <div className="prose max-w-none mb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Detaylı İnceleme
              </h3>
              <div className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                {formatContent(review.content)}
              </div>
            </div>

            {/* Pros and Cons */}
            {(review.pros.length > 0 || review.cons.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Pros */}
                {review.pros.length > 0 && (
                  <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
                    <h3 className="text-lg font-bold text-green-800 dark:text-green-300 mb-4 flex items-center">
                      ✅ Artıları
                    </h3>
                    <ul className="space-y-2">
                      {review.pros.map((pro, index) => (
                        <li key={index} className="text-green-700 dark:text-green-300 flex items-start">
                          <span className="text-green-500 mr-2 mt-1">•</span>
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Cons */}
                {review.cons.length > 0 && (
                  <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-200 dark:border-red-800">
                    <h3 className="text-lg font-bold text-red-800 dark:text-red-300 mb-4 flex items-center">
                      ❌ Eksileri
                    </h3>
                    <ul className="space-y-2">
                      {review.cons.map((con, index) => (
                        <li key={index} className="text-red-700 dark:text-red-300 flex items-start">
                          <span className="text-red-500 mr-2 mt-1">•</span>
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Final Score Box */}
            <div className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 p-6 rounded-lg text-center mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Final Puanı
              </h3>
              <div className="flex items-center justify-center space-x-4">
                <div className="flex items-center text-3xl">
                  {renderStars(review.rating)}
                </div>
                <span className={`text-4xl font-bold ${getRatingColor(review.rating)}`}>
                  {review.rating}/10
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {ratingBadge.text} - {review.gameTitle}
              </p>
            </div>

            {/* Author Box */}
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {review.author.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {review.author}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Oyun İnceleme Editörü
                  </p>
                </div>
              </div>
            </div>

            {/* Back to Reviews */}
            <div className="text-center">
              <Link
                href="/reviews-public"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Tüm İncelemelere Dön
              </Link>
            </div>
          </div>
        </article>

        {/* Related Reviews */}
        {relatedReviews.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              İlgili İncelemeler
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedReviews.map((relatedReview) => (
                <Link
                  key={relatedReview.id}
                  href={`/game-reviews/${relatedReview.id}`}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6"
                >
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="flex items-center">
                      {renderStars(relatedReview.rating)}
                    </div>
                    <span className={`font-semibold ${getRatingColor(relatedReview.rating)}`}>
                      {relatedReview.rating}/10
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {relatedReview.gameTitle}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
                    {relatedReview.summary}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
          </div>

          {/* Sağ Reklam Alanı - Desktop'ta görünür */}
          <div className="hidden xl:block w-60 flex-shrink-0">
            <div className="sticky top-8 space-y-6">
              {/* Reklam Alanı 3 */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 text-center border-2 border-dashed border-gray-300 dark:border-gray-600">
                <div className="h-60 flex items-center justify-center bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900 dark:to-red-900 rounded-lg">
                  <div className="text-center">
                    <div className="text-3xl mb-2">🛒</div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      E-ticaret
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      300x250px
                    </p>
                  </div>
                </div>
              </div>

              {/* Reklam Alanı 4 */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 text-center border-2 border-dashed border-gray-300 dark:border-gray-600">
                <div className="h-60 flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-lg">
                  <div className="text-center">
                    <div className="text-3xl mb-2">⭐</div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Premium İçerik
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      300x250px
                    </p>
                  </div>
                </div>
              </div>

              {/* Sosyal Medya Alanı */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-center">
                  Bizi Takip Edin
                </h3>
                <div className="space-y-2">
                  <a href="#" className="flex items-center space-x-3 p-2 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">f</span>
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Facebook</span>
                  </a>
                  <a href="#" className="flex items-center space-x-3 p-2 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                    <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">t</span>
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Twitter</span>
                  </a>
                  <a href="#" className="flex items-center space-x-3 p-2 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">▶</span>
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">YouTube</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobil Reklam Alanı - Sadece mobilde görünür */}
        <div className="xl:hidden mt-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 text-center border-2 border-dashed border-gray-300 dark:border-gray-600">
            <div className="h-32 flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-lg">
              <div className="text-center">
                <div className="text-2xl mb-2">📱</div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Mobil Reklam Alanı
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  320x100px
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}