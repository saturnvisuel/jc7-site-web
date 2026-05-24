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
import { useRouter } from "next/navigation";
import { calculateCategory, CATEGORIES, getTarif, getCategoryLabel } from "@/lib/categories";

const memberRegistrationSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  birthDate: z.string().min(1, "La date de naissance est requise"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(10, "Numéro de téléphone invalide"),
  emergencyContact: z.string().min(5, "Contact d'urgence requis"),
  category: z.string().min(1, "Catégorie requise"),
  medicalNote: z.string().optional(),
  relationToMember: z.string().min(1, "Relation requise"),
});

type MemberRegistrationFormData = z.infer<typeof memberRegistrationSchema>;

interface MemberRegistrationFormProps {
  userEmail: string;
}

export function MemberRegistrationForm({ userEmail }: MemberRegistrationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<MemberRegistrationFormData>({
    resolver: zodResolver(memberRegistrationSchema),
    defaultValues: {
      email: userEmail,
    },
  });

  const category = watch("category");
  const relationToMember = watch("relationToMember");
  const birthDate = watch("birthDate");

  useEffect(() => {
    if (birthDate) {
      const autoCategory = calculateCategory(birthDate);
      if (autoCategory) {
        setValue("category", autoCategory);
      }
    }
  }, [birthDate, setValue]);

  const onSubmit = async (data: MemberRegistrationFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/member-registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: data.firstName,
          last_name: data.lastName,
          birth_date: data.birthDate,
          email: data.email,
          phone: data.phone,
          emergency_contact: data.emergencyContact,
          category: data.category,
          medical_note: data.medicalNote || null,
          relation_to_member: data.relationToMember,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'inscription");
      }

      setSuccess(true);
      reset();
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold mb-6">Nouvelle inscription</h2>

      {success && (
        <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-600 rounded">
          <p className="text-green-800 font-semibold">✓ Inscription enregistrée avec succès !</p>
          <p className="text-sm text-green-700 mt-1">
            Vous recevrez un email de confirmation. Le club vous contactera pour finaliser l'inscription.
          </p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-600 rounded">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="relationToMember">Cette inscription concerne *</Label>
          <Select onValueChange={(value) => setValue("relationToMember", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="moi-meme">Moi-même (réinscription)</SelectItem>
              <SelectItem value="mon-enfant">Mon enfant</SelectItem>
              <SelectItem value="autre">Autre membre de la famille</SelectItem>
            </SelectContent>
          </Select>
          {errors.relationToMember && (
            <p className="text-sm text-destructive">{errors.relationToMember.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="firstName">Prénom *</Label>
            <Input
              id="firstName"
              {...register("firstName")}
              placeholder="Prénom"
            />
            {errors.firstName && (
              <p className="text-sm text-destructive">{errors.firstName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Nom *</Label>
            <Input
              id="lastName"
              {...register("lastName")}
              placeholder="Nom"
            />
            {errors.lastName && (
              <p className="text-sm text-destructive">{errors.lastName.message}</p>
            )}
          </div>
        </div>

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="email@exemple.fr"
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

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
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Catégorie *</Label>
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

        <div className="space-y-2">
          <Label htmlFor="emergencyContact">Contact d&apos;urgence *</Label>
          <Input
            id="emergencyContact"
            {...register("emergencyContact")}
            placeholder="Nom et téléphone du contact d'urgence"
          />
          {errors.emergencyContact && (
            <p className="text-sm text-destructive">{errors.emergencyContact.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="medicalNote">Informations médicales (optionnel)</Label>
          <Textarea
            id="medicalNote"
            {...register("medicalNote")}
            placeholder="Allergies, traitements, informations importantes..."
            rows={4}
          />
        </div>

        <div className="bg-amber-50 border-l-4 border-amber-600 p-4 rounded">
          <p className="text-sm text-amber-800">
            <strong>Note :</strong> Cette inscription sera validée par le club. 
            Vous recevrez un email avec les modalités de paiement et les documents à fournir.
          </p>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full"
          size="lg"
        >
          {isSubmitting ? "Envoi en cours..." : "Enregistrer l'inscription"}
        </Button>
      </form>
    </div>
  );
}
