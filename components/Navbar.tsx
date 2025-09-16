'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { signOut } from '@/lib/database'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const pathname = usePathname()
  const { user, loading } = useAuth()

  useEffect(() => {
    const theme = localStorage.getItem('theme')
    if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    if (!isDarkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Çıkış yapılırken hata:', error)
    }
  }

  const navItems = [
    { href: '/', label: '🏠 Ana Sayfa', emoji: '🏠' },
    { href: '/blog', label: '📝 Blog', emoji: '📝' },
    { href: '/oyunlar', label: '🎯 Oyunlar', emoji: '🎯' },
    { href: '/forum', label: '💬 Forum', emoji: '💬' },
    { href: '/reklam-paketleri', label: '📢 Reklam', emoji: '📢' }
  ]

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="text-2xl group-hover:animate-bounce">🎮</div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Aykutkaya
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center space-x-1 ${
                  pathname === item.href
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                <span className="text-lg">{item.emoji}</span>
                <span>{item.label.split(' ').slice(1).join(' ')}</span>
              </Link>
            ))}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Tema değiştir"
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>

            {/* Auth Section */}
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            ) : user ? (
              <div className="flex items-center space-x-2">
                {/* Dashboard Link - Only show for authenticated users */}
                <Link
                  href="/dashboard"
                  className="hidden sm:flex items-center space-x-1 px-3 py-2 rounded-lg bg-gradient-to-r from-green-500 to-blue-500 text-white text-sm font-medium hover:from-green-600 hover:to-blue-600 transition-all duration-200"
                >
                  <span>📊</span>
                  <span>Dashboard</span>
                </Link>
                
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors"
                >
                  <span>🚪</span>
                  <span>Çıkış</span>
                </button>
              </div>
            ) : (
              <Link
                href="/auth"
                className="flex items-center space-x-1 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
              >
                <span>🔐</span>
                <span>Giriş</span>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Menüyü aç/kapat"
            >
              {isMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-gray-200 dark:border-gray-700">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname === item.href
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="text-lg">{item.emoji}</span>
                <span>{item.label.split(' ').slice(1).join(' ')}</span>
              </Link>
            ))}
            
            {user && (
              <Link
                href="/dashboard"
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gradient-to-r from-green-500 to-blue-500 text-white text-sm font-medium transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <span>📊</span>
                <span>Dashboard</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}