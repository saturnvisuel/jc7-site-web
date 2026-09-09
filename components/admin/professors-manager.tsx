"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, X } from "lucide-react";
import { saveProfessor, deleteProfessor } from "@/app/admin/contenu/actions";

interface Professor {
  id: string;
  name: string;
  grade: string;
  display_order: number;
  is_active: boolean;
}

const inputClass =
  "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500";

export function ProfessorsManager({ professors }: { professors: Professor[] }) {
  const [creating, setCreating] = useState(false);

  return (
    <section className="rounded-lg bg-background p-4 sm:p-6 shadow">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-bold">Professeurs</h2>
        <Button size="sm" variant={creating ? "outline" : "default"} onClick={() => setCreating(!creating)}>
          {creating ? <X className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
          {creating ? "Annuler" : "Ajouter"}
        </Button>
      </div>

      {creating && (
        <form action={saveProfessor} className="mb-6 grid gap-3 rounded-md border border-dashed p-4 sm:grid-cols-4">
          <input name="name" placeholder="Nom" className={inputClass} required />
          <input name="grade" placeholder="Grade" className={inputClass} required />
          <input name="display_order" type="number" defaultValue={professors.length + 1} className={inputClass} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="is_active" defaultChecked className="h-4 w-4" />
            Actif
          </label>
          <div className="sm:col-span-4">
            <Button type="submit" size="sm">Enregistrer</Button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {professors.length === 0 && (
          <p className="text-sm text-muted-foreground">Aucun professeur enregistré.</p>
        )}
        {professors.map((prof) => (
          <div key={prof.id} className="rounded-md border p-3">
            <form action={saveProfessor} className="grid gap-3 sm:grid-cols-5 sm:items-center">
              <input type="hidden" name="id" value={prof.id} />
              <input name="name" defaultValue={prof.name} className={inputClass} required />
              <input name="grade" defaultValue={prof.grade} className={inputClass} required />
              <input name="display_order" type="number" defaultValue={prof.display_order} className={inputClass} />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="is_active" defaultChecked={prof.is_active} className="h-4 w-4" />
                Actif
              </label>
              <Button type="submit" size="sm" variant="outline">Mettre à jour</Button>
            </form>
            <form action={deleteProfessor} className="mt-2">
              <input type="hidden" name="id" value={prof.id} />
              <Button type="submit" size="sm" variant="ghost" className="text-red-600 hover:bg-red-50">
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer
              </Button>
            </form>
          </div>
        ))}
      </div>
    </section>
  );
}
