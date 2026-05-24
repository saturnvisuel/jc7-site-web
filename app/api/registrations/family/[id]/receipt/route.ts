import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { jsPDF } from "jspdf";
import { getTarif } from "@/lib/categories";

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
    let yPos = 20;

    // En-tête
    doc.setFontSize(20);
    doc.text("REÇU D'INSCRIPTION", 105, yPos, { align: "center" });
    yPos += 10;

    doc.setFontSize(16);
    doc.text("JC7 - Judo Courneuvien 7", 105, yPos, { align: "center" });
    yPos += 15;

    // Informations du responsable légal
    doc.setFontSize(12);
    doc.text("RESPONSABLE LÉGAL", 20, yPos);
    yPos += 8;

    doc.setFontSize(10);
    doc.text(`${registration.guardian_first_name} ${registration.guardian_last_name}`, 20, yPos);
    yPos += 6;
    doc.text(`${registration.guardian_address}`, 20, yPos);
    yPos += 6;
    doc.text(`${registration.guardian_postal_code} ${registration.guardian_city}`, 20, yPos);
    yPos += 6;
    doc.text(`Tél: ${registration.guardian_phone}`, 20, yPos);
    yPos += 6;
    doc.text(`Email: ${registration.guardian_email}`, 20, yPos);
    yPos += 12;

    // Ligne de séparation
    doc.line(20, yPos, 190, yPos);
    yPos += 10;

    // Titre des inscriptions
    doc.setFontSize(12);
    doc.text(isFamily ? "INSCRIPTIONS" : "INSCRIPTION", 20, yPos);
    yPos += 10;

    // Liste des inscriptions
    let childCount = 0;
    let totalAmount = 0;

    registrations.forEach((reg, index) => {
      if (reg.category !== "senior") {
        childCount++;
      }

      const tarif = getTarif(
        reg.category,
        reg.category !== "senior" ? childCount : 1
      );
      totalAmount += tarif;

      doc.setFontSize(10);
      doc.text(`${index + 1}. ${reg.first_name} ${reg.last_name}`, 20, yPos);
      yPos += 6;
      doc.text(`   Date de naissance: ${new Date(reg.birth_date).toLocaleDateString("fr-FR")}`, 20, yPos);
      yPos += 6;
      doc.text(`   Catégorie: ${reg.category}`, 20, yPos);
      yPos += 6;
      
      if (isFamily && childCount > 1 && reg.category !== "senior") {
        doc.text(`   Montant: ${tarif} € (réduction ${childCount}ème enfant)`, 20, yPos);
      } else {
        doc.text(`   Montant: ${tarif} €`, 20, yPos);
      }
      yPos += 10;

      // Nouvelle page si nécessaire
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
    });

    // Ligne de séparation
    yPos += 5;
    doc.line(20, yPos, 190, yPos);
    yPos += 10;

    // Total
    doc.setFontSize(14);
    doc.text(`TOTAL: ${totalAmount} €`, 20, yPos);
    yPos += 10;

    // Mode de paiement
    doc.setFontSize(10);
    const paymentMethodLabels: Record<string, string> = {
      carte: "Carte bancaire",
      cheque: "Chèque",
      especes: "Espèces",
    };
    doc.text(
      `Mode de paiement: ${paymentMethodLabels[registration.payment_method] || registration.payment_method}`,
      20,
      yPos
    );
    yPos += 6;

    doc.text(
      `Statut: ${registration.payment_status === "paid" ? "Payé" : "En attente"}`,
      20,
      yPos
    );
    yPos += 15;

    // Date d'émission
    doc.setFontSize(8);
    doc.text(
      `Reçu émis le ${new Date().toLocaleDateString("fr-FR")} à ${new Date().toLocaleTimeString("fr-FR")}`,
      20,
      yPos
    );

    // Pied de page
    doc.setFontSize(8);
    doc.text("JC7 - Judo Courneuvien 7", 105, 280, { align: "center" });
    doc.text("www.jc7.fr", 105, 285, { align: "center" });

    // Générer le PDF
    const pdfBuffer = doc.output("arraybuffer");

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="recu_inscription_${registration.last_name}_${new Date().getTime()}.pdf"`,
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
