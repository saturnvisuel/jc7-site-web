# Prochaines étapes - JC7 Site Web

## ✅ Complété

- [x] Structure de base Next.js avec TypeScript
- [x] Configuration Tailwind CSS et shadcn/ui
- [x] Page d'accueil
- [x] Page d'inscription avec formulaire validé
- [x] Intégration Stripe Checkout
- [x] API route pour les inscriptions
- [x] Webhook Stripe pour confirmation de paiement
- [x] Migrations Supabase (schéma + RLS)
- [x] Composants UI (Button, Input, Label, Textarea, Select)

## 🚧 À compléter

### 1. Dashboard Admin

Créer les pages suivantes dans `app/admin/`:

- **Login** (`/admin/login`)
  - Formulaire d'authentification Supabase
  - Redirection vers dashboard après login
  
- **Dashboard** (`/admin/dashboard`)
  - Vue d'ensemble des inscriptions
  - Statistiques (total, payées, en attente)
  
- **Liste des inscriptions** (`/admin/registrations`)
  - Table avec TanStack Table
  - Pagination, tri, filtres
  - Recherche par nom, email
  - Filtre par statut de paiement
  - Actions: voir détails, modifier, supprimer
  - Export CSV/Excel
  
- **Détails inscription** (`/admin/registrations/[id]`)
  - Affichage complet des informations
  - Formulaire d'édition
  - Historique des paiements

### 2. Middleware d'authentification

Créer `middleware.ts` à la racine pour protéger les routes admin:

```typescript
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session && req.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }

  return res
}

export const config = {
  matcher: '/admin/:path*',
}
```

### 3. Configuration Supabase

1. Créer un projet sur [supabase.com](https://supabase.com)
2. Exécuter les migrations SQL dans l'éditeur SQL:
   - `supabase/migrations/001_create_registrations.sql`
   - `supabase/migrations/002_setup_rls.sql`
3. Créer un utilisateur admin dans Authentication
4. Copier les clés API dans `.env.local`

### 4. Configuration Stripe

1. Créer un compte sur [stripe.com](https://stripe.com)
2. Récupérer les clés API (mode test)
3. Configurer le webhook:
   - URL: `https://votre-domaine.vercel.app/api/stripe/webhook`
   - Événement: `checkout.session.completed`
4. Copier le secret webhook dans `.env.local`

### 5. Variables d'environnement

Créer `.env.local` avec:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 6. Tests

Créer des tests pour:
- Validation du formulaire d'inscription
- Création d'inscription dans Supabase
- Webhook Stripe
- Export CSV

### 7. Déploiement

1. Pousser le code sur GitHub
2. Connecter le repo à Vercel
3. Configurer les variables d'environnement sur Vercel
4. Déployer
5. Mettre à jour l'URL du webhook Stripe avec l'URL de production

## 📝 Notes importantes

- **Sécurité**: Ne jamais commiter le fichier `.env.local`
- **Prix**: Modifier le montant dans `app/api/registrations/route.ts` (actuellement 200€)
- **Catégories**: Ajuster les catégories de judo selon les besoins du club
- **Email**: Ajouter l'envoi d'emails de confirmation (via Resend ou SendGrid)
- **Images**: Ajouter des images du club dans `public/`

## 🔧 Commandes utiles

```bash
# Développement
npm run dev

# Build de production
npm run build

# Lancer les tests
npm run test

# Linter
npm run lint
```

## 📚 Documentation

- [Next.js](https://nextjs.org/docs)
- [Supabase](https://supabase.com/docs)
- [Stripe](https://stripe.com/docs)
- [TanStack Table](https://tanstack.com/table/latest)
- [shadcn/ui](https://ui.shadcn.com)
