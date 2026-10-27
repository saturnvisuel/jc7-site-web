-- Rattachement explicite des inscriptions issues d'une même soumission familiale.
-- Le reçu familial les regroupait via (guardian_email + created_at identiques) :
-- or chaque ligne reçoit son propre now(), à quelques millisecondes d'écart,
-- donc un seul enfant était retrouvé et le total était faux.

ALTER TABLE public.registrations
ADD COLUMN IF NOT EXISTS family_id uuid;

CREATE INDEX IF NOT EXISTS registrations_family_id_idx
  ON public.registrations (family_id);

COMMENT ON COLUMN public.registrations.family_id IS
  'Identifiant commun aux inscriptions saisies dans le même formulaire familial';
