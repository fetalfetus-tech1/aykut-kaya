'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'

interface Game {
  id: string
  title: string
  genre: string
  platform: string
  rating: number
  image: string
  description: string
  release_date: string
  developer: string
  price: number
  slug: string
  views: number
}

export default function GamesPage() {
  const { isAdmin } = useAuth()
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('')
  const [sortBy, setSortBy] = useState('popular')

  useEffect(() => {
    loadGames()
  }, [])

  const loadGames = async () => {
    try {
      // Şimdilik mock veriler, daha sonra Supabase'den gelecek
      const mockGames: Game[] = [
        {
          id: '1',
          title: 'Cyberpunk 2077',
          genre: 'RPG',
          platform: 'PC/PS5/Xbox',
          rating: 8.5,
          image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop',
          description: 'Geleceğin şehrinde geçen sürükleyici cyberpunk macerasında Night City\'yi keşfedin.',
          release_date: '2020-12-10',
          developer: 'CD Projekt RED',
          price: 299.99,
          slug: 'cyberpunk-2077',
          views: 15420
        },
        {
          id: '2',
          title: 'The Witcher 3: Wild Hunt',
          genre: 'RPG',
          platform: 'Multi-platform',
          rating: 9.8,
          image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop',
          description: 'Büyücü Geralt\'ın destansı maceralarını konu alan açık dünya RPG şaheserinde efsanevi bir yolculuğa çıkın.',
          release_date: '2015-05-19',
          developer: 'CD Projekt RED',
          price: 149.99,
          slug: 'the-witcher-3',
          views: 12380
        },
        {
          id: '3',
          title: 'God of War',
          genre: 'Action',
          platform: 'PS4/PS5/PC',
          rating: 9.2,
          image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
          description: 'Kratos ve oğlu Atreus\'un İskandinav mitolojisindeki duygusal ve aksiyonla dolu yolculuğu.',
          release_date: '2018-04-20',
          developer: 'Santa Monica Studio',
          price: 199.99,
          slug: 'god-of-war',
          views: 11250
        },
        {
          id: '4',
          title: 'Red Dead Redemption 2',
          genre: 'Adventure',
          platform: 'Multi-platform',
          rating: 9.0,
          image: 'https://images.unsplash.com/photo-1560743173-567a3b5658b1?w=400&h=300&fit=crop',
          description: 'Vahşi Batı\'nın son günlerinde geçen bu açık dünya macerasında outlawların hikayesini yaşayın.',
          release_date: '2018-10-26',
          developer: 'Rockstar Games',
          price: 259.99,
          slug: 'red-dead-redemption-2',
          views: 10890
        },
        {
          id: '5',
          title: 'Elden Ring',
          genre: 'Souls-like',
          platform: 'Multi-platform',
          rating: 9.5,
          image: 'https://images.unsplash.com/photo-1556438064-2d7646166914?w=400&h=300&fit=crop',
          description: 'FromSoftware\'in açık dünya Souls-like başyapıtında Lands Between\'da destansı bir maceraya atılın.',
          release_date: '2022-02-25',
          developer: 'FromSoftware',
          price: 329.99,
          slug: 'elden-ring',
          views: 9670
        },
        {
          id: '6',
          title: 'Horizon Zero Dawn',
          genre: 'Action RPG',
          platform: 'PS4/PS5/PC',
          rating: 8.8,
          image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=300&fit=crop',
          description: 'Robot hayvanlarla dolu post-apokaliptik dünyada Aloy\'un büyüleyici macerası.',
          release_date: '2017-02-28',
          developer: 'Guerrilla Games',
          price: 179.99,
          slug: 'horizon-zero-dawn',
          views: 8420
        }
      ]
      setGames(mockGames)
    } catch (error) {
      console.error('Oyunlar yüklenirken hata:', error)
    }
    setLoading(false)
  }

  const filteredAndSortedGames = games
    .filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesGenre = selectedGenre === '' || game.genre === selectedGenre
      return matchesSearch && matchesGenre
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating
        case 'newest':
          return new Date(b.release_date).getTime() - new Date(a.release_date).getTime()
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'popular':
        default:
          return b.views - a.views
      }
    })

  const genres = [...new Set(games.map(game => game.genre))]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <p className="mt-2">Oyunlar yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">🎮 Oyunlar</h1>
          {isAdmin && (
            <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-colors">
              + Oyun Ekle
            </button>
          )}
        </div>
        
        {/* Filtreler ve Arama */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Oyun Ara</label>
              <input
                type="text"
                placeholder="Oyun adı..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Tür</label>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              >
                <option value="">Tüm Türler</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Sıralama</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              >
                <option value="popular">En Popüler</option>
                <option value="rating">En Yüksek Puan</option>
                <option value="newest">En Yeni</option>
                <option value="price-low">Fiyat (Düşük-Yüksek)</option>
                <option value="price-high">Fiyat (Yüksek-Düşük)</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedGenre('')
                  setSortBy('popular')
                }}
                className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
              >
                Filtreleri Temizle
              </button>
            </div>
          </div>
        </div>

        {/* Oyun Listesi */}
        {filteredAndSortedGames.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎮</div>
            <h2 className="text-2xl font-bold mb-4">Oyun bulunamadı</h2>
            <p className="text-gray-400">
              Arama kriterlerinizi değiştirerek tekrar deneyin.
            </p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-400">
                {filteredAndSortedGames.length} oyun bulundu
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSortedGames.map((game) => (
                <div key={game.id} className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-all duration-300 transform hover:scale-[1.02] group">
                  <div className="relative">
                    <Image
                      src={game.image}
                      alt={game.title}
                      width={400}
                      height={300}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1">
                      <div className="flex items-center gap-1 text-yellow-400">
                        <span>⭐</span>
                        <span className="font-bold text-sm">{game.rating}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2 line-clamp-2">{game.title}</h3>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-blue-600 px-2 py-1 rounded text-xs font-medium">
                        {game.genre}
                      </span>
                      <span className="text-gray-400 text-xs">{game.platform}</span>
                    </div>

                    <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                      {game.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="text-green-400 font-bold text-lg">
                        ₺{game.price.toFixed(2)}
                      </div>
                      
                      <div className="text-gray-400 text-xs">
                        👁️ {game.views.toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="mt-4 text-xs text-gray-500">
                      <div>🏢 {game.developer}</div>
                      <div>📅 {new Date(game.release_date).toLocaleDateString('tr-TR')}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}