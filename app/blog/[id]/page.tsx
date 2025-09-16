'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  summary: string;
  tags: string[];
  createdAt: string;
  published: boolean;
  author: string;
}

export default function BlogPostPage() {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;

  useEffect(() => {
    if (!postId) return;

    // localStorage'dan blog yazılarını yükle
    const savedPosts = localStorage.getItem('aykutkaya_blog_posts');
    if (savedPosts) {
      const allPosts: BlogPost[] = JSON.parse(savedPosts);
      const currentPost = allPosts.find(p => p.id === postId && p.published);
      
      if (currentPost) {
        setPost(currentPost);
        
        // İlgili yazıları bul (aynı etiketlere sahip)
        const related = allPosts
          .filter(p => 
            p.id !== postId && 
            p.published && 
            p.tags.some(tag => currentPost.tags.includes(tag))
          )
          .slice(0, 3);
        setRelatedPosts(related);
      }
    }
    setLoading(false);
  }, [postId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatContent = (content: string) => {
    // Basit markdown benzeri formatlamada yeni satırları <br> olarak dönüştür
    return content.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < content.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">Blog yazısı bulunamadı</p>
          <Link
            href="/blog"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Blog&apos;a Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <li>
              <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">
                Ana Sayfa
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/blog" className="hover:text-blue-600 dark:hover:text-blue-400">
                Blog
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900 dark:text-white truncate">{post.title}</li>
          </ol>
        </nav>

        {/* Üst Banner Reklam */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-lg shadow-lg p-4 text-center text-white">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">🔗</span>
                <div className="text-left">
                  <h3 className="font-bold text-lg">DosyaKutusu.com</h3>
                  <p className="text-sm opacity-90">Türkiye&apos;nin En Güvenli Dosya Paylaşım Platformu</p>
                </div>
              </div>
              <a
                href="https://dosyakutusu.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-green-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-md flex items-center space-x-2"
              >
                <span>📤</span>
                <span>Dosya Yükle</span>
              </a>
            </div>
          </div>
        </div>

        {/* Article */}
        <article className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="p-8 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
              <span>{formatDate(post.createdAt)}</span>
              <span>•</span>
              <span>Yazar: {post.author}</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {post.title}
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
              {post.summary}
            </p>
            
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="prose max-w-none text-gray-900 dark:text-gray-100 leading-relaxed text-lg">
              {formatContent(post.content)}
            </div>
            
            {/* İçerik Arası Reklam */}
            <div className="my-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 rounded-r-lg">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <span className="text-2xl">💾</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    Dosyalarınız için güvenli alan mı arıyorsunuz?
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                    <strong>DosyaKutusu.com</strong> ile dosyalarınızı güvenle saklayın ve paylaşın!
                  </p>
                  <a
                    href="https://dosyakutusu.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium text-sm"
                  >
                    Ücretsiz hesap aç →
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-8 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {post.author.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{post.author}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Blog Yazarı</p>
                  </div>
                </div>
              </div>
              
              <Link
                href="/blog"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Tüm Yazılar
              </Link>
            </div>
          </div>
        </article>

        {/* DosyaKutusu.com Reklam Alanı */}
        <div className="mt-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-4">
                  <span className="text-2xl">📁</span>
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-bold text-white">DosyaKutusu.com</h3>
                  <p className="text-blue-100 text-sm">Güvenli Dosya Paylaşım Platformu</p>
                </div>
              </div>
              
              <p className="text-white text-lg mb-4 leading-relaxed">
                Dosyalarınızı güvenle paylaşın! Hızlı yükleme, güvenli indirme ve kolay paylaşım imkanı.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-4">
                <div className="flex items-center space-x-2 text-blue-100">
                  <span className="text-sm">✓ Ücretsiz 10GB Alan</span>
                </div>
                <div className="flex items-center space-x-2 text-blue-100">
                  <span className="text-sm">✓ Hızlı Yükleme</span>
                </div>
                <div className="flex items-center space-x-2 text-blue-100">
                  <span className="text-sm">✓ Güvenli Paylaşım</span>
                </div>
              </div>
              
              <a
                href="https://dosyakutusu.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg"
              >
                <span className="mr-2">🚀</span>
                Hemen Başla
              </a>
              
              <p className="text-blue-100 text-xs mt-3 opacity-75">
                * Bu bir demo reklamdır
              </p>
            </div>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              İlgili Yazılar
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/blog/${relatedPost.id}`}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {relatedPost.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-3">
                    {relatedPost.summary}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {relatedPost.tags.slice(0, 2).map((tag, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}