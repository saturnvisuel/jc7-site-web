import { InscriptionChoice } from "@/components/inscription-choice";
import { getEnabledPaymentMethods } from "@/lib/payment-server";

// Les modes de paiement sont pilotés depuis l'administration : la page doit
// refléter la configuration courante à chaque visite.
export const dynamic = "force-dynamic";

export default async function InscriptionPage() {
  const paymentMethods = await getEnabledPaymentMethods();

  return <InscriptionChoice paymentMethods={paymentMethods} />;
}
