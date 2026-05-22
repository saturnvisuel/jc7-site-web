import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { MemberRegistrationForm } from "@/components/member-registration-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, LogOut } from "lucide-react";

export default async function MemberInscriptionsPage() {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-background border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Mes Inscriptions</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Accueil
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

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg mb-8">
            <h2 className="font-bold text-gray-900 mb-2">Espace Membre</h2>
            <p className="text-sm text-gray-700">
              En tant que membre connecté, vous pouvez inscrire vos enfants ou vous réinscrire pour la nouvelle saison.
              Aucun paiement ne sera demandé immédiatement.
            </p>
          </div>

          <MemberRegistrationForm userEmail={session.user.email || ""} />
        </div>
      </main>
    </div>
  );
}
