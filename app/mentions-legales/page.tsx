import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { CLUB_INFO } from "@/lib/club-info";

export default function MentionsLegalesPage() {
  return (
    <main className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à l'accueil
            </Link>
          </Button>

          <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
            <h1 className="text-4xl font-bold mb-6">Mentions Légales</h1>

            <section>
              <h2 className="text-2xl font-bold mb-4">1. Éditeur du site</h2>
              <p className="text-muted-foreground mb-2">
                <strong>Nom de l'association :</strong> {CLUB_INFO.name}
              </p>
              <p className="text-muted-foreground mb-2">
                <strong>Adresse :</strong> {CLUB_INFO.fullAddress}
              </p>
              <p className="text-muted-foreground mb-2">
                <strong>Email :</strong> {CLUB_INFO.email}
              </p>
              <p className="text-muted-foreground mb-2">
                <strong>Téléphone :</strong> {CLUB_INFO.phone}
              </p>
              <p className="text-muted-foreground">
                <strong>Numéro SIRET :</strong> {CLUB_INFO.siret}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. Directeur de la publication</h2>
              <p className="text-muted-foreground">
                {CLUB_INFO.president}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. Hébergement</h2>
              <p className="text-muted-foreground mb-2">
                <strong>Hébergeur :</strong> Vercel Inc.
              </p>
              <p className="text-muted-foreground mb-2">
                <strong>Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, USA
              </p>
              <p className="text-muted-foreground">
                <strong>Site web :</strong> <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">vercel.com</a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Base de données</h2>
              <p className="text-muted-foreground mb-2">
                <strong>Fournisseur :</strong> Supabase Inc.
              </p>
              <p className="text-muted-foreground mb-2">
                <strong>Localisation des données :</strong> Union Européenne (conformité RGPD)
              </p>
              <p className="text-muted-foreground">
                <strong>Site web :</strong> <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">supabase.com</a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. Paiement en ligne</h2>
              <p className="text-muted-foreground mb-2">
                <strong>Prestataire :</strong> Stripe Payments Europe, Ltd.
              </p>
              <p className="text-muted-foreground mb-2">
                <strong>Certification :</strong> PCI-DSS Level 1
              </p>
              <p className="text-muted-foreground">
                <strong>Site web :</strong> <a href="https://stripe.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">stripe.com</a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. Propriété intellectuelle</h2>
              <p className="text-muted-foreground mb-4">
                L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. 
                Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
              </p>
              <p className="text-muted-foreground">
                La reproduction de tout ou partie de ce site sur un support électronique quel qu'il soit est formellement interdite 
                sauf autorisation expresse du directeur de la publication.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. Cookies</h2>
              <p className="text-muted-foreground mb-4">
                Ce site utilise des cookies strictement nécessaires à son fonctionnement :
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li><strong>Cookies de session :</strong> Pour maintenir votre connexion à l'espace administrateur</li>
                <li><strong>Cookies de paiement :</strong> Pour sécuriser les transactions via Stripe</li>
              </ul>
              <p className="text-muted-foreground">
                Aucun cookie de tracking ou de publicité n'est utilisé sur ce site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">8. Liens hypertextes</h2>
              <p className="text-muted-foreground">
                Les liens hypertextes mis en place dans le cadre du présent site internet en direction d'autres ressources 
                présentes sur le réseau Internet ne sauraient engager la responsabilité de JC7.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">9. Limitation de responsabilité</h2>
              <p className="text-muted-foreground mb-4">
                JC7 ne pourra être tenu responsable des dommages directs et indirects causés au matériel de l'utilisateur, 
                lors de l'accès au site, et résultant soit de l'utilisation d'un matériel ne répondant pas aux spécifications 
                indiquées, soit de l'apparition d'un bug ou d'une incompatibilité.
              </p>
              <p className="text-muted-foreground">
                JC7 ne pourra également être tenu responsable des dommages indirects (tels par exemple qu'une perte de marché 
                ou perte d'une chance) consécutifs à l'utilisation du site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">10. Droit applicable</h2>
              <p className="text-muted-foreground">
                Les présentes mentions légales sont régies par le droit français. En cas de litige et à défaut d'accord amiable, 
                le litige sera porté devant les tribunaux français conformément aux règles de compétence en vigueur.
              </p>
            </section>

            <div className="pt-6 border-t">
              <p className="text-sm text-muted-foreground">
                <strong>Dernière mise à jour :</strong> 23 mai 2026
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
