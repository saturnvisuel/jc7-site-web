import { createClient } from "@/lib/supabase/client";

export const CERTIFICATE_MAX_SIZE = 5 * 1024 * 1024;

export const CERTIFICATE_ACCEPTED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "application/pdf",
];

/** Message d'erreur si le fichier est refusé, null s'il est valide. */
export function validateCertificate(file: File): string | null {
  if (!CERTIFICATE_ACCEPTED_TYPES.includes(file.type)) {
    return "Format de fichier non valide. Utilisez JPG, PNG ou PDF.";
  }
  if (file.size > CERTIFICATE_MAX_SIZE) {
    return "Le fichier est trop volumineux. Maximum 5 Mo.";
  }
  return null;
}

/**
 * Dépose le certificat dans le bucket privé puis rattache son chemin à
 * l'inscription. On stocke le chemin et non une URL publique : le document
 * est médical, il n'est accessible que via une URL signée côté admin.
 */
export async function attachMedicalCertificate(
  registrationId: string,
  file: File
): Promise<boolean> {
  try {
    const supabase = createClient();
    const extension = file.name.split(".").pop();
    const filePath = `medical-certificates/${registrationId}-${Date.now()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("documents")
      .upload(filePath, file, { cacheControl: "3600", upsert: false });

    if (uploadError) {
      console.error("Erreur upload certificat:", uploadError);
      return false;
    }

    const response = await fetch(`/api/registrations/${registrationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ medical_certificate_url: filePath }),
    });

    return response.ok;
  } catch (error) {
    console.error("Erreur lors de l'envoi du certificat:", error);
    return false;
  }
}
