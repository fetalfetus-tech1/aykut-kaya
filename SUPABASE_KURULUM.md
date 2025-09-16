# Supabase Proje Oluşturma Rehberi

## Adım 1: Yeni Proje Oluşturma

1. Supabase Dashboard'unda **"New Project"** butonuna tıklayın
2. Proje bilgilerini doldurun:
   - **Project Name**: `aykutkaya-gaming`
   - **Database Password**: Güçlü bir şifre oluşturun (ÖNEMLİ: Bu şifreyi kaydedin!)
   - **Region**: `West EU (Ireland)` seçin (Türkiye'ye en yakın)
3. **"Create new project"** butonuna tıklayın
4. Proje oluşturulmasını bekleyin (1-2 dakika)

## Adım 2: Proje Bilgilerini Alma

Proje oluştuktan sonra:

1. **Settings** > **API** sekmesine gidin
2. Aşağıdaki bilgileri kopyalayın ve kaydedin:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## Adım 3: Database Schema Yükleme

1. Sol menüden **"SQL Editor"** sekmesine gidin
2. **"New query"** butonuna tıklayın
3. Aşağıdaki SQL kodunu kopyalayıp yapıştırın:

```sql
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users profiles table
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog posts table
CREATE TABLE blog_posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    slug TEXT UNIQUE NOT NULL,
    image_url TEXT,
    category TEXT NOT NULL,
    tags TEXT[],
    author_id UUID REFERENCES auth.users(id) NOT NULL,
    published BOOLEAN DEFAULT false,
    featured BOOLEAN DEFAULT false,
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Forum posts table
CREATE TABLE forum_posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    tags TEXT[],
    author_id UUID REFERENCES auth.users(id) NOT NULL,
    pinned BOOLEAN DEFAULT false,
    locked BOOLEAN DEFAULT false,
    views INTEGER DEFAULT 0,
    replies_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Game reviews table
CREATE TABLE game_reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    game_title TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    content TEXT NOT NULL,
    pros TEXT[],
    cons TEXT[],
    game_image TEXT,
    platform TEXT NOT NULL,
    genre TEXT NOT NULL,
    author_id UUID REFERENCES auth.users(id) NOT NULL,
    published BOOLEAN DEFAULT false,
    featured BOOLEAN DEFAULT false,
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comments table
CREATE TABLE comments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    content TEXT NOT NULL,
    author_id UUID REFERENCES auth.users(id) NOT NULL,
    blog_post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
    forum_post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
    game_review_id UUID REFERENCES game_reviews(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT comments_single_reference CHECK (
        (blog_post_id IS NOT NULL)::int + 
        (forum_post_id IS NOT NULL)::int + 
        (game_review_id IS NOT NULL)::int = 1
    )
);

-- Indexes for better performance
CREATE INDEX idx_blog_posts_author ON blog_posts(author_id);
CREATE INDEX idx_blog_posts_published ON blog_posts(published);
CREATE INDEX idx_blog_posts_category ON blog_posts(category);
CREATE INDEX idx_blog_posts_created_at ON blog_posts(created_at DESC);

CREATE INDEX idx_forum_posts_author ON forum_posts(author_id);
CREATE INDEX idx_forum_posts_category ON forum_posts(category);
CREATE INDEX idx_forum_posts_created_at ON forum_posts(created_at DESC);

CREATE INDEX idx_game_reviews_author ON game_reviews(author_id);
CREATE INDEX idx_game_reviews_published ON game_reviews(published);
CREATE INDEX idx_game_reviews_rating ON game_reviews(rating);
CREATE INDEX idx_game_reviews_created_at ON game_reviews(created_at DESC);

CREATE INDEX idx_comments_blog_post ON comments(blog_post_id);
CREATE INDEX idx_comments_forum_post ON comments(forum_post_id);
CREATE INDEX idx_comments_game_review ON comments(game_review_id);
CREATE INDEX idx_comments_created_at ON comments(created_at);

-- Row Level Security (RLS) Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Blog posts policies
CREATE POLICY "Published blog posts are viewable by everyone" ON blog_posts FOR SELECT USING (published = true OR auth.uid() = author_id);
CREATE POLICY "Users can insert their own blog posts" ON blog_posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update their own blog posts" ON blog_posts FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users can delete their own blog posts" ON blog_posts FOR DELETE USING (auth.uid() = author_id);

-- Forum posts policies
CREATE POLICY "Forum posts are viewable by everyone" ON forum_posts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create forum posts" ON forum_posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update their own forum posts" ON forum_posts FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users can delete their own forum posts" ON forum_posts FOR DELETE USING (auth.uid() = author_id);

-- Game reviews policies
CREATE POLICY "Published game reviews are viewable by everyone" ON game_reviews FOR SELECT USING (published = true OR auth.uid() = author_id);
CREATE POLICY "Users can insert their own game reviews" ON game_reviews FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update their own game reviews" ON game_reviews FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users can delete their own game reviews" ON game_reviews FOR DELETE USING (auth.uid() = author_id);

-- Comments policies
CREATE POLICY "Comments are viewable by everyone" ON comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create comments" ON comments FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update their own comments" ON comments FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users can delete their own comments" ON comments FOR DELETE USING (auth.uid() = author_id);

-- Functions and triggers
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();

-- Update functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_forum_posts_updated_at BEFORE UPDATE ON forum_posts FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_game_reviews_updated_at BEFORE UPDATE ON game_reviews FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
```

4. **"RUN"** butonuna tıklayın
5. İşlem tamamlandığında "Success" mesajını göreceksiniz

## Adım 4: Environment Variables

Proje bilgilerinizi aldıktan sonra bana şu bilgileri verin:
- Project URL
- Anon public key

Bu bilgilerle .env.local dosyasını güncelleyeceğim.

## Sonraki Adım

Schema yüklenince bana bildirin, environment variables'ları güncelleyip test edeceğiz!