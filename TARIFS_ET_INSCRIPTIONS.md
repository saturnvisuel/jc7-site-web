# Tarifs et Inscriptions JC7

## Tarifs 2026

### Tarifs de base

| Catégorie | Tarif |
|-----------|-------|
| Baby Judo (4-5 ans) | 130 € |
| Mini-Poussins à Juniors (6-19 ans) | 180 € |
| Seniors (20 ans et +) | 180 € |

### Réductions familiales

Les réductions s'appliquent automatiquement lors d'une inscription familiale :

- **1er enfant** : Tarif normal (130 € ou 180 € selon catégorie)
- **2ème enfant** : 165 € (réduction de 15 €)
- **3ème enfant et suivants** : 150 € (réduction de 30 €)

**Important** : Les réductions ne s'appliquent qu'aux enfants (catégories Baby à Junior). Les adultes (Seniors) paient toujours le tarif normal de 180 €.

### Exemples de calcul

#### Famille avec 2 enfants
- Enfant 1 (Poussin) : 180 €
- Enfant 2 (Baby) : 165 €
- **Total : 345 €** (au lieu de 310 €)

#### Famille avec 3 enfants
- Enfant 1 (Benjamin) : 180 €
- Enfant 2 (Poussin) : 165 €
- Enfant 3 (Baby) : 150 €
- **Total : 495 €** (au lieu de 490 €)

#### Famille avec 1 adulte et 2 enfants
- Adulte (Senior) : 180 €
- Enfant 1 (Minime) : 180 €
- Enfant 2 (Poussin) : 165 €
- **Total : 525 €**

## Types d'inscription

### Inscription simple
- Pour une seule personne (enfant ou adulte)
- Formulaire classique avec toutes les informations
- Paiement par carte, chèque ou espèces

### Inscription familiale
- Pour inscrire plusieurs enfants d'une même famille
- Réductions automatiques appliquées
- Un seul responsable légal pour tous les enfants
- Calcul automatique du total avec réductions
- Paiement groupé

## Fonctionnalités

### Sélection automatique de catégorie
La catégorie d'âge est automatiquement sélectionnée en fonction de la date de naissance :

| Année de naissance | Catégorie |
|-------------------|-----------|
| 2020-2021 | Baby Judo |
| 2018-2019 | Mini-Poussins |
| 2016-2017 | Poussins |
| 2014-2015 | Benjamins |
| 2012-2013 | Minimes |
| 2009-2011 | Cadets |
| 2006-2008 | Juniors |
| 2005 et avant | Seniors |

### Modes de paiement
1. **Carte bancaire** : Paiement en ligne sécurisé via Stripe
2. **Chèque** : À l'ordre de 'JC7', à remettre lors de la première séance
3. **Espèces** : À remettre lors de la première séance

## Fichiers modifiés

### Logique métier
- `lib/categories.ts` : Gestion des catégories, tarifs et réductions
- `app/api/registrations/family/route.ts` : API pour inscriptions familiales

### Composants
- `components/registration-form.tsx` : Formulaire d'inscription simple
- `components/registration-form-family.tsx` : Formulaire d'inscription familiale
- `app/inscription/page.tsx` : Page de choix du type d'inscription

### Génération de reçus
- `app/api/registrations/[id]/receipt/route.ts` : Génération PDF des reçus
