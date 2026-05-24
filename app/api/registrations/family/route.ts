import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getTarif } from "@/lib/categories";

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("📝 Données reçues:", JSON.stringify(body, null, 2));
    
    const { children, guardian, payment_method } = body;

    if (!children || !Array.isArray(children) || children.length === 0) {
      return NextResponse.json(
        { error: "Au moins un enfant est requis" },
        { status: 400 }
      );
    }

    const registrationIds: string[] = [];
    let childCount = 0;
    let totalAmount = 0;

    for (const child of children) {
      // Ne compter que les enfants qui bénéficient des réductions (pas les baby ni les seniors)
      if (child.category !== "senior" && child.category !== "baby") {
        childCount++;
      }

      const tarif = getTarif(
        child.category,
        (child.category !== "senior" && child.category !== "baby") ? childCount : 1
      );

      totalAmount += tarif;

      console.log(`👶 Traitement enfant ${childCount}:`, {
        firstName: child.firstName,
        lastName: child.lastName,
        category: child.category,
        socialSecurityNumber: child.socialSecurityNumber,
      });

      const { data: registration, error } = await (supabaseAdmin
        .from("registrations") as any)
        .insert({
          first_name: child.firstName,
          last_name: child.lastName,
          birth_date: child.birthDate,
          category: child.category,
          belt: child.belt || null,
          address: guardian.address,
          postal_code: guardian.postal_code,
          city: guardian.city,
          phone: guardian.phone,
          email: guardian.email,
          social_security_number: child.socialSecurityNumber,
          medical_note: child.medicalNote || null,
          payment_method: payment_method,
          payment_status: "pending",
          is_self_registration: false,
          guardian_first_name: guardian.first_name,
          guardian_last_name: guardian.last_name,
          guardian_address: guardian.address,
          guardian_postal_code: guardian.postal_code,
          guardian_city: guardian.city,
          guardian_phone: guardian.phone,
          guardian_email: guardian.email,
        })
        .select()
        .single();

      if (error || !registration) {
        console.error("❌ Supabase error:", error);
        return NextResponse.json(
          { error: `Erreur lors de l'inscription: ${error?.message || "Données non retournées"}` },
          { status: 500 }
        );
      }

      console.log("✅ Enfant enregistré:", registration.id);

      registrationIds.push(registration.id);
    }

    if (payment_method === "carte") {
      const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: children.map((child: any, index: number) => {
          const childNum = child.category !== "senior" ? index + 1 : 1;
          const tarif = getTarif(child.category, childNum);

          return {
            price_data: {
              currency: "eur",
              product_data: {
                name: `Inscription Judo - ${child.firstName} ${child.lastName}`,
                description: `Catégorie: ${child.category}${
                  childNum > 1 ? ` (${childNum}ème enfant - réduction appliquée)` : ""
                }`,
              },
              unit_amount: tarif * 100,
            },
            quantity: 1,
          };
        }),
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/inscription/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/inscription`,
        metadata: {
          registration_ids: registrationIds.join(","),
          type: "family",
        },
      });

      for (const regId of registrationIds) {
        await supabaseAdmin
          .from("registrations")
          .update({ stripe_session_id: session.id })
          .eq("id", regId);
      }

      return NextResponse.json({
        success: true,
        checkoutUrl: session.url,
        registrationIds,
      });
    }

    return NextResponse.json({
      success: true,
      registrationIds,
      totalAmount,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'inscription" },
      { status: 500 }
    );
  }
}
