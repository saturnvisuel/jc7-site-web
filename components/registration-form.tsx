"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const registrationSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  birthDate: z.string().min(1, "La date de naissance est requise"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(10, "Numéro de téléphone invalide"),
  emergencyContact: z.string().min(5, "Contact d'urgence requis"),
  category: z.string().min(1, "Catégorie requise"),
  medicalNote: z.string().optional(),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

export function RegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
  });

  const category = watch("category");

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
          emergency_contact: data.emergencyContact,
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        <Label htmlFor="emergencyContact">Contact d&apos;urgence *</Label>
        <Input
          id="emergencyContact"
          {...register("emergencyContact")}
          placeholder="Nom et téléphone"
        />
        {errors.emergencyContact && (
          <p className="text-sm text-destructive">{errors.emergencyContact.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Catégorie *</Label>
        <Select onValueChange={(value) => setValue("category", value)} value={category}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner une catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="baby">Baby Judo (4-5 ans)</SelectItem>
            <SelectItem value="mini-poussin">Mini-Poussin (6-7 ans)</SelectItem>
            <SelectItem value="poussin">Poussin (8-9 ans)</SelectItem>
            <SelectItem value="benjamin">Benjamin (10-11 ans)</SelectItem>
            <SelectItem value="minime">Minime (12-13 ans)</SelectItem>
            <SelectItem value="cadet">Cadet (14-15 ans)</SelectItem>
            <SelectItem value="junior">Junior (16-17 ans)</SelectItem>
            <SelectItem value="senior">Senior (18+ ans)</SelectItem>
          </SelectContent>
        </Select>
        {errors.category && (
          <p className="text-sm text-destructive">{errors.category.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="medicalNote">Note médicale (optionnel)</Label>
        <Textarea
          id="medicalNote"
          {...register("medicalNote")}
          placeholder="Allergies, traitements en cours, etc."
          rows={4}
        />
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-md">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
        {isSubmitting ? "Traitement en cours..." : "Continuer vers le paiement"}
      </Button>

      <p className="text-sm text-muted-foreground text-center">
        * Champs obligatoires
      </p>
    </form>
  );
}
