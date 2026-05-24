"use client";

import { useState } from "react";
import { RegistrationForm } from "@/components/registration-form";
import { RegistrationFormFamily } from "@/components/registration-form-family";
import { Button } from "@/components/ui/button";
import { Users, User } from "lucide-react";

export default function InscriptionPage() {
  const [formType, setFormType] = useState<"single" | "family" | null>(null);

  if (formType === null) {
    return (
      <main className="min-h-screen bg-white py-12">
        <div className="max-w-4xl mx-auto px-6">
          <Button
            variant="ghost"
            onClick={() => window.location.href = '/'}
            className="mb-6"
          >
            ← Retour à l'accueil
          </Button>
          
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Inscription JC7
            </h1>
            <p className="text-lg text-gray-600">
              Choisissez votre type d'inscription
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={() => setFormType("single")}
              className="bg-white p-8 rounded-2xl border-2 border-gray-200 hover:border-red-600 transition-all text-left"
            >
              <div className="mb-4">
                <User className="h-12 w-12 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Inscription simple</h2>
              <p className="text-gray-600 mb-4">
                Pour une seule personne
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Baby Judo</span>
                  <span className="font-semibold">130 €</span>
                </div>
                <div className="flex justify-between">
                  <span>Autres catégories</span>
                  <span className="font-semibold">180 €</span>
                </div>
              </div>
            </button>

            <button
              onClick={() => setFormType("family")}
              className="bg-white p-8 rounded-2xl border-2 border-gray-200 hover:border-red-600 transition-all text-left"
            >
              <div className="mb-4">
                <Users className="h-12 w-12 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Inscription familiale</h2>
              <p className="text-gray-600 mb-4">
                Plusieurs enfants d'une même famille
              </p>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span>1er enfant</span>
                  <span className="font-semibold">Tarif normal</span>
                </div>
                <div className="flex justify-between">
                  <span>2ème enfant</span>
                  <span className="font-semibold">165 €</span>
                </div>
                <div className="flex justify-between">
                  <span>3ème et +</span>
                  <span className="font-semibold">150 €</span>
                </div>
              </div>
              <div className="bg-red-50 border border-red-200 p-3 rounded text-xs text-red-800 font-medium">
                Réductions familiales
              </div>
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => setFormType(null)}
            className="mb-4"
          >
            ← Retour au choix
          </Button>
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              {formType === "single" ? "Inscription simple" : "Inscription familiale"}
            </h1>
            <p className="text-lg text-muted-foreground">
              {formType === "single"
                ? "Remplissez le formulaire ci-dessous pour vous inscrire"
                : "Inscrivez plusieurs enfants et bénéficiez de réductions"}
            </p>
          </div>
        </div>

        {formType === "single" ? <RegistrationForm /> : <RegistrationFormFamily />}
      </div>
    </main>
  );
}
