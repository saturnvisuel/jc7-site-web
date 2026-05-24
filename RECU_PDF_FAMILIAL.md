# Reçu PDF pour inscriptions familiales

## Fonctionnalité ajoutée

Génération automatique d'un reçu PDF pour les inscriptions familiales avec :
- Informations du responsable légal
- Liste de tous les enfants inscrits
- Tarifs individuels avec réductions appliquées
- Total à payer
- Mode de paiement

## Fichiers créés/modifiés

### 1. API de génération du reçu
**Fichier :** `app/api/registrations/family/[id]/receipt/route.ts`

**Fonctionnalités :**
- Récupère l'inscription par ID
- Trouve toutes les inscriptions de la même famille (même email + même date)
- Génère un PDF avec jsPDF
- Calcule les réductions automatiquement
- Affiche le total

**Endpoint :** `GET /api/registrations/family/{id}/receipt`

### 2. Composant formulaire familial
**Fichier :** `components/registration-form-family.tsx`

**Modifications :**
- Ajout du state `registrationIds` pour stocker les IDs
- Stockage des IDs après inscription réussie
- Bouton "📄 Télécharger le reçu PDF" dans le message de succès

## Structure du reçu PDF

### En-tête
```
REÇU D'INSCRIPTION
JC7 - Judo Courneuvien 7
```

### Informations responsable légal
```
RESPONSABLE LÉGAL
Prénom Nom
Adresse
Code postal Ville
Tél: 06...
Email: ...
```

### Liste des inscriptions
```
INSCRIPTIONS

1. Prénom Nom
   Date de naissance: JJ/MM/AAAA
   Catégorie: poussin
   Montant: 180 €

2. Prénom Nom
   Date de naissance: JJ/MM/AAAA
   Catégorie: baby
   Montant: 165 € (réduction 2ème enfant)

3. Prénom Nom
   Date de naissance: JJ/MM/AAAA
   Catégorie: minime
   Montant: 150 € (réduction 3ème enfant)
```

### Total et paiement
```
TOTAL: 495 €

Mode de paiement: Chèque
Statut: En attente

Reçu émis le JJ/MM/AAAA à HH:MM:SS
```

### Pied de page
```
JC7 - Judo Courneuvien 7
www.jc7.fr
```

## Logique de calcul des réductions

Le reçu utilise la même logique que le formulaire :

```typescript
let childCount = 0;

registrations.forEach((reg) => {
  if (reg.category !== "senior") {
    childCount++;
  }
  
  const tarif = getTarif(
    reg.category,
    reg.category !== "senior" ? childCount : 1
  );
  
  // Affiche "réduction Xème enfant" si childCount > 1
});
```

## Identification des inscriptions familiales

Le système identifie les inscriptions d'une même famille par :
1. **Même email du responsable** (`guardian_email`)
2. **Même date de création** (`created_at`)

Cela permet de regrouper toutes les inscriptions faites en une seule fois.

## Utilisation

### Depuis le formulaire
1. Remplir le formulaire d'inscription familiale
2. Soumettre
3. ✅ Message de succès s'affiche
4. Cliquer sur "📄 Télécharger le reçu PDF"
5. Le PDF s'ouvre dans un nouvel onglet

### Depuis l'URL directe
```
GET /api/registrations/family/{id}/receipt
```

Où `{id}` est l'ID de n'importe quelle inscription de la famille.

## Exemple de reçu

### Famille Camara (3 enfants)

```
REÇU D'INSCRIPTION
JC7 - Judo Courneuvien 7

RESPONSABLE LÉGAL
Moustapha Camara
6 Square des Roses
93300 Aubervilliers
Tél: 0652610123
Email: camara@example.com

─────────────────────────────────

INSCRIPTIONS

1. Ibrahim Camara
   Date de naissance: 17/07/2006
   Catégorie: junior
   Montant: 180 €

2. Lucas Camara
   Date de naissance: 23/06/2009
   Catégorie: cadet
   Montant: 165 € (réduction 2ème enfant)

3. Sarah Camara
   Date de naissance: 23/06/2012
   Catégorie: minime
   Montant: 150 € (réduction 3ème enfant)

─────────────────────────────────

TOTAL: 495 €

Mode de paiement: Espèces
Statut: En attente

Reçu émis le 23/05/2026 à 15:51:23

JC7 - Judo Courneuvien 7
www.jc7.fr
```

## Avantages

✅ **Automatique** : Génération instantanée après inscription
✅ **Complet** : Toutes les informations en un seul document
✅ **Clair** : Réductions affichées explicitement
✅ **Professionnel** : Format PDF standard
✅ **Pratique** : Téléchargement en un clic

## Cas d'usage

### Inscription simple (1 enfant)
- Le reçu affiche "INSCRIPTION" (singulier)
- Pas de mention de réduction
- Total = tarif normal

### Inscription familiale (2+ enfants)
- Le reçu affiche "INSCRIPTIONS" (pluriel)
- Réductions affichées pour 2ème et 3ème+ enfants
- Total = somme avec réductions

### Avec adulte (senior)
- L'adulte ne compte pas dans les réductions
- Les enfants bénéficient des réductions normalement
- L'adulte paie toujours 180 €

## Améliorations futures possibles

### Court terme
- [ ] Ajouter le logo du club
- [ ] Ajouter un numéro de reçu unique
- [ ] Ajouter les informations de contact du club

### Moyen terme
- [ ] Envoi automatique par email
- [ ] QR code pour vérification
- [ ] Signature numérique

### Long terme
- [ ] Historique des reçus dans l'espace membre
- [ ] Reçus fiscaux pour les dons
- [ ] Export comptable

## Test

### Scénario de test complet

1. Aller sur `/inscription`
2. Choisir "Inscription familiale"
3. Remplir les informations du responsable
4. Ajouter 3 enfants avec dates de naissance
5. Choisir "Espèces" comme mode de paiement
6. Soumettre le formulaire
7. ✅ Vérifier le message de succès
8. Cliquer sur "📄 Télécharger le reçu PDF"
9. ✅ Vérifier que le PDF s'ouvre
10. ✅ Vérifier les informations :
    - Responsable légal correct
    - 3 enfants listés
    - Tarifs : 180 €, 165 €, 150 €
    - Total : 495 €
    - Mode de paiement : Espèces

## Statut
✅ **Implémenté** - Le reçu PDF est disponible pour toutes les inscriptions familiales.
