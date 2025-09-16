-- Add approved field to forum_posts table for admin approval system

ALTER TABLE forum_posts ADD COLUMN IF NOT EXISTS approved BOOLEAN DEFAULT false;

-- Update RLS policies to only show approved posts to regular users
DROP POLICY IF EXISTS "Forum posts are viewable by everyone" ON forum_posts;
CREATE POLICY "Approved forum posts are viewable by everyone" ON forum_posts
  FOR SELECT USING (approved = true OR auth.uid() = author_id);

-- Allow authenticated users to create posts (but they start as unapproved)
CREATE POLICY "Authenticated users can create forum posts" ON forum_posts
  FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Allow authors to update their own posts
CREATE POLICY "Authors can update their own forum posts" ON forum_posts
  FOR UPDATE USING (auth.uid() = author_id);

-- Allow authors to delete their own posts
CREATE POLICY "Authors can delete their own forum posts" ON forum_posts
  FOR DELETE USING (auth.uid() = author_id);