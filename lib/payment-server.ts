import { supabaseAdmin } from "@/lib/supabase/admin";
import {
  ALL_PAYMENT_METHODS,
  DEFAULT_ENABLED_METHODS,
  type PaymentMethodOption,
  type PaymentMethodValue,
} from "@/lib/payment";

/**
 * Activation de chaque mode de paiement, telle que configurée en administration.
 * Repli sur les valeurs par défaut si la migration 011 n'est pas appliquée.
 */
export async function getPaymentSettings(): Promise<Record<PaymentMethodValue, boolean>> {
  try {
    const { data, error } = await supabaseAdmin
      .from("payment_settings")
      .select("method, enabled");

    if (error || !data?.length) return { ...DEFAULT_ENABLED_METHODS };

    const settings = { ...DEFAULT_ENABLED_METHODS };
    for (const row of data as { method: PaymentMethodValue; enabled: boolean }[]) {
      if (row.method in settings) settings[row.method] = row.enabled;
    }
    return settings;
  } catch {
    return { ...DEFAULT_ENABLED_METHODS };
  }
}

/** Modes proposés aux visiteurs, dans l'ordre d'affichage. */
export async function getEnabledPaymentMethods(): Promise<PaymentMethodOption[]> {
  const settings = await getPaymentSettings();
  return ALL_PAYMENT_METHODS.filter((method) => settings[method.value]);
}

/** Contrôle serveur : un mode désactivé ne doit jamais être accepté. */
export async function isPaymentMethodAllowed(value: string): Promise<boolean> {
  const settings = await getPaymentSettings();
  return Boolean(settings[value as PaymentMethodValue]);
}
