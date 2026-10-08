-- Montant facturé, figé au moment de l'inscription.
-- Sans cette colonne, chaque document PDF recalcule le prix : les réductions
-- familiales ne peuvent pas être retrouvées à partir d'une inscription isolée,
-- et un changement de grille tarifaire réécrirait les anciens reçus.

ALTER TABLE public.registrations
ADD COLUMN IF NOT EXISTS amount integer;

COMMENT ON COLUMN public.registrations.amount IS
  'Montant dû en euros, réductions familiales comprises, figé à l''inscription';
