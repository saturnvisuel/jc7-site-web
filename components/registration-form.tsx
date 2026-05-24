"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { calculateCategory, CATEGORIES, getTarif, getCategoryLabel } from "@/lib/categories";
import { RGPDConsent } from "@/components/rgpd-consent";
import { createClient } from "@/lib/supabase/client";

const registrationSchema = z.object({
  // Informations du pratiquant
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  birthDate: z.string().min(1, "La date de naissance est requise"),
  category: z.string().min(1, "Catégorie requise"),
  belt: z.string().optional(),
  licenseNumber: z.string().optional().refine(
    (val) => {
      if (!val || val === "") return true;
      // Format: MJJMMAAAANNNNNXX (17 caractères)
      const regex = /^[MF]\d{8}[A-Z*]{5}\d{2}$/;
      return regex.test(val);
    },
    {
      message: "Format invalide. Exemple: M18121999TAUPI01 ou F22012002LOTI*01",
    }
  ),
  address: z.string().min(5, "Adresse requise"),
  postalCode: z.string().min(5, "Code postal requis"),
  city: z.string().min(2, "Ville requise"),
  phone: z.string().min(10, "Numéro de téléphone invalide"),
  phoneAlt: z.string().optional(),
  email: z.string().email("Email invalide"),
  socialSecurityNumber: z.string().min(15, "Numéro de sécurité sociale requis"),
  
  // Responsable légal
  isSelfRegistration: z.boolean().default(false),
  guardianFirstName: z.string().optional(),
  guardianLastName: z.string().optional(),
  guardianAddress: z.string().optional(),
  guardianPostalCode: z.string().optional(),
  guardianCity: z.string().optional(),
  guardianPhone: z.string().optional(),
  guardianEmail: z.string().optional(),
  
  medicalNote: z.string().optional(),
  medicalCertificateUrl: z.string().optional(),
  paymentMethod: z.string().min(1, "Mode de paiement requis"),
}).refine(
  (data) => {
    if (!data.isSelfRegistration) {
      return (
        data.guardianFirstName &&
        data.guardianLastName &&
        data.guardianAddress &&
        data.guardianPostalCode &&
        data.guardianCity &&
        data.guardianPhone &&
        data.guardianEmail
      );
    }
    return true;
  },
  {
    message: "Les informations du responsable légal sont requises",
    path: ["guardianFirstName"],
  }
);

type RegistrationFormData = z.infer<typeof registrationSchema>;

export function RegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [registrationId, setRegistrationId] = useState<string | null>(null);
  const [rgpdConsent, setRgpdConsent] = useState(false);
  const [medicalCertificateFile, setMedicalCertificateFile] = useState<File | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      isSelfRegistration: false,
    },
  });

  const category = watch("category");
  const belt = watch("belt");
  const paymentMethod = watch("paymentMethod");
  const isSelfRegistration = watch("isSelfRegistration");
  const birthDate = watch("birthDate");

  useEffect(() => {
    if (birthDate) {
      const autoCategory = calculateCategory(birthDate);
      if (autoCategory) {
        setValue("category", autoCategory);
      }
    }
  }, [birthDate, setValue]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier le type de fichier
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setError("Format de fichier non valide. Utilisez JPG, PNG ou PDF.");
      return;
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Le fichier est trop volumineux. Maximum 5MB.");
      return;
    }

    setMedicalCertificateFile(file);
    setError(null);
  };

  const uploadMedicalCertificate = async (file: File, registrationId: string): Promise<string | null> => {
    try {
      const supabase = createClient();
      const fileExt = file.name.split('.').pop();
      const fileName = `${registrationId}-${Date.now()}.${fileExt}`;
      const filePath = `medical-certificates/${fileName}`;

      const { data, error } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Erreur upload Supabase:', error);
        return null;
      }

      // Retourner le chemin du fichier (pas l'URL publique pour la sécurité)
      return filePath;
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      return null;
    }
  };

  const onSubmit = async (data: RegistrationFormData) => {
    if (!rgpdConsent) {
      setError("Vous devez accepter la politique de confidentialité pour continuer.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: data.firstName,
          last_name: data.lastName,
          birth_date: data.birthDate,
          category: data.category,
          belt: data.belt || null,
          license_number: data.licenseNumber || null,
          address: data.address,
          postal_code: data.postalCode,
          city: data.city,
          phone: data.phone,
          phone_alt: data.phoneAlt || null,
          email: data.email,
          social_security_number: data.socialSecurityNumber,
          is_self_registration: data.isSelfRegistration,
          guardian_first_name: data.isSelfRegistration ? null : data.guardianFirstName,
          guardian_last_name: data.isSelfRegistration ? null : data.guardianLastName,
          guardian_address: data.isSelfRegistration ? null : data.guardianAddress,
          guardian_postal_code: data.isSelfRegistration ? null : data.guardianPostalCode,
          guardian_city: data.isSelfRegistration ? null : data.guardianCity,
          guardian_phone: data.isSelfRegistration ? null : data.guardianPhone,
          guardian_email: data.isSelfRegistration ? null : data.guardianEmail,
          medical_note: data.medicalNote || null,
          payment_method: data.paymentMethod,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'inscription");
      }

      const result = await response.json();

      // Uploader le certificat médical si présent
      if (medicalCertificateFile && result.id) {
        setUploadingFile(true);
        const certificateUrl = await uploadMedicalCertificate(medicalCertificateFile, result.id);
        
        if (certificateUrl) {
          // Mettre à jour l'inscription avec l'URL du certificat
          await fetch(`/api/registrations/${result.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              medical_certificate_url: certificateUrl,
            }),
          });
        }
        setUploadingFile(false);
      }

      if (data.paymentMethod === "carte" && result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      } else {
        setRegistrationId(result.id);
        setSuccess(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* INFORMATIONS DU PRATIQUANT */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-bold mb-6 text-primary">Informations du pratiquant</h2>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom *</Label>
              <Input
                id="lastName"
                {...register("lastName")}
                placeholder="Dupont"
              />
              {errors.lastName && (
                <p className="text-sm text-destructive">{errors.lastName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom *</Label>
              <Input
                id="firstName"
                {...register("firstName")}
                placeholder="Jean"
              />
              {errors.firstName && (
                <p className="text-sm text-destructive">{errors.firstName.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="birthDate">Date de naissance *</Label>
              <Input
                id="birthDate"
                type="date"
                {...register("birthDate")}
              />
              {errors.birthDate && (
                <p className="text-sm text-destructive">{errors.birthDate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Catégorie d&apos;âge *</Label>
              <Input
                id="category"
                value={category ? getCategoryLabel(category) : "Saisissez d'abord la date de naissance"}
                disabled
                className="bg-gray-50"
              />
              <input type="hidden" {...register("category")} value={category || ""} />
              {errors.category && (
                <p className="text-sm text-destructive">{errors.category.message}</p>
              )}
              {category && (
                <div className="mt-2">
                  <p className="text-xs text-muted-foreground mb-2">Catégorie déterminée automatiquement selon la date de naissance</p>
                  <div className="bg-blue-50 border-l-4 border-blue-600 p-3 rounded">
                    <p className="text-sm font-semibold text-blue-900">
                      Montant : {getTarif(category)} €
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="belt">Ceinture (optionnel)</Label>
            <Select onValueChange={(value) => setValue("belt", value)} value={belt || ""}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une ceinture" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blanche">Blanche</SelectItem>
                <SelectItem value="blanche-jaune">Blanche-Jaune</SelectItem>
                <SelectItem value="jaune">Jaune</SelectItem>
                <SelectItem value="jaune-orange">Jaune-Orange</SelectItem>
                <SelectItem value="orange">Orange</SelectItem>
                <SelectItem value="orange-verte">Orange-Verte</SelectItem>
                <SelectItem value="verte">Verte</SelectItem>
                <SelectItem value="bleue">Bleue</SelectItem>
                <SelectItem value="marron">Marron</SelectItem>
                <SelectItem value="noire">Noire</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="licenseNumber">Numéro de licence (optionnel)</Label>
            <Input
              id="licenseNumber"
              {...register("licenseNumber")}
              placeholder="Ex: M18121999TAUPI01"
              maxLength={17}
              className="uppercase"
            />
            {errors.licenseNumber && (
              <p className="text-sm text-destructive">{errors.licenseNumber.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Pour les anciens licenciés uniquement. Format: MJJMMAAAANNNNNXX
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Adresse *</Label>
            <Input
              id="address"
              {...register("address")}
              placeholder="12 rue de la République"
            />
            {errors.address && (
              <p className="text-sm text-destructive">{errors.address.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="postalCode">Code postal *</Label>
              <Input
                id="postalCode"
                {...register("postalCode")}
                placeholder="93120"
              />
              {errors.postalCode && (
                <p className="text-sm text-destructive">{errors.postalCode.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">Ville *</Label>
              <Input
                id="city"
                {...register("city")}
                placeholder="La Courneuve"
              />
              {errors.city && (
                <p className="text-sm text-destructive">{errors.city.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone *</Label>
              <Input
                id="phone"
                type="tel"
                {...register("phone")}
                placeholder="06 12 34 56 78"
              />
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneAlt">Téléphone 2 (optionnel)</Label>
              <Input
                id="phoneAlt"
                type="tel"
                {...register("phoneAlt")}
                placeholder="01 23 45 67 89"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="jean.dupont@example.com"
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="socialSecurityNumber">Numéro de sécurité sociale *</Label>
            <Input
              id="socialSecurityNumber"
              {...register("socialSecurityNumber")}
              placeholder="1 23 45 67 890 123 45"
            />
            {errors.socialSecurityNumber && (
              <p className="text-sm text-destructive">{errors.socialSecurityNumber.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* RESPONSABLE LÉGAL */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-primary">Responsable légal</h2>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isSelfRegistration"
              checked={isSelfRegistration}
              onCheckedChange={(checked) => setValue("isSelfRegistration", checked as boolean)}
            />
            <Label htmlFor="isSelfRegistration" className="cursor-pointer font-normal">
              Je m&apos;inscris pour moi-même
            </Label>
          </div>
        </div>

        {!isSelfRegistration && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="guardianLastName">Nom *</Label>
                <Input
                  id="guardianLastName"
                  {...register("guardianLastName")}
                  placeholder="Dupont"
                />
                {errors.guardianFirstName && (
                  <p className="text-sm text-destructive">{errors.guardianFirstName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="guardianFirstName">Prénom *</Label>
                <Input
                  id="guardianFirstName"
                  {...register("guardianFirstName")}
                  placeholder="Marie"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="guardianAddress">Adresse *</Label>
              <Input
                id="guardianAddress"
                {...register("guardianAddress")}
                placeholder="12 rue de la République"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="guardianPostalCode">Code postal *</Label>
                <Input
                  id="guardianPostalCode"
                  {...register("guardianPostalCode")}
                  placeholder="93120"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="guardianCity">Ville *</Label>
                <Input
                  id="guardianCity"
                  {...register("guardianCity")}
                  placeholder="La Courneuve"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="guardianPhone">Téléphone *</Label>
              <Input
                id="guardianPhone"
                type="tel"
                {...register("guardianPhone")}
                placeholder="06 12 34 56 78"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="guardianEmail">Email *</Label>
              <Input
                id="guardianEmail"
                type="email"
                {...register("guardianEmail")}
                placeholder="marie.dupont@example.com"
              />
            </div>
          </div>
        )}

        {isSelfRegistration && (
          <div className="p-4 bg-blue-50 border-l-4 border-blue-600 rounded">
            <p className="text-sm text-blue-800">
              ℹ️ Vos informations personnelles seront utilisées comme responsable légal.
            </p>
          </div>
        )}
      </div>

      {/* INFORMATIONS MÉDICALES */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-bold mb-6 text-primary">Informations médicales</h2>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="medicalCertificate">Certificat médical (optionnel)</Label>
            <Input
              id="medicalCertificate"
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={handleFileChange}
              disabled={isSubmitting || uploadingFile}
              className="cursor-pointer"
            />
            {medicalCertificateFile && (
              <p className="text-sm text-green-600">
                ✓ Fichier sélectionné : {medicalCertificateFile.name}
              </p>
            )}
            {uploadingFile && (
              <p className="text-sm text-blue-600">
                Upload en cours...
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Formats acceptés : JPG, PNG, PDF (max 5MB)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="medicalNote">Note médicale (optionnel)</Label>
            <Textarea
              id="medicalNote"
              {...register("medicalNote")}
              placeholder="Allergies, traitements en cours, contre-indications..."
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              Ces informations resteront confidentielles et ne seront utilisées qu&apos;en cas d&apos;urgence.
            </p>
          </div>
        </div>
      </div>

      {/* MODE DE PAIEMENT */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-bold mb-6 text-primary">Mode de paiement</h2>
        
        <div className="space-y-2">
          <Label htmlFor="paymentMethod">Choisissez votre mode de paiement *</Label>
          <Select onValueChange={(value) => setValue("paymentMethod", value)} value={paymentMethod}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un mode de paiement" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="carte">💳 Paiement en ligne (Carte bancaire)</SelectItem>
              <SelectItem value="cheque">📝 Chèque (à remettre au club)</SelectItem>
              <SelectItem value="especes">💵 Espèces (à remettre au club)</SelectItem>
            </SelectContent>
          </Select>
          {errors.paymentMethod && (
            <p className="text-sm text-destructive">{errors.paymentMethod.message}</p>
          )}
          
          {paymentMethod && paymentMethod !== "carte" && (
            <div className="mt-4 p-4 bg-amber-50 border-l-4 border-amber-600 rounded">
              <p className="text-sm text-amber-800">
                <strong>Note :</strong> Votre inscription sera enregistrée. 
                Vous devrez régler {paymentMethod === "cheque" ? "par chèque" : "en espèces"} directement au club lors de votre première séance.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* MESSAGES */}
      {success && registrationId && (
        <div className="p-6 bg-green-50 border-l-4 border-green-600 rounded space-y-4">
          <div>
            <p className="text-green-800 font-semibold text-lg">✓ Inscription enregistrée avec succès !</p>
            <p className="text-sm text-green-700 mt-2">
              Vous recevrez un email de confirmation. 
              {paymentMethod === "cheque" && " N'oubliez pas d'apporter votre chèque lors de votre première séance."}
              {paymentMethod === "especes" && " N'oubliez pas d'apporter le montant en espèces lors de votre première séance."}
            </p>
          </div>
          
          <div className="pt-2 border-t border-green-200">
            <p className="text-sm text-green-800 font-medium mb-3">📄 Téléchargez votre reçu d'inscription :</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                type="button"
                variant="default"
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={() => window.open(`/api/registrations/${registrationId}/receipt`, '_blank')}
              >
                📥 Télécharger le reçu PDF
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => window.location.href = '/'}
              >
                🏠 Retour à l'accueil
              </Button>
            </div>
            <p className="text-xs text-green-600 mt-2 text-center">
              Ce document contient toutes les informations de votre inscription et le montant à régler
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-md">
          {error}
        </div>
      )}

      {/* CONSENTEMENT RGPD */}
      <RGPDConsent
        checked={rgpdConsent}
        onCheckedChange={setRgpdConsent}
        error={error && !rgpdConsent ? "Consentement requis" : undefined}
      />

      {/* BOUTON DE SOUMISSION */}
      <Button type="submit" className="w-full" size="lg" disabled={isSubmitting || success}>
        {isSubmitting ? "Traitement en cours..." : 
         paymentMethod === "carte" ? "Continuer vers le paiement" : 
         "Valider mon inscription"}
      </Button>

      <p className="text-sm text-muted-foreground text-center">
        * Champs obligatoires
      </p>
    </form>
  );
}
