import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { redirect, notFound } from "next/navigation";
import { RegistrationDetails } from "@/components/admin/registration-details";

export default async function RegistrationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  // Utiliser le client admin pour récupérer les données
  const { data: registration } = await supabaseAdmin
    .from("registrations")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!registration) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-muted/50">
      <header className="bg-background border-b">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <h1 className="text-xl sm:text-2xl font-bold">Détails de l&apos;inscription</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <RegistrationDetails registration={registration} />
      </main>
    </div>
  );
}
