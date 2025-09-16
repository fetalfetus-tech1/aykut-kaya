-- RLS'İ TAMAMEN RESETLEME - EN RADİKAL ÇÖZÜM

-- 1. TÜM POLICIES'LERİ SİL
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON profiles;

DROP POLICY IF EXISTS "Anyone can view published blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Authors can view own blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Admins can view all blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Authors can update own blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Admins can update all blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Authors can insert blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Admins can delete blog posts" ON blog_posts;

DROP POLICY IF EXISTS "Anyone can view forum posts" ON forum_posts;
DROP POLICY IF EXISTS "Authenticated users can insert forum posts" ON forum_posts;
DROP POLICY IF EXISTS "Authors can update own forum posts" ON forum_posts;
DROP POLICY IF EXISTS "Admins can update all forum posts" ON forum_posts;
DROP POLICY IF EXISTS "Admins can delete forum posts" ON forum_posts;

-- 2. RLS'İ DEVRE DIŞI BIRAK
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE forum_posts DISABLE ROW LEVEL SECURITY;

-- 3. RLS'İ TEKRAR ETKİNLEŞTİR
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;

-- 4. DAHA PERMISSIVE POLICIES - AUTH PROBLEMLERINI ÇÖZMEK İÇİN
-- PROFIL TABLOSU - DAHA GENİŞ YETKİLER
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- IMPORTANT: Allow authenticated users to view profiles for joins and general access
CREATE POLICY "Authenticated users can view all profiles" ON profiles
    FOR SELECT USING (auth.uid() IS NOT NULL);

-- BLOG POSTS TABLOSU
CREATE POLICY "Anyone can view published blog posts" ON blog_posts
    FOR SELECT USING (published = true);

CREATE POLICY "Authors can insert blog posts" ON blog_posts
    FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can view own blog posts" ON blog_posts
    FOR SELECT USING (auth.uid() = author_id);

CREATE POLICY "Authors can update own blog posts" ON blog_posts
    FOR UPDATE USING (auth.uid() = author_id);

-- FORUM POSTS TABLOSU
CREATE POLICY "Anyone can view forum posts" ON forum_posts
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert forum posts" ON forum_posts
    FOR INSERT WITH CHECK (auth.uid() = author_id AND auth.uid() IS NOT NULL);

CREATE POLICY "Authors can update own forum posts" ON forum_posts
    FOR UPDATE USING (auth.uid() = author_id);