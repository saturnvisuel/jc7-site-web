import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      persistSession: false,
    },
    global: {
      fetch: (...args) => {
        // Désactiver la vérification SSL en développement
        if (process.env.NODE_ENV === 'development') {
          process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
        }
        return fetch(...args);
      },
    },
  }
);

/** Champs qu'un administrateur connecté peut modifier. */
const ADMIN_EDITABLE_FIELDS = [
  "first_name", "last_name", "birth_date", "email", "phone", "phone_alt",
  "address", "postal_code", "city", "category", "belt", "license_number",
  "social_security_number", "medical_note", "medical_certificate_url",
  "guardian_first_name", "guardian_last_name", "guardian_address",
  "guardian_postal_code", "guardian_city", "guardian_phone", "guardian_email",
  "payment_method", "payment_status", "amount",
];

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const supabase = createServerClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Sans session, seul le rattachement du certificat médical est permis :
    // c'est la seule écriture dont le formulaire public a besoin. Autoriser
    // tout le corps laisserait un visiteur passer son inscription en "payée".
    let payload: Record<string, unknown>;

    if (session) {
      payload = Object.fromEntries(
        Object.entries(body).filter(([key]) => ADMIN_EDITABLE_FIELDS.includes(key))
      );
    } else {
      const certificate = body.medical_certificate_url;

      if (typeof certificate !== "string" || !certificate.startsWith("medical-certificates/")) {
        return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
      }

      // Un certificat déjà présent ne peut pas être remplacé sans être admin.
      const { data: existing } = await supabaseAdmin
        .from("registrations")
        .select("medical_certificate_url")
        .eq("id", params.id)
        .single();

      if (!existing) {
        return NextResponse.json({ error: "Inscription non trouvée" }, { status: 404 });
      }

      if ((existing as any).medical_certificate_url) {
        return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
      }

      payload = { medical_certificate_url: certificate };
    }

    if (Object.keys(payload).length === 0) {
      return NextResponse.json({ error: "Aucun champ modifiable fourni" }, { status: 400 });
    }

    const { error } = await (supabaseAdmin
      .from("registrations") as any)
      .update(payload)
      .eq("id", params.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Suppression réservée à l'administration.
    const supabase = createServerClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { error } = await supabaseAdmin
      .from("registrations")
      .delete()
      .eq("id", params.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la suppression" },
      { status: 500 }
    );
  }
}
