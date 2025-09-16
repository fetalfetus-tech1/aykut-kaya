'use client';

import { useState, useMemo } from 'react';
import { Game } from '@/types/game';

interface SearchBarProps {
  games: Game[];
  onFilteredGames: (filteredGames: Game[]) => void;
}

export default function SearchBar({ games, onFilteredGames }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Get unique categories from all games
  const categories = useMemo(() => {
    const allCategories = games.map(game => game.genre);
    return [...new Set(allCategories)].sort();
  }, [games]);

  // Filter games based on search term and category
  const filteredGames = useMemo(() => {
    return games.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          game.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === '' || game.genre === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [games, searchTerm, selectedCategory]);

  // Update parent component with filtered games
  useMemo(() => {
    onFilteredGames(filteredGames);
  }, [filteredGames, onFilteredGames]);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Oyun Ara
          </label>
          <input
            id="search"
            type="text"
            placeholder="Başlık veya açıklamaya göre ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        {/* Category Filter */}
        <div className="md:w-64">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Kategori
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">Tüm Kategoriler</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results count */}
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        {games.length} oyundan {filteredGames.length} tanesi gösteriliyor
      </div>
    </div>
  );
}