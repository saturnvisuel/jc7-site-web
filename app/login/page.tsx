"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      // Vérifier le rôle de l'utilisateur (vous pouvez ajouter une logique ici)
      // Pour l'instant, on redirige vers le dashboard admin
      router.push("/admin/dashboard");
      router.refresh();
    } catch (err) {
      setError("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md px-6">
        {/* Logo / Titre */}
        <div className="mb-10 text-center">
          <Link href="/" className="inline-block mb-6">
            <h2 className="text-3xl font-semibold tracking-tight text-gray-900">JC7</h2>
          </Link>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-3">
            Connexion
          </h1>
          <p className="text-lg text-gray-600">
            Accédez à votre espace administrateur
          </p>
        </div>

        {/* Formulaire */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Adresse email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nom@exemple.fr"
                required
                disabled={loading}
                className="h-12 rounded-xl border-gray-300 focus:border-red-500 focus:ring-red-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Mot de passe
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
                className="h-12 rounded-xl border-gray-300 focus:border-red-500 focus:ring-red-500"
              />
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-12 rounded-full bg-red-600 hover:bg-red-700 text-white font-medium text-base transition-all mt-6" 
              disabled={loading}
            >
              {loading ? "Connexion en cours..." : "Se connecter"}
            </Button>
          </form>
        </div>

        {/* Lien retour */}
        <div className="mt-8 text-center">
          <Link 
            href="/" 
            className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
          >
            ← Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
