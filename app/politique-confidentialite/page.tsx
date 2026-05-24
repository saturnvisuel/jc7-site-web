import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { CLUB_INFO } from "@/lib/club-info";

export default function PolitiqueConfidentialitePage() {
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
            <h1 className="text-4xl font-bold mb-6">Politique de Confidentialité</h1>

            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-6">
              <p className="text-blue-900 font-semibold">
                {CLUB_INFO.fullName} s'engage à protéger vos données personnelles conformément au Règlement Général sur la Protection des Données (RGPD).
              </p>
            </div>

            <section>
              <h2 className="text-2xl font-bold mb-4">1. Responsable du traitement</h2>
              <p className="text-muted-foreground mb-2">
                <strong>Association :</strong> {CLUB_INFO.name}
              </p>
              <p className="text-muted-foreground mb-2">
                <strong>Adresse :</strong> {CLUB_INFO.fullAddress}
              </p>
              <p className="text-muted-foreground mb-2">
                <strong>Email :</strong> {CLUB_INFO.email}
              </p>
              <p className="text-muted-foreground">
                <strong>Délégué à la protection des données :</strong> {CLUB_INFO.dpo}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. Données collectées</h2>
              
              <h3 className="text-xl font-semibold mb-3">2.1 Lors de l'inscription</h3>
              <p className="text-muted-foreground mb-3">Nous collectons les données suivantes :</p>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-semibold mb-2">Informations personnelles de l'adhérent :</h4>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Nom et prénom</li>
                  <li>Date de naissance</li>
                  <li>Numéro de sécurité sociale</li>
                  <li>Adresse postale complète</li>
                  <li>Email</li>
                  <li>Numéro de téléphone</li>
                  <li>Ceinture de judo (optionnel)</li>
                  <li>Informations médicales (optionnel)</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-semibold mb-2">Pour les mineurs - Informations du responsable légal :</h4>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Nom et prénom</li>
                  <li>Adresse postale</li>
                  <li>Email</li>
                  <li>Numéro de téléphone</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Données de paiement :</h4>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Mode de paiement choisi (carte, chèque, espèces)</li>
                  <li>Statut du paiement</li>
                  <li>Montant</li>
                  <li><strong>Note :</strong> Les données bancaires ne sont jamais stockées sur nos serveurs (gérées par Stripe)</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. Finalités du traitement</h2>
              <p className="text-muted-foreground mb-3">Vos données sont collectées pour :</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong>Gestion des inscriptions :</strong> Traiter votre adhésion au club</li>
                <li><strong>Gestion administrative :</strong> Tenir à jour le fichier des adhérents</li>
                <li><strong>Gestion des paiements :</strong> Suivre les cotisations et paiements</li>
                <li><strong>Communication :</strong> Vous informer des activités du club</li>
                <li><strong>Sécurité :</strong> Contact d'urgence en cas de besoin</li>
                <li><strong>Obligations légales :</strong> Conformité avec la Fédération Française de Judo</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Base légale du traitement</h2>
              <p className="text-muted-foreground mb-3">Le traitement de vos données repose sur :</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong>Exécution du contrat :</strong> Votre inscription au club constitue un contrat</li>
                <li><strong>Obligation légale :</strong> Déclaration à la Fédération Française de Judo</li>
                <li><strong>Consentement :</strong> Pour les données optionnelles (informations médicales)</li>
                <li><strong>Intérêt légitime :</strong> Gestion administrative de l'association</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. Destinataires des données</h2>
              <p className="text-muted-foreground mb-3">Vos données sont accessibles uniquement à :</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong>Personnel autorisé du club :</strong> Bureau et administrateurs</li>
                <li><strong>Fédération Française de Judo :</strong> Pour la licence sportive</li>
                <li><strong>Prestataires techniques :</strong>
                  <ul className="list-circle list-inside ml-6 mt-1">
                    <li>Supabase (hébergement base de données - UE)</li>
                    <li>Stripe (paiement en ligne - certifié PCI-DSS)</li>
                    <li>Vercel (hébergement site web)</li>
                  </ul>
                </li>
              </ul>
              <p className="text-muted-foreground mt-3">
                <strong>Aucune donnée n'est vendue ou transmise à des tiers à des fins commerciales.</strong>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. Durée de conservation</h2>
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <p className="text-muted-foreground">
                  <strong>Adhérents actifs :</strong> Pendant toute la durée de l'adhésion + 1 an
                </p>
                <p className="text-muted-foreground">
                  <strong>Anciens adhérents :</strong> 3 ans après la dernière adhésion (obligations comptables et fiscales)
                </p>
                <p className="text-muted-foreground">
                  <strong>Données de paiement :</strong> 10 ans (obligations légales comptables)
                </p>
                <p className="text-muted-foreground">
                  <strong>Informations médicales :</strong> Supprimées à la fin de l'adhésion
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. Sécurité des données</h2>
              <p className="text-muted-foreground mb-3">Nous mettons en œuvre les mesures suivantes :</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong>Chiffrement :</strong> Toutes les communications sont chiffrées (HTTPS/SSL)</li>
                <li><strong>Authentification :</strong> Accès admin protégé par mot de passe sécurisé</li>
                <li><strong>Hébergement sécurisé :</strong> Données stockées dans l'Union Européenne</li>
                <li><strong>Sauvegardes :</strong> Sauvegardes automatiques quotidiennes</li>
                <li><strong>Accès restreint :</strong> Seuls les administrateurs autorisés ont accès aux données</li>
                <li><strong>Paiement sécurisé :</strong> Aucune donnée bancaire stockée (Stripe PCI-DSS Level 1)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">8. Vos droits (RGPD)</h2>
              <p className="text-muted-foreground mb-4">
                Conformément au RGPD, vous disposez des droits suivants :
              </p>

              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">✓ Droit d'accès</h4>
                  <p className="text-blue-800 text-sm">
                    Vous pouvez demander une copie de toutes les données vous concernant.
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">✓ Droit de rectification</h4>
                  <p className="text-blue-800 text-sm">
                    Vous pouvez demander la correction de données inexactes ou incomplètes.
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">✓ Droit à l'effacement</h4>
                  <p className="text-blue-800 text-sm">
                    Vous pouvez demander la suppression de vos données (sauf obligations légales).
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">✓ Droit à la limitation</h4>
                  <p className="text-blue-800 text-sm">
                    Vous pouvez demander la limitation du traitement de vos données.
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">✓ Droit à la portabilité</h4>
                  <p className="text-blue-800 text-sm">
                    Vous pouvez récupérer vos données dans un format structuré (CSV, PDF).
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">✓ Droit d'opposition</h4>
                  <p className="text-blue-800 text-sm">
                    Vous pouvez vous opposer au traitement de vos données pour des raisons légitimes.
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">✓ Droit de retirer votre consentement</h4>
                  <p className="text-blue-800 text-sm">
                    Pour les données optionnelles, vous pouvez retirer votre consentement à tout moment.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">9. Exercer vos droits</h2>
              <p className="text-muted-foreground mb-4">
                Pour exercer vos droits, vous pouvez :
              </p>
              
              <div className="bg-green-50 border-l-4 border-green-600 p-4 mb-4">
                <p className="text-green-900 mb-2">
                  <strong>📧 Par email :</strong> {CLUB_INFO.email}
                </p>
                <p className="text-green-900 mb-2">
                  <strong>📮 Par courrier :</strong> {CLUB_INFO.name} - {CLUB_INFO.fullAddress}
                </p>
                <p className="text-green-900">
                  <strong>🏢 Sur place :</strong> Lors des permanences du club
                </p>
              </div>

              <p className="text-muted-foreground mb-2">
                <strong>Délai de réponse :</strong> 1 mois maximum
              </p>
              <p className="text-muted-foreground">
                <strong>Pièce d'identité :</strong> Une copie peut être demandée pour vérifier votre identité
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">10. Droit de réclamation</h2>
              <p className="text-muted-foreground mb-4">
                Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation auprès de la CNIL :
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-muted-foreground mb-2">
                  <strong>Commission Nationale de l'Informatique et des Libertés (CNIL)</strong>
                </p>
                <p className="text-muted-foreground mb-2">
                  3 Place de Fontenoy - TSA 80715
                </p>
                <p className="text-muted-foreground mb-2">
                  75334 PARIS CEDEX 07
                </p>
                <p className="text-muted-foreground">
                  Site web : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.cnil.fr</a>
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">11. Cookies</h2>
              <p className="text-muted-foreground mb-3">
                Ce site utilise uniquement des cookies strictement nécessaires à son fonctionnement :
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong>Cookies de session :</strong> Pour maintenir votre connexion (espace admin)</li>
                <li><strong>Cookies de paiement :</strong> Pour sécuriser les transactions Stripe</li>
              </ul>
              <p className="text-muted-foreground mt-3">
                <strong>Aucun cookie de tracking, publicité ou analyse n'est utilisé.</strong>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">12. Transferts de données hors UE</h2>
              <p className="text-muted-foreground mb-3">
                Vos données sont principalement stockées dans l'Union Européenne. Certains prestataires peuvent être situés hors UE :
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong>Stripe :</strong> Certifié PCI-DSS, clauses contractuelles types UE</li>
                <li><strong>Vercel :</strong> Hébergement avec garanties de protection des données</li>
              </ul>
              <p className="text-muted-foreground mt-3">
                Tous nos prestataires respectent les standards de protection des données personnelles.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">13. Mineurs</h2>
              <p className="text-muted-foreground mb-3">
                Pour les adhérents mineurs (moins de 18 ans) :
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>L'inscription doit être effectuée par un responsable légal</li>
                <li>Le responsable légal consent au traitement des données de l'enfant</li>
                <li>Le responsable légal peut exercer les droits RGPD au nom de l'enfant</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">14. Modifications de la politique</h2>
              <p className="text-muted-foreground">
                Cette politique de confidentialité peut être modifiée à tout moment. La version en vigueur est toujours 
                accessible sur cette page. En cas de modification substantielle, vous serez informé par email.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">15. Contact</h2>
              <p className="text-muted-foreground mb-3">
                Pour toute question concernant vos données personnelles :
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-600 p-4">
                <p className="text-blue-900 mb-2">
                  <strong>Email :</strong> {CLUB_INFO.email}
                </p>
                <p className="text-blue-900 mb-2">
                  <strong>Téléphone :</strong> {CLUB_INFO.phone}
                </p>
                <p className="text-blue-900">
                  <strong>Adresse :</strong> {CLUB_INFO.name} - {CLUB_INFO.fullAddress}
                </p>
              </div>
            </section>

            <div className="pt-6 border-t">
              <p className="text-sm text-muted-foreground mb-2">
                <strong>Dernière mise à jour :</strong> 23 mai 2026
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Version :</strong> 1.0
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
