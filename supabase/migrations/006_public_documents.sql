-- Documents publics téléchargeables (règlement, fiches, calendriers...)

CREATE TABLE IF NOT EXISTS public.documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  file_path text NOT NULL,
  file_name text NOT NULL,
  file_size bigint NOT NULL DEFAULT 0,
  mime_type text,
  display_order integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS documents_published_idx
  ON public.documents (is_published, display_order);

-- =========================
-- RLS sur la table
-- =========================
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read published documents" ON public.documents;
CREATE POLICY "Public can read published documents"
ON public.documents FOR SELECT TO anon, authenticated
USING (is_published = true);

DROP POLICY IF EXISTS "Authenticated can manage documents" ON public.documents;
CREATE POLICY "Authenticated can manage documents"
ON public.documents FOR ALL TO authenticated
USING (true) WITH CHECK (true);

GRANT SELECT ON public.documents TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.documents TO authenticated;

-- =========================
-- Bucket de stockage public
-- =========================
INSERT INTO storage.buckets (id, name, public)
VALUES ('public-documents', 'public-documents', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public can read public documents" ON storage.objects;
CREATE POLICY "Public can read public documents"
ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'public-documents');

DROP POLICY IF EXISTS "Authenticated can upload public documents" ON storage.objects;
CREATE POLICY "Authenticated can upload public documents"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'public-documents');

DROP POLICY IF EXISTS "Authenticated can delete public documents" ON storage.objects;
CREATE POLICY "Authenticated can delete public documents"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'public-documents');
