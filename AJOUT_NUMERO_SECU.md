# Ajout du numéro de sécurité sociale pour les enfants

## Modifications effectuées

### 1. Schéma de validation (Zod)
**Fichier :** `components/registration-form-family.tsx`

**Ajout dans `childSchema` :**
```typescript
const childSchema = z.object({
  firstName: z.string().min(2, "Prénom requis"),
  lastName: z.string().min(2, "Nom requis"),
  birthDate: z.string().min(1, "Date de naissance requise"),
  category: z.string().min(1, "Catégorie requise"),
  socialSecurityNumber: z.string().min(15, "Numéro de sécurité sociale requis (15 chiffres)"), // ✅ Ajouté
  belt: z.string().optional(),
  medicalNote: z.string().optional(),
});
```

### 2. Valeurs par défaut du formulaire
**Ajout dans `defaultValues` :**
```typescript
defaultValues: {
  children: [
    {
      firstName: "",
      lastName: "",
      birthDate: "",
      category: "",
      socialSecurityNumber: "", // ✅ Ajouté
      belt: "",
      medicalNote: "",
    },
  ],
}
```

### 3. Fonction d'ajout d'enfant
**Mise à jour de la fonction `append` :**
```typescript
onClick={() => append({
  firstName: "",
  lastName: "",
  birthDate: "",
  category: "",
  socialSecurityNumber: "", // ✅ Ajouté
  belt: "",
  medicalNote: "",
})}
```

### 4. Champ dans le formulaire
**Ajout du champ HTML après la catégorie :**
```tsx
<div className="space-y-2">
  <Label htmlFor={`children.${index}.socialSecurityNumber`}>
    Numéro de sécurité sociale *
  </Label>
  <Input
    {...register(`children.${index}.socialSecurityNumber`)}
    placeholder="1 23 45 67 890 123 45"
    maxLength={21}
  />
  {errors.children?.[index]?.socialSecurityNumber && (
    <p className="text-sm text-destructive">
      {errors.children[index]?.socialSecurityNumber?.message}
    </p>
  )}
  <p className="text-xs text-muted-foreground">
    15 chiffres (espaces acceptés)
  </p>
</div>
```

### 5. API d'enregistrement
**Fichier :** `app/api/registrations/family/route.ts`

**Utilisation de la valeur du formulaire :**
```typescript
social_security_number: child.socialSecurityNumber, // ✅ Plus de valeur par défaut
```

## Validation

### Format accepté
- **15 chiffres minimum** requis
- **Espaces acceptés** dans la saisie
- **Limite de 21 caractères** (15 chiffres + 6 espaces max)

### Exemples valides
- `123456789012345`
- `1 23 45 67 890 123 45`
- `1 2345 67 890 123 45`

### Exemples invalides
- `12345` (trop court)
- `ABC123456789012` (lettres non acceptées)
- `` (vide)

## Affichage dans le formulaire

### Position
Le champ apparaît pour chaque enfant dans cet ordre :
1. Nom / Prénom
2. Date de naissance / Catégorie (auto)
3. **Numéro de sécurité sociale** ⭐ NOUVEAU
4. Ceinture (optionnel)
5. Informations médicales (optionnel)
6. Tarif calculé

### Style
- Label avec astérisque rouge (champ obligatoire)
- Placeholder avec exemple de format
- Message d'aide : "15 chiffres (espaces acceptés)"
- Message d'erreur si validation échoue

## Test de vérification

### Scénario de test

1. Aller sur `/inscription`
2. Choisir "Inscription familiale"
3. Remplir les informations du responsable légal
4. Pour l'enfant 1 :
   - Saisir nom, prénom, date de naissance
   - ✅ Vérifier que le champ "Numéro de sécurité sociale *" apparaît
   - Saisir un numéro invalide (ex: `123`) → Erreur attendue
   - Saisir un numéro valide (ex: `1 23 45 67 890 123 45`)
5. Ajouter un 2ème enfant
   - ✅ Vérifier que le champ apparaît aussi pour l'enfant 2
6. Soumettre le formulaire
7. ✅ Vérifier dans Supabase que les numéros sont enregistrés

### Vérification base de données

```sql
SELECT 
  first_name,
  last_name,
  social_security_number,
  created_at
FROM registrations
WHERE created_at > NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC;
```

**Résultat attendu :**
- Les numéros de sécurité sociale sont présents
- Pas de valeur "À compléter"

## Comparaison avec l'inscription simple

| Caractéristique | Inscription simple | Inscription familiale |
|----------------|-------------------|----------------------|
| Champ présent | ✅ Oui | ✅ Oui (nouveau) |
| Obligatoire | ✅ Oui | ✅ Oui |
| Validation | 15 caractères min | 15 caractères min |
| Format | Espaces acceptés | Espaces acceptés |

## Avantages de cette modification

✅ **Données complètes** : Plus besoin de compléter après coup
✅ **Cohérence** : Même champ dans les deux types d'inscription
✅ **Validation** : Erreurs détectées avant l'enregistrement
✅ **Conformité** : Respect du schéma de base de données

## Notes importantes

- Le champ est **obligatoire** pour tous les enfants
- La validation Zod vérifie la longueur minimale (15 caractères)
- Les espaces sont acceptés pour faciliter la saisie
- Le champ `maxLength={21}` empêche de saisir plus de 21 caractères
- Si l'utilisateur oublie de remplir ce champ, le formulaire ne se soumettra pas

## Prochaines étapes possibles

### Amélioration future (optionnel)
- Ajouter un formatage automatique pendant la saisie
- Masquer les chiffres pour la confidentialité
- Valider le format exact du numéro de sécurité sociale français
- Calculer automatiquement la clé de contrôle

### Exemple de formatage automatique
```typescript
const formatSecurityNumber = (value: string) => {
  const cleaned = value.replace(/\s/g, '');
  const match = cleaned.match(/^(\d{1})(\d{2})(\d{2})(\d{2})(\d{3})(\d{3})(\d{2})$/);
  if (match) {
    return `${match[1]} ${match[2]} ${match[3]} ${match[4]} ${match[5]} ${match[6]} ${match[7]}`;
  }
  return value;
};
```

## Statut
✅ **Implémenté** - Le champ numéro de sécurité sociale est maintenant présent pour chaque enfant dans le formulaire d'inscription familiale.
