/**
 * Définitions des modes de paiement, sans accès base : ce module est importé
 * par des composants client. La lecture de l'activation se fait dans
 * lib/payment-server.ts, côté serveur uniquement.
 */

export type PaymentMethodValue = "carte" | "cheque" | "especes";

export interface PaymentMethodOption {
  value: PaymentMethodValue;
  label: string;
  description: string;
}

export const ALL_PAYMENT_METHODS: PaymentMethodOption[] = [
  {
    value: "carte",
    label: "Carte bancaire (en ligne)",
    description: "Paiement sécurisé par Stripe",
  },
  {
    value: "cheque",
    label: "Chèque",
    description: "À remettre lors de la première séance, à l'ordre de JC7",
  },
  {
    value: "especes",
    label: "Espèces",
    description: "À remettre lors de la première séance",
  },
];

/**
 * État appliqué tant que la migration 011 n'est pas exécutée, ou si la table
 * est injoignable : on reste sur la configuration prudente (pas de paiement
 * en ligne) plutôt que d'ouvrir un mode par accident.
 */
export const DEFAULT_ENABLED_METHODS: Record<PaymentMethodValue, boolean> = {
  carte: false,
  cheque: true,
  especes: true,
};

export function getMethodLabel(value: string): string {
  return ALL_PAYMENT_METHODS.find((method) => method.value === value)?.label ?? value;
}
