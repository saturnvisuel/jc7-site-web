# JC7 - Site Web du Judo Courneuvien 7

Application web MVP pour la gestion des inscriptions et paiements du club de judo JC7.

## Stack Technique

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, RLS)
- **Paiements**: Stripe Checkout
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

### Création de la table registrations

Exécuter le script SQL suivant dans l'éditeur SQL de Supabase:

```sql
-- Voir le fichier: supabase/migrations/001_create_registrations.sql
```

### Row Level Security (RLS)

Les politiques RLS sont définies dans:
```sql
-- Voir le fichier: supabase/migrations/002_setup_rls.sql
```

## Développement

Lancer le serveur de développement:

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## Structure du projet

```
jc7-site-web/
├── app/                      # Pages Next.js (App Router)
│   ├── page.tsx             # Page d'accueil
│   ├── inscription/         # Page d'inscription
│   ├── admin/               # Dashboard admin
│   └── api/                 # API routes
│       └── stripe/          # Webhooks Stripe
├── components/              # Composants React
│   └── ui/                  # Composants shadcn/ui
├── lib/                     # Utilitaires
│   ├── supabase/           # Clients Supabase
│   └── utils.ts            # Fonctions utilitaires
├── supabase/               # Migrations et schémas
│   └── migrations/         # Scripts SQL
└── public/                 # Assets statiques
```

## Fonctionnalités

### Pages publiques
- ✅ Page d'accueil avec présentation du club
- ✅ Formulaire d'inscription
- ✅ Intégration Stripe Checkout

### Dashboard Admin
- ✅ Authentification sécurisée
- ✅ Liste des inscriptions
- ✅ Recherche et filtres
- ✅ Tri par colonnes
- ✅ Export CSV/Excel
- ✅ Édition et suppression

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

Pour toute question: contact@jc7.fr
