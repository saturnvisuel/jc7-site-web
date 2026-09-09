"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { Calendar, Clock, Users, X } from "lucide-react";
import type { ScheduleDay } from "@/lib/content";

export interface AgeCategory {
  nom: string;
  age: string;
  description: string;
  tarif: string;
  color: string;
  keywords: string[];
}

interface CoursExplorerProps {
  planning: ScheduleDay[];
  categories: AgeCategory[];
}

function matchesCategory(label: string, keywords: string[]) {
  const normalized = label.toLowerCase();
  return keywords.some((keyword) => normalized.includes(keyword));
}

export function CoursExplorer({ planning, categories }: CoursExplorerProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const planningRef = useRef<HTMLDivElement>(null);

  const activeCategory = categories.find((cat) => cat.nom === selected) ?? null;

  const filteredPlanning = useMemo(() => {
    if (!activeCategory) return planning;

    return planning
      .map((day) => ({
        ...day,
        slots: day.slots.filter((slot) =>
          matchesCategory(slot.category_label, activeCategory.keywords)
        ),
      }))
      .filter((day) => day.slots.length > 0);
  }, [planning, activeCategory]);

  const totalSlots = filteredPlanning.reduce((sum, day) => sum + day.slots.length, 0);

  const selectCategory = (nom: string) => {
    setSelected((current) => (current === nom ? null : nom));
    planningRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      {/* Catégories cliquables */}
      <section className="py-14 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-8 sm:mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Catégories d&apos;Âge
            </h2>
            <p className="text-base sm:text-lg text-gray-600 px-4">
              Cliquez sur une catégorie pour voir les cours correspondants
            </p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {categories.map((cat, index) => {
              const isActive = selected === cat.nom;

              return (
                <Reveal key={cat.nom} delay={index * 80} className="h-full">
                  <button
                    type="button"
                    onClick={() => selectCategory(cat.nom)}
                    aria-pressed={isActive}
                    className={`flex h-full w-full flex-col rounded-xl bg-white p-5 text-center shadow-sm border-2 ${cat.color} transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                      isActive ? "ring-2 ring-red-600 ring-offset-2 shadow-lg" : ""
                    }`}
                  >
                    <h3 className="text-base sm:text-lg font-bold leading-snug text-gray-900 [overflow-wrap:anywhere]">
                      {cat.nom}
                    </h3>
                    <p className="mt-1 text-sm font-semibold text-red-600">{cat.age}</p>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-600">
                      {cat.description}
                    </p>
                    <div className="mt-4 border-t border-gray-200 pt-3">
                      <p className="text-2xl font-black text-red-600">{cat.tarif}</p>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        {isActive ? "Filtre actif" : "Voir les cours"}
                      </p>
                    </div>
                  </button>
                </Reveal>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <p className="text-base sm:text-lg text-gray-600 mb-6">
              Réductions familiales disponibles • Paiement en plusieurs fois possible
            </p>
            <Button
              asChild
              size="lg"
              className="rounded-full px-8 py-6 text-base sm:text-lg font-medium bg-gradient-to-r from-red-600 via-red-500 to-red-700 hover:from-red-700 hover:to-red-800"
            >
              <Link href="/inscription">S&apos;inscrire maintenant</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Planning filtrable */}
      <section ref={planningRef} className="scroll-mt-16 py-14 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Planning Hebdomadaire
            </h2>
            <p className="text-base sm:text-lg text-gray-600 px-4">
              {activeCategory
                ? `${totalSlots} cours pour la catégorie ${activeCategory.nom}`
                : "Tous les horaires de nos cours"}
            </p>
          </div>

          {/* Filtres rapides */}
          <div className="mb-6 sm:mb-8 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => setSelected(null)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                selected === null
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Tous les cours
            </button>
            {categories.map((cat) => (
              <button
                key={cat.nom}
                type="button"
                onClick={() => setSelected(cat.nom)}
                className={`max-w-full rounded-full px-4 py-2 text-sm font-medium transition-colors [overflow-wrap:anywhere] ${
                  selected === cat.nom
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat.nom}
              </button>
            ))}
          </div>

          {activeCategory && (
            <div className="mb-8 flex flex-wrap items-center justify-center gap-3 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">
              <span>
                Filtre : <strong>{activeCategory.nom}</strong> ({activeCategory.age})
              </span>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 font-medium text-red-700 shadow-sm transition-colors hover:bg-red-100"
              >
                <X className="h-3.5 w-3.5" />
                Réinitialiser
              </button>
            </div>
          )}

          {filteredPlanning.length === 0 ? (
            <div className="mx-auto max-w-xl rounded-2xl border border-dashed border-gray-300 p-8 text-center">
              <Calendar className="mx-auto mb-4 h-10 w-10 text-gray-300" />
              <p className="font-semibold text-gray-900">
                Aucun cours programmé pour cette catégorie
              </p>
              <p className="mt-2 text-sm text-gray-600">
                Contactez-nous pour connaître les possibilités d&apos;accueil.
              </p>
              <Button asChild variant="outline" className="mt-4 rounded-full">
                <Link href="/contact">Nous contacter</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {filteredPlanning.map((journee, index) => (
                <Reveal key={journee.day} delay={index * 60} className="h-full">
                  <div className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <h3 className="bg-gray-900 px-4 py-2.5 text-center text-sm font-bold uppercase tracking-wide text-white">
                      {journee.day}
                    </h3>

                    <div className="flex flex-1 flex-col divide-y divide-gray-100">
                      {journee.slots.map((slot) => (
                        <div
                          key={slot.id}
                          className="px-4 py-3 text-center transition-colors hover:bg-red-50"
                        >
                          <p className="flex items-center justify-center gap-1.5 text-sm font-bold text-gray-900">
                            <Clock className="h-3.5 w-3.5 text-gray-400" />
                            {slot.start_time} à {slot.end_time}
                          </p>
                          <p className="mt-1.5 text-sm font-semibold leading-snug text-red-600 [overflow-wrap:anywhere]">
                            {slot.category_label}
                          </p>
                          <p className="mt-1.5 text-xs text-gray-500">
                            {slot.professor_name} • {slot.level}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}

          <div className="mt-8 sm:mt-12 bg-blue-50 border-l-4 border-blue-600 p-4 sm:p-6 rounded-r-lg">
            <div className="flex items-start gap-3">
              <Users className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="text-base sm:text-lg font-bold text-blue-900 mb-2">
                  Informations importantes
                </h4>
                <ul className="text-sm sm:text-base text-blue-800 space-y-1">
                  <li>• Cours fermés pendant les vacances scolaires</li>
                  <li>• Tenue obligatoire : judogi blanc</li>
                  <li>• Certificat médical obligatoire pour la première inscription</li>
                  <li>• Cours d&apos;essai gratuit sur réservation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
