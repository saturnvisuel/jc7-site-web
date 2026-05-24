import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const memberRegistrationSchema = z.object({
  first_name: z.string().min(2),
  last_name: z.string().min(2),
  birth_date: z.string(),
  email: z.string().email(),
  phone: z.string().min(10),
  emergency_contact: z.string().min(5),
  category: z.string().min(1),
  medical_note: z.string().nullable().optional(),
  relation_to_member: z.string().min(1),
});

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const validatedData = memberRegistrationSchema.parse(body);

    const { data: registration, error: dbError } = await (supabase
      .from("registrations") as any)
      .insert({
        ...validatedData,
        payment_status: "pending",
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        { error: "Erreur lors de l'enregistrement" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      registrationId: registration.id,
    });
  } catch (error) {
    console.error("Member registration error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Erreur lors de l'inscription" },
      { status: 500 }
    );
  }
}
