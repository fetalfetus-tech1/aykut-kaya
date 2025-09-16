# Supabase Kurulum Rehberi

Bu rehber, projenizi ücretsiz Supabase veritabanı ile canlıya çıkarmanız için gereken adımları içerir.

## 1. Supabase Hesabı Oluşturma

1. [Supabase.com](https://supabase.com) adresine gidin
2. "Start your project" butonuna tıklayın
3. GitHub, Google veya email ile hesap oluşturun

## 2. Yeni Proje Oluşturma

1. Dashboard'da "New Project" butonuna tıklayın
2. Proje bilgilerini doldurun:
   - **Project Name**: `aykutkaya-gaming`
   - **Database Password**: Güçlü bir şifre oluşturun (kaydedin!)
   - **Region**: `West EU (Ireland)` (Türkiye'ye en yakın)
3. "Create new project" butonuna tıklayın
4. Proje oluşturulana kadar bekleyin (1-2 dakika)

## 3. Veritabanı Şemasını Kurma

1. Proje dashboard'unda sol menüden **SQL Editor**'e gidin
2. `database/schema.sql` dosyasındaki tüm kodu kopyalayın
3. SQL Editor'e yapıştırın ve **RUN** butonuna tıklayın
4. Tabloların oluşturulduğunu doğrulayın

## 4. Environment Variables Ayarlama

1. Proje dashboard'unda **Settings** > **API** sekmesine gidin
2. Aşağıdaki değerleri kopyalayın:
   - **Project URL**
   - **anon public key**

3. `.env.local` dosyasını güncelleyin:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## 5. Row Level Security (RLS) Doğrulama

1. **Table Editor**'e gidin
2. Her tablo için RLS'nin aktif olduğunu kontrol edin
3. **Authentication** > **Policies** sekmesinde politikaların oluşturulduğunu doğrulayın

## 6. Lokalde Test Etme

```bash
npm run dev
```

1. `http://localhost:3000/auth` adresine gidin
2. Yeni hesap oluşturun
3. Dashboard'a erişebildiğinizi kontrol edin
4. Blog, forum ve inceleme oluşturarak veritabanının çalıştığını test edin

## 7. Vercel'e Deploy Etme

### Vercel Hesabı Oluşturma
1. [Vercel.com](https://vercel.com) adresine gidin
2. GitHub hesabınızla giriş yapın

### Projeyi Deploy Etme
1. Vercel dashboard'unda "New Project" butonuna tıklayın
2. GitHub repo'nuzu seçin
3. **Environment Variables** bölümünde şunları ekleyin:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```
4. "Deploy" butonuna tıklayın

## 8. Domain Ayarlama (Opsiyonel)

### Ücretsiz Subdomain
- Vercel otomatik olarak `your-project.vercel.app` domain'i verir

### Özel Domain
1. Vercel project settings'e gidin
2. "Domains" sekmesinde domain'inizi ekleyin
3. DNS ayarlarını yapın

## 9. Güvenlik Kontrolleri

### Supabase Güvenlik
1. **Authentication** > **Settings**'de email doğrulamayı aktif edin
2. **Database** > **Settings**'de connection pooling'i kontrol edin

### Vercel Güvenlik
1. Environment variables'ın sadece production'da görünür olduğunu kontrol edin
2. Preview deployments için ayrı test veritabanı kullanmayı düşünün

## 10. Monitoring ve Maintenance

### Supabase Dashboard
- **Logs**: Hata loglarını takip edin
- **Database**: Tablo boyutlarını kontrol edin
- **Auth**: Kullanıcı aktivitelerini izleyin

### Vercel Analytics
- **Functions**: API response sürelerini takip edin
- **Speed Insights**: Site performansını optimize edin

## Ücretsiz Limitler

### Supabase Free Tier
- **Database**: 500MB
- **Auth users**: 50,000
- **API requests**: 2,5 milyon/ay
- **Bandwidth**: 5GB

### Vercel Hobby Plan
- **Build time**: 6,000 dakika/ay
- **Bandwidth**: 100GB
- **Function executions**: 12,000 saat/ay

## Troubleshooting

### Yaygın Hatalar

1. **"Invalid API key"**
   - Environment variables'ı kontrol edin
   - Supabase dashboard'da doğru key'i kopyaladığınızdan emin olun

2. **"Row Level Security policy violation"**
   - RLS politikalarının doğru kurulduğunu kontrol edin
   - SQL Editor'de politikaları yeniden çalıştırın

3. **Authentication hatası**
   - Supabase Auth ayarlarını kontrol edin
   - Email confirmation'ın aktif olup olmadığını kontrol edin

### Destek

- **Supabase**: [discord.supabase.com](https://discord.supabase.com)
- **Vercel**: [vercel.com/help](https://vercel.com/help)
- **Next.js**: [nextjs.org/docs](https://nextjs.org/docs)

## Sonuç

Bu adımları takip ederek projeniz tamamen ücretsiz olarak canlıya çıkacaktır. Kullanıcı sayınız arttıkça Supabase ve Vercel'in ücretli planlarına geçiş yapabilirsiniz.

**🎉 Tebrikler! Gaming blog siteniz artık canlı!**