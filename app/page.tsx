import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen">
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            JC7 - Judo Courneuvien 7
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            Bienvenue au club de judo de La Courneuve
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/inscription">S&apos;inscrire</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="#contact">Nous contacter</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">
              À propos du club
            </h2>
            <div className="prose prose-lg mx-auto">
              <p>
                Le JC7 (Judo Courneuvien 7) est un club de judo situé à La Courneuve,
                offrant des cours pour tous les âges et tous les niveaux.
              </p>
              <p>
                Notre équipe de professeurs qualifiés vous accompagne dans votre
                progression, que vous soyez débutant ou judoka confirmé.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Contact</h2>
            <div className="space-y-4">
              <p className="text-lg">
                <strong>Email:</strong> contact@jc7.fr
              </p>
              <p className="text-lg">
                <strong>Téléphone:</strong> 01 23 45 67 89
              </p>
              <p className="text-lg">
                <strong>Adresse:</strong> La Courneuve, France
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
