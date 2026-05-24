# Fix - Enregistrement dans la base de données

## Problème identifié
Les adhérents ne s'enregistraient pas dans la base de données lors de l'inscription familiale.

## Cause
Le champ `social_security_number` est **obligatoire** dans la base de données (défini avec `NOT NULL DEFAULT ''` dans la migration `004_add_full_registration_fields.sql`), mais l'API d'inscription familiale ne l'envoyait pas.

## Solution appliquée

### Modification de l'API familiale
**Fichier :** `app/api/registrations/family/route.ts`

**Ajout du champ manquant :**
```typescript
const { data: registration, error } = await supabase
  .from("registrations")
  .insert({
    // ... autres champs
    social_security_number: child.socialSecurityNumber || "À compléter", // ✅ Ajouté
    // ... autres champs
  })
```

**Valeur par défaut :** `"À compléter"` si non fourni

## Schéma de la base de données

### Table `registrations`

Champs obligatoires :
- ✅ `first_name` VARCHAR(255) NOT NULL
- ✅ `last_name` VARCHAR(255) NOT NULL
- ✅ `birth_date` DATE NOT NULL
- ✅ `email` VARCHAR(255) NOT NULL
- ✅ `phone` VARCHAR(50) NOT NULL
- ✅ `category` VARCHAR(100) NOT NULL
- ✅ `address` TEXT NOT NULL
- ✅ `postal_code` VARCHAR(10) NOT NULL
- ✅ `city` VARCHAR(100) NOT NULL
- ✅ `social_security_number` VARCHAR(20) NOT NULL ⚠️ **C'était le problème**

Champs optionnels :
- `belt` VARCHAR(50)
- `phone_alt` VARCHAR(20)
- `medical_note` TEXT
- `guardian_*` (tous optionnels)
- `stripe_session_id` VARCHAR(255)

## Test de vérification

### Inscription familiale

1. Aller sur `/inscription`
2. Choisir "Inscription familiale"
3. Remplir les informations du responsable légal
4. Ajouter 2 enfants avec leurs dates de naissance
5. Choisir un mode de paiement (chèque ou espèces pour test rapide)
6. Soumettre le formulaire

**Résultat attendu :**
- ✅ Message de succès affiché
- ✅ 2 lignes créées dans la table `registrations`
- ✅ Champ `social_security_number` = "À compléter"
- ✅ Statut `payment_status` = "pending"

### Inscription simple

1. Aller sur `/inscription`
2. Choisir "Inscription simple"
3. Remplir tous les champs y compris le numéro de sécurité sociale
4. Soumettre

**Résultat attendu :**
- ✅ Enregistrement créé avec le vrai numéro de sécurité sociale

## Vérification dans Supabase

### Via l'interface Supabase

```sql
SELECT 
  id,
  first_name,
  last_name,
  birth_date,
  category,
  social_security_number,
  payment_status,
  created_at
FROM registrations
ORDER BY created_at DESC
LIMIT 10;
```

### Vérifier les erreurs

Si l'enregistrement échoue encore, vérifier :

1. **Console du navigateur** : Erreurs JavaScript
2. **Console serveur** : Logs d'erreur Supabase
3. **Supabase Dashboard** : Logs de la base de données

## Amélioration future recommandée

### Option 1 : Rendre le champ optionnel dans la BDD
```sql
ALTER TABLE public.registrations
ALTER COLUMN social_security_number DROP NOT NULL;
```

### Option 2 : Ajouter le champ au formulaire familial

Ajouter un champ "Numéro de sécurité sociale" pour chaque enfant dans le formulaire d'inscription familiale.

**Avantages :**
- Données complètes dès l'inscription
- Pas de "À compléter" dans la base

**Inconvénients :**
- Formulaire plus long
- Peut décourager les inscriptions

## Recommandation

Pour l'instant, la solution `"À compléter"` est suffisante pour le MVP. Les administrateurs pourront compléter cette information plus tard via l'interface admin.

## Autres champs à vérifier

Tous les champs obligatoires sont maintenant couverts :

| Champ | Inscription simple | Inscription familiale |
|-------|-------------------|----------------------|
| first_name | ✅ | ✅ |
| last_name | ✅ | ✅ |
| birth_date | ✅ | ✅ |
| email | ✅ | ✅ (responsable) |
| phone | ✅ | ✅ (responsable) |
| category | ✅ | ✅ (auto) |
| address | ✅ | ✅ (responsable) |
| postal_code | ✅ | ✅ (responsable) |
| city | ✅ | ✅ (responsable) |
| social_security_number | ✅ | ✅ (fix appliqué) |

## Statut
✅ **Problème résolu** - Les inscriptions familiales s'enregistrent maintenant correctement dans la base de données.
