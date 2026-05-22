"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, ChevronRight, Check, Info } from "lucide-react";

const registrationSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  birthDate: z.string().min(1, "La date de naissance est requise"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(10, "Numéro de téléphone invalide"),
  address: z.string().min(5, "Adresse requise"),
  postalCode: z.string().min(5, "Code postal requis"),
  city: z.string().min(2, "Ville requise"),
  category: z.string().min(1, "Catégorie requise"),
  level: z.string().optional(),
  wantsCompetition: z.boolean().optional(),
  doctorName: z.string().optional(),
  doctorPhone: z.string().optional(),
  emergencyContact: z.string().min(5, "Contact d'urgence requis"),
  emergencyPhone: z.string().min(10, "Téléphone d'urgence requis"),
  medicalNote: z.string().optional(),
  acceptRules: z.boolean().refine((val) => val === true, "Vous devez accepter le règlement"),
  acceptPhotos: z.boolean().optional(),
  acceptNewsletter: z.boolean().optional(),
  acceptRGPD: z.boolean().refine((val) => val === true, "Vous devez accepter la politique RGPD"),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

const categories = [
  { value: "baby", label: "Baby Judo", age: "4-6 ans", price: "180€/an", icon: "👶", color: "orange" },
  { value: "enfants", label: "Judo Enfants", age: "7-13 ans", price: "220€/an", icon: "🥋", color: "indigo" },
  { value: "ados-adultes", label: "Ados/Adultes", age: "14 ans et +", price: "250€/an", icon: "🥷", color: "red" },
  { value: "loisir", label: "Judo Loisir", age: "Adultes", price: "200€/an", icon: "❤️", color: "emerald" },
];

const levels = [
  "Débutant (jamais pratiqué)",
  "Ceinture blanche",
  "Ceinture jaune",
  "Ceinture orange",
  "Ceinture verte",
  "Ceinture bleue",
  "Ceinture marron",
  "Ceinture noire",
];

export function RegistrationFormMultiStep() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalSteps = 4;
  const stepTitles = [
    "Informations personnelles",
    "Choix du cours",
    "Informations médicales",
    "Validation",
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      acceptRules: false,
      acceptPhotos: false,
      acceptNewsletter: false,
      acceptRGPD: false,
      wantsCompetition: false,
    },
  });

  const selectedCategory = watch("category");
  const watchedValues = watch();

  const nextStep = async () => {
    let fieldsToValidate: (keyof RegistrationFormData)[] = [];
    
    if (currentStep === 1) {
      fieldsToValidate = ["firstName", "lastName", "birthDate", "email", "phone", "address", "postalCode", "city"];
    } else if (currentStep === 2) {
      fieldsToValidate = ["category"];
    } else if (currentStep === 3) {
      fieldsToValidate = ["emergencyContact", "emergencyPhone"];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const onSubmit = async (data: RegistrationFormData) => {
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
          email: data.email,
          phone: data.phone,
          emergency_contact: `${data.emergencyContact} - ${data.emergencyPhone}`,
          category: data.category,
          medical_note: data.medicalNote || null,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'inscription");
      }

      const result = await response.json();

      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCategoryInfo = categories.find((c) => c.value === selectedCategory);

  return (
    <div>
      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 mb-8 rounded-t-3xl">
        <div className="p-6">
          <div className="flex justify-between mb-4">
            <div className="text-sm font-semibold text-gray-900">
              Étape {currentStep} sur {totalSteps}
            </div>
            <div className="text-sm text-gray-600">{stepTitles[currentStep - 1]}</div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-red-800 to-red-900 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
        {/* Step 1: Informations personnelles */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Informations personnelles</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-semibold text-gray-700">
                  Prénom *
                </Label>
                <Input
                  id="firstName"
                  {...register("firstName")}
                  className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-red-800"
                  placeholder="Prénom"
                />
                {errors.firstName && (
                  <p className="text-sm text-red-600">{errors.firstName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-semibold text-gray-700">
                  Nom *
                </Label>
                <Input
                  id="lastName"
                  {...register("lastName")}
                  className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-red-800"
                  placeholder="Nom"
                />
                {errors.lastName && (
                  <p className="text-sm text-red-600">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthDate" className="text-sm font-semibold text-gray-700">
                Date de naissance *
              </Label>
              <Input
                id="birthDate"
                type="date"
                {...register("birthDate")}
                className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-red-800"
              />
              {errors.birthDate && (
                <p className="text-sm text-red-600">{errors.birthDate.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-red-800"
                  placeholder="email@exemple.fr"
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">
                  Téléphone *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  {...register("phone")}
                  className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-red-800"
                  placeholder="06 12 34 56 78"
                />
                {errors.phone && (
                  <p className="text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-semibold text-gray-700">
                Adresse complète *
              </Label>
              <Input
                id="address"
                {...register("address")}
                className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-red-800"
                placeholder="Numéro et nom de rue"
              />
              {errors.address && (
                <p className="text-sm text-red-600">{errors.address.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="postalCode" className="text-sm font-semibold text-gray-700">
                  Code postal *
                </Label>
                <Input
                  id="postalCode"
                  {...register("postalCode")}
                  className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-red-800"
                  placeholder="75000"
                />
                {errors.postalCode && (
                  <p className="text-sm text-red-600">{errors.postalCode.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="city" className="text-sm font-semibold text-gray-700">
                  Ville *
                </Label>
                <Input
                  id="city"
                  {...register("city")}
                  className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-red-800"
                  placeholder="Paris"
                />
                {errors.city && (
                  <p className="text-sm text-red-600">{errors.city.message}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Choix du cours */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Choix du cours</h2>
            
            <div className="space-y-4">
              <Label className="text-sm font-semibold text-gray-700 mb-4 block">
                Sélectionnez votre cours *
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map((cat) => (
                  <label key={cat.value} className="relative cursor-pointer">
                    <input
                      type="radio"
                      value={cat.value}
                      {...register("category")}
                      className="peer sr-only"
                    />
                    <div className={`p-6 border-2 border-gray-300 rounded-xl peer-checked:border-${cat.color}-500 peer-checked:bg-${cat.color}-50 transition-all hover:border-${cat.color}-300`}>
                      <div className="flex items-center mb-3">
                        <span className="text-3xl mr-3">{cat.icon}</span>
                        <div>
                          <div className="font-bold text-gray-900">{cat.label}</div>
                          <div className="text-sm text-gray-600">{cat.age}</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-700 font-semibold">{cat.price}</div>
                    </div>
                  </label>
                ))}
              </div>
              {errors.category && (
                <p className="text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="level" className="text-sm font-semibold text-gray-700">
                Niveau actuel
              </Label>
              <select
                id="level"
                {...register("level")}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-red-800 transition-all"
              >
                {levels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-start cursor-pointer">
                <input
                  type="checkbox"
                  {...register("wantsCompetition")}
                  className="mt-1 mr-3 w-5 h-5 text-red-800 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">
                  Je souhaite participer aux compétitions (optionnel)
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Step 3: Informations médicales */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Informations médicales</h2>
            
            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg">
              <div className="flex items-start">
                <Info className="text-blue-600 text-xl mr-3 mt-1 flex-shrink-0" />
                <p className="text-sm text-gray-700">
                  Un certificat médical de moins de 3 mois sera obligatoire pour valider votre inscription définitive.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="doctorName" className="text-sm font-semibold text-gray-700">
                Nom du médecin traitant
              </Label>
              <Input
                id="doctorName"
                {...register("doctorName")}
                className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-red-800"
                placeholder="Dr. Nom"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="doctorPhone" className="text-sm font-semibold text-gray-700">
                Téléphone du médecin
              </Label>
              <Input
                id="doctorPhone"
                type="tel"
                {...register("doctorPhone")}
                className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-red-800"
                placeholder="01 23 45 67 89"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyContact" className="text-sm font-semibold text-gray-700">
                Personne à contacter en cas d&apos;urgence *
              </Label>
              <Input
                id="emergencyContact"
                {...register("emergencyContact")}
                className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-red-800"
                placeholder="Nom et prénom"
              />
              {errors.emergencyContact && (
                <p className="text-sm text-red-600">{errors.emergencyContact.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyPhone" className="text-sm font-semibold text-gray-700">
                Téléphone d&apos;urgence *
              </Label>
              <Input
                id="emergencyPhone"
                type="tel"
                {...register("emergencyPhone")}
                className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-red-800"
                placeholder="06 12 34 56 78"
              />
              {errors.emergencyPhone && (
                <p className="text-sm text-red-600">{errors.emergencyPhone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="medicalNote" className="text-sm font-semibold text-gray-700">
                Allergies ou problèmes de santé à signaler
              </Label>
              <Textarea
                id="medicalNote"
                {...register("medicalNote")}
                rows={4}
                className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-red-800"
                placeholder="Décrivez toute information médicale importante..."
              />
            </div>
          </div>
        )}

        {/* Step 4: Validation */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Validation</h2>
            
            <div className="bg-gray-50 p-8 rounded-2xl">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Récapitulatif</h3>
              <div className="space-y-4 text-gray-700">
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="font-semibold">Cours sélectionné</span>
                  <span>{selectedCategoryInfo?.label || "-"}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="font-semibold">Tarif annuel</span>
                  <span>{selectedCategoryInfo?.price || "-"}</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="font-semibold">Cours d&apos;essai</span>
                  <span className="text-emerald-600 font-bold">GRATUIT</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="flex items-start cursor-pointer">
                <input
                  type="checkbox"
                  {...register("acceptRules")}
                  className="mt-1 mr-3 w-5 h-5 text-red-800 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">
                  J&apos;accepte le règlement intérieur du JC7 *
                </span>
              </label>
              {errors.acceptRules && (
                <p className="text-sm text-red-600">{errors.acceptRules.message}</p>
              )}

              <label className="flex items-start cursor-pointer">
                <input
                  type="checkbox"
                  {...register("acceptPhotos")}
                  className="mt-1 mr-3 w-5 h-5 text-red-800 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">
                  J&apos;autorise le JC7 à utiliser des photos/vidéos pour la communication du club
                </span>
              </label>

              <label className="flex items-start cursor-pointer">
                <input
                  type="checkbox"
                  {...register("acceptNewsletter")}
                  className="mt-1 mr-3 w-5 h-5 text-red-800 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">
                  Je souhaite recevoir la newsletter du JC7
                </span>
              </label>

              <label className="flex items-start cursor-pointer">
                <input
                  type="checkbox"
                  {...register("acceptRGPD")}
                  className="mt-1 mr-3 w-5 h-5 text-red-800 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">
                  J&apos;accepte que mes données soient utilisées pour traiter ma demande (RGPD) *
                </span>
              </label>
              {errors.acceptRGPD && (
                <p className="text-sm text-red-600">{errors.acceptRGPD.message}</p>
              )}
            </div>

            <div className="bg-amber-50 border-l-4 border-amber-600 p-6 rounded-lg">
              <div className="flex items-start">
                <Info className="text-amber-600 text-xl mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-700 font-semibold mb-2">Prochaines étapes :</p>
                  <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                    <li>Vous recevrez un email de confirmation</li>
                    <li>Nous vous contacterons sous 48h pour planifier votre cours d&apos;essai</li>
                    <li>Pensez à préparer votre certificat médical</li>
                  </ul>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-12 pt-8 border-t border-gray-200">
          {currentStep > 1 && (
            <Button
              type="button"
              onClick={prevStep}
              variant="outline"
              size="lg"
              className="px-8 py-4 border-2 border-gray-300 rounded-full font-semibold"
            >
              <ChevronLeft className="mr-2 h-5 w-5" />
              Précédent
            </Button>
          )}

          {currentStep < totalSteps && (
            <Button
              type="button"
              onClick={nextStep}
              size="lg"
              className="ml-auto px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 rounded-full font-semibold shadow-lg"
            >
              Suivant
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          )}

          {currentStep === totalSteps && (
            <Button
              type="submit"
              disabled={isSubmitting}
              size="lg"
              className="ml-auto px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-full font-semibold shadow-lg"
            >
              <Check className="mr-2 h-5 w-5" />
              {isSubmitting ? "Envoi en cours..." : "Valider ma pré-inscription"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
