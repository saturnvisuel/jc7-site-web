# Migration : Ajout du numéro de licence

## Commande SQL à exécuter dans Supabase

Allez dans **SQL Editor** de Supabase et exécutez cette commande :

```sql
-- Ajouter la colonne license_number dans la table registrations
ALTER TABLE registrations 
ADD COLUMN license_number TEXT;

-- Ajouter un commentaire pour documenter la colonne
COMMENT ON COLUMN registrations.license_number 
IS 'Numéro de licence pour les anciens licenciés (optionnel)';
```

## Vérification

Après avoir exécuté la commande, vérifiez que :
1. La colonne `license_number` apparaît dans la table `registrations`
2. Le type est `TEXT`
3. La colonne est `nullable` (optionnelle)

## Utilisation

Ce champ permet aux anciens licenciés d'indiquer leur numéro de licence lors de l'inscription.

**Formulaires concernés :**
- Inscription simple
- Inscription familiale (pour chaque enfant)

**Format du numéro de licence FFJDA :**

```
MJJMMAAAANNNNNXX
```

**Détail :**
- `M` ou `F` = sexe (Masculin/Féminin)
- `JJMMAAAA` = date de naissance (jour/mois/année)
- `NNNNN` = 5 premières lettres du nom de famille
  - Si moins de 5 lettres → complété avec `*`
  - Si nom composé → 5 premiers caractères avec espace/logique FFJDA
- `XX` = indice de 01 à 05 (différencie les homonymes)

**Exemples valides :**
- Ernest TAUPIN, né le 18/12/1999 → `M18121999TAUPI01`
- Isabelle LOTI, née le 22/01/2002 → `F22012002LOTI*01`

**Validation :**
- Longueur exacte : 17 caractères
- Format vérifié automatiquement
- Message d'erreur si format invalide
- Champ en majuscules automatiquement
