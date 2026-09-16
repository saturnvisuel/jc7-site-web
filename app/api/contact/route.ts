import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase/admin";

const contactSchema = z.object({
  prenom: z.string().trim().min(2, "Prénom requis").max(100),
  nom: z.string().trim().min(2, "Nom requis").max(100),
  email: z.string().trim().email("Email invalide").max(255),
  telephone: z.string().trim().max(30).optional().or(z.literal("")),
  age: z.string().trim().max(20).optional().or(z.literal("")),
  sujet: z.string().trim().min(1, "Sujet requis").max(100),
  message: z.string().trim().min(10, "Message trop court").max(5000),
  newsletter: z.boolean().optional(),
  rgpd: z.literal(true, {
    errorMap: () => ({ message: "Vous devez accepter l'utilisation de vos données" }),
  }),
  // Champ piège : rempli uniquement par les robots
  website: z.string().max(0).optional().or(z.literal("")),
});

export async function POST(request: NextRequest) {
  try {
    const parsed = contactSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Données invalides" },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Robot détecté : on répond OK sans rien enregistrer
    if (data.website) {
      return NextResponse.json({ success: true });
    }

    const { error } = await supabaseAdmin.from("contact_messages").insert({
      first_name: data.prenom,
      last_name: data.nom,
      email: data.email,
      phone: data.telephone || null,
      age_range: data.age || null,
      subject: data.sujet,
      message: data.message,
      newsletter: Boolean(data.newsletter),
    });

    if (error) {
      console.error("Contact message error:", error);
      return NextResponse.json(
        { error: "Erreur lors de l'enregistrement du message" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact route error:", error);
    return NextResponse.json({ error: "Erreur lors de l'envoi du message" }, { status: 500 });
  }
}
