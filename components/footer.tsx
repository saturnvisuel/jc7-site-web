import Link from "next/link";
import { CLUB_INFO } from "@/lib/club-info";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* À propos */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">{CLUB_INFO.name}</h3>
            <p className="text-sm mb-4">
              Club de judo affilié à la {CLUB_INFO.federation}.
            </p>
            <p className="text-sm">
              Cours pour tous les âges, du baby judo aux adultes.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Contact</h3>
            <div className="text-sm space-y-2">
              <p>
                <strong>Email :</strong>{" "}
                <a href={`mailto:${CLUB_INFO.email}`} className="hover:text-white transition-colors">
                  {CLUB_INFO.email}
                </a>
              </p>
              <p>
                <strong>Téléphone :</strong> {CLUB_INFO.phone}
              </p>
              <p>
                <strong>Adresse :</strong><br />
                {CLUB_INFO.fullAddress}
              </p>
            </div>
          </div>

          {/* Liens utiles */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Informations légales</h3>
            <ul className="text-sm space-y-2">
              <li>
                <Link href="/mentions-legales" className="hover:text-white transition-colors">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link href="/politique-confidentialite" className="hover:text-white transition-colors">
                  Politique de confidentialité (RGPD)
                </Link>
              </li>
              <li>
                <a
                  href={CLUB_INFO.federationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  {CLUB_INFO.federation}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-sm text-center">
          <p>
            © {currentYear} {CLUB_INFO.name}. Tous droits réservés.
          </p>
          <p className="mt-2 text-xs">
            Site conforme au RGPD • Paiement sécurisé par Stripe • Données hébergées dans l'UE
          </p>
          <p className="mt-2 text-xs text-gray-500">
            Développé par{" "}
            {CLUB_INFO.developerUrl ? (
              <a 
                href={CLUB_INFO.developerUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-gray-300 transition-colors"
              >
                {CLUB_INFO.developer}
              </a>
            ) : (
              CLUB_INFO.developer
            )}
          </p>
        </div>
      </div>
    </footer>
  );
}
