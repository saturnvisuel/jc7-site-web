import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { jsPDF } from "jspdf";
import { getCategoryLabel, getTarif } from "@/lib/categories";
import {
  ACCENT_COLOR,
  CLUB_WEBSITE,
  CONTENT_WIDTH,
  MARGIN,
  drawInfoBlock,
  drawPdfFooter,
  drawPdfHeader,
  drawSectionTitle,
  loadClubLogo,
  pdfAttachmentHeader,
} from "@/lib/pdf";
import { CLUB_INFO } from "@/lib/club-info";

// Client Supabase sans authentification pour les reçus publics
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  carte: "Carte bancaire (en ligne)",
  cheque: "Chèque",
  especes: "Espèces",
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: registration, error } = await supabaseAdmin
      .from("registrations")
      .select("*")
      .eq("id", params.id)
      .single();

    if (error || !registration) {
      return NextResponse.json({ error: "Inscription non trouvée" }, { status: 404 });
    }

    const reg = registration as any;

    // Montant figé à l'inscription (réductions familiales comprises).
    // Repli sur la grille tarifaire pour les inscriptions antérieures à la
    // migration 010, qui n'ont pas de montant enregistré.
    const montant = reg.amount ?? getTarif(registration.category);
    const isPaid = registration.payment_status === "paid";

    const doc = new jsPDF();
    const logo = await loadClubLogo(request);

    let y = drawPdfHeader(doc, "Reçu d'inscription", logo);

    // Référence et date d'émission
    doc.setFontSize(9);
    doc.setTextColor(110, 110, 110);
    doc.text(
      `Référence : ${registration.id.substring(0, 8).toUpperCase()}`,
      MARGIN,
      y
    );
    doc.text(
      `Inscription du ${new Date(registration.created_at).toLocaleDateString("fr-FR")}`,
      210 - MARGIN,
      y,
      { align: "right" }
    );
    doc.setTextColor(0, 0, 0);
    y += 10;

    // Pratiquant
    y = drawSectionTitle(doc, "Informations du pratiquant", y);

    const pratiquantRows: [string, string][] = [
      ["Nom et prénom", `${registration.last_name} ${registration.first_name}`],
      [
        "Date de naissance",
        new Date(registration.birth_date).toLocaleDateString("fr-FR"),
      ],
      ["Catégorie", getCategoryLabel(registration.category)],
    ];

    if (reg.belt) pratiquantRows.push(["Ceinture", reg.belt]);
    if (reg.license_number) pratiquantRows.push(["N° de licence", reg.license_number]);

    pratiquantRows.push(
      ["Adresse", `${reg.address || ""}`.trim()],
      ["Code postal, ville", `${reg.postal_code || ""} ${reg.city || ""}`.trim()],
      ["Téléphone", registration.phone],
      ["Email", registration.email]
    );

    if (reg.social_security_number) {
      pratiquantRows.push(["N° sécurité sociale", reg.social_security_number]);
    }

    y = drawInfoBlock(doc, pratiquantRows, y);

    // Responsable légal
    if (!reg.is_self_registration && reg.guardian_first_name) {
      y = drawSectionTitle(doc, "Responsable légal", y);
      y = drawInfoBlock(
        doc,
        [
          [
            "Nom et prénom",
            `${reg.guardian_last_name || ""} ${reg.guardian_first_name || ""}`.trim(),
          ],
          ["Téléphone", reg.guardian_phone || ""],
          ["Email", reg.guardian_email || ""],
        ],
        y
      );
    }

    // Règlement
    y = drawSectionTitle(doc, "Règlement", y);

    // Encadré du montant
    doc.setFillColor(...ACCENT_COLOR);
    doc.roundedRect(MARGIN, y, CONTENT_WIDTH, 20, 2, 2, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Cotisation annuelle 2025-2026", MARGIN + 6, y + 8);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(`${montant} €`, 210 - MARGIN - 6, y + 13, { align: "right" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(
      `Mode de paiement : ${
        PAYMENT_METHOD_LABELS[reg.payment_method] || reg.payment_method || "-"
      }`,
      MARGIN + 6,
      y + 15
    );

    doc.setTextColor(0, 0, 0);
    y += 26;

    // Statut du paiement
    if (isPaid) {
      doc.setFillColor(22, 128, 61);
    } else {
      doc.setFillColor(180, 83, 9);
    }
    doc.roundedRect(MARGIN, y, CONTENT_WIDTH, 11, 2, 2, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(isPaid ? "PAIEMENT REÇU" : "PAIEMENT EN ATTENTE", 105, y + 7.5, {
      align: "center",
    });
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    y += 17;

    if (!isPaid) {
      doc.setFontSize(9);
      const instructions =
        reg.payment_method === "cheque"
          ? `Merci de remettre votre chèque de ${montant} € à l'ordre de JC7 lors de la première séance, accompagné de ce reçu.`
          : `Merci de régler ${montant} € en espèces lors de la première séance et de présenter ce reçu.`;

      doc.text(doc.splitTextToSize(instructions, CONTENT_WIDTH), MARGIN, y);
      y += 10;
    }

    // Documents à fournir
    y = drawSectionTitle(doc, "Documents à fournir", y);
    doc.setFontSize(9.5);

    const documents = [
      "Certificat médical de non-contre-indication à la pratique du judo, si il n'a pas été fourni lors de l'inscription.",
      "Une photo d'identité",
      "Copie de la licence de l'année précédente, en cas de renouvellement",
    ];

    for (const line of documents) {
      doc.setFillColor(...ACCENT_COLOR);
      doc.circle(MARGIN + 1.5, y - 1.2, 0.9, "F");
      doc.text(doc.splitTextToSize(line, CONTENT_WIDTH - 8), MARGIN + 6, y);
      y += 6;
    }

    y += 4;

    // Informations pratiques
    y = drawSectionTitle(doc, "Informations pratiques", y);
    y = drawInfoBlock(
      doc,
      [
        ["Lieu des cours", CLUB_INFO.address],
        ["Adresse", `${CLUB_INFO.street}, ${CLUB_INFO.postalCode} ${CLUB_INFO.city}`],
        ["Contact", CLUB_INFO.email],
        ["Horaires à jour", `${CLUB_WEBSITE}/cours`],
      ],
      y
    );

    drawPdfFooter(doc);

    const pdfBuffer = doc.output("arraybuffer");

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": pdfAttachmentHeader(
          `recu-inscription-jc7-${registration.last_name}.pdf`
        ),
      },
    });
  } catch (error) {
    console.error("Receipt generation error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération du reçu" },
      { status: 500 }
    );
  }
}
