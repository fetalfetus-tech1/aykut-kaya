-- Update game_reviews table to match admin panel requirements
-- This migration simplifies the game_reviews table structure

-- First, drop existing game_reviews table if it exists
DROP TABLE IF EXISTS game_reviews CASCADE;

-- Create simplified game_reviews table
CREATE TABLE game_reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    game_title TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 10),
    author_id UUID REFERENCES auth.users(id) NOT NULL,
    published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE game_reviews ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Published game reviews are viewable by everyone" ON game_reviews
  FOR SELECT USING (published = true OR auth.uid() = author_id);

CREATE POLICY "Users can insert their own game reviews" ON game_reviews
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own game reviews" ON game_reviews
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own game reviews" ON game_reviews
  FOR DELETE USING (auth.uid() = author_id);

-- Create indexes
CREATE INDEX idx_game_reviews_author ON game_reviews(author_id);
CREATE INDEX idx_game_reviews_published ON game_reviews(published);
CREATE INDEX idx_game_reviews_created_at ON game_reviews(created_at DESC);

-- Create trigger for updated_at
CREATE TRIGGER update_game_reviews_updated_at
  BEFORE UPDATE ON game_reviews
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();