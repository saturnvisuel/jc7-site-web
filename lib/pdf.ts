import type { jsPDF } from "jspdf";
import { CLUB_INFO } from "@/lib/club-info";

/** Bleu JC7 utilisé pour les titres de section. */
export const ACCENT_COLOR: [number, number, number] = [0, 51, 102];

/** Rouge JC7, repris de l'identité du site. */
export const BRAND_COLOR: [number, number, number] = [185, 28, 28];

export const CLUB_WEBSITE = "jc7.fr";

/** Marges du document, en mm. */
export const MARGIN = 18;
export const CONTENT_WIDTH = 210 - MARGIN * 2;

/**
 * Charge le logo du site depuis /public pour l'intégrer aux PDF.
 * On passe par une requête same-origin : le fichier est servi par le CDN,
 * ce qui évite de dépendre du système de fichiers en environnement serverless.
 * Renvoie null en cas d'échec pour ne jamais bloquer la génération du PDF.
 */
export async function loadClubLogo(request: Request): Promise<string | null> {
  try {
    const response = await fetch(new URL("/JC7_logo.jpg", request.url));
    if (!response.ok) return null;

    const buffer = Buffer.from(await response.arrayBuffer());
    return `data:image/jpeg;base64,${buffer.toString("base64")}`;
  } catch {
    return null;
  }
}

/**
 * En-tête commun : bandeau de marque, logo, identité du club et titre du document.
 * Renvoie l'ordonnée à laquelle le contenu peut commencer.
 */
export function drawPdfHeader(doc: jsPDF, title: string, logo: string | null): number {
  // Bandeau de couleur pleine largeur
  doc.setFillColor(...ACCENT_COLOR);
  doc.rect(0, 0, 210, 34, "F");

  // Liseré rouge sous le bandeau
  doc.setFillColor(...BRAND_COLOR);
  doc.rect(0, 34, 210, 1.5, "F");

  let textX = MARGIN;

  if (logo) {
    // Pastille blanche pour détacher le logo du fond bleu
    doc.setFillColor(255, 255, 255);
    doc.circle(MARGIN + 11, 17, 12, "F");
    doc.addImage(logo, "JPEG", MARGIN + 2, 8, 18, 18);
    textX = MARGIN + 28;
  }

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text("JC7 - JUDO COURNEUVIEN 7", textX, 15);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(CLUB_INFO.fullAddress, textX, 21);
  doc.text(`${CLUB_INFO.email}  |  ${CLUB_WEBSITE}`, textX, 26);

  // Titre du document, sous le bandeau
  doc.setTextColor(...ACCENT_COLOR);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  doc.text(title.toUpperCase(), MARGIN, 48);

  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");

  return 58;
}

/** Titre de section : filet coloré + libellé. Renvoie l'ordonnée suivante. */
export function drawSectionTitle(doc: jsPDF, label: string, y: number): number {
  doc.setFillColor(...BRAND_COLOR);
  doc.rect(MARGIN, y - 4, 2.5, 5.5, "F");

  doc.setTextColor(...ACCENT_COLOR);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(label.toUpperCase(), MARGIN + 5, y);

  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  return y + 8;
}

/** Bloc d'informations sur fond gris clair (libellé / valeur). */
export function drawInfoBlock(
  doc: jsPDF,
  rows: [string, string][],
  y: number
): number {
  const lineHeight = 6;
  const padding = 4;
  const height = rows.length * lineHeight + padding * 2 - 2;

  doc.setFillColor(247, 248, 250);
  doc.roundedRect(MARGIN, y, CONTENT_WIDTH, height, 2, 2, "F");

  let cursor = y + padding + 3;

  for (const [label, value] of rows) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(110, 110, 110);
    doc.text(label, MARGIN + 4, cursor);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 30, 30);
    doc.text(value || "-", MARGIN + 48, cursor);

    cursor += lineHeight;
  }

  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");

  return y + height + 8;
}

/**
 * En-tête Content-Disposition sûr pour un nom de fichier contenant des accents.
 * Les en-têtes HTTP ne transportent pas d'UTF-8 : on fournit une version ASCII
 * (accents translittérés) et la version exacte via filename* (RFC 5987).
 */
export function pdfAttachmentHeader(filename: string): string {
  const ascii =
    filename
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // supprime les diacritiques
      .replace(/[^A-Za-z0-9._-]+/g, "-")
      .replace(/-{2,}/g, "-")
      .replace(/^-|-$/g, "") || "document.pdf";

  return `attachment; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(filename)}`;
}

/**
 * Pied de page commun, appliqué à toutes les pages du document :
 * filet, mentions du club, date de génération et pagination.
 */
export function drawPdfFooter(doc: jsPDF): void {
  const now = new Date();
  const pageCount = doc.getNumberOfPages();

  for (let page = 1; page <= pageCount; page++) {
    doc.setPage(page);

    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.3);
    doc.line(MARGIN, 275, 210 - MARGIN, 275);

    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(120, 120, 120);
    doc.text(
      `${CLUB_INFO.name} - Association loi 1901 - ${CLUB_INFO.email} - ${CLUB_WEBSITE}`,
      MARGIN,
      280
    );
    doc.text(
      `Généré le ${now.toLocaleDateString("fr-FR")} à ${now.toLocaleTimeString("fr-FR")}`,
      MARGIN,
      284
    );
    doc.text(`Page ${page} / ${pageCount}`, 210 - MARGIN, 284, { align: "right" });

    doc.setTextColor(0, 0, 0);
  }
}
