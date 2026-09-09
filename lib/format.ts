/**
 * Utilitaires purs, sans dépendance serveur : importables depuis
 * des composants client comme des composants serveur.
 */

export const DOCUMENTS_BUCKET = "public-documents";

export const GALLERY_BUCKET = "gallery";

export function formatFileSize(bytes: number): string {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}
