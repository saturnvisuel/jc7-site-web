"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { calculateCategory, CATEGORIES, getTarif, getCategoryLabel } from "@/lib/categories";
import { Trash2, Plus } from "lucide-react";
import { RGPDConsent } from "@/components/rgpd-consent";

const childSchema = z.object({
  firstName: z.string().min(2, "Prénom requis"),
  lastName: z.string().min(2, "Nom requis"),
  birthDate: z.string().min(1, "Date de naissance requise"),
  category: z.string().min(1, "Catégorie requise"),
  socialSecurityNumber: z.string().min(15, "Numéro de sécurité sociale requis (15 chiffres)"),
  belt: z.string().optional(),
  medicalNote: z.string().optional(),
});

const familyRegistrationSchema = z.object({
  children: z.array(childSchema).min(1, "Au moins un enfant requis"),
  
  // Responsable légal
  guardianFirstName: z.string().min(2, "Prénom requis"),
  guardianLastName: z.string().min(2, "Nom requis"),
  guardianAddress: z.string().min(5, "Adresse requise"),
  guardianPostalCode: z.string().min(5, "Code postal requis"),
  guardianCity: z.string().min(2, "Ville requise"),
  guardianPhone: z.string().min(10, "Téléphone requis"),
  guardianEmail: z.string().email("Email invalide"),
  
  paymentMethod: z.string().min(1, "Mode de paiement requis"),
});

type FamilyRegistrationFormData = z.infer<typeof familyRegistrationSchema>;

export function RegistrationFormFamily() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [registrationIds, setRegistrationIds] = useState<string[]>([]);
  const [rgpdConsent, setRgpdConsent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm<FamilyRegistrationFormData>({
    resolver: zodResolver(familyRegistrationSchema),
    defaultValues: {
      children: [
        {
          firstName: "",
          lastName: "",
          birthDate: "",
          category: "",
          socialSecurityNumber: "",
          belt: "",
          medicalNote: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "children",
  });

  const children = watch("children");
  const paymentMethod = watch("paymentMethod");

  useEffect(() => {
    children.forEach((child, index) => {
      if (child.birthDate) {
        const autoCategory = calculateCategory(child.birthDate);
        if (autoCategory && child.category !== autoCategory) {
          setValue(`children.${index}.category`, autoCategory, { shouldValidate: false });
        }
      }
    });
  }, [children.map(c => c.birthDate).join(','), setValue]);

  const calculateTotal = () => {
    let childCount = 0;
    let total = 0;

    children.forEach((child) => {
      if (child.category && child.category !== "senior") {
        childCount++;
        total += getTarif(child.category, childCount);
      } else if (child.category === "senior") {
        total += getTarif(child.category, 1);
      }
    });

    return total;
  };

  const getChildTarif = (index: number) => {
    const child = children[index];
    if (!child.category) return 0;

    let childCount = 0;
    for (let i = 0; i <= index; i++) {
      if (children[i].category && children[i].category !== "senior") {
        childCount++;
      }
    }

    if (child.category === "senior") {
      return getTarif(child.category, 1);
    }

    return getTarif(child.category, childCount);
  };

  const onSubmit = async (data: FamilyRegistrationFormData) => {
    if (!rgpdConsent) {
      setError("Vous devez accepter la politique de confidentialité pour continuer.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/registrations/family", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          children: data.children,
          guardian: {
            first_name: data.guardianFirstName,
            last_name: data.guardianLastName,
            address: data.guardianAddress,
            postal_code: data.guardianPostalCode,
            city: data.guardianCity,
            phone: data.guardianPhone,
            email: data.guardianEmail,
          },
          payment_method: data.paymentMethod,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Erreur inconnue" }));
        throw new Error(errorData.error || "Erreur lors de l'inscription");
      }

      const result = await response.json();

      if (data.paymentMethod === "carte" && result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      } else {
        setRegistrationIds(result.registrationIds || []);
        setSuccess(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-green-800 mb-4">✓ Inscriptions enregistrées !</h2>
          <p className="text-green-700 mb-4">
            Les inscriptions de vos enfants ont été enregistrées avec succès.
          </p>
          <p className="text-sm text-green-600 mb-6">
            Vous recevrez un email de confirmation avec les détails et les reçus.
          </p>
          
          {registrationIds.length > 0 && (
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => {
                  window.open(`/api/registrations/family/${registrationIds[0]}/receipt`, '_blank');
                }}
                className="w-full sm:w-auto"
              >
                📄 Télécharger le reçu PDF
              </Button>
              <Button
                onClick={() => {
                  window.location.href = '/';
                }}
                variant="outline"
                className="w-full sm:w-auto"
              >
                🏠 Retour à l'accueil
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl mx-auto">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* RESPONSABLE LÉGAL */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-bold mb-6 text-primary">Responsable légal</h2>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="guardianLastName">Nom *</Label>
              <Input
                id="guardianLastName"
                {...register("guardianLastName")}
                placeholder="Dupont"
              />
              {errors.guardianLastName && (
                <p className="text-sm text-destructive">{errors.guardianLastName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="guardianFirstName">Prénom *</Label>
              <Input
                id="guardianFirstName"
                {...register("guardianFirstName")}
                placeholder="Marie"
              />
              {errors.guardianFirstName && (
                <p className="text-sm text-destructive">{errors.guardianFirstName.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="guardianAddress">Adresse *</Label>
            <Input
              id="guardianAddress"
              {...register("guardianAddress")}
              placeholder="12 rue de la République"
            />
            {errors.guardianAddress && (
              <p className="text-sm text-destructive">{errors.guardianAddress.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="guardianPostalCode">Code postal *</Label>
              <Input
                id="guardianPostalCode"
                {...register("guardianPostalCode")}
                placeholder="93120"
              />
              {errors.guardianPostalCode && (
                <p className="text-sm text-destructive">{errors.guardianPostalCode.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="guardianCity">Ville *</Label>
              <Input
                id="guardianCity"
                {...register("guardianCity")}
                placeholder="La Courneuve"
              />
              {errors.guardianCity && (
                <p className="text-sm text-destructive">{errors.guardianCity.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="guardianPhone">Téléphone *</Label>
              <Input
                id="guardianPhone"
                type="tel"
                {...register("guardianPhone")}
                placeholder="06 12 34 56 78"
              />
              {errors.guardianPhone && (
                <p className="text-sm text-destructive">{errors.guardianPhone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="guardianEmail">Email *</Label>
              <Input
                id="guardianEmail"
                type="email"
                {...register("guardianEmail")}
                placeholder="email@exemple.fr"
              />
              {errors.guardianEmail && (
                <p className="text-sm text-destructive">{errors.guardianEmail.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ENFANTS */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-primary">Enfants à inscrire</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({
              firstName: "",
              lastName: "",
              birthDate: "",
              category: "",
              socialSecurityNumber: "",
              belt: "",
              medicalNote: "",
            })}
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un enfant
          </Button>
        </div>

        {fields.map((field, index) => (
          <div key={field.id} className="mb-8 pb-8 border-b last:border-b-0">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Enfant {index + 1}</h3>
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              )}
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor={`children.${index}.lastName`}>Nom *</Label>
                  <Input
                    {...register(`children.${index}.lastName`)}
                    placeholder="Dupont"
                  />
                  {errors.children?.[index]?.lastName && (
                    <p className="text-sm text-destructive">{errors.children[index]?.lastName?.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`children.${index}.firstName`}>Prénom *</Label>
                  <Input
                    {...register(`children.${index}.firstName`)}
                    placeholder="Lucas"
                  />
                  {errors.children?.[index]?.firstName && (
                    <p className="text-sm text-destructive">{errors.children[index]?.firstName?.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor={`children.${index}.birthDate`}>Date de naissance *</Label>
                  <Input
                    type="date"
                    {...register(`children.${index}.birthDate`)}
                  />
                  {errors.children?.[index]?.birthDate && (
                    <p className="text-sm text-destructive">{errors.children[index]?.birthDate?.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`children.${index}.category`}>Catégorie *</Label>
                  <Input
                    id={`children.${index}.category`}
                    value={children[index]?.category ? getCategoryLabel(children[index].category) : "Saisissez d'abord la date de naissance"}
                    disabled
                    readOnly
                    className="bg-gray-50"
                    onChange={() => {}} // Évite le warning React
                  />
                  <input type="hidden" {...register(`children.${index}.category`)} value={children[index]?.category || ""} />
                  {errors.children?.[index]?.category && (
                    <p className="text-sm text-destructive">{errors.children[index]?.category?.message}</p>
                  )}
                  {children[index]?.category && (
                    <p className="text-xs text-muted-foreground">
                      Catégorie déterminée automatiquement selon la date de naissance
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`children.${index}.socialSecurityNumber`}>Numéro de sécurité sociale *</Label>
                <Input
                  {...register(`children.${index}.socialSecurityNumber`)}
                  placeholder="1 23 45 67 890 123 45"
                  maxLength={21}
                />
                {errors.children?.[index]?.socialSecurityNumber && (
                  <p className="text-sm text-destructive">{errors.children[index]?.socialSecurityNumber?.message}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  15 chiffres (espaces acceptés)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`children.${index}.belt`}>Ceinture (optionnel)</Label>
                <Select
                  onValueChange={(value) => setValue(`children.${index}.belt`, value)}
                  value={children[index]?.belt || ""}
                >
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
                <Label htmlFor={`children.${index}.medicalNote`}>Informations médicales (optionnel)</Label>
                <Textarea
                  {...register(`children.${index}.medicalNote`)}
                  placeholder="Allergies, traitements..."
                  rows={3}
                />
              </div>

              {children[index]?.category && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-blue-900">
                    Tarif pour cet enfant : {getChildTarif(index)} €
                    {index > 0 && children[index]?.category !== "senior" && (
                      <span className="text-blue-600 ml-2">
                        (réduction appliquée)
                      </span>
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}

        {children.length > 1 && (
          <div className="bg-amber-50 border-l-4 border-amber-600 p-4 rounded mt-6">
            <p className="text-sm text-amber-800">
              <strong>Réductions familiales :</strong>
              <br />
              • 1er enfant : tarif normal
              <br />
              • 2ème enfant : 165 €
              <br />
              • 3ème enfant et plus : 150 €
            </p>
          </div>
        )}
      </div>

      {/* PAIEMENT */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-bold mb-6 text-primary">Mode de paiement</h2>

        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <p className="text-2xl font-bold text-blue-900">
              Total à payer : {calculateTotal()} €
            </p>
            <p className="text-sm text-blue-700 mt-1">
              Pour {children.length} enfant{children.length > 1 ? "s" : ""}
            </p>
          </div>

          <div className="space-y-3">
            <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                value="carte"
                {...register("paymentMethod")}
                className="h-4 w-4"
              />
              <div>
                <p className="font-semibold">Carte bancaire (en ligne)</p>
                <p className="text-sm text-muted-foreground">Paiement sécurisé par Stripe</p>
              </div>
            </label>

            <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                value="cheque"
                {...register("paymentMethod")}
                className="h-4 w-4"
              />
              <div>
                <p className="font-semibold">Chèque</p>
                <p className="text-sm text-muted-foreground">À remettre lors de la première séance</p>
              </div>
            </label>

            <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                value="especes"
                {...register("paymentMethod")}
                className="h-4 w-4"
              />
              <div>
                <p className="font-semibold">Espèces</p>
                <p className="text-sm text-muted-foreground">À remettre lors de la première séance</p>
              </div>
            </label>
          </div>

          {errors.paymentMethod && (
            <p className="text-sm text-destructive">{errors.paymentMethod.message}</p>
          )}
        </div>
      </div>

      {/* CONSENTEMENT RGPD */}
      <RGPDConsent
        checked={rgpdConsent}
        onCheckedChange={setRgpdConsent}
        error={error && !rgpdConsent ? "Consentement requis" : undefined}
      />

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full"
        size="lg"
      >
        {isSubmitting ? "Inscription en cours..." : `Valider les inscriptions (${calculateTotal()} €)`}
      </Button>
    </form>
  );
}
