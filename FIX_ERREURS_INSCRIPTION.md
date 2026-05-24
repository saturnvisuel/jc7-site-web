# Fix - Erreurs d'inscription familiale

## Problèmes identifiés

### 1. Warning React : Input non contrôlé
```
Warning: A component is changing a controlled input to be uncontrolled.
```

**Cause :** Le champ catégorie pouvait avoir une valeur `undefined`, ce qui fait passer React d'un input contrôlé à non contrôlé.

**Solution appliquée :**
```typescript
// Avant
<input type="hidden" {...register(`children.${index}.category`)} />

// Après  
<Input
  value={children[index]?.category ? getCategoryLabel(children[index].category) : "..."}
  onChange={() => {}} // ✅ Évite le warning
/>
<input type="hidden" {...register(`children.${index}.category`)} value={children[index]?.category || ""} /> // ✅ Toujours une string
```

### 2. Erreur 500 de l'API
```
Failed to load resource: the server responded with a status of 500
```

**Causes possibles :**
- Erreur TypeScript dans l'API
- Champ manquant dans les données
- Erreur Supabase

**Solutions appliquées :**

#### A. Ajout de logs détaillés
```typescript
console.log("📝 Données reçues:", JSON.stringify(body, null, 2));
console.log(`👶 Traitement enfant ${childCount}:`, {...});
console.log("✅ Enfant enregistré:", registration.id);
```

#### B. Meilleure gestion d'erreur côté client
```typescript
if (!response.ok) {
  const errorData = await response.json().catch(() => ({ error: "Erreur inconnue" }));
  throw new Error(errorData.error || "Erreur lors de l'inscription");
}
```

#### C. Messages d'erreur plus explicites côté serveur
```typescript
if (error || !registration) {
  console.error("❌ Supabase error:", error);
  return NextResponse.json(
    { error: `Erreur lors de l'inscription: ${error?.message || "Données non retournées"}` },
    { status: 500 }
  );
}
```

#### D. Fix TypeScript
```typescript
// Avant (erreur: Property 'id' does not exist on type 'never')
const { data: registration, error } = await supabase.from("registrations")...

// Après
const { data: registration, error } = await (supabase.from("registrations") as any)...
```

## Vérification des corrections

### Test 1 : Warning React
1. Ouvrir la console du navigateur
2. Aller sur `/inscription` → "Inscription familiale"
3. Ajouter un enfant
4. ✅ Aucun warning ne devrait apparaître

### Test 2 : Erreur API
1. Remplir le formulaire d'inscription familiale
2. Soumettre
3. Vérifier la console serveur (terminal)
4. ✅ Voir les logs : "📝 Données reçues", "👶 Traitement enfant", "✅ Enfant enregistré"
5. ✅ Pas d'erreur 500

### Test 3 : Message d'erreur explicite
Si une erreur se produit :
1. ✅ Le message d'erreur exact s'affiche à l'utilisateur
2. ✅ Les logs serveur montrent le détail de l'erreur Supabase

## Logs à surveiller

### Console serveur (terminal Next.js)
```
📝 Données reçues: {
  "children": [
    {
      "firstName": "Lucas",
      "lastName": "Martin",
      "birthDate": "2016-06-15",
      "category": "poussin",
      "socialSecurityNumber": "1 23 45 67 890 123 45",
      ...
    }
  ],
  ...
}

👶 Traitement enfant 1: {
  firstName: 'Lucas',
  lastName: 'Martin',
  category: 'poussin',
  socialSecurityNumber: '1 23 45 67 890 123 45'
}

✅ Enfant enregistré: abc123-def456-...
```

### Console navigateur
- ✅ Aucun warning React
- ✅ Message d'erreur clair si problème

## Causes possibles d'erreur 500 restantes

Si l'erreur 500 persiste, vérifier :

### 1. Connexion Supabase
```typescript
// Vérifier que createClient() fonctionne
const supabase = createClient();
console.log("Supabase client:", supabase ? "OK" : "ERREUR");
```

### 2. Variables d'environnement
```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=... # Pour l'API
```

### 3. Schéma de base de données
Vérifier que tous les champs existent :
```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'registrations'
ORDER BY ordinal_position;
```

### 4. Row Level Security (RLS)
Si RLS est activé, vérifier les policies :
```sql
SELECT * FROM pg_policies WHERE tablename = 'registrations';
```

### 5. Format des données
Vérifier que les données envoyées correspondent au schéma :
- `birth_date` : format ISO (YYYY-MM-DD)
- `social_security_number` : string de 15+ caractères
- `email` : format email valide
- `phone` : string de 10+ caractères

## Checklist de débogage

Si l'erreur persiste :

- [ ] Vérifier les logs serveur (terminal)
- [ ] Vérifier la console navigateur
- [ ] Tester avec un seul enfant
- [ ] Tester avec des données minimales
- [ ] Vérifier la connexion Supabase
- [ ] Vérifier les variables d'environnement
- [ ] Vérifier le schéma de la table
- [ ] Vérifier les RLS policies
- [ ] Tester l'API directement (Postman/curl)

## Commande de test API directe

```bash
curl -X POST http://localhost:3000/api/registrations/family \
  -H "Content-Type: application/json" \
  -d '{
    "children": [{
      "firstName": "Test",
      "lastName": "Enfant",
      "birthDate": "2016-01-01",
      "category": "poussin",
      "socialSecurityNumber": "123456789012345"
    }],
    "guardian": {
      "first_name": "Test",
      "last_name": "Parent",
      "address": "1 rue Test",
      "postal_code": "75001",
      "city": "Paris",
      "phone": "0123456789",
      "email": "test@example.com"
    },
    "payment_method": "cheque"
  }'
```

## Statut
✅ **Corrections appliquées** - Les warnings React sont corrigés et les logs détaillés sont en place pour identifier l'erreur 500.

🔍 **À surveiller** - Vérifier les logs serveur lors du prochain test d'inscription pour identifier la cause exacte de l'erreur 500.
