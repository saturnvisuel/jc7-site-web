import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";
import { z } from "zod";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

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

const registrationSchema = z.object({
  first_name: z.string().min(2),
  last_name: z.string().min(2),
  birth_date: z.string(),
  category: z.string().min(1),
  belt: z.string().nullable().optional(),
  license_number: z.string().nullable().optional(),
  address: z.string().min(5),
  postal_code: z.string().min(5),
  city: z.string().min(2),
  phone: z.string().min(10),
  phone_alt: z.string().nullable().optional(),
  email: z.string().email(),
  social_security_number: z.string().min(15),
  is_self_registration: z.boolean(),
  guardian_first_name: z.string().nullable().optional(),
  guardian_last_name: z.string().nullable().optional(),
  guardian_address: z.string().nullable().optional(),
  guardian_postal_code: z.string().nullable().optional(),
  guardian_city: z.string().nullable().optional(),
  guardian_phone: z.string().nullable().optional(),
  guardian_email: z.string().nullable().optional(),
  medical_note: z.string().nullable().optional(),
  payment_method: z.string().min(1, "Mode de paiement requis"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = registrationSchema.parse(body);

    const { data: registration, error: dbError } = await (supabaseAdmin
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
        { error: "Erreur lors de l'enregistrement", details: dbError.message },
        { status: 500 }
      );
    }

    // Créer une session Stripe uniquement si paiement par carte
    if (validatedData.payment_method === "carte") {
      // Vérifier que les clés Stripe sont configurées
      if (!process.env.STRIPE_SECRET_KEY || !process.env.NEXT_PUBLIC_APP_URL) {
        console.error("Stripe configuration missing");
        return NextResponse.json(
          { error: "Configuration Stripe manquante. Veuillez choisir un autre mode de paiement." },
          { status: 500 }
        );
      }

      try {
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [
            {
              price_data: {
                currency: "eur",
                product_data: {
                  name: "Inscription JC7",
                  description: `Inscription pour ${validatedData.first_name} ${validatedData.last_name} - ${validatedData.category}`,
                },
                unit_amount: 20000,
              },
              quantity: 1,
            },
          ],
          mode: "payment",
          success_url: `${process.env.NEXT_PUBLIC_APP_URL}/inscription/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/inscription?cancelled=true`,
          metadata: {
            registration_id: registration.id,
          },
        });

        await (supabaseAdmin
          .from("registrations") as any)
          .update({ stripe_session_id: session.id })
          .eq("id", registration.id);

        return NextResponse.json({
          checkoutUrl: session.url,
          registrationId: registration.id,
        });
      } catch (stripeError) {
        console.error("Stripe error:", stripeError);
        return NextResponse.json(
          { error: "Erreur lors de la création de la session de paiement. Veuillez choisir un autre mode de paiement." },
          { status: 500 }
        );
      }
    }

    // Pour chèque ou espèces, retourner simplement le succès avec l'ID
    return NextResponse.json({
      success: true,
      id: registration.id,
    });
  } catch (error) {
    console.error("Registration error:", error);
    
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
