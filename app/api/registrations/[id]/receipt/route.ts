import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { jsPDF } from "jspdf";

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

    // Tarifs par catégorie (à ajuster selon vos tarifs réels)
    const tarifs: Record<string, number> = {
      "baby": 150,
      "mini-poussin": 180,
      "poussin": 180,
      "benjamin": 200,
      "minime": 200,
      "cadet": 220,
      "junior": 220,
      "senior": 250,
    };

    const montant = tarifs[registration.category] || 200;

    // Créer le PDF
    const doc = new jsPDF();
    
    let y = 20;
    
    // En-tête simple
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("JC7 - JUDO COURNEUVIEN 7", 105, y, { align: "center" });
    y += 10;
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text("Reçu d'inscription", 105, y, { align: "center" });
    y += 15;
    
    // Numéro d'inscription et date
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`N° d'inscription : ${registration.id.substring(0, 8).toUpperCase()}`, 20, y);
    doc.text(`Date : ${new Date(registration.created_at).toLocaleDateString("fr-FR")}`, 150, y);
    y += 15;
    
    // Ligne de séparation
    doc.setLineWidth(0.5);
    doc.line(20, y, 190, y);
    y += 10;
    
    // INFORMATIONS DU PRATIQUANT
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...accentColor);
    doc.text("INFORMATIONS DU PRATIQUANT", 20, y);
    doc.setTextColor(0, 0, 0);
    y += 10;
    
    doc.setFontSize(11);
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
    
    pratiquantInfo.push(
      `Adresse : ${(registration as any).address || ""}`,
      `${(registration as any).postal_code || ""} ${(registration as any).city || ""}`,
      `Téléphone : ${registration.phone}`,
      `Email : ${registration.email}`
    );
    
    pratiquantInfo.forEach((line) => {
      doc.text(line, 20, y);
      y += 7;
    });
    
    y += 5;
    
    // RESPONSABLE LÉGAL (si applicable)
    if (!(registration as any).is_self_registration && (registration as any).guardian_first_name) {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...accentColor);
      doc.text("RESPONSABLE LÉGAL", 20, y);
      doc.setTextColor(0, 0, 0);
      y += 10;
      
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      
      const guardianInfo = [
        `Nom : ${(registration as any).guardian_last_name}`,
        `Prénom : ${(registration as any).guardian_first_name}`,
        `Téléphone : ${(registration as any).guardian_phone}`,
        `Email : ${(registration as any).guardian_email}`,
      ];
      
      guardianInfo.forEach((line) => {
        doc.text(line, 20, y);
        y += 7;
      });
      
      y += 5;
    }
    
    // DÉTAILS DE L'INSCRIPTION
    y += 5;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...accentColor);
    doc.text("DÉTAILS DE L'INSCRIPTION", 20, y);
    doc.setTextColor(0, 0, 0);
    y += 10;
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    
    // Encadré pour le montant
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(20, y, 170, 30, 3, 3, "F");
    
    y += 10;
    doc.setFontSize(12);
    doc.text("Cotisation annuelle", 30, y);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(`${montant} €`, 160, y, { align: "right" });
    
    y += 12;
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    
    const paymentMethodLabel = 
      (registration as any).payment_method === "carte" ? "Carte bancaire (en ligne)" :
      (registration as any).payment_method === "cheque" ? "Chèque" :
      "Espèces";
    
    doc.text(`Mode de paiement : ${paymentMethodLabel}`, 30, y);
    
    y += 15;
    
    // Statut du paiement
    const isPaid = registration.payment_status === "paid";
    
    if (isPaid) {
      doc.setFillColor(40, 167, 69);
      doc.roundedRect(20, y, 170, 15, 3, 3, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("✓ PAIEMENT REÇU", 105, y + 10, { align: "center" });
      doc.setTextColor(0, 0, 0);
      y += 20;
    } else {
      doc.setFillColor(255, 193, 7);
      doc.roundedRect(20, y, 170, 15, 3, 3, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("⚠ PAIEMENT EN ATTENTE", 105, y + 10, { align: "center" });
      y += 20;
      
      // Instructions de paiement
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      
      if ((registration as any).payment_method === "cheque") {
        doc.text("Merci de remettre votre chèque à l'ordre de 'JC7' lors de votre première séance.", 20, y);
        y += 6;
        doc.text("Le chèque doit être accompagné de ce reçu.", 20, y);
      } else if ((registration as any).payment_method === "especes") {
        doc.text(`Merci de régler ${montant} € en espèces lors de votre première séance.`, 20, y);
        y += 6;
        doc.text("Présentez ce reçu lors du paiement.", 20, y);
      }
      
      y += 10;
    }
    
    // INFORMATIONS PRATIQUES
    y += 10;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...accentColor);
    doc.text("INFORMATIONS PRATIQUES", 20, y);
    doc.setTextColor(0, 0, 0);
    y += 10;
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    
    const infos = [
      "📍 Adresse : Gymnase Municipal, 123 Avenue de la République, 93120 La Courneuve",
      "📞 Téléphone : 01 23 45 67 89",
      "📧 Email : contact@jc7.fr",
      "🌐 Site web : www.jc7.fr",
      "",
      "Horaires d'entraînement :",
      "• Baby Judo : Mercredi 14h-15h",
      "• Mini-Poussins/Poussins : Mercredi 15h-16h, Samedi 10h-11h",
      "• Benjamins/Minimes : Mercredi 16h-17h30, Samedi 11h-12h30",
      "• Cadets/Juniors/Seniors : Mardi/Jeudi 19h-21h",
    ];
    
    infos.forEach((line) => {
      doc.text(line, 20, y);
      y += 5;
    });
    
    // Documents à fournir
    y += 5;
    doc.setFont("helvetica", "bold");
    doc.text("Documents à fournir :", 20, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    
    const documents = [
      "✓ Certificat médical de non contre-indication à la pratique du judo",
      "✓ Photo d'identité",
      "✓ Copie de la licence de l'année précédente (si renouvellement)",
    ];
    
    documents.forEach((line) => {
      doc.text(line, 20, y);
      y += 5;
    });
    
    // Pied de page
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(128, 128, 128);
    doc.text("JC7 - Judo Courneuvien 7 - Association loi 1901", 105, 280, { align: "center" });
    doc.text(`Document généré le ${new Date().toLocaleDateString("fr-FR")} à ${new Date().toLocaleTimeString("fr-FR")}`, 105, 285, { align: "center" });
    
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
