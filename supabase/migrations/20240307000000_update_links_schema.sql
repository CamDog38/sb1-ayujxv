-- Update links table with new columns
ALTER TABLE public.links
ADD COLUMN IF NOT EXISTS is_nsfw BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS requires_email BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS folder_links TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS form_fields JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS poll_options JSONB DEFAULT '[]';

-- Create storage bucket for link media if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('links', 'links', true)
ON CONFLICT (id) DO NOTHING;

-- Update storage policies
CREATE POLICY "Media files are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'links');

CREATE POLICY "Authenticated users can upload media"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'links' AND
    auth.role() = 'authenticated'
);

-- Update RLS policies
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own links"
ON public.links
USING (auth.uid() = user_id);

CREATE POLICY "Public can view active links"
ON public.links FOR SELECT
USING (is_active = true);