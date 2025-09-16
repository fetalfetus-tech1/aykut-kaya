'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function ReklamPaketleriPage() {
  const [selectedPackage, setSelectedPackage] = useState('');

  const packages = [
    {
      id: 'basic',
      name: 'Başlangıç Paketi',
      price: '2.500',
      period: 'aylık',
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600',
      features: [
        'Ana sayfa üst banner (728x90px)',
        'Aylık 500.000 görüntülenme',
        'Desktop ve mobil uyumlu',
        'Temel analitik rapor',
        '7/24 teknik destek'
      ],
      description: 'Küçük işletmeler ve start-up&apos;lar için ideal',
      recommended: false
    },
    {
      id: 'standard',
      name: 'Standart Paket',
      price: '4.750',
      period: 'aylık',
      color: 'purple',
      gradient: 'from-purple-500 to-purple-600',
      features: [
        'Ana sayfa + 2 kategori sayfası banner',
        'Aylık 1.200.000 görüntülenme',
        'Sidebar reklamları dahil',
        'İçerik arası reklam alanları',
        'Detaylı analitik rapor',
        'Targeting seçenekleri',
        'Öncelikli teknik destek'
      ],
      description: 'Orta ölçekli şirketler için en popüler seçenek',
      recommended: true
    },
    {
      id: 'premium',
      name: 'Premium Paket',
      price: '8.900',
      period: 'aylık',
      color: 'gold',
      gradient: 'from-yellow-500 to-orange-600',
      features: [
        'Tüm sayfalarda reklam alanları',
        'Sınırsız görüntülenme',
        'Özel tasarım reklam formatları',
        'Video reklam desteği',
        'Sticky (yapışkan) reklam alanları',
        'A/B test imkanı',
        'Gerçek zamanlı analitik',
        'Dedicated hesap yöneticisi',
        'Öncelikli yerleşim garantisi'
      ],
      description: 'Büyük markalar ve ajanslar için premium çözüm',
      recommended: false
    },
    {
      id: 'enterprise',
      name: 'Kurumsal Paket',
      price: 'Özel Fiyat',
      period: 'yıllık',
      color: 'emerald',
      gradient: 'from-emerald-500 to-teal-600',
      features: [
        'Özel sponsorluk seçenekleri',
        'Event ve turnuva sponsorluğu',
        'İçerik ortaklığı imkanları',
        'Özel landing page&apos;ler',
        'API entegrasyonu',
        'White-label çözümler',
        'Özel reklam formatları',
        'Detaylı hedef kitle analizi',
        '24/7 Premium destek'
      ],
      description: 'Büyük oyun şirketleri ve platform sahipleri için',
      recommended: false
    }
  ];

  const additionalServices = [
    {
      name: 'Reklam Tasarım Hizmeti',
      price: '750',
      description: 'Profesyonel banner ve görsel tasarım hizmeti'
    },
    {
      name: 'İçerik Pazarlama',
      price: '1.200',
      description: 'Sponsored content ve blog yazısı hazırlama'
    },
    {
      name: 'Social Media Boost',
      price: '900',
      description: 'Sosyal medya hesaplarımızda reklam paylaşımı'
    },
    {
      name: 'Influencer Collaboration',
      price: '2.100',
      description: 'Gaming influencer&apos;ları ile iş birliği'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Reklam Paketlerimiz
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
            Türkiye&apos;nin en büyük gaming topluluğunda markanızı tanıtın. 
            Hedef kitlenize direkt ulaşmanın en etkili yolu!
          </p>
          
          {/* İstatistikler */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">15K+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Günlük Ziyaretçi</div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">85%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">18-35 Yaş Arası</div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">450K</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Aylık Sayfa Görünümü</div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">3.2dk</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Ortalama Kalış Süresi</div>
            </div>
          </div>
        </div>

        {/* Paketler */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8 mb-16">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300 ${
                pkg.recommended ? 'ring-4 ring-purple-500 ring-opacity-50' : ''
              }`}
            >
              {pkg.recommended && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    ⭐ En Popüler
                  </div>
                </div>
              )}
              
              <div className={`bg-gradient-to-r ${pkg.gradient} p-6 text-white text-center`}>
                <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                <div className="text-4xl font-bold mb-1">
                  {typeof pkg.price === 'string' && pkg.price.includes('Özel') ? (
                    <span className="text-2xl">Özel Fiyat</span>
                  ) : (
                    <>₺{pkg.price}</>
                  )}
                </div>
                <div className="text-sm opacity-90">
                  {pkg.period === 'aylık' ? 'Aylık' : pkg.period === 'yıllık' ? 'Yıllık Sözleşme' : ''}
                </div>
              </div>
              
              <div className="p-6">
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                  {pkg.description}
                </p>
                
                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={() => setSelectedPackage(pkg.id)}
                  className={`w-full bg-gradient-to-r ${pkg.gradient} text-white py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-opacity`}
                >
                  {pkg.price.includes('Özel') ? 'Teklif Al' : 'Paketi Seç'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Ek Hizmetler */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Ek Hizmetlerimiz
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalServices.map((service, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                    ₺{service.price}
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    {service.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Özel Teklifler */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Özel Tekliflerimiz</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white bg-opacity-20 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-2">🎮 Oyun Lansmanları</h3>
              <p className="text-sm opacity-90">
                Yeni oyun çıkışlarında özel kampanya fiyatları
              </p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-2">📅 Uzun Dönem İndirimi</h3>
              <p className="text-sm opacity-90">
                6 ay ve üzeri sözleşmelerde %15 indirim
              </p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-2">🤝 Partner Programı</h3>
              <p className="text-sm opacity-90">
                Gaming şirketleri için özel ortaklık fırsatları
              </p>
            </div>
          </div>
        </div>

        {/* İletişim */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Hemen Başlayın!
          </h2>
          
          <div className="max-w-2xl mx-auto">
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Reklam paketlerimiz hakkında detaylı bilgi almak ve özel tekliflerimizden 
              yararlanmak için bizimle iletişime geçin.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:reklam@aykutkaya.com?subject=Reklam Paketi Talebi&body=Merhaba, reklam paketleriniz hakkında bilgi almak istiyorum."
                className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <span>📧</span>
                <span>E-posta Gönder</span>
              </a>
              
              <a
                href="https://wa.me/905XXXXXXXXX"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
              >
                <span>📱</span>
                <span>WhatsApp İletişim</span>
              </a>
              
              <Link
                href="/"
                className="border-2 border-gray-400 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
              >
                <span>🏠</span>
                <span>Ana Sayfaya Dön</span>
              </Link>
            </div>
            
            <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
              <p>💡 <strong>Not:</strong> Tüm fiyatlar KDV dahildir. Özel ihtiyaçlarınız için özelleştirilmiş paketler hazırlayabiliriz.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}