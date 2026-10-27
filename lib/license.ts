import * as z from "zod";

/**
 * Numéro de licence FFJDA : sexe (M/F), date de naissance (JJMMAAAA),
 * 5 premières lettres du nom, puis 2 chiffres. Soit 16 caractères.
 */
export const LICENSE_PATTERN = /^[MF]\d{8}[A-Z*]{5}\d{2}$/;
export const LICENSE_LENGTH = 16;
export const LICENSE_EXAMPLE = "M18121999TAUPI01";
export const LICENSE_HINT = "Pour les anciens licenciés uniquement. Format : MJJMMAAAANNNNNXX";

/**
 * Champ optionnel. La valeur est normalisée en majuscules avant contrôle :
 * l'affichage en capitales via CSS ne modifie pas la saisie, une entrée en
 * minuscules serait donc refusée alors qu'elle paraît correcte.
 */
export const licenseNumberSchema = z
  .string()
  .optional()
  .transform((value) => (value ? value.trim().toUpperCase() : value))
  .refine((value) => !value || LICENSE_PATTERN.test(value), {
    message: `Format invalide. Exemple : ${LICENSE_EXAMPLE}`,
  });
