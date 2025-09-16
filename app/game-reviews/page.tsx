'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Link from 'next/link';

interface GameReview {
  id: string;
  gameTitle: string;
  gameSlug: string;
  rating: number; // 0-10 arası
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

const sampleReviews: GameReview[] = [
  {
    id: "1",
    gameTitle: "The Witcher 3: Wild Hunt",
    gameSlug: "the-witcher-3-wild-hunt",
    rating: 9.5,
    title: "Bir RPG Başyapıtı - The Witcher 3 Detaylı İnceleme",
    content: "The Witcher 3, açık dünya RPG oyunlarının zirvesini temsil ediyor. Geralt'ın son macerasında karşımıza çıkan hikaye derinliği, karakter gelişimi ve yan görevlerin kalitesi gerçekten etkileyici.\n\nOyunun en güçlü yönlerinden biri hikayesi. Ana hikaye kadar yan görevler de son derece kaliteli ve her birinin kendine has bir hikayesi var. Karakterlerin gelişimi ve diyalogların kalitesi AAA standartlarını aşıyor.\n\nGrafik açısından hala etkileyici görünüyor. Açık dünya tasarımı mükemmel, her bölgenin kendine has atmosferi var. Müzikler de oyunun ruhuna çok uygun.\n\nSavaş sistemi başta biraz karmaşık gelebilir ama alıştıktan sonra oldukça tatmin edici. İksir sistemi ve karakter gelişimi çok detaylı.",
    summary: "RPG severler için mutlaka oynanması gereken bir başyapıt. Hikayesi, dünyası ve karakterleriyle unutulmaz bir deneyim sunuyor.",
    pros: [
      "Mükemmel hikaye ve karakter gelişimi",
      "Kaliteli yan görevler",
      "Etkileyici açık dünya tasarımı",
      "Harika müzikler ve atmosfer",
      "Çok fazla içerik (100+ saat)",
      "DLC'ler ana oyun kadar kaliteli"
    ],
    cons: [
      "Başta karmaşık kontroller",
      "Bazı teknik hatalar olabiliyor",
      "Envanter yönetimi zahmetli",
      "Yükleme süreleri uzun olabiliyor"
    ],
    author: "GameMaster",
    createdAt: "2025-09-15T10:00:00Z",
    published: true,
    gameImage: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop",
    playTime: "120 saat",
    platform: "PC, PlayStation, Xbox"
  }
];

export default function ReviewsManagementPage() {
  const [reviews, setReviews] = useState<GameReview[]>([]);
  const [showEditor, setShowEditor] = useState(false);
  const [editingReview, setEditingReview] = useState<GameReview | null>(null);
  const [formData, setFormData] = useState({
    gameTitle: '',
    rating: 8,
    title: '',
    content: '',
    summary: '',
    pros: '',
    cons: '',
    playTime: '',
    platform: '',
    gameImage: '',
    published: true
  });

  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    // localStorage'dan incelemeleri yükle
    const savedReviews = localStorage.getItem('aykutkaya_game_reviews');
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
    } else {
      // İlk kez açılıyorsa örnek inceleme ekle
      setReviews(sampleReviews);
      localStorage.setItem('aykutkaya_game_reviews', JSON.stringify(sampleReviews));
    }
  }, [isAuthenticated]);

  const saveReviews = (newReviews: GameReview[]) => {
    setReviews(newReviews);
    localStorage.setItem('aykutkaya_game_reviews', JSON.stringify(newReviews));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    const gameSlug = formData.gameTitle.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-');

    if (editingReview) {
      // Güncelle
      const updatedReviews = reviews.map(review => 
        review.id === editingReview.id 
          ? {
              ...editingReview,
              gameTitle: formData.gameTitle,
              gameSlug: gameSlug,
              rating: formData.rating,
              title: formData.title,
              content: formData.content,
              summary: formData.summary,
              pros: formData.pros.split('\n').filter(p => p.trim()),
              cons: formData.cons.split('\n').filter(c => c.trim()),
              playTime: formData.playTime,
              platform: formData.platform,
              gameImage: formData.gameImage,
              published: formData.published
            }
          : review
      );
      saveReviews(updatedReviews);
    } else {
      // Yeni inceleme ekle
      const newReview: GameReview = {
        id: Date.now().toString(),
        gameTitle: formData.gameTitle,
        gameSlug: gameSlug,
        rating: formData.rating,
        title: formData.title,
        content: formData.content,
        summary: formData.summary,
        pros: formData.pros.split('\n').filter(p => p.trim()),
        cons: formData.cons.split('\n').filter(c => c.trim()),
        author: user.username,
        createdAt: new Date().toISOString(),
        playTime: formData.playTime,
        platform: formData.platform,
        gameImage: formData.gameImage,
        published: formData.published
      };
      saveReviews([newReview, ...reviews]);
    }

    // Formu temizle
    setFormData({
      gameTitle: '',
      rating: 8,
      title: '',
      content: '',
      summary: '',
      pros: '',
      cons: '',
      playTime: '',
      platform: '',
      gameImage: '',
      published: true
    });
    setShowEditor(false);
    setEditingReview(null);
  };

  const handleEdit = (review: GameReview) => {
    setEditingReview(review);
    setFormData({
      gameTitle: review.gameTitle,
      rating: review.rating,
      title: review.title,
      content: review.content,
      summary: review.summary,
      pros: review.pros.join('\n'),
      cons: review.cons.join('\n'),
      playTime: review.playTime || '',
      platform: review.platform || '',
      gameImage: review.gameImage || '',
      published: review.published
    });
    setShowEditor(true);
  };

  const handleDelete = (reviewId: string) => {
    if (confirm('Bu incelemeyi silmek istediğinizden emin misiniz?')) {
      const updatedReviews = reviews.filter(review => review.id !== reviewId);
      saveReviews(updatedReviews);
    }
  };

  const togglePublished = (reviewId: string) => {
    const updatedReviews = reviews.map(review =>
      review.id === reviewId ? { ...review, published: !review.published } : review
    );
    saveReviews(updatedReviews);
  };

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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Giriş Gerekli</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Oyun incelemesi yönetimi için giriş yapmanız gerekiyor
          </p>
          <Link
            href="/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Giriş Yap
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Oyun İnceleme Yönetimi
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Detaylı oyun incelemelerinizi oluşturun ve yönetin
            </p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => setShowEditor(!showEditor)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {showEditor ? 'Editörü Kapat' : 'Yeni İnceleme'}
            </button>
            <button
              onClick={logout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Çıkış Yap
            </button>
          </div>
        </div>

        {/* Editor */}
        {showEditor && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              {editingReview ? 'İncelemeyi Düzenle' : 'Yeni Oyun İncelemesi'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Oyun Adı
                  </label>
                  <input
                    type="text"
                    value={formData.gameTitle}
                    onChange={(e) => setFormData({...formData, gameTitle: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="The Witcher 3: Wild Hunt"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Puan (0-10)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={formData.rating}
                    onChange={(e) => setFormData({...formData, rating: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  İnceleme Başlığı
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Bir RPG Başyapıtı - The Witcher 3 Detaylı İnceleme"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Özet
                </label>
                <textarea
                  value={formData.summary}
                  onChange={(e) => setFormData({...formData, summary: e.target.value})}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Kısa özet..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Detaylı İnceleme
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  rows={12}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Detaylı incelemenizi yazın..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Artıları (her satıra bir tane)
                  </label>
                  <textarea
                    value={formData.pros}
                    onChange={(e) => setFormData({...formData, pros: e.target.value})}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Mükemmel hikaye&#10;Kaliteli yan görevler&#10;Etkileyici grafik"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Eksileri (her satıra bir tane)
                  </label>
                  <textarea
                    value={formData.cons}
                    onChange={(e) => setFormData({...formData, cons: e.target.value})}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Karmaşık kontroller&#10;Teknik hatalar&#10;Uzun yükleme süreleri"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Oyun Süresi
                  </label>
                  <input
                    type="text"
                    value={formData.playTime}
                    onChange={(e) => setFormData({...formData, playTime: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="120 saat"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Platform
                  </label>
                  <input
                    type="text"
                    value={formData.platform}
                    onChange={(e) => setFormData({...formData, platform: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="PC, PlayStation, Xbox"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Oyun Görseli (URL)
                  </label>
                  <input
                    type="url"
                    value={formData.gameImage}
                    onChange={(e) => setFormData({...formData, gameImage: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published}
                  onChange={(e) => setFormData({...formData, published: e.target.checked})}
                  className="mr-2"
                />
                <label htmlFor="published" className="text-sm text-gray-700 dark:text-gray-300">
                  Yayınla
                </label>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  {editingReview ? 'Güncelle' : 'İncelemeyi Kaydet'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditor(false);
                    setEditingReview(null);
                    setFormData({
                      gameTitle: '', rating: 8, title: '', content: '', summary: '',
                      pros: '', cons: '', playTime: '', platform: '', gameImage: '', published: true
                    });
                  }}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Reviews List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Oyun İncelemeleri ({reviews.length})
            </h2>
          </div>
          
          {reviews.length === 0 ? (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              Henüz oyun incelemesi yok. İlk incelemenizi oluşturun!
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {reviews.map((review) => (
                <div key={review.id} className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-3">
                        {review.gameImage && (
                          <img 
                            src={review.gameImage} 
                            alt={review.gameTitle}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        )}
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {review.gameTitle}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center">
                              {renderStars(review.rating)}
                            </div>
                            <span className="text-lg font-semibold text-yellow-600">
                              {review.rating}/10
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {review.title}
                      </h4>
                      
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        {review.summary}
                      </p>

                      {(review.playTime || review.platform) && (
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                          {review.playTime && <span>⏱️ {review.playTime}</span>}
                          {review.platform && <span>🎮 {review.platform}</span>}
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>{new Date(review.createdAt).toLocaleDateString('tr-TR')}</span>
                        <span className={`px-2 py-1 rounded ${review.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {review.published ? 'Yayında' : 'Taslak'}
                        </span>
                        <span>👤 {review.author}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => togglePublished(review.id)}
                        className={`px-3 py-1 rounded text-sm ${review.published ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
                      >
                        {review.published ? 'Gizle' : 'Yayınla'}
                      </button>
                      <button
                        onClick={() => handleEdit(review)}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => handleDelete(review.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}