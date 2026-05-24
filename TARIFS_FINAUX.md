# Tarifs finaux - JC7

## Règles de tarification

### Tarifs de base

| Catégorie | Tarif | Réduction possible |
|-----------|-------|-------------------|
| **Baby** (4-5 ans) | **130€** | ❌ Non (toujours 130€) |
| Mini-poussin (6-7 ans) | 180€ | ✅ Oui |
| Poussin (8-9 ans) | 180€ | ✅ Oui |
| Benjamin (10-11 ans) | 180€ | ✅ Oui |
| Minime (12-13 ans) | 180€ | ✅ Oui |
| Cadet (14-16 ans) | 180€ | ✅ Oui |
| Junior (17-19 ans) | 180€ | ✅ Oui |
| **Senior** (20+ ans) | **180€** | ❌ Non (toujours 180€) |

### Réductions familiales

Les réductions s'appliquent **uniquement** aux catégories à 180€ (mini-poussin à junior) :

| Position | Tarif |
|----------|-------|
| 1er enfant | 180€ |
| 2ème enfant | 165€ (-15€) |
| 3ème enfant et + | 150€ (-30€) |

**Important :** Les baby et les seniors ne comptent pas dans le calcul des réductions et gardent toujours leur tarif de base.

## Exemples de calcul

### Exemple 1 : 3 baby
```
1er baby: 130€
2ème baby: 130€
3ème baby: 130€
─────────────
Total: 390€
```
✅ Aucune réduction (les baby ne bénéficient pas des réductions)

### Exemple 2 : 3 poussins
```
1er poussin: 180€
2ème poussin: 165€ (réduction)
3ème poussin: 150€ (réduction)
─────────────
Total: 495€
```
✅ Réductions appliquées

### Exemple 3 : 1 baby + 2 poussins
```
1er baby: 130€
1er poussin: 180€
2ème poussin: 165€ (réduction)
─────────────
Total: 475€
```
✅ Le baby ne compte pas, donc les 2 poussins sont comptés comme 1er et 2ème

### Exemple 4 : 2 baby + 1 poussin
```
1er baby: 130€
2ème baby: 130€
1er poussin: 180€
─────────────
Total: 440€
```
✅ Les baby ne comptent pas, le poussin est le 1er enfant pour les réductions

### Exemple 5 : 1 baby + 3 poussins
```
1er baby: 130€
1er poussin: 180€
2ème poussin: 165€ (réduction)
3ème poussin: 150€ (réduction)
─────────────
Total: 625€
```
✅ Le baby ne compte pas, les 3 poussins bénéficient des réductions

### Exemple 6 : 2 baby + 1 adulte
```
1er baby: 130€
2ème baby: 130€
Adulte (senior): 180€
─────────────
Total: 440€
```
✅ Ni les baby ni l'adulte ne bénéficient de réductions

### Exemple 7 : 1 poussin + 1 baby + 1 minime
```
1er poussin: 180€
1er baby: 130€
2ème minime: 165€ (réduction)
─────────────
Total: 475€
```
✅ Le baby ne compte pas, le minime est le 2ème enfant pour les réductions

### Exemple 8 : Famille nombreuse (2 baby + 4 poussins)
```
1er baby: 130€
2ème baby: 130€
1er poussin: 180€
2ème poussin: 165€ (réduction)
3ème poussin: 150€ (réduction)
4ème poussin: 150€ (réduction)
─────────────
Total: 905€
```
✅ Les baby ne comptent pas, les 4 poussins bénéficient des réductions

## Logique de comptage

### Qui compte pour les réductions ?
- ✅ Mini-poussin (6-7 ans)
- ✅ Poussin (8-9 ans)
- ✅ Benjamin (10-11 ans)
- ✅ Minime (12-13 ans)
- ✅ Cadet (14-16 ans)
- ✅ Junior (17-19 ans)

### Qui ne compte pas ?
- ❌ Baby (4-5 ans) → Toujours 130€
- ❌ Senior (20+ ans) → Toujours 180€

## Ordre de traitement

Dans le formulaire d'inscription familiale, l'ordre de saisie détermine l'ordre de calcul. Pour optimiser :

### Stratégie recommandée
1. Inscrire d'abord les catégories à 180€ (pour bénéficier des réductions)
2. Inscrire ensuite les baby (qui restent à 130€)
3. Inscrire enfin les adultes (qui restent à 180€)

### Exemple d'optimisation
**Ordre optimal :**
```
1. Poussin: 180€
2. Minime: 165€
3. Baby: 130€
Total: 475€
```

**Ordre non optimal :**
```
1. Baby: 130€
2. Poussin: 180€
3. Minime: 165€
Total: 475€ (même résultat)
```

En fait, l'ordre n'a pas d'importance car les baby ne comptent pas dans le calcul ! 😊

## Affichage dans le formulaire

### Pour chaque enfant
- Le tarif s'affiche automatiquement après sélection de la date de naissance
- Si réduction appliquée : mention "(réduction appliquée)"
- Si baby ou senior : pas de mention de réduction

### Total
Le total est calculé en temps réel et affiché en bas du formulaire.

## Reçu PDF

Le reçu PDF affiche :
- Le tarif de chaque enfant
- La mention "(réduction Xème enfant)" si applicable
- Le total à payer

Exemple de reçu :
```
1. Lucas Dupont - Poussin - 180€
2. Marie Dupont - Minime - 165€ (réduction 2ème enfant)
3. Tom Dupont - Baby - 130€

TOTAL: 475€
```

## Cas particuliers

### Que se passe-t-il si on inscrit uniquement des baby ?
Tous les baby paient 130€, pas de réduction.

### Que se passe-t-il si on inscrit uniquement des adultes ?
Tous les adultes paient 180€, pas de réduction.

### Peut-on mélanger baby, enfants et adultes ?
Oui ! Seuls les enfants de 6 à 19 ans (mini-poussin à junior) bénéficient des réductions.

## Résumé

✅ **Baby** : Toujours 130€, jamais de réduction
✅ **Catégories 6-19 ans** : 180€ de base, réductions possibles (165€, 150€)
✅ **Senior** : Toujours 180€, jamais de réduction
✅ **Comptage** : Seules les catégories 6-19 ans comptent pour les réductions
✅ **Ordre** : N'a pas d'importance grâce au système de comptage intelligent

## Statut
✅ **Implémenté et testé** - Les tarifs fonctionnent correctement avec les règles définies.
