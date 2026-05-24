import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { jsPDF } from "jspdf";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    // Récupérer l'inscription
    const { data: registration, error } = await supabase
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

    // Cast pour éviter les erreurs TypeScript
    const reg = registration as any;

    // Créer le PDF
    const doc = new jsPDF();
    
    // En-tête
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("FICHE D'INSCRIPTION", 105, 20, { align: "center" });
    doc.text("JC7 - JUDO COURNEUVIEN 7", 105, 30, { align: "center" });
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Date d'inscription : ${new Date(reg.created_at).toLocaleDateString("fr-FR")}`, 105, 40, { align: "center" });
    
    // Ligne de séparation
    doc.setLineWidth(0.5);
    doc.line(20, 45, 190, 45);
    
    let y = 55;
    
    // INFORMATIONS DU PRATIQUANT
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("INFORMATIONS DU PRATIQUANT", 20, y);
    y += 10;
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    
    doc.text(`Nom : ${reg.last_name}`, 20, y);
    y += 7;
    doc.text(`Prénom : ${reg.first_name}`, 20, y);
    y += 7;
    doc.text(`Date de naissance : ${new Date(reg.birth_date).toLocaleDateString("fr-FR")}`, 20, y);
    y += 7;
    doc.text(`Catégorie d'âge : ${reg.category}`, 20, y);
    y += 7;
    
    if (reg.belt) {
      doc.text(`Ceinture : ${reg.belt}`, 20, y);
      y += 7;
    }
    
    if (reg.license_number) {
      doc.text(`Numéro de licence : ${reg.license_number}`, 20, y);
      y += 7;
    }
    
    doc.text(`Adresse : ${reg.address}`, 20, y);
    y += 7;
    doc.text(`Code postal : ${reg.postal_code}`, 20, y);
    doc.text(`Ville : ${reg.city}`, 100, y);
    y += 7;
    doc.text(`Téléphone : ${reg.phone}`, 20, y);
    y += 7;
    
    if (reg.phone_alt) {
      doc.text(`Téléphone 2 : ${reg.phone_alt}`, 20, y);
      y += 7;
    }
    
    doc.text(`Email : ${reg.email}`, 20, y);
    y += 7;
    doc.text(`Numéro de sécurité sociale : ${reg.social_security_number}`, 20, y);
    y += 12;
    
    // RESPONSABLE LÉGAL
    if (!reg.is_self_registration && reg.guardian_first_name) {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("RESPONSABLE LÉGAL", 20, y);
      y += 10;
      
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      
      doc.text(`Nom : ${reg.guardian_last_name}`, 20, y);
      y += 7;
      doc.text(`Prénom : ${reg.guardian_first_name}`, 20, y);
      y += 7;
      doc.text(`Adresse : ${reg.guardian_address}`, 20, y);
      y += 7;
      doc.text(`Code postal : ${reg.guardian_postal_code}`, 20, y);
      doc.text(`Ville : ${reg.guardian_city}`, 100, y);
      y += 7;
      doc.text(`Téléphone : ${reg.guardian_phone}`, 20, y);
      y += 7;
      doc.text(`Email : ${reg.guardian_email}`, 20, y);
      y += 12;
    } else {
      doc.setFontSize(11);
      doc.setFont("helvetica", "italic");
      doc.text("Inscription pour soi-même", 20, y);
      y += 12;
    }
    
    // INFORMATIONS MÉDICALES
    if (reg.medical_note) {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("INFORMATIONS MÉDICALES", 20, y);
      y += 10;
      
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      
      const splitNote = doc.splitTextToSize(reg.medical_note, 170);
      doc.text(splitNote, 20, y);
      y += splitNote.length * 7 + 5;
    }
    
    // PAIEMENT
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("PAIEMENT", 20, y);
    y += 10;
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    
    const paymentMethodLabel = 
      reg.payment_method === "carte" ? "Carte bancaire (en ligne)" :
      reg.payment_method === "cheque" ? "Chèque" :
      "Espèces";
    
    doc.text(`Mode de paiement : ${paymentMethodLabel}`, 20, y);
    y += 7;
    
    const paymentStatusLabel = 
      reg.payment_status === "paid" ? "Payé ✓" :
      reg.payment_status === "pending" ? "En attente" :
      "Annulé";
    
    doc.text(`Statut : ${paymentStatusLabel}`, 20, y);
    
    // Pied de page
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.text("JC7 - Judo Courneuvien 7", 105, 280, { align: "center" });
    doc.text("Document généré automatiquement", 105, 285, { align: "center" });
    
    // Générer le PDF en buffer
    const pdfBuffer = doc.output("arraybuffer");
    
    // Retourner le PDF
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="inscription-${reg.last_name}-${reg.first_name}.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération du PDF" },
      { status: 500 }
    );
  }
}
