-- RLS POLICIES'LERİ SİLME KOMUTLARI
-- Bu komutları çalıştırarak tüm mevcut RLS policies'leri silebilirsiniz

-- PROFIL TABLOSU POLICIES'LERİNİ SİL
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON profiles;

-- BLOG POSTS TABLOSU POLICIES'LERİNİ SİL
DROP POLICY IF EXISTS "Anyone can view published blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Authors can view own blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Admins can view all blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Authors can update own blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Admins can update all blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Authors can insert blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Admins can delete blog posts" ON blog_posts;

-- FORUM POSTS TABLOSU POLICIES'LERİNİ SİL
DROP POLICY IF EXISTS "Anyone can view forum posts" ON forum_posts;
DROP POLICY IF EXISTS "Authenticated users can insert forum posts" ON forum_posts;
DROP POLICY IF EXISTS "Authors can update own forum posts" ON forum_posts;
DROP POLICY IF EXISTS "Admins can update all forum posts" ON forum_posts;
DROP POLICY IF EXISTS "Admins can delete forum posts" ON forum_posts;

-- TABLOLARDA RLS'İ DEVRE DIŞI BIRAK (İSTEĞE BAĞLI)
-- ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE blog_posts DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE forum_posts DISABLE ROW LEVEL SECURITY;