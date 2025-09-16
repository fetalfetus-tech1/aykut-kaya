'use client'

import { useAuth } from '@/hooks/useAuth'

export default function AdminPanel() {
  const { user, isAdmin, loading: authLoading } = useAuth()

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">🚫 Erişim Reddedildi</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Bu sayfaya erişim yetkiniz yok.
          </p>
          <a
            href="/dashboard"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Dashboard&apos;a Dön
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">🎮 Admin Panel</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Admin paneli teknik güncelleme nedeniyle geçici olarak basitleştirildi.
        </p>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg max-w-md">
          <h2 className="text-xl font-semibold mb-4">Admin Bilgileri</h2>
          <div className="text-left space-y-2">
            <p><strong>ID:</strong> {user?.id}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Role:</strong> {user?.profile?.role}</p>
            <p><strong>Username:</strong> {user?.profile?.username}</p>
          </div>
        </div>
        <div className="mt-6">
          <a
            href="/dashboard"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg mr-4"
          >
            Dashboard&apos;a Dön
          </a>
          <span className="text-sm text-gray-500 dark:text-gray-500">
            Admin paneli yakında tam olarak geri dönecek
          </span>
        </div>
      </div>
    </div>
  )
}