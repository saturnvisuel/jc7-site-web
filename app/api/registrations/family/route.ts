import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { computeAmounts, getCategoryLabel } from "@/lib/categories";
import { isPaymentMethodAllowed } from "@/lib/payment-server";

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

    // Le paiement par carte peut être désactivé côté club : on refuse avant
    // tout enregistrement pour ne pas créer d'inscriptions orphelines.
    if (!(await isPaymentMethodAllowed(payment_method))) {
      return NextResponse.json(
        { error: "Ce mode de paiement n'est pas disponible actuellement." },
        { status: 400 }
      );
    }

    const registrationIds: string[] = [];

    // Identifiant commun à la fratrie : indispensable pour que le reçu
    // familial retrouve toutes les inscriptions de cette soumission.
    const familyId = randomUUID();

    // Calcul unique des montants : ils sont ensuite figés en base et repris
    // tels quels par Stripe et par les reçus PDF.
    const amounts = computeAmounts(children.map((child: any) => child.category));
    const totalAmount = amounts.reduce((sum: number, amount: number) => sum + amount, 0);

    for (const [index, child] of children.entries()) {
      const tarif = amounts[index];

      const { data: registration, error } = await (supabaseAdmin
        .from("registrations") as any)
        .insert({
          amount: tarif,
          family_id: familyId,
          first_name: child.firstName,
          last_name: child.lastName,
          birth_date: child.birthDate,
          category: child.category,
          belt: child.belt || null,
          license_number: child.licenseNumber || null,
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
          const tarif = amounts[index];

          return {
            price_data: {
              currency: "eur",
              product_data: {
                name: `Inscription Judo - ${child.firstName} ${child.lastName}`,
                description: `Catégorie: ${getCategoryLabel(child.category)}`,
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
        await (supabaseAdmin
          .from("registrations") as any)
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
