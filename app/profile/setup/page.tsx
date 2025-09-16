'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'

  const { user } = useAuth()
  const [username, setUsername] = useState('')
  const [fullName, setFullName] = useState('')
  const [bio, setBio] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [gallery, setGallery] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  // Galeri avatarlarını yükle
  useEffect(() => {
    fetch('/avatars/gallery.json')
      .then(res => res.json())
      .then(setGallery)
  }, [])

  // Dosya yükleme
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return
    setUploading(true)
    setError("")
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `avatar_${user.id}_${Date.now()}.${fileExt}`
      const { data, error } = await supabase.storage.from('avatars').upload(fileName, file, { upsert: true })
      if (error) throw error
      const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(fileName)
      setAvatarUrl(publicUrlData.publicUrl)
    } catch (err: any) {
      setError('Avatar yüklenemedi. Lütfen tekrar deneyin.')
    } finally {
      setUploading(false)
    }
  }

  // Galeriden seçim
  const handleGallerySelect = (filename: string) => {
    setAvatarUrl(`/avatars/${filename}`)
  }

  useEffect(() => {
    if (!user) {
      router.push('/auth')
      return
    }

    // Eğer zaten profil varsa dashboard'a yönlendir
    if (user.profile) {
      router.push('/dashboard')
      return
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setError('')

    try {
      const { error } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          username: username.trim(),
          full_name: fullName.trim() || null,
          bio: bio.trim() || null,
          avatar_url: avatarUrl.trim() || null,
          role: 'user'
        })

      if (error) throw error

      // Profil oluşturulduktan sonra dashboard'a yönlendir
      router.push('/dashboard')
    } catch (err: any) {
      console.error('Profil oluşturma hatası:', err)
      if (err.code === '23505') { // Unique violation
        setError('Bu kullanıcı adı zaten kullanılıyor. Başka bir kullanıcı adı seçin.')
      } else {
        setError('Profil oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (!user || user.profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            🎮 Profilinizi Tamamlayın
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Oyun topluluğunda sizi tanıtalım!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Kullanıcı Adı *
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="oyuncu123"
              required
              minLength={3}
              maxLength={30}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              3-30 karakter arası, benzersiz olmalı
            </p>
          </div>

          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tam Adınız
            </label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Ahmet Yılmaz"
            />
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Hakkınızda
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Merhaba! Oyunları ve teknolojiyi seviyorum..."
              maxLength={500}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {bio.length}/500 karakter
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Avatar</label>
            <div className="flex items-center gap-4 mb-2">
              <img src={avatarUrl || '/avatars/default.png'} alt="Avatar" className="w-16 h-16 rounded-full object-cover border-2 border-blue-500 bg-gray-900" />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                disabled={uploading}
              >
                {uploading ? 'Yükleniyor...' : 'Cihazdan Yükle'}
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            <div className="mb-2">
              <span className="block text-xs text-gray-500 mb-1">Veya galeriden seç:</span>
              <div className="flex gap-2 flex-wrap">
                {gallery.map(filename => (
                  <button
                    type="button"
                    key={filename}
                    onClick={() => handleGallerySelect(filename)}
                    className={`border-2 rounded-full p-0.5 ${avatarUrl === `/avatars/${filename}` ? 'border-blue-600' : 'border-transparent'}`}
                  >
                    <img src={`/avatars/${filename}`} alt={filename} className="w-10 h-10 rounded-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
            <input
              type="url"
              value={avatarUrl}
              onChange={e => setAvatarUrl(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white mt-2"
              placeholder="https://..."
            />
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !username.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Profil Oluşturuluyor...
              </>
            ) : (
              '🎯 Profili Tamamla'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => supabase.auth.signOut()}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm"
          >
            Çıkış Yap
          </button>
        </div>
      </div>
    </div>
  )
}