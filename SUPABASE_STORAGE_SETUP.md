# Configuration Supabase Storage pour les Certificats Médicaux

## Création du bucket

1. Aller dans Supabase Dashboard > Storage
2. Créer un nouveau bucket nommé `documents`
3. Configuration du bucket :
   - **Public** : NON (privé pour la sécurité)
   - **File size limit** : 5MB
   - **Allowed MIME types** : `image/jpeg`, `image/jpg`, `image/png`, `application/pdf`

## Politiques de sécurité (RLS)

### Politique d'upload (INSERT)
```sql
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'documents' AND (storage.foldername(name))[1] = 'medical-certificates');
```

### Politique de lecture (SELECT) - Admin seulement
```sql
CREATE POLICY "Allow admin read access"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'documents' AND (storage.foldername(name))[1] = 'medical-certificates');
```

## Ajout de la colonne dans la table registrations

```sql
ALTER TABLE registrations 
ADD COLUMN medical_certificate_url TEXT;

COMMENT ON COLUMN registrations.medical_certificate_url IS 'URL du certificat médical stocké dans Supabase Storage';
```

## Structure des fichiers

Les certificats sont stockés avec la structure suivante :
```
documents/
  └── medical-certificates/
      └── {registration_id}-{timestamp}.{ext}
```

Exemple : `documents/medical-certificates/abc123-1234567890.pdf`

## Accès aux certificats depuis l'admin

Les administrateurs peuvent accéder aux certificats via l'URL stockée dans `medical_certificate_url`.

Pour télécharger un certificat :
```typescript
const supabase = createClient();
const { data, error } = await supabase.storage
  .from('documents')
  .download('medical-certificates/abc123-1234567890.pdf');
```

## Avantages de cette solution

✅ **Pas de surcharge de la BDD** : Les fichiers sont stockés dans Storage, pas en base64
✅ **Sécurisé** : Bucket privé avec RLS
✅ **Scalable** : Supabase Storage gère automatiquement la compression et l'optimisation
✅ **URLs signées** : Possibilité de générer des URLs temporaires pour le téléchargement
✅ **Limite de taille** : 5MB max par fichier
