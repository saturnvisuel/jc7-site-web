-- Carrousel photo de la page d'accueil, géré depuis l'admin

CREATE TABLE IF NOT EXISTS public.gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  caption text,
  file_path text NOT NULL,
  file_name text NOT NULL,
  file_size bigint NOT NULL DEFAULT 0,
  mime_type text,
  display_order integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS gallery_images_published_idx
  ON public.gallery_images (is_published, display_order);

-- =========================
-- RLS sur la table
-- =========================
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read published gallery images" ON public.gallery_images;
CREATE POLICY "Public can read published gallery images"
ON public.gallery_images FOR SELECT TO anon, authenticated
USING (is_published = true);

DROP POLICY IF EXISTS "Authenticated can manage gallery images" ON public.gallery_images;
CREATE POLICY "Authenticated can manage gallery images"
ON public.gallery_images FOR ALL TO authenticated
USING (true) WITH CHECK (true);

GRANT SELECT ON public.gallery_images TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gallery_images TO authenticated;

-- =========================
-- Bucket de stockage public
-- =========================
INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery', 'gallery', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public can read gallery" ON storage.objects;
CREATE POLICY "Public can read gallery"
ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'gallery');

DROP POLICY IF EXISTS "Authenticated can upload gallery" ON storage.objects;
CREATE POLICY "Authenticated can upload gallery"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'gallery');

DROP POLICY IF EXISTS "Authenticated can delete gallery" ON storage.objects;
CREATE POLICY "Authenticated can delete gallery"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'gallery');
