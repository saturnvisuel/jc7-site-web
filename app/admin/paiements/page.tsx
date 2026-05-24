import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { PaymentsManagement } from "@/components/payments-management";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, LogOut } from "lucide-react";

export default async function PaymentsPage() {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  // Utiliser le client admin pour récupérer les données
  const { data: registrations } = await supabaseAdmin
    .from("registrations")
    .select("*")
    .in("payment_method", ["cheque", "especes"])
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-background border-b">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <h1 className="text-xl sm:text-2xl font-bold">Gestion des Paiements</h1>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button variant="outline" size="sm" asChild className="flex-1 sm:flex-none">
                  <Link href="/admin/dashboard">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Dashboard</span>
                    <span className="sm:hidden">Accueil</span>
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild className="flex-1 sm:flex-none">
                  <Link href="/admin/registrations">Inscriptions</Link>
                </Button>
              </div>
            </div>
            <form action="/api/auth/signout" method="post" className="w-full sm:w-auto">
              <Button variant="ghost" size="sm" type="submit" className="w-full sm:w-auto">
                <LogOut className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Déconnexion</span>
                <span className="sm:hidden">Sortir</span>
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="mb-4 sm:mb-6">
          <h2 className="text-base sm:text-lg text-muted-foreground">
            Paiements en attente (chèque et espèces)
          </h2>
        </div>

        <PaymentsManagement initialRegistrations={registrations || []} />
      </main>
    </div>
  );
}
