-- Portfolio Database Schema
-- This migration sets up the initial database structure for the portfolio application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create content_overrides table to store localized content
-- Replaces the file-based content-overrides.json approach
CREATE TABLE IF NOT EXISTS content_overrides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  locale VARCHAR(10) NOT NULL,
  content JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  UNIQUE(locale)
);

-- Create index on locale for faster queries
CREATE INDEX IF NOT EXISTS idx_content_overrides_locale ON content_overrides(locale);

-- Create uploads table to track uploaded files
CREATE TABLE IF NOT EXISTS uploads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename VARCHAR(255) NOT NULL UNIQUE,
  original_filename VARCHAR(255) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  size_bytes BIGINT NOT NULL,
  storage_path TEXT NOT NULL,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT valid_filename CHECK (filename ~ '^[a-zA-Z0-9_-]+\.[a-zA-Z0-9]+$')
);

-- Create index on filename for faster lookups
CREATE INDEX IF NOT EXISTS idx_uploads_filename ON uploads(filename);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_content_overrides_updated_at
  BEFORE UPDATE ON content_overrides
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies

-- Enable RLS on content_overrides
ALTER TABLE content_overrides ENABLE ROW LEVEL SECURITY;

-- Allow public read access to content_overrides
CREATE POLICY "Allow public read access to content_overrides"
  ON content_overrides
  FOR SELECT
  USING (true);

-- Allow authenticated users to insert/update content_overrides
CREATE POLICY "Allow authenticated users to modify content_overrides"
  ON content_overrides
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Enable RLS on uploads
ALTER TABLE uploads ENABLE ROW LEVEL SECURITY;

-- Allow public read access to uploads (for serving files)
CREATE POLICY "Allow public read access to uploads"
  ON uploads
  FOR SELECT
  USING (true);

-- Allow authenticated users to upload files
CREATE POLICY "Allow authenticated users to upload files"
  ON uploads
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to delete their own uploads
CREATE POLICY "Allow authenticated users to delete uploads"
  ON uploads
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- Create storage bucket for uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for uploads bucket
CREATE POLICY "Allow public access to uploads bucket"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'uploads');

CREATE POLICY "Allow authenticated users to upload to uploads bucket"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'uploads' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Allow authenticated users to delete from uploads bucket"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'uploads' AND
    auth.role() = 'authenticated'
  );
