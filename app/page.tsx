import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Award, Users, Calendar, Shield } from "lucide-react";
import { CLUB_INFO } from "@/lib/club-info";
import { Navbar } from "@/components/navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section - Design amélioré */}
      <section className="relative overflow-hidden bg-gradient-to-br from-red-600 via-red-500 to-red-700 min-h-[70vh] sm:min-h-[80vh] md:min-h-[90vh] flex items-center">
        {/* Motifs décoratifs subtils */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 relative z-10 w-full">
          <div className="text-center max-w-5xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-white mb-4 sm:mb-6 drop-shadow-2xl">
              Judo Courneuvien 7
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white/95 mb-4 sm:mb-6 font-light">
              L'excellence du judo à La Courneuve
            </p>
            <p className="text-base sm:text-lg md:text-xl text-white/90 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-4">
              Rejoignez notre club affilié à la Fédération Française de Judo. 
              Des cours adaptés pour tous les âges, du baby judo aux adultes.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
              <Button 
                asChild 
                size="lg" 
                className="rounded-full px-6 sm:px-10 py-5 sm:py-7 text-base sm:text-lg font-semibold bg-white text-red-600 hover:bg-gray-50 hover:scale-105 transition-all shadow-2xl w-full sm:w-auto"
              >
                <Link href="/inscription">S&apos;inscrire maintenant →</Link>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                size="lg"
                className="rounded-full px-6 sm:px-10 py-5 sm:py-7 text-base sm:text-lg font-semibold border-2 border-white bg-white/20 text-white hover:bg-white hover:text-red-600 backdrop-blur-md transition-all shadow-lg w-full sm:w-auto"
              >
                <Link href="#about">Découvrir le club</Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Vague décorative */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Features Grid - Style Apple */}
      <section id="about" className="py-16 sm:py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-3 sm:mb-4">
              Pourquoi choisir JC7 ?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Un club de judo moderne avec des valeurs traditionnelles
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl p-8 text-center group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Award className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Professeurs qualifiés
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Équipe diplômée d'État pour un enseignement de qualité
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl p-8 text-center group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Tous les âges
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Du baby judo (4 ans) aux adultes, débutants ou confirmés
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl p-8 text-center group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Calendar className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Horaires flexibles
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Cours en semaine et le week-end pour s'adapter à votre emploi du temps
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-2xl p-8 text-center group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Inscription sécurisée
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Paiement en ligne sécurisé ou sur place selon votre préférence
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-16 sm:py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-3 sm:mb-4">
              Nos catégories
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Des cours adaptés à chaque âge et niveau
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Baby Judo */}
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-t-4 border-red-500 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-100 rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative">
                <div className="inline-block bg-red-100 text-red-600 px-4 py-1 rounded-full text-sm font-semibold mb-4">
                  4-5 ans
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-4">Baby Judo</h3>
                <p className="text-gray-600 mb-6 leading-relaxed min-h-[80px]">
                  Éveil corporel et découverte du judo à travers le jeu. 
                  Développement de la motricité et de la socialisation.
                </p>
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-4xl font-black text-red-600">130€<span className="text-lg font-normal text-gray-500">/an</span></p>
                </div>
              </div>
            </div>

            {/* Enfants */}
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-t-4 border-red-600 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-100 rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative">
                <div className="inline-block bg-red-600 text-white px-4 py-1 rounded-full text-sm font-semibold mb-4">
                  6-17 ans • Populaire
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-4">Enfants & Ados</h3>
                <p className="text-gray-600 mb-6 leading-relaxed min-h-[80px]">
                  Apprentissage technique, compétition et passage de grades. 
                  Formation complète aux valeurs du judo.
                </p>
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-4xl font-black text-red-600">180€<span className="text-lg font-normal text-gray-500">/an</span></p>
                </div>
              </div>
            </div>

            {/* Adultes */}
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-t-4 border-red-700 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-100 rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative">
                <div className="inline-block bg-red-100 text-red-700 px-4 py-1 rounded-full text-sm font-semibold mb-4">
                  18 ans et +
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-4">Adultes</h3>
                <p className="text-gray-600 mb-6 leading-relaxed min-h-[80px]">
                  Perfectionnement technique, préparation physique et compétition. 
                  Ambiance conviviale et sportive.
                </p>
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-4xl font-black text-red-600">180€<span className="text-lg font-normal text-gray-500">/an</span></p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-6">
              Réductions familiales disponibles • Paiement en plusieurs fois possible
            </p>
            <Button 
              asChild 
              size="lg"
              className="rounded-full px-8 py-6 text-base font-medium bg-red-600 hover:bg-red-700"
            >
              <Link href="/inscription">Voir toutes les options</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section - Style Apple */}
      <section id="contact" className="py-16 sm:py-24 md:py-32 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-4 sm:mb-6">
            Contactez-nous
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 sm:mb-12 px-4">
            Une question ? Notre équipe est là pour vous répondre
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 text-left">
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Email</h3>
              <a 
                href={`mailto:${CLUB_INFO.email}`} 
                className="text-lg text-gray-900 hover:text-gray-700 font-medium break-all"
              >
                {CLUB_INFO.email}
              </a>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Téléphone</h3>
              <p className="text-lg text-gray-900 font-medium">{CLUB_INFO.phone}</p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Adresse</h3>
              <p className="text-lg text-gray-900 font-medium">{CLUB_INFO.address}</p>
              <p className="text-sm text-gray-600 mt-1">{CLUB_INFO.street}</p>
              <p className="text-sm text-gray-600">{CLUB_INFO.postalCode} {CLUB_INFO.city}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
