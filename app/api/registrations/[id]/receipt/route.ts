import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { jsPDF } from "jspdf";
import { getTarif } from "@/lib/categories";
import { CLUB_INFO } from "@/lib/club-info";

// Client Supabase sans authentification pour les reçus publics
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Récupérer l'inscription
    const { data: registration, error } = await supabaseAdmin
      .from("registrations")
      .select("*")
      .eq("id", params.id)
      .single();

    if (error || !registration) {
      return NextResponse.json(
        { error: "Inscription non trouvée" },
        { status: 404 }
      );
    }

    const montant = getTarif(registration.category);

    // Créer le PDF
    const doc = new jsPDF();
    
    let y = 20;
    
    // En-tête
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("JC7 - JUDO COURNEUVIEN 7", 105, y, { align: "center" });
    y += 8;
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Reçu d'inscription", 105, y, { align: "center" });
    y += 12;
    
    // Numéro et date
    doc.setFontSize(10);
    doc.text(`N° : ${registration.id.substring(0, 8).toUpperCase()}`, 20, y);
    doc.text(`Date : ${new Date(registration.created_at).toLocaleDateString("fr-FR")}`, 150, y);
    y += 10;
    
    doc.line(20, y, 190, y);
    y += 10;
    
    // Informations du pratiquant
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("INFORMATIONS DU PRATIQUANT", 20, y);
    y += 8;
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    
    const pratiquantInfo = [
      `Nom : ${registration.last_name}`,
      `Prénom : ${registration.first_name}`,
      `Date de naissance : ${new Date(registration.birth_date).toLocaleDateString("fr-FR")}`,
      `Catégorie : ${registration.category}`,
    ];
    
    if ((registration as any).belt) {
      pratiquantInfo.push(`Ceinture : ${(registration as any).belt}`);
    }
    
    if ((registration as any).address) {
      pratiquantInfo.push(`Adresse : ${(registration as any).address}`);
      pratiquantInfo.push(`${(registration as any).postal_code || ""} ${(registration as any).city || ""}`);
    }
    
    pratiquantInfo.push(
      `Téléphone : ${registration.phone}`,
      `Email : ${registration.email}`
    );
    
    pratiquantInfo.forEach((line) => {
      doc.text(line, 20, y);
      y += 6;
    });
    
    y += 5;
    
    // Responsable légal
    if (!(registration as any).is_self_registration && (registration as any).guardian_first_name) {
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("RESPONSABLE LÉGAL", 20, y);
      y += 8;
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      
      const guardianInfo = [
        `Nom : ${(registration as any).guardian_last_name}`,
        `Prénom : ${(registration as any).guardian_first_name}`,
        `Téléphone : ${(registration as any).guardian_phone}`,
        `Email : ${(registration as any).guardian_email}`,
      ];
      
      guardianInfo.forEach((line) => {
        doc.text(line, 20, y);
        y += 6;
      });
      
      y += 5;
    }
    
    // Détails de l'inscription
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("DÉTAILS DE L'INSCRIPTION", 20, y);
    y += 8;
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    
    doc.text("Cotisation annuelle :", 20, y);
    doc.setFont("helvetica", "bold");
    doc.text(`${montant} €`, 80, y);
    y += 8;
    
    doc.setFont("helvetica", "normal");
    const paymentMethodLabel = 
      (registration as any).payment_method === "carte" ? "Carte bancaire" :
      (registration as any).payment_method === "cheque" ? "Chèque" :
      "Espèces";
    
    doc.text(`Mode de paiement : ${paymentMethodLabel}`, 20, y);
    y += 8;
    
    const isPaid = registration.payment_status === "paid";
    doc.setFont("helvetica", "bold");
    doc.text(`Statut : ${isPaid ? "PAIEMENT REÇU" : "PAIEMENT EN ATTENTE"}`, 20, y);
    y += 10;
    
    if (!isPaid) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      
      if ((registration as any).payment_method === "cheque") {
        doc.text("Merci de remettre votre chèque à l'ordre de 'JC7' lors de votre première séance.", 20, y);
      } else if ((registration as any).payment_method === "especes") {
        doc.text(`Merci de régler ${montant} € en espèces lors de votre première séance.`, 20, y);
      }
      
      y += 8;
    }
    
    // Informations pratiques
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("INFORMATIONS PRATIQUES", 20, y);
    y += 8;
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    
    const infos = [
      `Adresse : ${CLUB_INFO.fullAddress}`,
      `Téléphone : ${CLUB_INFO.phone}`,
      `Email : ${CLUB_INFO.email}`,
    ];
    
    infos.forEach((line) => {
      doc.text(line, 20, y);
      y += 5;
    });
    
    y += 3;
    doc.setFont("helvetica", "bold");
    doc.text("Documents à fournir :", 20, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    
    const documents = [
      "- Certificat médical de non contre-indication à la pratique du judo",
      "- Photo d'identité",
      "- Copie de la licence de l'année précédente (si renouvellement)",
    ];
    
    documents.forEach((line) => {
      doc.text(line, 20, y);
      y += 5;
    });
    
    // Pied de page
    doc.setFontSize(8);
    doc.text("JC7 - Judo Courneuvien 7 - Association loi 1901", 105, 280, { align: "center" });
    doc.text(`Document généré le ${new Date().toLocaleDateString("fr-FR")}`, 105, 285, { align: "center" });
    
    // Générer le PDF en buffer
    const pdfBuffer = doc.output("arraybuffer");
    
    // Retourner le PDF
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="recu-inscription-jc7-${registration.last_name}.pdf"`,
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
