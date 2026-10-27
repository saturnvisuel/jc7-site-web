import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();

    // Vérifier l'authentification
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { filePath } = await request.json();

    if (typeof filePath !== "string" || !filePath) {
      return NextResponse.json({ error: "Chemin du fichier requis" }, { status: 400 });
    }

    // Pas de remontée d'arborescence : on reste dans le dossier des certificats.
    if (!filePath.startsWith("medical-certificates/") || filePath.includes("..")) {
      return NextResponse.json({ error: "Chemin non autorisé" }, { status: 403 });
    }

    // La session vient d'être vérifiée : on signe avec la clé de service pour
    // ne pas dépendre des policies de stockage côté utilisateur.
    const { data, error } = await supabaseAdmin.storage
      .from("documents")
      .createSignedUrl(filePath, 3600); // 1 heure

    if (error) {
      console.error('Erreur création URL signée:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ signedUrl: data.signedUrl });
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
