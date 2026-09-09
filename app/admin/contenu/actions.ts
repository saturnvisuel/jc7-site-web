"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { DOCUMENTS_BUCKET, GALLERY_BUCKET } from "@/lib/format";

async function assertAdmin() {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) throw new Error("Non autorisé");
}

function refresh() {
  revalidatePath("/admin/contenu");
  revalidatePath("/cours");
  revalidatePath("/actualites");
  revalidatePath("/documents");
  revalidatePath("/");
}

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function num(formData: FormData, key: string, fallback = 0): number {
  const parsed = Number(formData.get(key));
  return Number.isFinite(parsed) ? parsed : fallback;
}

// ---------- Professeurs ----------

export async function saveProfessor(formData: FormData) {
  await assertAdmin();

  const id = str(formData, "id");
  const payload = {
    name: str(formData, "name"),
    grade: str(formData, "grade"),
    display_order: num(formData, "display_order"),
    is_active: formData.get("is_active") === "on",
  };

  if (!payload.name || !payload.grade) throw new Error("Nom et grade requis");

  const table = supabaseAdmin.from("professors") as any;
  const { error } = id
    ? await table.update(payload).eq("id", id)
    : await table.insert(payload);

  if (error) throw new Error(error.message);
  refresh();
}

export async function deleteProfessor(formData: FormData) {
  await assertAdmin();
  const id = str(formData, "id");
  const { error } = await supabaseAdmin.from("professors").delete().eq("id", id);
  if (error) throw new Error(error.message);
  refresh();
}

// ---------- Créneaux ----------

export async function saveSlot(formData: FormData) {
  await assertAdmin();

  const id = str(formData, "id");
  const payload = {
    day_of_week: num(formData, "day_of_week", 1),
    start_time: str(formData, "start_time"),
    end_time: str(formData, "end_time"),
    category_label: str(formData, "category_label"),
    professor_name: str(formData, "professor_name"),
    level: str(formData, "level") || "Tous niveaux",
    display_order: num(formData, "display_order"),
    is_active: formData.get("is_active") === "on",
  };

  if (!payload.start_time || !payload.end_time || !payload.category_label) {
    throw new Error("Horaires et catégorie requis");
  }

  const table = supabaseAdmin.from("schedule_slots") as any;
  const { error } = id
    ? await table.update(payload).eq("id", id)
    : await table.insert(payload);

  if (error) throw new Error(error.message);
  refresh();
}

export async function deleteSlot(formData: FormData) {
  await assertAdmin();
  const id = str(formData, "id");
  const { error } = await supabaseAdmin.from("schedule_slots").delete().eq("id", id);
  if (error) throw new Error(error.message);
  refresh();
}

// ---------- Actualités ----------

export async function saveNews(formData: FormData) {
  await assertAdmin();

  const id = str(formData, "id");
  const payload = {
    title: str(formData, "title"),
    excerpt: str(formData, "excerpt"),
    content: str(formData, "content") || null,
    published: formData.get("published") === "on",
  };

  if (!payload.title || !payload.excerpt) throw new Error("Titre et résumé requis");

  const table = supabaseAdmin.from("news") as any;
  const { error } = id
    ? await table.update(payload).eq("id", id)
    : await table.insert(payload);

  if (error) throw new Error(error.message);
  refresh();
}

export async function deleteNews(formData: FormData) {
  await assertAdmin();
  const id = str(formData, "id");
  const { error } = await supabaseAdmin.from("news").delete().eq("id", id);
  if (error) throw new Error(error.message);
  refresh();
}

// ---------- Documents publics ----------

const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024; // 10 Mo

const ALLOWED_DOCUMENT_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

/** Nettoie un nom de fichier pour un usage sûr dans le Storage. */
function slugifyFileName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9.\-_]/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
}

export async function uploadDocument(formData: FormData) {
  await assertAdmin();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Aucun fichier sélectionné");
  }

  if (file.size > MAX_DOCUMENT_SIZE) {
    throw new Error("Fichier trop volumineux (10 Mo maximum)");
  }

  if (!ALLOWED_DOCUMENT_TYPES.includes(file.type)) {
    throw new Error("Format non autorisé. Utilisez PDF, JPG, PNG ou Word.");
  }

  const title = str(formData, "title") || file.name;
  const safeName = slugifyFileName(file.name);
  const filePath = `${Date.now()}-${safeName}`;

  const { error: uploadError } = await supabaseAdmin.storage
    .from(DOCUMENTS_BUCKET)
    .upload(filePath, file, {
      contentType: file.type,
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) throw new Error(`Upload impossible : ${uploadError.message}`);

  const { error: insertError } = await (supabaseAdmin.from("documents") as any).insert({
    title,
    description: str(formData, "description") || null,
    file_path: filePath,
    file_name: file.name,
    file_size: file.size,
    mime_type: file.type,
    display_order: num(formData, "display_order"),
    is_published: formData.get("is_published") === "on",
  });

  if (insertError) {
    // Évite un fichier orphelin dans le Storage si l'insertion échoue.
    await supabaseAdmin.storage.from(DOCUMENTS_BUCKET).remove([filePath]);
    throw new Error(insertError.message);
  }

  refresh();
}

export async function updateDocument(formData: FormData) {
  await assertAdmin();

  const id = str(formData, "id");
  if (!id) throw new Error("Document introuvable");

  const { error } = await (supabaseAdmin.from("documents") as any)
    .update({
      title: str(formData, "title"),
      description: str(formData, "description") || null,
      display_order: num(formData, "display_order"),
      is_published: formData.get("is_published") === "on",
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  refresh();
}

export async function deleteDocument(formData: FormData) {
  await assertAdmin();

  const id = str(formData, "id");
  const filePath = str(formData, "file_path");

  const { error } = await supabaseAdmin.from("documents").delete().eq("id", id);
  if (error) throw new Error(error.message);

  if (filePath) {
    await supabaseAdmin.storage.from(DOCUMENTS_BUCKET).remove([filePath]);
  }

  refresh();
}

// ---------- Carrousel photo ----------

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 Mo

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

export async function uploadGalleryImage(formData: FormData) {
  await assertAdmin();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Aucune image sélectionnée");
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error("Image trop volumineuse (5 Mo maximum)");
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error("Format non autorisé. Utilisez JPG, PNG, WebP ou AVIF.");
  }

  const safeName = slugifyFileName(file.name);
  const filePath = `${Date.now()}-${safeName}`;

  const { error: uploadError } = await supabaseAdmin.storage
    .from(GALLERY_BUCKET)
    .upload(filePath, file, {
      contentType: file.type,
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) throw new Error(`Upload impossible : ${uploadError.message}`);

  const { error: insertError } = await (supabaseAdmin.from("gallery_images") as any).insert({
    title: str(formData, "title") || null,
    caption: str(formData, "caption") || null,
    file_path: filePath,
    file_name: file.name,
    file_size: file.size,
    mime_type: file.type,
    display_order: num(formData, "display_order"),
    is_published: formData.get("is_published") === "on",
  });

  if (insertError) {
    // Évite une image orpheline dans le Storage si l'insertion échoue.
    await supabaseAdmin.storage.from(GALLERY_BUCKET).remove([filePath]);
    throw new Error(insertError.message);
  }

  refresh();
}

export async function updateGalleryImage(formData: FormData) {
  await assertAdmin();

  const id = str(formData, "id");
  if (!id) throw new Error("Image introuvable");

  const { error } = await (supabaseAdmin.from("gallery_images") as any)
    .update({
      title: str(formData, "title") || null,
      caption: str(formData, "caption") || null,
      display_order: num(formData, "display_order"),
      is_published: formData.get("is_published") === "on",
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  refresh();
}

export async function deleteGalleryImage(formData: FormData) {
  await assertAdmin();

  const id = str(formData, "id");
  const filePath = str(formData, "file_path");

  const { error } = await supabaseAdmin.from("gallery_images").delete().eq("id", id);
  if (error) throw new Error(error.message);

  if (filePath) {
    await supabaseAdmin.storage.from(GALLERY_BUCKET).remove([filePath]);
  }

  refresh();
}
