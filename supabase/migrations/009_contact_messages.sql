-- Messages envoyés depuis le formulaire de contact public

CREATE TABLE IF NOT EXISTS public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text,
  age_range text,
  subject text NOT NULL,
  message text NOT NULL,
  newsletter boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'handled')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS contact_messages_status_idx
  ON public.contact_messages (status, created_at DESC);

-- =========================
-- RLS
-- =========================
-- Aucune policy pour anon : l'insertion passe par la route serveur
-- /api/contact avec la clé service role, ce qui évite d'exposer la table.
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated can manage contact messages" ON public.contact_messages;
CREATE POLICY "Authenticated can manage contact messages"
ON public.contact_messages FOR ALL TO authenticated
USING (true) WITH CHECK (true);

REVOKE ALL ON public.contact_messages FROM anon;
GRANT SELECT, UPDATE, DELETE ON public.contact_messages TO authenticated;

COMMENT ON TABLE public.contact_messages IS 'Messages reçus via le formulaire de contact public';
COMMENT ON COLUMN public.contact_messages.status IS 'new = à traiter, handled = traité';
