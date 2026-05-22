import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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

    const { registrationId, paymentDate, paymentNote } = await request.json();

    const { error } = await supabase
      .from("registrations")
      .update({
        payment_status: "paid",
      })
      .eq("id", registrationId);

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Erreur lors de la validation" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Validate payment error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la validation du paiement" },
      { status: 500 }
    );
  }
}
