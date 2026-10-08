-- Activation des modes de paiement, pilotée depuis l'administration.
-- Remplace la constante CARD_PAYMENT_ENABLED du code.

CREATE TABLE IF NOT EXISTS public.payment_settings (
  method text PRIMARY KEY CHECK (method IN ('carte', 'cheque', 'especes')),
  enabled boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- =========================
-- RLS
-- =========================
-- Lecture publique : les formulaires d'inscription doivent connaître les
-- modes disponibles. Seuls les administrateurs peuvent les modifier.
ALTER TABLE public.payment_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read payment settings" ON public.payment_settings;
CREATE POLICY "Public can read payment settings"
ON public.payment_settings FOR SELECT TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Authenticated can manage payment settings" ON public.payment_settings;
CREATE POLICY "Authenticated can manage payment settings"
ON public.payment_settings FOR ALL TO authenticated
USING (true) WITH CHECK (true);

GRANT SELECT ON public.payment_settings TO anon;
GRANT SELECT, INSERT, UPDATE ON public.payment_settings TO authenticated;

-- =========================
-- Valeurs initiales
-- =========================
-- Reprend l'état actuel du site : paiement en ligne désactivé.
INSERT INTO public.payment_settings (method, enabled)
VALUES
  ('carte', false),
  ('cheque', true),
  ('especes', true)
ON CONFLICT (method) DO NOTHING;

COMMENT ON TABLE public.payment_settings IS
  'Modes de paiement proposés sur les formulaires publics';
