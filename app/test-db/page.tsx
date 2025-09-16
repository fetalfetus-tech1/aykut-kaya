'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestDB() {
  const [connectionStatus, setConnectionStatus] = useState<string>('Testing...')
  const [profiles, setProfiles] = useState<any[]>([])

  useEffect(() => {
    testConnection()
  }, [])

  async function testConnection() {
    try {
      // Test 1: Basit bağlantı testi
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .limit(1)

      if (error) {
        setConnectionStatus(`❌ Bağlantı hatası: ${error.message}`)
        return
      }

      setConnectionStatus('✅ Supabase bağlantısı başarılı!')
      
      // Test 2: Tüm tabloları test et
      const tables = ['profiles', 'blog_posts', 'forum_posts', 'game_reviews', 'comments']
      const tableTests = await Promise.all(
        tables.map(async (table) => {
          try {
            const { data, error } = await supabase
              .from(table)
              .select('*')
              .limit(1)
            
            return { table, success: !error, error: error?.message }
          } catch (err) {
            return { table, success: false, error: 'Unexpected error' }
          }
        })
      )

      setProfiles(tableTests)

    } catch (err) {
      setConnectionStatus(`❌ Beklenmedik hata: ${err}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔍 Supabase Database Test</h1>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
          <p className="text-lg">{connectionStatus}</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Table Tests</h2>
          <div className="space-y-2">
            {profiles.map((test, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-700 rounded">
                <span className={test.success ? 'text-green-400' : 'text-red-400'}>
                  {test.success ? '✅' : '❌'}
                </span>
                <span className="font-medium">{test.table}</span>
                {!test.success && (
                  <span className="text-red-300 text-sm">({test.error})</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <button 
            onClick={testConnection}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            🔄 Test Tekrarla
          </button>
        </div>
      </div>
    </div>
  )
}