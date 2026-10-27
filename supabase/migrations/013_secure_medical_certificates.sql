-- Verrouillage du bucket "documents", qui contient les certificats médicaux.
--
-- Constat : avec la seule clé anonyme (publique, présente dans le navigateur),
-- il était possible de lister puis télécharger tous les certificats médicaux.
-- Ce sont des données de santé : la lecture doit être réservée aux admins.
--
-- Le formulaire public doit en revanche continuer à déposer un certificat,
-- on conserve donc l'écriture anonyme, limitée au dossier dédié.

-- Supprime les policies existantes portant sur ce bucket précis.
-- Le motif inclut les quotes pour ne pas toucher au bucket 'public-documents'.
DO $$
DECLARE
  pol record;
BEGIN
  FOR pol IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND (
        COALESCE(qual, '') LIKE '%''documents''%'
        OR COALESCE(with_check, '') LIKE '%''documents''%'
      )
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol.policyname);
  END LOOP;
END $$;

-- Dépôt d'un certificat depuis le formulaire public (écriture seule).
CREATE POLICY "Anon can upload medical certificates"
ON storage.objects FOR INSERT TO anon
WITH CHECK (
  bucket_id = 'documents'
  AND (storage.foldername(name))[1] = 'medical-certificates'
);

-- Les administrateurs connectés gèrent le contenu du bucket.
CREATE POLICY "Authenticated can read private documents"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'documents');

CREATE POLICY "Authenticated can write private documents"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'documents');

CREATE POLICY "Authenticated can delete private documents"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'documents');

-- Ceinture et bretelles : le bucket doit rester privé.
UPDATE storage.buckets SET public = false WHERE id = 'documents';
