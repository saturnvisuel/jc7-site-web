import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { Clock, Users, Award, Calendar } from "lucide-react";

const PROFESSEURS = [
  {
    name: "Junior Camara",
    grade: "Ceinture Noire 2ème Dan",
    specialite: "Judo Compétition",
  },
  {
    name: "Moustapha Camara",
    grade: "Ceinture Noire 2ème Dan",
    specialite: "Judo Technique",
  },
  {
    name: "Loucif",
    grade: "Ceinture Noire 5ème Dan",
    specialite: "Baby Judo & Éveil",
  },
];

const PLANNING = [
  {
    jour: "Lundi",
    cours: [
      {
        horaire: "17h00 - 18h00",
        categorie: "Benjamins/Minimes Débutants (<Jaune-Orange)",
        professeur: "Loucif",
        niveau: "Débutant",
      },
    ],
  },
  {
    jour: "Mardi",
    cours: [
      {
        horaire: "17h00 - 18h00",
        categorie: "Poussins/Pré-Poussins",
        professeur: "Junior Camara",
        niveau: "Tous niveaux",
      },
      {
        horaire: "18h00 - 19h00",
        categorie: "Benjamins/Minimes Confirmés (>Jaune-Orange)",
        professeur: "Junior Camara",
        niveau: "Confirmé",
      },
      {
        horaire: "19h00 - 21h00",
        categorie: "Cadets/Juniors/Seniors",
        professeur: "Junior Camara",
        niveau: "Avancé",
      },
    ],
  },
  {
    jour: "Mercredi",
    cours: [
      {
        horaire: "17h30 - 18h30",
        categorie: "Baby Judo (4-5 ans)",
        professeur: "Moustapha Camara",
        niveau: "Débutant",
      },
      {
        horaire: "18h30 - 19h30",
        categorie: "Baby Judo (4-5 ans)",
        professeur: "Moustapha Camara",
        niveau: "Débutant",
      },
    ],
  },
  {
    jour: "Jeudi",
    cours: [
      {
        horaire: "17h00 - 18h00",
        categorie: "Benjamins/Minimes Débutants (<Jaune-Orange)",
        professeur: "Loucif",
        niveau: "Débutant",
      },
    ],
  },
  {
    jour: "Vendredi",
    cours: [
      {
        horaire: "17h00 - 18h00",
        categorie: "Poussins/Pré-Poussins",
        professeur: "Junior Camara",
        niveau: "Tous niveaux",
      },
      {
        horaire: "18h00 - 19h00",
        categorie: "Benjamins/Minimes Confirmés (>Jaune-Orange)",
        professeur: "Junior Camara",
        niveau: "Confirmé",
      },
      {
        horaire: "19h00 - 21h00",
        categorie: "Cadets/Juniors/Seniors",
        professeur: "Junior Camara",
        niveau: "Avancé",
      },
    ],
  },
  {
    jour: "Samedi",
    cours: [
      {
        horaire: "13h00 - 15h00",
        categorie: "Préparation Physique",
        professeur: "Adam",
        niveau: "Tous niveaux",
      },
    ],
  },
];

const CATEGORIES = [
  {
    nom: "Baby Judo",
    age: "4-5 ans",
    description: "Éveil corporel et découverte du judo à travers le jeu",
    tarif: "130€/an",
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  {
    nom: "Poussins",
    age: "6-7 ans",
    description: "Apprentissage des bases techniques et des valeurs du judo",
    tarif: "180€/an",
    color: "bg-green-100 text-green-800 border-green-200",
  },
  {
    nom: "Benjamins/Minimes",
    age: "8-13 ans",
    description: "Perfectionnement technique et initiation à la compétition",
    tarif: "180€/an",
    color: "bg-orange-100 text-orange-800 border-orange-200",
  },
  {
    nom: "Cadets/Juniors",
    age: "14-17 ans",
    description: "Entraînement intensif et compétition",
    tarif: "180€/an",
    color: "bg-purple-100 text-purple-800 border-purple-200",
  },
  {
    nom: "Adultes",
    age: "18 ans et +",
    description: "Pratique loisir ou compétition selon vos objectifs",
    tarif: "180€/an",
    color: "bg-red-100 text-red-800 border-red-200",
  },
];

export default function CoursPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

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
            {PROFESSEURS.map((prof, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow border-t-4 border-red-600"
              >
                <div className="text-center">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
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
            ))}
          </div>
        </div>
      </section>

      {/* Planning Section */}
      <section className="py-16 sm:py-20 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
              Planning Hebdomadaire
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 px-4">
              Tous les horaires de nos cours
            </p>
          </div>

          {/* Planning par jour */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {PLANNING.map((journee, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
              >
                <div className="bg-gradient-to-r from-red-600 via-red-500 to-red-700 text-white px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-6 h-6" />
                    <h3 className="text-xl sm:text-2xl font-bold">{journee.jour}</h3>
                  </div>
                </div>
                <div className="p-4 sm:p-6 space-y-4">
                  {journee.cours.map((cours, idx) => (
                    <div
                      key={idx}
                      className="border-l-4 border-red-600 bg-gray-50 p-4 rounded-r-lg"
                    >
                      <div className="flex items-start gap-3 mb-2">
                        <Clock className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-base sm:text-lg font-bold text-gray-900">
                            {cours.horaire}
                          </p>
                          <p className="text-sm sm:text-base font-semibold text-red-600 mt-1">
                            {cours.categorie}
                          </p>
                        </div>
                      </div>
                      <div className="ml-8 space-y-1">
                        <p className="text-xs sm:text-sm text-gray-600">
                          <span className="font-medium">Professeur:</span> {cours.professeur}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600">
                          <span className="font-medium">Niveau:</span> {cours.niveau}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

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
                  <li>• Cours d'essai gratuit sur réservation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Catégories Section */}
      <section className="py-16 sm:py-20 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
              Catégories d'Âge
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 px-4">
              Trouvez le cours adapté à votre âge
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {CATEGORIES.map((cat, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl p-6 sm:p-8 shadow-lg border-2 ${cat.color} hover:shadow-xl transition-all`}
              >
                <div className="text-center mb-4">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                    {cat.nom}
                  </h3>
                  <p className="text-lg sm:text-xl font-semibold text-red-600">
                    {cat.age}
                  </p>
                </div>
                <p className="text-sm sm:text-base text-gray-600 mb-4 text-center min-h-[60px]">
                  {cat.description}
                </p>
                <div className="text-center pt-4 border-t border-gray-200">
                  <p className="text-2xl sm:text-3xl font-black text-red-600">
                    {cat.tarif}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-base sm:text-lg text-gray-600 mb-6">
              Réductions familiales disponibles • Paiement en plusieurs fois possible
            </p>
            <Button
              asChild
              size="lg"
              className="rounded-full px-8 py-6 text-base sm:text-lg font-medium bg-gradient-to-r from-red-600 via-red-500 to-red-700 hover:from-red-700 hover:to-red-800"
            >
              <Link href="/inscription">S'inscrire maintenant</Link>
            </Button>
          </div>
        </div>
      </section>

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
