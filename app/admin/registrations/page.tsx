import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { RegistrationsTable } from "@/components/admin/registrations-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LogOut, Home } from "lucide-react";

export default async function RegistrationsPage() {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  // Utiliser le client admin pour récupérer les données
  const { data: registrations, error } = await supabaseAdmin
    .from("registrations")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erreur lors de la récupération des inscriptions:", error);
  }

  return (
    <div className="min-h-screen bg-muted/50">
      <header className="bg-background border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Gestion des inscriptions</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/dashboard">
                <Home className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>
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
        <RegistrationsTable data={registrations || []} />
      </main>
    </div>
  );
}
