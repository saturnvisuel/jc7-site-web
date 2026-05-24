# Test - Inscription Familiale

## Problème corrigé
Les catégories ne se mettaient pas à jour automatiquement quand on saisissait la date de naissance pour plusieurs enfants.

## Solution appliquée

### 1. Correction du `useEffect`
**Avant :**
```typescript
useEffect(() => {
  children.forEach((child, index) => {
    if (child.birthDate) {
      const autoCategory = calculateCategory(child.birthDate);
      if (autoCategory && child.category !== autoCategory) {
        setValue(`children.${index}.category`, autoCategory);
      }
    }
  });
}, [children, setValue]); // ❌ Boucle infinie car children change
```

**Après :**
```typescript
useEffect(() => {
  children.forEach((child, index) => {
    if (child.birthDate) {
      const autoCategory = calculateCategory(child.birthDate);
      if (autoCategory && child.category !== autoCategory) {
        setValue(`children.${index}.category`, autoCategory, { shouldValidate: false });
      }
    }
  });
}, [children.map(c => c.birthDate).join(','), setValue]); // ✅ Surveille uniquement les dates
```

**Changements :**
- Dépendance : surveille uniquement les dates de naissance (pas tout l'objet `children`)
- Ajout de `{ shouldValidate: false }` pour éviter la validation à chaque changement

### 2. Amélioration du champ Input
**Ajout de `readOnly` :**
```typescript
<Input
  value={children[index]?.category ? getCategoryLabel(children[index].category) : "..."}
  disabled
  readOnly  // ✅ Ajouté
  className="bg-gray-50"
/>
```

## Test manuel à effectuer

### Scénario 1 : Inscription de 2 enfants

1. Aller sur `/inscription`
2. Cliquer sur "Inscription familiale"
3. **Enfant 1 :**
   - Saisir date de naissance : `2016-06-15`
   - ✅ Vérifier que la catégorie affiche : "Poussins (8-9 ans)"
   - ✅ Vérifier que le tarif affiche : "180 €"

4. Cliquer sur "Ajouter un enfant"
5. **Enfant 2 :**
   - Saisir date de naissance : `2020-03-20`
   - ✅ Vérifier que la catégorie affiche : "Éveil Judo / Baby Judo (4-5 ans)"
   - ✅ Vérifier que le tarif affiche : "165 €" (réduction 2ème enfant)

6. ✅ Vérifier le total : "345 €" (180 + 165)

### Scénario 2 : Inscription de 3 enfants

1. Suivre les étapes du scénario 1
2. Cliquer sur "Ajouter un enfant"
3. **Enfant 3 :**
   - Saisir date de naissance : `2018-09-10`
   - ✅ Vérifier que la catégorie affiche : "Mini-Poussins / Poussinets (6-7 ans)"
   - ✅ Vérifier que le tarif affiche : "150 €" (réduction 3ème enfant)

4. ✅ Vérifier le total : "495 €" (180 + 165 + 150)

### Scénario 3 : Modification d'une date

1. Avoir 2 enfants avec des dates saisies
2. Modifier la date de naissance de l'enfant 1
3. ✅ Vérifier que la catégorie se met à jour automatiquement
4. ✅ Vérifier que le tarif se recalcule

### Scénario 4 : Suppression d'un enfant

1. Avoir 3 enfants
2. Supprimer l'enfant 2
3. ✅ Vérifier que les tarifs se recalculent correctement
4. ✅ Vérifier que le total est mis à jour

## Comportement attendu

### Calcul automatique
- ✅ La catégorie se calcule dès la saisie de la date de naissance
- ✅ Le champ catégorie est grisé et non modifiable
- ✅ Le tarif s'affiche immédiatement avec les réductions

### Réductions familiales
- ✅ 1er enfant : tarif normal (130€ ou 180€)
- ✅ 2ème enfant : 165€
- ✅ 3ème enfant et + : 150€
- ✅ Adultes (seniors) : toujours 180€, pas de réduction

### Affichage
- ✅ Message : "Catégorie déterminée automatiquement selon la date de naissance"
- ✅ Encadré bleu avec le tarif
- ✅ Mention "(réduction appliquée)" pour les 2ème et 3ème enfants
- ✅ Total mis à jour en temps réel

## Vérifications techniques

### Dans la console du navigateur
Aucune erreur ne devrait apparaître, notamment :
- ❌ Pas de "Maximum update depth exceeded"
- ❌ Pas de boucle infinie
- ❌ Pas d'erreur de validation

### Performance
- ✅ Le formulaire doit rester réactif
- ✅ Pas de ralentissement lors de l'ajout d'enfants
- ✅ Mise à jour instantanée des catégories

## Cas limites à tester

1. **Date invalide** : Laisser le champ date vide → Affiche "Saisissez d'abord la date de naissance"
2. **Année future** : Saisir une date dans le futur → Devrait calculer "baby"
3. **Très vieille date** : Saisir 1950 → Devrait calculer "senior"
4. **Ajout/suppression rapide** : Ajouter et supprimer plusieurs enfants rapidement → Pas d'erreur
