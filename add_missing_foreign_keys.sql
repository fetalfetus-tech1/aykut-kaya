-- Eksik forum_stars ve forum_replies tablolarını oluştur
CREATE TABLE IF NOT EXISTS forum_stars (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS forum_replies (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Forum ve blog ilişkili tablolar için foreign key ekleme scripti

-- Forum stars tablosu (eğer yoksa önce tabloyu oluşturmalısın)
ALTER TABLE IF EXISTS forum_stars
  ADD CONSTRAINT fk_forum_stars_post
  FOREIGN KEY (post_id) REFERENCES forum_posts(id);

-- Forum replies tablosu (eğer yoksa önce tabloyu oluşturmalısın)
ALTER TABLE IF EXISTS forum_replies
  ADD CONSTRAINT fk_forum_replies_post
  FOREIGN KEY (post_id) REFERENCES forum_posts(id);

-- Blog posts tablosu için author_id -> profiles.id foreign key
ALTER TABLE IF EXISTS blog_posts
  ADD CONSTRAINT fk_blog_posts_author
  FOREIGN KEY (author_id) REFERENCES profiles(id);
