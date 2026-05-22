"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import { Database } from "@/lib/supabase/types";

type Registration = Database["public"]["Tables"]["registrations"]["Row"];

interface RegistrationDetailsProps {
  registration: Registration;
}

export function RegistrationDetails({ registration }: RegistrationDetailsProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: registration.first_name,
    last_name: registration.last_name,
    birth_date: registration.birth_date,
    email: registration.email,
    phone: registration.phone,
    emergency_contact: registration.emergency_contact,
    category: registration.category,
    medical_note: registration.medical_note || "",
    payment_status: registration.payment_status,
  });

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/registrations/${registration.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsEditing(false);
        router.refresh();
      }
    } catch (error) {
      console.error("Error updating registration:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette inscription ?")) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/registrations/${registration.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/admin/registrations");
      }
    } catch (error) {
      console.error("Error deleting registration:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="outline" asChild>
          <Link href="/admin/registrations">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à la liste
          </Link>
        </Button>
        <div className="flex gap-2">
          {!isEditing ? (
            <>
              <Button onClick={() => setIsEditing(true)}>Modifier</Button>
              <Button variant="destructive" onClick={handleDelete} disabled={loading}>
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)} disabled={loading}>
                Annuler
              </Button>
              <Button onClick={handleUpdate} disabled={loading}>
                <Save className="mr-2 h-4 w-4" />
                {loading ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="bg-background rounded-lg shadow p-6 space-y-6">
        <div>
          <h2 className="text-xl font-bold mb-4">Informations personnelles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">Prénom</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Nom</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="birth_date">Date de naissance</Label>
              <Input
                id="birth_date"
                type="date"
                value={formData.birth_date}
                onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Catégorie</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue />
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
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Contact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="emergency_contact">Contact d&apos;urgence</Label>
              <Input
                id="emergency_contact"
                value={formData.emergency_contact}
                onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Informations médicales</h2>
          <div className="space-y-2">
            <Label htmlFor="medical_note">Note médicale</Label>
            <Textarea
              id="medical_note"
              value={formData.medical_note}
              onChange={(e) => setFormData({ ...formData, medical_note: e.target.value })}
              disabled={!isEditing}
              rows={4}
            />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Paiement</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="payment_status">Statut du paiement</Label>
              <Select
                value={formData.payment_status}
                onValueChange={(value) =>
                  setFormData({ ...formData, payment_status: value as "pending" | "paid" | "cancelled" })
                }
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="paid">Payé</SelectItem>
                  <SelectItem value="cancelled">Annulé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Date d&apos;inscription</Label>
              <Input value={new Date(registration.created_at).toLocaleString("fr-FR")} disabled />
            </div>
            {registration.stripe_session_id && (
              <div className="space-y-2 md:col-span-2">
                <Label>ID Session Stripe</Label>
                <Input value={registration.stripe_session_id} disabled />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
