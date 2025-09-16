'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface ForumPost {
  id: string;
  title: string;
  author: string;
  content: string;
  replies: number;
  lastReply: string;
  category: string;
  isSticky?: boolean;
  views: number;
  createdAt: string;
}

const initialForumPosts: ForumPost[] = [
  {
    id: "1",
    title: "The Witcher 3 DLC'leri hakkında düşünceleriniz?",
    author: "GameMaster",
    content: "Blood and Wine ve Hearts of Stone DLC'lerini oynadınız mı? Hangisini daha çok beğendiniz?",
    replies: 23,
    lastReply: "2 saat önce",
    category: "RPG Oyunları",
    isSticky: true,
    views: 456,
    createdAt: "2025-09-15T10:00:00Z"
  },
  {
    id: "2",
    title: "Cyberpunk 2077 güncellemelerden sonra nasıl?",
    author: "TechGamer",
    content: "Son güncellemelerle birlikte oyun çok daha stabil hale geldi. Artık rahatça oynayabiliyorum.",
    replies: 18,
    lastReply: "4 saat önce",
    category: "Aksiyon Oyunları",
    views: 234,
    createdAt: "2025-09-15T08:00:00Z"
  },
  {
    id: "3",
    title: "En iyi souls-like oyunlar listesi",
    author: "SoulsVeteran",
    content: "Dark Souls serisinden sonra en çok beğendiğiniz souls-like oyunlar hangileri?",
    replies: 31,
    lastReply: "1 gün önce",
    category: "Souls-like",
    views: 678,
    createdAt: "2025-09-14T15:00:00Z"
  }
];

const categories = [
  "Genel Tartışma",
  "RPG Oyunları", 
  "Aksiyon Oyunları",
  "Souls-like",
  "Indie Oyunlar",
  "Teknoloji",
  "Oyun İncelemeleri"
];

export default function ForumPage() {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<ForumPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'Genel Tartışma'
  });

  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    // localStorage'dan forum postlarını yükle
    const savedPosts = localStorage.getItem('aykutkaya_forum_posts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      // İlk kez yükleniyorsa başlangıç verilerini kullan
      setPosts(initialForumPosts);
      localStorage.setItem('aykutkaya_forum_posts', JSON.stringify(initialForumPosts));
    }
  }, []);

  useEffect(() => {
    let filtered = posts;

    // Arama filtresi
    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Kategori filtresi
    if (selectedCategory) {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    // Sabitlenmiş postları üstte göster
    filtered.sort((a, b) => {
      if (a.isSticky && !b.isSticky) return -1;
      if (!a.isSticky && b.isSticky) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    setFilteredPosts(filtered);
  }, [posts, searchTerm, selectedCategory]);

  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !user) {
      alert('Gönderi oluşturmak için giriş yapmalısınız!');
      return;
    }

    const post: ForumPost = {
      id: Date.now().toString(),
      title: newPost.title,
      content: newPost.content,
      category: newPost.category,
      author: user.username,
      replies: 0,
      views: 0,
      lastReply: 'Şimdi',
      createdAt: new Date().toISOString()
    };

    const updatedPosts = [post, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem('aykutkaya_forum_posts', JSON.stringify(updatedPosts));

    // Formu temizle
    setNewPost({
      title: '',
      content: '',
      category: 'Genel Tartışma'
    });
    setShowNewPostForm(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Az önce';
    if (diffInHours < 24) return `${diffInHours} saat önce`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} gün önce`;
    
    return date.toLocaleDateString('tr-TR');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Forum Reklam Banner */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg overflow-hidden">
            <div className="relative">
              <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                REKLAM
              </div>
              <div className="p-6 text-center text-white">
                <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
                  <div className="flex items-center space-x-4">
                    <span className="text-4xl">💬</span>
                    <div className="text-left">
                      <h3 className="text-2xl font-bold">Discord Sunucumuza Katılın!</h3>
                      <p className="text-indigo-100">7/24 Aktif Gaming Topluluğu</p>
                    </div>
                  </div>
                  <div className="text-center lg:text-right">
                    <p className="text-lg font-semibold mb-2">5000+ Oyuncu Sizi Bekliyor</p>
                    <button className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-lg">
                      🎮 Discord&apos;a Katıl
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Aykutkaya Forum
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Oyun severlerin buluşma noktası - Deneyimlerinizi paylaşın, sorular sorun!
          </p>
        </div>

        {/* New Post Button */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Forum Tartışmaları
          </h2>
          {isAuthenticated ? (
            <button
              onClick={() => setShowNewPostForm(!showNewPostForm)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Yeni Konu Aç</span>
            </button>
          ) : (
            <div className="text-gray-600 dark:text-gray-400">
              Yeni konu açmak için <a href="/login" className="text-blue-600 hover:underline">giriş yapın</a>
            </div>
          )}
        </div>

        {/* New Post Form */}
        {showNewPostForm && isAuthenticated && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Yeni Forum Konusu Oluştur
            </h3>
            <form onSubmit={handleSubmitPost} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Konu Başlığı
                </label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Konu başlığınızı yazın..."
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Kategori
                </label>
                <select
                  value={newPost.category}
                  onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  İçerik
                </label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Düşüncelerinizi, sorularınızı veya deneyimlerinizi paylaşın..."
                  required
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Konuyu Paylaş
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowNewPostForm(false);
                    setNewPost({title: '', content: '', category: 'Genel Tartışma'});
                  }}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search and Filter */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Forum konularında ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Tüm Kategoriler</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            {(searchTerm || selectedCategory) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Temizle
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400">{posts.length}</h3>
            <p className="text-gray-600 dark:text-gray-400">Toplam Konu</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-2xl font-bold text-green-600 dark:text-green-400">
              {posts.reduce((sum, post) => sum + post.replies, 0)}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">Toplam Cevap</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {posts.reduce((sum, post) => sum + post.views, 0)}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">Toplam Görüntüleme</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-2xl font-bold text-orange-600 dark:text-orange-400">{categories.length}</h3>
            <p className="text-gray-600 dark:text-gray-400">Kategori</p>
          </div>
        </div>

        {/* Forum Posts */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Aktif Konular ({filteredPosts.length})
            </h2>
          </div>
          
          {filteredPosts.length === 0 ? (
            <div className="p-12 text-center text-gray-500 dark:text-gray-400">
              <h3 className="text-xl font-semibold mb-2">Konu bulunamadı</h3>
              <p>Arama kriterlerinize uygun forum konusu bulunamadı.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredPosts.map((post) => (
                <div key={post.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        {post.isSticky && (
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">
                            📌 Sabitlenmiş
                          </span>
                        )}
                        <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs font-medium">
                          {post.category}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                        {post.title}
                      </h3>
                      
                      <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {post.content}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>👤 {post.author}</span>
                        <span>💬 {post.replies} cevap</span>
                        <span>👁️ {post.views} görüntüleme</span>
                        <span>🕒 {formatDate(post.createdAt)}</span>
                      </div>
                    </div>
                    
                    <div className="ml-4 text-center">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Son cevap
                      </div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {post.lastReply}
                      </div>
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