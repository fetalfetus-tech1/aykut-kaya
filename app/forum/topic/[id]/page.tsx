"use client";
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'

interface ForumPost {
  id: string
  title: string
  content: string
  category: string
  author_id: string
  created_at: string
  author_name: string
  author_avatar: string
  stars: number
}

interface ForumReply {
  id: string
  content: string
  author_id: string
  created_at: string
  author_name: string
  author_avatar: string
}

export default function ForumTopicPage({ params }: { params: { id: string } }) {
  const { user, isAdmin } = useAuth()
  const postId = params.id
  const [post, setPost] = useState<ForumPost | null>(null)
  const [replies, setReplies] = useState<ForumReply[]>([])
  const [replyContent, setReplyContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [starred, setStarred] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editData, setEditData] = useState<{ title: string; content: string; category: string }>({ title: '', content: '', category: '' })

  // Admin: Sil
  const handleDelete = async () => {
    if (!user || !isAdmin || !post) return
    if (!confirm('Bu konuyu silmek istediğinize emin misiniz?')) return
    const { error } = await supabase.from('forum_posts').delete().eq('id', post.id)
    if (!error) window.location.href = '/forum'
    else alert('Konu silinemedi!')
  }

  // Admin: Düzenle
  const openEditModal = () => {
    if (!post) return
    setEditData({ title: post.title, content: post.content, category: post.category })
    setShowEditModal(true)
  }
  const handleEditSave = async () => {
    if (!user || !isAdmin || !post) return
    const { error } = await supabase.from('forum_posts').update({
      title: editData.title,
      content: editData.content,
      category: editData.category
    }).eq('id', post.id)
    if (!error) {
      setShowEditModal(false)
      loadTopic()
    } else alert('Konu güncellenemedi!')
  }

  // ...rest of the code remains unchanged...

  useEffect(() => {
    if (postId) loadTopic()
    // eslint-disable-next-line
  }, [postId])

  const loadTopic = async () => {
    setLoading(true)
    // Postu, yazar adını ve yıldız sayısını çek
    const { data: postData, error: postError } = await supabase
      .from('forum_posts')
      .select('*, profiles:author_id(username,avatar_url)')
      .eq('id', postId)
      .single()
    if (postError) return setLoading(false)
    // Yıldız sayısı
    const { count: starCount } = await supabase
      .from('forum_stars')
      .select('id', { count: 'exact' })
      .eq('post_id', postId)
    // Cevaplar (profil join ile)
    const { data: replyData } = await supabase
      .from('forum_replies')
      .select('*, profiles:author_id(username,avatar_url)')
      .eq('post_id', postId)
      .order('created_at', { ascending: true })
    setPost({
      ...postData,
      stars: starCount || 0,
      author_name: postData?.profiles?.username || 'Anonim',
      author_avatar: postData?.profiles?.avatar_url || '/avatars/default.png',
    })
    setReplies((replyData || []).map(r => ({
      ...r,
      author_name: r.profiles?.username || 'Anonim',
      author_avatar: r.profiles?.avatar_url || '/avatars/default.png',
    })))
    setLoading(false)
  }

  const handleReply = async () => {
    if (!user) return alert('Cevap yazmak için giriş yapmalısınız!')
    if (!replyContent.trim()) return
    await supabase.from('forum_replies').insert({
      post_id: postId,
      content: replyContent,
      author_id: user.id
    })
    setReplyContent('')
    loadTopic()
  }

  const handleStar = async () => {
    if (!user) return alert('Yıldız vermek için giriş yapmalısınız!')
    await supabase.from('forum_stars').insert({
      post_id: postId,
      user_id: user.id
    })
    setStarred(true)
    loadTopic()
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>
  if (!post) return <div className="min-h-screen flex items-center justify-center">Konu bulunamadı.</div>

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-gray-800 rounded-xl p-6 mb-6 shadow-lg border border-gray-700/40">
          <div className="flex items-start gap-4 mb-2">
            <img
              src={post.author_avatar}
              alt={post.author_name}
              className="w-16 h-16 rounded-full object-cover border-2 border-blue-500 shadow-md bg-gray-900"
              style={{ minWidth: 64 }}
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs bg-purple-600 px-2 py-1 rounded">{post.category}</span>
                <span className="text-gray-200 font-semibold text-sm">{post.author_name}</span>
                <span className="text-gray-400 text-sm">•</span>
                <span className="text-gray-400 text-sm">{new Date(post.created_at).toLocaleDateString('tr-TR')}</span>
              </div>
              <h2 className="text-2xl font-bold mb-2 text-white line-clamp-1">{post.title}</h2>
              <p className="text-gray-300 mb-3 whitespace-pre-line">{post.content}</p>
              <div className="flex gap-4 text-xs text-gray-400 mt-2">
                <button
                  onClick={handleStar}
                  disabled={starred}
                  className={`flex items-center gap-1 px-3 py-1 rounded bg-yellow-500/20 text-yellow-400 font-semibold ${starred ? 'opacity-60' : 'hover:bg-yellow-500/40'}`}
                >
                  ⭐ {post.stars}
                </button>
                <span>{replies.length} yanıt</span>
                {isAdmin && (
                  <>
                    <button
                      onClick={openEditModal}
                      className="ml-2 px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
                    >Düzenle</button>
                    <button
                      onClick={handleDelete}
                      className="ml-2 px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-semibold"
                    >Sil</button>
                  </>
                )}
              </div>
            </div>
          </div>
          {/* Edit Modal */}
          {showEditModal && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-gray-900 rounded-xl p-8 w-full max-w-lg shadow-lg border border-gray-700">
                <h3 className="text-xl font-bold mb-4 text-white">Konu Düzenle</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Başlık</label>
                    <input
                      type="text"
                      value={editData.title}
                      onChange={e => setEditData(d => ({ ...d, title: e.target.value }))}
                      className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Kategori</label>
                    <select
                      value={editData.category}
                      onChange={e => setEditData(d => ({ ...d, category: e.target.value }))}
                      className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-600 text-white"
                    >
                      <option value="genel">Genel Tartışma</option>
                      <option value="oyun-onerileri">Oyun Önerileri</option>
                      <option value="teknik-destek">Teknik Destek</option>
                      <option value="esports">E-Sports</option>
                      <option value="diger">Diğer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">İçerik</label>
                    <textarea
                      value={editData.content}
                      onChange={e => setEditData(d => ({ ...d, content: e.target.value }))}
                      rows={6}
                      className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-600 text-white"
                    />
                  </div>
                  <div className="flex justify-end gap-4 mt-4">
                    <button
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg"
                    >İptal</button>
                    <button
                      type="button"
                      onClick={handleEditSave}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold"
                    >Kaydet</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="bg-gray-800 rounded-xl p-6 mb-6 shadow border border-gray-700/40">
          <h3 className="text-lg font-bold mb-4">Yanıtlar</h3>
          {replies.length === 0 ? (
            <div className="text-gray-400">Henüz yanıt yok. İlk cevabı sen yaz!</div>
          ) : (
            <div className="space-y-4">
              {replies.map(reply => (
                <div key={reply.id} className="bg-gray-700 rounded p-4 flex items-start gap-3">
                  <img
                    src={reply.author_avatar}
                    alt={reply.author_name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-blue-400 bg-gray-900"
                    style={{ minWidth: 40 }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-gray-200 font-semibold text-xs">{reply.author_name}</span>
                      <span className="text-gray-400 text-xs">•</span>
                      <span className="text-gray-400 text-xs">{new Date(reply.created_at).toLocaleDateString('tr-TR')}</span>
                    </div>
                    <div className="text-gray-200 whitespace-pre-line">{reply.content}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {user ? (
          <div className="bg-gray-800 rounded-lg p-6">
            <h4 className="font-bold mb-2">Cevap Yaz</h4>
            <textarea
              value={replyContent}
              onChange={e => setReplyContent(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg mb-2"
              placeholder="Cevabınızı yazın..."
            />
            <button
              onClick={handleReply}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium"
            >
              Gönder
            </button>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <Link href="/auth" className="text-blue-400 underline">Giriş yaparak cevap yazabilirsin</Link>
          </div>
        )}
      </div>
    </div>
  )
}
