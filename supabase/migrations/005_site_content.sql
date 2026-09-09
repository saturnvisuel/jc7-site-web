-- Contenu éditable du site public (professeurs, planning, actualités)

-- =========================
-- Professeurs
-- =========================
CREATE TABLE IF NOT EXISTS public.professors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  grade text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS professors_order_idx ON public.professors (display_order);

-- =========================
-- Créneaux du planning
-- =========================
CREATE TABLE IF NOT EXISTS public.schedule_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week smallint NOT NULL CHECK (day_of_week BETWEEN 1 AND 7),
  start_time text NOT NULL,
  end_time text NOT NULL,
  category_label text NOT NULL,
  professor_name text NOT NULL,
  level text NOT NULL DEFAULT 'Tous niveaux',
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS schedule_slots_day_idx ON public.schedule_slots (day_of_week, display_order);

-- =========================
-- Actualités
-- =========================
CREATE TABLE IF NOT EXISTS public.news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  excerpt text NOT NULL,
  content text,
  published boolean NOT NULL DEFAULT false,
  published_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS news_published_idx ON public.news (published, published_at DESC);

-- =========================
-- RLS
-- =========================
ALTER TABLE public.professors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedule_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read active professors" ON public.professors;
CREATE POLICY "Public can read active professors"
ON public.professors FOR SELECT TO anon, authenticated
USING (is_active = true);

DROP POLICY IF EXISTS "Authenticated can manage professors" ON public.professors;
CREATE POLICY "Authenticated can manage professors"
ON public.professors FOR ALL TO authenticated
USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can read active slots" ON public.schedule_slots;
CREATE POLICY "Public can read active slots"
ON public.schedule_slots FOR SELECT TO anon, authenticated
USING (is_active = true);

DROP POLICY IF EXISTS "Authenticated can manage slots" ON public.schedule_slots;
CREATE POLICY "Authenticated can manage slots"
ON public.schedule_slots FOR ALL TO authenticated
USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can read published news" ON public.news;
CREATE POLICY "Public can read published news"
ON public.news FOR SELECT TO anon, authenticated
USING (published = true);

DROP POLICY IF EXISTS "Authenticated can manage news" ON public.news;
CREATE POLICY "Authenticated can manage news"
ON public.news FOR ALL TO authenticated
USING (true) WITH CHECK (true);

GRANT SELECT ON public.professors, public.schedule_slots, public.news TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.professors, public.schedule_slots, public.news TO authenticated;

-- =========================
-- Données initiales
-- =========================
INSERT INTO public.professors (name, grade, display_order)
SELECT * FROM (VALUES
  ('Junior Camara', 'Ceinture Noire 2ème Dan', 1),
  ('Moustapha Camara', 'Ceinture Noire 2ème Dan', 2),
  ('Loucif', 'Ceinture Noire 5ème Dan', 3)
) AS seed(name, grade, display_order)
WHERE NOT EXISTS (SELECT 1 FROM public.professors);

INSERT INTO public.schedule_slots (day_of_week, start_time, end_time, category_label, professor_name, level, display_order)
SELECT * FROM (VALUES
  (1, '17h00', '18h00', 'Benjamins/Minimes Débutants (<Jaune-Orange)', 'Loucif', 'Débutant', 1),
  (2, '17h00', '18h00', 'Poussins/Pré-Poussins', 'Junior Camara', 'Tous niveaux', 1),
  (2, '18h00', '19h00', 'Benjamins/Minimes Confirmés (>Jaune-Orange)', 'Junior Camara', 'Confirmé', 2),
  (2, '19h00', '21h00', 'Cadets/Juniors/Seniors', 'Junior Camara', 'Avancé', 3),
  (3, '17h30', '18h30', 'Baby Judo (4-5 ans)', 'Moustapha Camara', 'Débutant', 1),
  (3, '18h30', '19h30', 'Baby Judo (4-5 ans)', 'Moustapha Camara', 'Débutant', 2),
  (4, '17h00', '18h00', 'Benjamins/Minimes Débutants (<Jaune-Orange)', 'Loucif', 'Débutant', 1),
  (5, '17h00', '18h00', 'Poussins/Pré-Poussins', 'Junior Camara', 'Tous niveaux', 1),
  (5, '18h00', '19h00', 'Benjamins/Minimes Confirmés (>Jaune-Orange)', 'Junior Camara', 'Confirmé', 2),
  (5, '19h00', '21h00', 'Cadets/Juniors/Seniors', 'Junior Camara', 'Avancé', 3),
  (6, '13h00', '15h00', 'Préparation Physique', 'Adam', 'Tous niveaux', 1)
) AS seed(day_of_week, start_time, end_time, category_label, professor_name, level, display_order)
WHERE NOT EXISTS (SELECT 1 FROM public.schedule_slots);
