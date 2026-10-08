"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getPaymentSettings } from "@/lib/payment-server";
import { ALL_PAYMENT_METHODS, type PaymentMethodValue } from "@/lib/payment";

async function assertAdmin() {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) throw new Error("Non autorisé");
}

export async function setPaymentMethodEnabled(formData: FormData) {
  await assertAdmin();

  const method = String(formData.get("method") ?? "") as PaymentMethodValue;
  const enabled = formData.get("enabled") === "true";

  if (!ALL_PAYMENT_METHODS.some((option) => option.value === method)) {
    throw new Error("Mode de paiement inconnu");
  }

  // Au moins un mode doit rester actif, sinon plus personne ne peut s'inscrire.
  if (!enabled) {
    const settings = await getPaymentSettings();
    const remaining = ALL_PAYMENT_METHODS.filter(
      (option) => option.value !== method && settings[option.value]
    );

    if (remaining.length === 0) {
      throw new Error(
        "Impossible de désactiver le dernier mode de paiement : les inscriptions seraient bloquées."
      );
    }
  }

  const { error } = await supabaseAdmin
    .from("payment_settings")
    .upsert({ method, enabled, updated_at: new Date().toISOString() });

  if (error) throw new Error(error.message);

  revalidatePath("/admin/paiements");
  revalidatePath("/inscription");
  revalidatePath("/");
}
