import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { Reveal } from "@/components/ui/reveal";
import { ScrollToTop } from "@/components/scroll-to-top";
import { Award } from "lucide-react";
import { getProfessors, getScheduleSlots, groupSlotsByDay } from "@/lib/content";
import { CoursExplorer, type AgeCategory } from "@/components/cours/cours-explorer";

export const revalidate = 60;

const CATEGORIES: AgeCategory[] = [
  {
    nom: "Baby Judo",
    age: "4-5 ans",
    description: "Éveil corporel et découverte du judo à travers le jeu",
    tarif: "150€/an",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    keywords: ["baby"],
  },
  {
    nom: "Mini-Poussins/Poussins",
    age: "6-9 ans",
    description: "Apprentissage des bases techniques et des valeurs du judo",
    tarif: "200€/an",
    color: "bg-green-100 text-green-800 border-green-200",
    keywords: ["mini-poussin", "poussin"],
  },
  {
    nom: "Benjamins",
    age: "10-11 ans",
    description: "Perfectionnement technique et initiation à la compétition",
    tarif: "200€/an",
    color: "bg-orange-100 text-orange-800 border-orange-200",
    keywords: ["benjamin"],
  },
  {
    nom: "Minimes/Cadets/Juniors/Seniors",
    age: "12 ans et +",
    description: "Entraînement intensif et compétition",
    tarif: "200€/an",
    color: "bg-purple-100 text-purple-800 border-purple-200",
    keywords: ["minime", "cadet", "junior", "senior"],
  },
  {
    nom: "Jujitsu",
    age: "Ados/Adultes",
    description: "Art martial complet : self-défense, techniques et contrôle",
    tarif: "200€/an",
    color: "bg-red-100 text-red-800 border-red-200",
    keywords: ["jujitsu"],
  },
];

export default async function CoursPage() {
  const [professors, slots] = await Promise.all([getProfessors(), getScheduleSlots()]);
  const planning = groupSlotsByDay(slots);

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <ScrollToTop />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-red-600 via-red-500 to-red-700 text-white py-16 sm:py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
              Nos Cours de Judo
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto px-4">
              Des cours adaptés à tous les âges et tous les niveaux, encadrés par des professeurs diplômés
            </p>
          </div>
        </div>
      </section>

      {/* Professeurs Section */}
      <section className="py-16 sm:py-20 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
              Notre Équipe Pédagogique
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 px-4">
              Des professeurs diplômés d'État passionnés et expérimentés
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {professors.map((prof, index) => (
              <Reveal key={prof.id} delay={index * 100}>
                <div className="group h-full bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-t-4 border-red-600">
                  <div className="text-center">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 transition-transform duration-300 group-hover:scale-110">
                      <Award className="w-10 h-10 sm:w-12 sm:h-12 text-red-600" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                      {prof.name}
                    </h3>
                    <p className="text-sm sm:text-base text-red-600 font-semibold">
                      {prof.grade}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CoursExplorer planning={planning} categories={CATEGORIES} />

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-red-600 via-red-500 to-red-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
            Prêt à commencer ?
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl mb-8 sm:mb-10 text-white/90 px-4">
            Rejoignez-nous pour un cours d'essai gratuit !
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
            <Button
              asChild
              size="lg"
              className="rounded-full px-8 py-6 text-base sm:text-lg font-semibold bg-white text-red-600 hover:bg-gray-100"
            >
              <Link href="/inscription">S'inscrire</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full px-8 py-6 text-base sm:text-lg font-semibold border-2 border-white bg-white/10 text-white hover:bg-white hover:text-red-600 backdrop-blur-md"
            >
              <Link href="/#contact">Nous contacter</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
