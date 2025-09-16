"use client"

import React, { useState, useRef, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function ProfileEditPage() {
  const { user } = useAuth()
  const [fullName, setFullName] = useState(user?.profile?.full_name || "")
  const [bio, setBio] = useState(user?.profile?.bio || "")
  const [avatarUrl, setAvatarUrl] = useState(user?.profile?.avatar_url || "")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [gallery, setGallery] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setLoading(true)
    setError("")
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName.trim(),
          bio: bio.trim(),
          avatar_url: avatarUrl.trim()
        })
        .eq("id", user.id)
      if (error) throw error
      router.push("/dashboard")
    } catch (err: any) {
      setError("Profil güncellenemedi. Lütfen tekrar deneyin.")
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Profili Düzenle</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Ad Soyad</label>
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Adınız Soyadınız"
              maxLength={50}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Biyografi</label>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Kendinizden kısaca bahsedin"
              maxLength={200}
              rows={3}
            />
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
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors"
          >
            {loading ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </form>
      </div>
    </div>
  )
}
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Biyografi</label>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Kendinizden kısaca bahsedin"
              maxLength={200}
              rows={3}
            />
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
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors"
          >
            {loading ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </form>
      </div>
    </div>
  )
