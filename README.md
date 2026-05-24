# JC7 - Site Web du Judo Courneuvien 7

Application web MVP pour la gestion des inscriptions et paiements du club de judo JC7.

**Développé par** : Saturn.  
**Client** : JC7 - Judo Courneuvien 7  
**Date** : Mai 2026

## Stack Technique

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, RLS)
- **Paiements**: Stripe Checkout (carte bancaire)
- **Export**: CSV avec filtres personnalisables
- **PDF**: Génération de fiches d'inscription (jsPDF)
- **Déploiement**: Vercel

## Prérequis

- Node.js 18+ et npm
- Compte Supabase
- Compte Stripe

## Installation

1. Cloner le projet et installer les dépendances:

```bash
npm install
```

2. Copier le fichier d'environnement:

```bash
copy .env.example .env.local
```

3. Configurer les variables d'environnement dans `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon_supabase
SUPABASE_SERVICE_ROLE_KEY=votre_cle_service_role

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=votre_cle_publique_stripe
STRIPE_SECRET_KEY=votre_cle_secrete_stripe
STRIPE_WEBHOOK_SECRET=votre_secret_webhook_stripe

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Exécuter les migrations Supabase (voir section Base de données)

## Base de données

### Migrations à exécuter dans Supabase (SQL Editor)

Exécuter les migrations dans l'ordre suivant :

1. **Création de la table registrations**
```sql
-- Voir: supabase/migrations/001_create_registrations.sql
```

2. **Row Level Security (RLS)**
```sql
-- Voir: supabase/migrations/002_setup_rls.sql
```

3. **Ajout du champ payment_method**
```sql
-- Voir: supabase/migrations/003_add_payment_method.sql
```

4. **Formulaire complet d'inscription**
```sql
-- Voir: supabase/migrations/004_add_full_registration_fields.sql
-- Ajoute: ceinture, adresse complète, téléphones, n° sécu, responsable légal
```

### Schéma de la table registrations

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | uuid | Identifiant unique |
| `first_name` | varchar | Prénom du pratiquant |
| `last_name` | varchar | Nom du pratiquant |
| `birth_date` | date | Date de naissance |
| `category` | varchar | Catégorie d'âge |
| `belt` | varchar | Ceinture (optionnel) |
| `address` | text | Adresse |
| `postal_code` | varchar | Code postal |
| `city` | varchar | Ville |
| `phone` | varchar | Téléphone principal |
| `phone_alt` | varchar | Téléphone secondaire (optionnel) |
| `email` | varchar | Email |
| `social_security_number` | varchar | Numéro de sécurité sociale |
| `is_self_registration` | boolean | Inscription pour soi-même |
| `guardian_first_name` | varchar | Prénom responsable légal |
| `guardian_last_name` | varchar | Nom responsable légal |
| `guardian_address` | text | Adresse responsable |
| `guardian_postal_code` | varchar | Code postal responsable |
| `guardian_city` | varchar | Ville responsable |
| `guardian_phone` | varchar | Téléphone responsable |
| `guardian_email` | varchar | Email responsable |
| `medical_note` | text | Note médicale (optionnel) |
| `payment_method` | varchar | Mode de paiement (carte/cheque/especes) |
| `payment_status` | varchar | Statut (pending/paid/cancelled) |
| `stripe_session_id` | varchar | ID session Stripe (si carte) |
| `created_at` | timestamp | Date d'inscription |

## Développement

Lancer le serveur de développement:

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## Structure du projet

```
jc7-site-web/
├── app/                                    # Pages Next.js (App Router)
│   ├── page.tsx                           # Page d'accueil
│   ├── inscription/page.tsx               # Formulaire d'inscription public
│   ├── login/page.tsx                     # Page de connexion admin
│   ├── admin/                             # Dashboard admin
│   │   ├── dashboard/page.tsx            # Tableau de bord
│   │   ├── registrations/page.tsx        # Liste des inscriptions
│   │   └── paiements/page.tsx            # Gestion paiements manuels
│   └── api/                               # API routes
│       ├── registrations/route.ts         # POST inscription
│       ├── registrations/[id]/pdf/route.ts # GET PDF fiche
│       ├── admin/
│       │   ├── validate-payment/route.ts  # POST valider paiement
│       │   └── cancel-payment/route.ts    # POST annuler paiement
│       └── stripe/
│           └── webhook/route.ts           # POST webhook Stripe
├── components/                            # Composants React
│   ├── registration-form.tsx             # Formulaire inscription
│   ├── admin/
│   │   ├── registrations-table.tsx       # Tableau inscriptions
│   │   ├── export-csv-dialog.tsx         # Dialog export CSV
│   │   └── payments-management.tsx       # Gestion paiements
│   └── ui/                                # Composants shadcn/ui
├── lib/                                   # Utilitaires
│   ├── supabase/
│   │   ├── client.ts                     # Client browser
│   │   ├── server.ts                     # Client serveur
│   │   └── types.ts                      # Types TypeScript
│   └── utils.ts                          # Fonctions utilitaires
├── supabase/migrations/                   # Migrations SQL
│   ├── 001_create_registrations.sql
│   ├── 002_setup_rls.sql
│   ├── 003_add_payment_method.sql
│   └── 004_add_full_registration_fields.sql
└── public/                                # Assets statiques
```

## Routes API

### Publiques
- `POST /api/registrations` - Créer une inscription
- `POST /api/stripe/webhook` - Webhook Stripe (paiements carte)

### Admin (authentification requise)
- `GET /api/registrations/[id]/pdf` - Télécharger fiche PDF
- `POST /api/admin/validate-payment` - Valider un paiement manuel
- `POST /api/admin/cancel-payment` - Annuler une inscription

## Fonctionnalités

### Pages publiques
- ✅ Page d'accueil avec présentation du club
- ✅ **Formulaire d'inscription complet** avec :
  - Informations du pratiquant (nom, prénom, date naissance, catégorie, ceinture)
  - Adresse complète (rue, code postal, ville)
  - Contacts (2 téléphones, email, n° sécurité sociale)
  - Responsable légal (si mineur) avec case à cocher "Je m'inscris pour moi-même"
  - Note médicale (optionnel)
- ✅ **3 modes de paiement** :
  - 💳 Carte bancaire (Stripe Checkout en ligne)
  - 📝 Chèque (à remettre au club)
  - 💵 Espèces (à remettre au club)

### Dashboard Admin (`/admin`)
- ✅ **Authentification sécurisée** (Supabase Auth)
- ✅ **Tableau de bord** avec statistiques :
  - Nombre total d'inscriptions
  - Paiements en attente (chèque/espèces)
  - Liens rapides vers les pages de gestion
- ✅ **Liste des inscriptions** (`/admin/registrations`) :
  - Recherche globale
  - Filtres par statut de paiement
  - Tri par colonnes
  - Pagination
- ✅ **Export CSV personnalisable** :
  - Sélection des colonnes à exporter (20 colonnes disponibles)
  - Filtres par statut de paiement et catégorie
  - Compteur en temps réel des inscriptions filtrées
  - Format compatible Excel (UTF-8 BOM)
- ✅ **Génération PDF** :
  - Fiche d'inscription complète par membre
  - Téléchargement direct depuis le tableau
  - Format professionnel avec logo et sections
- ✅ **Gestion des paiements manuels** (`/admin/paiements`) :
  - Liste des paiements en attente (chèque/espèces)
  - Validation des paiements
  - Annulation d'inscriptions
  - Filtres et recherche

## Tests

```bash
# Tests unitaires
npm run test

# Tests E2E
npm run test:e2e
```

## Déploiement

### Vercel

1. Connecter le repo GitHub à Vercel
2. Configurer les variables d'environnement
3. Déployer automatiquement à chaque push

### Configuration Stripe Webhook

Après déploiement, configurer le webhook Stripe:
- URL: `https://votre-domaine.vercel.app/api/stripe/webhook`
- Événements: `checkout.session.completed`

## Sécurité

- ✅ Variables d'environnement pour les secrets
- ✅ Row Level Security (RLS) sur Supabase
- ✅ Validation des webhooks Stripe
- ✅ Protection des routes admin
- ✅ Validation côté serveur (Zod)

## Support

Pour toute question: judo.courneuve93@gmail.com

---

## Crédits

**Développement** : Saturn.  
**Technologies** : Next.js, TypeScript, Supabase, Stripe  
**Année** : 2026

© 2026 Saturn. Tous droits réservés.
