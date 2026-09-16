"use client";

import { useEffect, useRef, useState } from "react";
import { useForm, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { FormStepper } from "@/components/ui/form-stepper";
import { RGPDConsent } from "@/components/rgpd-consent";
import { calculateCategory, getCategoryLabel, getTarif } from "@/lib/categories";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

const registrationSchema = z.object({
  // Informations du pratiquant
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  birthDate: z.string().min(1, "La date de naissance est requise"),
  category: z.string().min(1, "Catégorie requise"),
  belt: z.string().optional(),
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

const STEPS = [
  { title: "Pratiquant", description: "Identité et coordonnées" },
  { title: "Responsable légal", description: "Obligatoire pour un mineur" },
  { title: "Paiement", description: "Récapitulatif et validation" },
];

/** Champs à valider avant de passer à l'étape suivante. */
const STEP_FIELDS: FieldPath<RegistrationFormData>[][] = [
  [
    "lastName",
    "firstName",
    "birthDate",
    "category",
    "address",
    "postalCode",
    "city",
    "phone",
    "email",
    "socialSecurityNumber",
  ],
  [
    "guardianLastName",
    "guardianFirstName",
    "guardianAddress",
    "guardianPostalCode",
    "guardianCity",
    "guardianPhone",
    "guardianEmail",
  ],
  ["paymentMethod"],
];

export function RegistrationForm() {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [registrationId, setRegistrationId] = useState<string | null>(null);
  const [rgpdConsent, setRgpdConsent] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  const isLastStep = step === STEPS.length - 1;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    mode: "onTouched",
    defaultValues: {
      isSelfRegistration: false,
    },
  });

  const category = watch("category");
  const belt = watch("belt");
  const birthDate = watch("birthDate");
  const paymentMethod = watch("paymentMethod");
  const isSelfRegistration = watch("isSelfRegistration");

  // La catégorie d'âge découle de la date de naissance : jamais saisie à la main.
  useEffect(() => {
    if (!birthDate) return;
    const autoCategory = calculateCategory(birthDate);
    if (autoCategory) {
      setValue("category", autoCategory, { shouldValidate: true });
    }
  }, [birthDate, setValue]);

  const goToStep = (target: number) => {
    setStep(target);
    setError(null);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleNext = async () => {
    const valid = await trigger(STEP_FIELDS[step], { shouldFocus: true });
    if (!valid) {
      setError("Veuillez corriger les champs en rouge avant de continuer.");
      return;
    }
    goToStep(Math.min(step + 1, STEPS.length - 1));
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

  const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (!isLastStep) {
      event.preventDefault();
      handleNext();
      return;
    }
    handleSubmit(onSubmit)(event);
  };

  return (
    <form onSubmit={onFormSubmit} className="space-y-8 max-w-4xl mx-auto">
      <div ref={topRef} className="scroll-mt-24" />

      <FormStepper steps={STEPS} current={step} onStepClick={goToStep} />

      {error && (
        <div role="alert" className="bg-red-50 border-l-4 border-red-600 p-4 rounded">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* ÉTAPE 1 — INFORMATIONS DU PRATIQUANT */}
      {step === 0 && (
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
                value={
                  category
                    ? getCategoryLabel(category)
                    : "Saisissez d'abord la date de naissance"
                }
                disabled
                readOnly
                className="bg-gray-50"
                onChange={() => {}} // Évite le warning React
              />
              <input type="hidden" {...register("category")} value={category || ""} />
              {errors.category && (
                <p className="text-sm text-destructive">{errors.category.message}</p>
              )}
              {category && (
                <p className="text-xs text-muted-foreground">
                  Catégorie déterminée automatiquement selon la date de naissance
                </p>
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
      )}

      {/* ÉTAPE 2 — RESPONSABLE LÉGAL */}
      {step === 1 && (
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
      )}

      {/* ÉTAPE 3 — RÉCAPITULATIF, SANTÉ ET PAIEMENT */}
      {step === 2 && (
      <>
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-bold mb-4 text-primary">Récapitulatif</h2>
        <dl className="divide-y text-sm">
          <div className="flex justify-between gap-4 py-2">
            <dt className="text-muted-foreground">Pratiquant</dt>
            <dd className="font-medium text-right">
              {watch("firstName")} {watch("lastName")}
              {category && (
                <span className="block text-xs text-muted-foreground">
                  {getCategoryLabel(category)}
                </span>
              )}
            </dd>
          </div>
          <div className="flex justify-between gap-4 py-2">
            <dt className="text-muted-foreground">Responsable</dt>
            <dd className="font-medium text-right">
              {isSelfRegistration
                ? "Le pratiquant lui-même"
                : `${watch("guardianFirstName") ?? ""} ${watch("guardianLastName") ?? ""}`}
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-4 py-3">
            <dt className="font-semibold">Total à régler</dt>
            <dd className="text-2xl font-black text-red-600">
              {category ? `${getTarif(category)} €` : "—"}
            </dd>
          </div>
        </dl>
        <Button
          type="button"
          variant="link"
          className="h-auto p-0 text-sm"
          onClick={() => goToStep(0)}
        >
          Modifier les informations du pratiquant
        </Button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-bold mb-6 text-primary">Informations médicales</h2>
        
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

      <RGPDConsent
        checked={rgpdConsent}
        onCheckedChange={setRgpdConsent}
        error={error && !rgpdConsent ? "Consentement requis" : undefined}
      />
      </>
      )}

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
            <Button
              type="button"
              variant="default"
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={() => window.open(`/api/registrations/${registrationId}/receipt`, '_blank')}
            >
              📥 Télécharger le reçu PDF
            </Button>
            <p className="text-xs text-green-600 mt-2 text-center">
              Ce document contient toutes les informations de votre inscription et le montant à régler
            </p>
          </div>
        </div>
      )}

      {/* NAVIGATION */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => goToStep(step - 1)}
          disabled={step === 0 || isSubmitting}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Précédent
        </Button>

        {isLastStep ? (
          <Button type="submit" size="lg" disabled={isSubmitting || success}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Traitement en cours...
              </>
            ) : paymentMethod === "carte" ? (
              "Continuer vers le paiement"
            ) : (
              "Valider mon inscription"
            )}
          </Button>
        ) : (
          <Button type="button" size="lg" onClick={handleNext}>
            Continuer
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      <p className="text-sm text-muted-foreground text-center">
        * Champs obligatoires
      </p>
    </form>
  );
}
