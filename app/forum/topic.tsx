import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
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
  stars: number
}

interface ForumReply {
  id: string
  content: string
  author_id: string
  created_at: string
  author_name: string
}

export default function ForumTopicPage() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useSearchParams()
  const postId = params.get('id')
  const [post, setPost] = useState<ForumPost | null>(null)
  const [replies, setReplies] = useState<ForumReply[]>([])
  const [replyContent, setReplyContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [starred, setStarred] = useState(false)

  useEffect(() => {
    if (postId) loadTopic()
    // eslint-disable-next-line
  }, [postId])

  const loadTopic = async () => {
    setLoading(true)
    // Postu ve yıldız sayısını çek
    const { data: postData, error: postError } = await supabase
      .from('forum_posts')
      .select('*')
      .eq('id', postId)
      .single()
    if (postError) return setLoading(false)
    // Yıldız sayısı
    const { count: starCount } = await supabase
      .from('forum_stars')
      .select('id', { count: 'exact' })
      .eq('post_id', postId)
    // Cevaplar
    const { data: replyData } = await supabase
      .from('forum_replies')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true })
    setPost({ ...postData, stars: starCount || 0, author_name: 'Anonim' })
    setReplies((replyData || []).map(r => ({ ...r, author_name: 'Anonim' })))
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
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs bg-purple-600 px-2 py-1 rounded">{post.category}</span>
            <span className="text-gray-400 text-sm">{post.author_name}</span>
            <span className="text-gray-400 text-sm">•</span>
            <span className="text-gray-400 text-sm">{new Date(post.created_at).toLocaleDateString('tr-TR')}</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
          <p className="text-gray-300 mb-3">{post.content}</p>
          <div className="flex items-center gap-4 mt-4">
            <button
              onClick={handleStar}
              disabled={starred}
              className={`flex items-center gap-1 px-3 py-1 rounded bg-yellow-500/20 text-yellow-400 font-semibold ${starred ? 'opacity-60' : 'hover:bg-yellow-500/40'}`}
            >
              ⭐ {post.stars}
            </button>
            <span className="text-gray-400 text-sm">{replies.length} yanıt</span>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-bold mb-4">Yanıtlar</h3>
          {replies.length === 0 ? (
            <div className="text-gray-400">Henüz yanıt yok. İlk cevabı sen yaz!</div>
          ) : (
            <div className="space-y-4">
              {replies.map(reply => (
                <div key={reply.id} className="bg-gray-700 rounded p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-gray-400 text-xs">{reply.author_name}</span>
                    <span className="text-gray-400 text-xs">•</span>
                    <span className="text-gray-400 text-xs">{new Date(reply.created_at).toLocaleDateString('tr-TR')}</span>
                  </div>
                  <div className="text-gray-200">{reply.content}</div>
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
