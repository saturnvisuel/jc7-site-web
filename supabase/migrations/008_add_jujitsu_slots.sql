-- Ajout des créneaux Jujitsu (Adam) : mercredi et jeudi 19h00-21h00
-- Idempotent : ne réinsère pas un créneau déjà présent

INSERT INTO public.schedule_slots (day_of_week, start_time, end_time, category_label, professor_name, level, display_order)
SELECT seed.day_of_week, seed.start_time, seed.end_time, seed.category_label, seed.professor_name, seed.level, seed.display_order
FROM (VALUES
  (3, '19h00', '21h00', 'Jujitsu (Site Jean Villard)', 'Adam', 'Tous niveaux', 3),
  (4, '19h00', '21h00', 'Jujitsu (Site Jean Villard)', 'Adam', 'Tous niveaux', 2)
) AS seed(day_of_week, start_time, end_time, category_label, professor_name, level, display_order)
WHERE NOT EXISTS (
  SELECT 1 FROM public.schedule_slots existing
  WHERE existing.day_of_week = seed.day_of_week
    AND existing.start_time = seed.start_time
    AND existing.category_label = seed.category_label
);
