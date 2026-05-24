# Tests JC7

Ce projet contient des tests unitaires et end-to-end pour l'application JC7.

## Types de tests

### Tests unitaires (Vitest)

Les tests unitaires vérifient la logique métier isolée, notamment :

- **`lib/categories.test.ts`** : Tests des fonctions de calcul de catégories et tarifs
  - Calcul automatique de catégorie selon l'année de naissance
  - Calcul des tarifs de base
  - Calcul des réductions familiales
  - Validation des constantes (CATEGORIES, TARIFS)

### Tests end-to-end (Playwright)

Les tests E2E vérifient le comportement complet de l'application dans un navigateur :

- **`tests/inscription.spec.ts`** : Tests du parcours d'inscription
  - Choix entre inscription simple et familiale
  - Calcul automatique de catégorie
  - Affichage des montants
  - Ajout/suppression d'enfants (inscription familiale)
  - Calcul des réductions
  - Modes de paiement

- **`tests/admin.spec.ts`** : Tests de l'interface admin
  - Redirection vers login si non authentifié
  - Protection des routes admin

## Lancer les tests

### Tests unitaires

```bash
# Lancer tous les tests unitaires
npm test

# Lancer les tests en mode watch
npm test -- --watch

# Lancer les tests avec couverture
npm test -- --coverage
```

### Tests end-to-end

```bash
# Lancer tous les tests E2E
npm run test:e2e

# Lancer les tests E2E en mode UI
npm run test:e2e -- --ui

# Lancer les tests sur un navigateur spécifique
npm run test:e2e -- --project=chromium

# Lancer les tests en mode debug
npm run test:e2e -- --debug
```

## Couverture des tests

### Fonctionnalités testées

✅ **Calcul de catégories**
- Toutes les tranches d'âge (Baby à Senior)
- Cas limites (dates vides, années limites)

✅ **Calcul de tarifs**
- Tarifs de base par catégorie
- Réductions familiales (2ème enfant : 165€, 3ème+ : 150€)
- Exclusion des seniors des réductions

✅ **Interface utilisateur**
- Navigation entre formulaires
- Calcul automatique en temps réel
- Affichage des montants
- Gestion multi-enfants

✅ **Sécurité**
- Protection des routes admin
- Redirection vers login

### Fonctionnalités critiques à tester manuellement

⚠️ **Paiement Stripe**
- Redirection vers Stripe Checkout
- Webhook de confirmation
- Mise à jour du statut de paiement

⚠️ **Génération de reçus PDF**
- Contenu du PDF
- Calcul des montants dans le reçu
- Téléchargement du fichier

⚠️ **Base de données Supabase**
- Création des inscriptions
- Row Level Security
- Authentification admin

## Configuration

### Vitest

Configuration dans `vitest.config.ts` :
- Environnement Node.js
- Alias `@` pour les imports
- Mode globals activé

### Playwright

Configuration dans `playwright.config.ts` :
- Tests sur Chrome, Firefox, Safari
- Tests mobile (Pixel 5, iPhone 12)
- Serveur de développement automatique
- Retry en cas d'échec (CI)

## Bonnes pratiques

1. **Écrire des tests avant de corriger un bug** : Créez un test qui reproduit le bug, puis corrigez-le
2. **Tester les cas limites** : Dates invalides, valeurs extrêmes, champs vides
3. **Isoler les tests** : Chaque test doit être indépendant
4. **Nommer clairement** : Les noms de tests doivent décrire le comportement attendu
5. **Éviter les tests fragiles** : Ne pas tester les détails d'implémentation

## Ajouter de nouveaux tests

### Test unitaire

```typescript
// lib/maFonction.test.ts
import { describe, it, expect } from 'vitest';
import { maFonction } from './maFonction';

describe('maFonction', () => {
  it('devrait retourner le résultat attendu', () => {
    expect(maFonction('input')).toBe('output');
  });
});
```

### Test E2E

```typescript
// tests/maPage.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Ma page', () => {
  test('devrait afficher le contenu', async ({ page }) => {
    await page.goto('/ma-page');
    await expect(page.getByRole('heading')).toBeVisible();
  });
});
```

## CI/CD

Les tests sont conçus pour s'exécuter en CI :
- Retry automatique en cas d'échec
- Rapport HTML généré
- Pas de serveur réutilisé en CI

## Dépannage

### Les tests E2E échouent

1. Vérifier que le serveur de dev tourne : `npm run dev`
2. Vérifier l'URL de base dans `playwright.config.ts`
3. Installer les navigateurs : `npx playwright install`

### Les tests unitaires échouent

1. Vérifier les imports (alias `@`)
2. Vérifier la configuration Vitest
3. Nettoyer le cache : `npm test -- --clearCache`
