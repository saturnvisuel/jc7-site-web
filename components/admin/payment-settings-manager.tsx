import { Button } from "@/components/ui/button";
import { CreditCard, Eye, EyeOff } from "lucide-react";
import { ALL_PAYMENT_METHODS, type PaymentMethodValue } from "@/lib/payment";
import { setPaymentMethodEnabled } from "@/app/admin/paiements/actions";

export function PaymentSettingsManager({
  settings,
}: {
  settings: Record<PaymentMethodValue, boolean>;
}) {
  const activeCount = ALL_PAYMENT_METHODS.filter((method) => settings[method.value]).length;

  return (
    <section className="mb-6 sm:mb-8 rounded-lg bg-background p-4 sm:p-6 shadow">
      <div className="mb-1 flex items-center gap-2">
        <CreditCard className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-lg sm:text-xl font-bold">Modes de paiement proposés</h3>
      </div>
      <p className="mb-4 text-sm text-muted-foreground">
        Les modes désactivés disparaissent des formulaires d&apos;inscription et sont refusés
        côté serveur. Au moins un mode doit rester actif.
      </p>

      <div className="space-y-3">
        {ALL_PAYMENT_METHODS.map((method) => {
          const enabled = settings[method.value];
          const isLastActive = enabled && activeCount === 1;

          return (
            <div
              key={method.value}
              className={`flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between ${
                enabled ? "bg-white" : "border-dashed bg-gray-50"
              }`}
            >
              <div className="flex items-start gap-3">
                {enabled ? (
                  <Eye className="mt-0.5 h-4 w-4 text-green-600" />
                ) : (
                  <EyeOff className="mt-0.5 h-4 w-4 text-gray-400" />
                )}
                <div>
                  <p className={`font-semibold ${enabled ? "" : "text-gray-500"}`}>
                    {method.label}
                  </p>
                  <p className="text-sm text-muted-foreground">{method.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    enabled ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {enabled ? "Proposé" : "Masqué"}
                </span>

                <form action={setPaymentMethodEnabled}>
                  <input type="hidden" name="method" value={method.value} />
                  <input type="hidden" name="enabled" value={enabled ? "false" : "true"} />
                  <Button
                    type="submit"
                    size="sm"
                    variant={enabled ? "outline" : "default"}
                    disabled={isLastActive}
                    title={
                      isLastActive
                        ? "Dernier mode actif : impossible de le désactiver"
                        : undefined
                    }
                  >
                    {enabled ? "Désactiver" : "Activer"}
                  </Button>
                </form>
              </div>
            </div>
          );
        })}
      </div>

      {settings.carte && (
        <p className="mt-4 rounded-md border-l-4 border-amber-500 bg-amber-50 p-3 text-sm text-amber-900">
          Le paiement en ligne est actif : vérifiez que les clés Stripe et l&apos;URL de retour
          sont bien configurées en production.
        </p>
      )}
    </section>
  );
}
