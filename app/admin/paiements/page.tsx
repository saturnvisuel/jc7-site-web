import { createClient } from "@/lib/supabase/server";
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

  const { data: registrations } = await supabase
    .from("registrations")
    .select("*")
    .in("payment_method", ["cheque", "especes"])
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-background border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">Gestion des Paiements</h1>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/admin/dashboard">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/admin/registrations">Inscriptions</Link>
                </Button>
              </div>
            </div>
            <form action="/api/auth/signout" method="post">
              <Button variant="ghost" size="sm" type="submit">
                <LogOut className="mr-2 h-4 w-4" />
                Déconnexion
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-lg text-muted-foreground">
            Paiements en attente (chèque et espèces)
          </h2>
        </div>

        <PaymentsManagement initialRegistrations={registrations || []} />
      </main>
    </div>
  );
}
