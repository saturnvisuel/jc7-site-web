import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { jsPDF } from "jspdf";
import { computeAmounts, getCategoryLabel, getTarif } from "@/lib/categories";
import {
  ACCENT_COLOR,
  CONTENT_WIDTH,
  MARGIN,
  drawInfoBlock,
  drawPdfFooter,
  drawPdfHeader,
  drawSectionTitle,
  loadClubLogo,
  pdfAttachmentHeader,
} from "@/lib/pdf";

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  carte: "Carte bancaire (en ligne)",
  cheque: "Chèque",
  especes: "Espèces",
};

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      persistSession: false,
    },
  }
);

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const registrationId = params.id;

    // Récupérer l'inscription principale
    const { data: registration, error } = await supabaseAdmin
      .from("registrations")
      .select("*")
      .eq("id", registrationId)
      .single();

    if (error || !registration) {
      return NextResponse.json(
        { error: "Inscription non trouvée" },
        { status: 404 }
      );
    }

    // Récupérer toutes les inscriptions de la même famille (même email responsable)
    const { data: familyRegistrations, error: familyError } = await supabaseAdmin
      .from("registrations")
      .select("*")
      .eq("guardian_email", registration.guardian_email)
      .eq("created_at", registration.created_at)
      .order("created_at", { ascending: true });

    if (familyError) {
      return NextResponse.json(
        { error: "Erreur lors de la récupération des inscriptions" },
        { status: 500 }
      );
    }

    const registrations = familyRegistrations || [registration];
    const isFamily = registrations.length > 1;

    // Créer le PDF
    const doc = new jsPDF();
    const logo = await loadClubLogo(request);

    let yPos = drawPdfHeader(
      doc,
      isFamily ? "Reçu d'inscription familiale" : "Reçu d'inscription",
      logo
    );

    // Référence et date
    doc.setFontSize(9);
    doc.setTextColor(110, 110, 110);
    doc.text(`Référence : ${registration.id.substring(0, 8).toUpperCase()}`, MARGIN, yPos);
    doc.text(
      `Inscription du ${new Date(registration.created_at).toLocaleDateString("fr-FR")}`,
      210 - MARGIN,
      yPos,
      { align: "right" }
    );
    doc.setTextColor(0, 0, 0);
    yPos += 10;

    // Responsable légal
    yPos = drawSectionTitle(doc, "Responsable légal", yPos);
    yPos = drawInfoBlock(
      doc,
      [
        [
          "Nom et prénom",
          `${registration.guardian_last_name || ""} ${registration.guardian_first_name || ""}`.trim(),
        ],
        ["Adresse", `${registration.guardian_address || ""}`.trim()],
        [
          "Code postal, ville",
          `${registration.guardian_postal_code || ""} ${registration.guardian_city || ""}`.trim(),
        ],
        ["Téléphone", registration.guardian_phone || ""],
        ["Email", registration.guardian_email || ""],
      ],
      yPos
    );

    // Détail des inscriptions, présenté en tableau
    yPos = drawSectionTitle(doc, isFamily ? "Inscriptions" : "Inscription", yPos);

    // En-tête du tableau
    doc.setFillColor(...ACCENT_COLOR);
    doc.rect(MARGIN, yPos - 4, CONTENT_WIDTH, 7, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("Pratiquant", MARGIN + 3, yPos);
    doc.text("Catégorie", MARGIN + 70, yPos);
    doc.text("Montant", 210 - MARGIN - 3, yPos, { align: "right" });
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    yPos += 9;

    // Montants figés à l'inscription ; repli sur le calcul de référence pour
    // les inscriptions antérieures à la migration 010.
    const fallbackAmounts = computeAmounts(registrations.map((reg: any) => reg.category));
    const amounts = registrations.map(
      (reg: any, index: number) => reg.amount ?? fallbackAmounts[index]
    );
    const totalAmount = amounts.reduce((sum: number, amount: number) => sum + amount, 0);

    registrations.forEach((reg, index) => {
      const tarif = amounts[index];
      const hasDiscount = tarif < getTarif(reg.category, 1);

      // Fond alterné pour la lisibilité
      if (index % 2 === 1) {
        doc.setFillColor(247, 248, 250);
        doc.rect(MARGIN, yPos - 4.5, CONTENT_WIDTH, 11, "F");
      }

      doc.setFontSize(9.5);
      doc.setFont("helvetica", "bold");
      doc.text(`${reg.last_name} ${reg.first_name}`, MARGIN + 3, yPos);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(110, 110, 110);
      doc.text(
        `né(e) le ${new Date(reg.birth_date).toLocaleDateString("fr-FR")}`,
        MARGIN + 3,
        yPos + 4
      );
      doc.setTextColor(0, 0, 0);

      doc.setFontSize(9);
      doc.text(
        doc.splitTextToSize(getCategoryLabel(reg.category), 55),
        MARGIN + 70,
        yPos
      );

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(`${tarif} €`, 210 - MARGIN - 3, yPos, { align: "right" });
      doc.setFont("helvetica", "normal");

      if (hasDiscount) {
        doc.setFontSize(7.5);
        doc.setTextColor(22, 128, 61);
        doc.text("réduction familiale", 210 - MARGIN - 3, yPos + 4, {
          align: "right",
        });
        doc.setTextColor(0, 0, 0);
      }

      yPos += 12;

      if (yPos > 240) {
        doc.addPage();
        yPos = 30;
      }
    });

    // Total
    doc.setFillColor(...ACCENT_COLOR);
    doc.roundedRect(MARGIN, yPos, CONTENT_WIDTH, 16, 2, 2, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Total à régler", MARGIN + 6, yPos + 10);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(`${totalAmount} €`, 210 - MARGIN - 6, yPos + 11, { align: "right" });
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    yPos += 22;

    // Règlement
    yPos = drawSectionTitle(doc, "Règlement", yPos);
    yPos = drawInfoBlock(
      doc,
      [
        [
          "Mode de paiement",
          PAYMENT_METHOD_LABELS[registration.payment_method] ||
            registration.payment_method ||
            "-",
        ],
        ["Statut", registration.payment_status === "paid" ? "Payé" : "En attente"],
      ],
      yPos
    );

    if (registration.payment_status !== "paid") {
      doc.setFontSize(9);
      const instructions =
        registration.payment_method === "cheque"
          ? `Merci de remettre votre chèque de ${totalAmount} € à l'ordre de JC7 lors de la première séance, accompagné de ce reçu.`
          : `Merci de régler ${totalAmount} € en espèces lors de la première séance et de présenter ce reçu.`;
      doc.text(doc.splitTextToSize(instructions, CONTENT_WIDTH), MARGIN, yPos);
    }

    drawPdfFooter(doc);

    // Générer le PDF
    const pdfBuffer = doc.output("arraybuffer");

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": pdfAttachmentHeader(
          `recu_inscription_${registration.last_name}_${new Date().getTime()}.pdf`
        ),
      },
    });
  } catch (error) {
    console.error("Erreur génération PDF:", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération du reçu" },
      { status: 500 }
    );
  }
}
