"use client"

import { useState } from "react"
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
  const router = useRouter()

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
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Avatar URL</label>
            <input
              type="url"
              value={avatarUrl}
              onChange={e => setAvatarUrl(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
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
