-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view own links" ON public.links;
DROP POLICY IF EXISTS "Users can insert own links" ON public.links;
DROP POLICY IF EXISTS "Users can update own links" ON public.links;
DROP POLICY IF EXISTS "Users can delete own links" ON public.links;
DROP POLICY IF EXISTS "Public can view active links" ON public.links;
DROP POLICY IF EXISTS "Media files are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload media" ON storage.objects;

-- Add new columns for link types (if they don't exist)
ALTER TABLE public.links 
ADD COLUMN IF NOT EXISTS type TEXT NOT NULL DEFAULT 'url',
ADD COLUMN IF NOT EXISTS is_nsfw BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS requires_email BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS folder_links UUID[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS form_fields JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS poll_options JSONB DEFAULT '[]';

-- Create storage bucket for media
INSERT INTO storage.buckets (id, name, public)
VALUES ('links', 'links', true)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies
CREATE POLICY "Users can view own links"
ON public.links FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own links"
ON public.links FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own links"
ON public.links FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own links"
ON public.links FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "Public can view active links"
ON public.links FOR SELECT
USING (is_active = true);

-- Create storage policies
CREATE POLICY "Media files are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'links');

CREATE POLICY "Authenticated users can upload media"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'links' AND
    auth.role() = 'authenticated'
);

-- Create function to update link positions
CREATE OR REPLACE FUNCTION update_link_positions(link_positions jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  FOR i IN 0..jsonb_array_length(link_positions) - 1 LOOP
    UPDATE public.links
    SET 
      position = (link_positions->i->>'position')::int,
      updated_at = NOW()
    WHERE 
      id = (link_positions->i->>'id')::uuid
      AND user_id = auth.uid();
  END LOOP;
END;
$$;