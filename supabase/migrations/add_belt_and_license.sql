-- Migration: Ajout des colonnes belt et license_number
-- Date: 2026-05-24
-- Description: Ajoute les champs ceinture et numéro de licence à la table registrations

-- Ajouter la colonne belt (ceinture)
ALTER TABLE registrations 
ADD COLUMN IF NOT EXISTS belt TEXT;

-- Ajouter la colonne license_number (numéro de licence)
ALTER TABLE registrations 
ADD COLUMN IF NOT EXISTS license_number TEXT;

-- Ajouter des commentaires pour documenter les colonnes
COMMENT ON COLUMN registrations.belt 
IS 'Ceinture actuelle du pratiquant (optionnel)';

COMMENT ON COLUMN registrations.license_number 
IS 'Numéro de licence FFJDA pour les anciens licenciés (format: MJJMMAAAANNNNNXX, optionnel)';

-- Vérifier que les colonnes ont été ajoutées
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'registrations' 
AND column_name IN ('belt', 'license_number');
