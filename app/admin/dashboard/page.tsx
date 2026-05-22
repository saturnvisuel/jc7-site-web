import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Users, CheckCircle, Clock, XCircle, Euro } from "lucide-react";

export default async function DashboardPage() {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const { data: registrations } = await supabase
    .from("registrations")
    .select("*")
    .order("created_at", { ascending: false });

  const total = registrations?.length || 0;
  const paid = registrations?.filter((r) => r.payment_status === "paid").length || 0;
  const pending = registrations?.filter((r) => r.payment_status === "pending").length || 0;
  const cancelled = registrations?.filter((r) => r.payment_status === "cancelled").length || 0;
  const pendingCashCheck = registrations?.filter(
    (r) => r.payment_status === "pending" && (r.payment_method === "cheque" || r.payment_method === "especes")
  ).length || 0;

  return (
    <div className="min-h-screen bg-muted/50">
      <header className="bg-background border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">JC7 Admin Dashboard</h1>
          <form action="/api/auth/signout" method="post">
            <Button variant="outline">Déconnexion</Button>
          </form>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Tableau de bord</h2>
          <p className="text-muted-foreground">Vue d&apos;ensemble des inscriptions</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-background p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <Users className="h-8 w-8 text-primary" />
              <span className="text-3xl font-bold">{total}</span>
            </div>
            <p className="text-sm text-muted-foreground">Total inscriptions</p>
          </div>

          <div className="bg-background p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <span className="text-3xl font-bold">{paid}</span>
            </div>
            <p className="text-sm text-muted-foreground">Paiements confirmés</p>
          </div>

          <div className="bg-background p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <Clock className="h-8 w-8 text-orange-500" />
              <span className="text-3xl font-bold">{pending}</span>
            </div>
            <p className="text-sm text-muted-foreground">En attente</p>
          </div>

          <div className="bg-background p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <XCircle className="h-8 w-8 text-red-500" />
              <span className="text-3xl font-bold">{cancelled}</span>
            </div>
            <p className="text-sm text-muted-foreground">Annulés</p>
          </div>
        </div>

        {pendingCashCheck > 0 && (
          <div className="bg-amber-50 border-l-4 border-amber-600 p-6 rounded-lg shadow mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Euro className="h-8 w-8 text-amber-600" />
                <div>
                  <h3 className="text-lg font-bold text-amber-900">
                    {pendingCashCheck} paiement{pendingCashCheck > 1 ? "s" : ""} en attente
                  </h3>
                  <p className="text-sm text-amber-700">
                    Chèques et espèces à valider
                  </p>
                </div>
              </div>
              <Button asChild className="bg-amber-600 hover:bg-amber-700">
                <Link href="/admin/paiements">
                  <Euro className="mr-2 h-4 w-4" />
                  Gérer les paiements
                </Link>
              </Button>
            </div>
          </div>
        )}

        <div className="bg-background p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Actions rapides</h3>
          </div>
          <div className="flex gap-4">
            <Button asChild>
              <Link href="/admin/registrations">Voir toutes les inscriptions</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/paiements">
                <Euro className="mr-2 h-4 w-4" />
                Gestion des paiements
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Retour au site</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
