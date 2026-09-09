import { createClient } from "@/lib/supabase/server";
import { GALLERY_BUCKET } from "@/lib/format";

export interface Professor {
  id: string;
  name: string;
  grade: string;
}

export interface ScheduleSlot {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  category_label: string;
  professor_name: string;
  level: string;
}

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string | null;
  published_at: string;
}

export interface ScheduleDay {
  day: string;
  slots: ScheduleSlot[];
}

export const DAY_LABELS = [
  "",
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche",
] as const;

/** Repli utilisé si la table n'existe pas encore ou si Supabase est injoignable. */
const FALLBACK_PROFESSORS: Professor[] = [
  { id: "fallback-1", name: "Junior Camara", grade: "Ceinture Noire 2ème Dan" },
  { id: "fallback-2", name: "Moustapha Camara", grade: "Ceinture Noire 2ème Dan" },
  { id: "fallback-3", name: "Loucif", grade: "Ceinture Noire 5ème Dan" },
];

const FALLBACK_SLOTS: ScheduleSlot[] = [
  // Lundi
  { id: "f1", day_of_week: 1, start_time: "17h00", end_time: "18h00", category_label: "Mini-Poussins/Poussins débutant(e)s", professor_name: "Loucif", level: "Débutant" },
  // Mardi
  { id: "f2", day_of_week: 2, start_time: "17h00", end_time: "18h00", category_label: "Mini-Poussins/Poussins confirmé(e)s", professor_name: "Junior Camara", level: "Confirmé" },
  { id: "f3", day_of_week: 2, start_time: "18h00", end_time: "19h00", category_label: "Benjamins", professor_name: "Junior Camara", level: "Tous niveaux" },
  { id: "f4", day_of_week: 2, start_time: "19h00", end_time: "20h30", category_label: "Minimes/Cadets/Juniors/Seniors", professor_name: "Junior Camara", level: "Avancé" },
  // Mercredi
  { id: "f5", day_of_week: 3, start_time: "17h30", end_time: "18h30", category_label: "Babies 1", professor_name: "Moustapha Camara", level: "Débutant" },
  { id: "f6", day_of_week: 3, start_time: "18h30", end_time: "19h30", category_label: "Babies 2", professor_name: "Moustapha Camara", level: "Débutant" },
  { id: "f7", day_of_week: 3, start_time: "19h00", end_time: "21h00", category_label: "Jujitsu (Site Jean Villard)", professor_name: "Junior Camara", level: "Tous niveaux" },
  // Jeudi
  { id: "f8", day_of_week: 4, start_time: "17h00", end_time: "18h00", category_label: "Mini-Poussins/Poussins débutant(e)s", professor_name: "Loucif", level: "Débutant" },
  { id: "f9", day_of_week: 4, start_time: "19h00", end_time: "21h00", category_label: "Jujitsu (Site Jean Villard)", professor_name: "Junior Camara", level: "Tous niveaux" },
  // Vendredi
  { id: "f10", day_of_week: 5, start_time: "17h00", end_time: "18h00", category_label: "Mini-Poussins/Poussins confirmé(e)s", professor_name: "Junior Camara", level: "Confirmé" },
  { id: "f11", day_of_week: 5, start_time: "18h00", end_time: "19h00", category_label: "Benjamins", professor_name: "Junior Camara", level: "Tous niveaux" },
  { id: "f12", day_of_week: 5, start_time: "19h00", end_time: "20h30", category_label: "Minimes/Cadets/Juniors/Seniors", professor_name: "Junior Camara", level: "Avancé" },
];

export async function getProfessors(): Promise<Professor[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("professors")
      .select("id, name, grade")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error || !data?.length) return FALLBACK_PROFESSORS;
    return data;
  } catch {
    return FALLBACK_PROFESSORS;
  }
}

export async function getScheduleSlots(): Promise<ScheduleSlot[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("schedule_slots")
      .select("id, day_of_week, start_time, end_time, category_label, professor_name, level")
      .eq("is_active", true)
      .order("day_of_week", { ascending: true })
      .order("display_order", { ascending: true });

    if (error || !data?.length) return FALLBACK_SLOTS;
    return data;
  } catch {
    return FALLBACK_SLOTS;
  }
}

export function groupSlotsByDay(slots: ScheduleSlot[]): ScheduleDay[] {
  const days = new Map<number, ScheduleSlot[]>();

  for (const slot of slots) {
    const existing = days.get(slot.day_of_week);
    if (existing) existing.push(slot);
    else days.set(slot.day_of_week, [slot]);
  }

  return [...days.entries()]
    .sort(([a], [b]) => a - b)
    .map(([dayNumber, daySlots]) => ({
      day: DAY_LABELS[dayNumber] ?? `Jour ${dayNumber}`,
      slots: daySlots,
    }));
}

export interface PublicDocument {
  id: string;
  title: string;
  description: string | null;
  file_path: string;
  file_name: string;
  file_size: number;
  mime_type: string | null;
}

export async function getPublicDocuments(): Promise<PublicDocument[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("documents")
      .select("id, title, description, file_path, file_name, file_size, mime_type")
      .eq("is_published", true)
      .order("display_order", { ascending: true });

    if (error || !data) return [];
    return data;
  } catch {
    return [];
  }
}

export interface GalleryImage {
  id: string;
  title: string | null;
  caption: string | null;
  url: string;
}

/** Images publiées du carrousel, avec leur URL publique déjà résolue. */
export async function getGalleryImages(): Promise<GalleryImage[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("gallery_images")
      .select("id, title, caption, file_path")
      .eq("is_published", true)
      .order("display_order", { ascending: true });

    if (error || !data) return [];

    const rows = data as unknown as Array<{
      id: string;
      title: string | null;
      caption: string | null;
      file_path: string;
    }>;

    return rows.map((image) => ({
      id: image.id,
      title: image.title,
      caption: image.caption,
      url: supabase.storage.from(GALLERY_BUCKET).getPublicUrl(image.file_path).data.publicUrl,
    }));
  } catch {
    return [];
  }
}

export async function getPublishedNews(limit?: number): Promise<NewsItem[]> {
  try {
    const supabase = createClient();
    let query = supabase
      .from("news")
      .select("id, title, excerpt, content, published_at")
      .eq("published", true)
      .order("published_at", { ascending: false });

    if (limit) query = query.limit(limit);

    const { data, error } = await query;
    if (error || !data) return [];
    return data;
  } catch {
    return [];
  }
}
