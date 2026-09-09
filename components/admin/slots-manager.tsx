"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, X } from "lucide-react";
import { saveSlot, deleteSlot } from "@/app/admin/contenu/actions";

interface Slot {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  category_label: string;
  professor_name: string;
  level: string;
  display_order: number;
  is_active: boolean;
}

const inputClass =
  "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500";

export function SlotsManager({
  slots,
  dayLabels,
}: {
  slots: Slot[];
  dayLabels: string[];
}) {
  const [creating, setCreating] = useState(false);

  const daySelect = (name: string, defaultValue?: number) => (
    <select name={name} defaultValue={defaultValue ?? 1} className={inputClass}>
      {dayLabels.map((label, index) =>
        index === 0 ? null : (
          <option key={index} value={index}>
            {label}
          </option>
        )
      )}
    </select>
  );

  return (
    <section className="rounded-lg bg-background p-4 sm:p-6 shadow">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-bold">Créneaux du planning</h2>
        <Button size="sm" variant={creating ? "outline" : "default"} onClick={() => setCreating(!creating)}>
          {creating ? <X className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
          {creating ? "Annuler" : "Ajouter"}
        </Button>
      </div>

      {creating && (
        <form action={saveSlot} className="mb-6 grid gap-3 rounded-md border border-dashed p-4 sm:grid-cols-3">
          {daySelect("day_of_week")}
          <input name="start_time" placeholder="17h00" className={inputClass} required />
          <input name="end_time" placeholder="18h00" className={inputClass} required />
          <input name="category_label" placeholder="Catégorie" className={inputClass} required />
          <input name="professor_name" placeholder="Professeur" className={inputClass} required />
          <input name="level" placeholder="Niveau" defaultValue="Tous niveaux" className={inputClass} />
          <input name="display_order" type="number" defaultValue={1} className={inputClass} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="is_active" defaultChecked className="h-4 w-4" />
            Actif
          </label>
          <div className="sm:col-span-3">
            <Button type="submit" size="sm">Enregistrer</Button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {slots.length === 0 && (
          <p className="text-sm text-muted-foreground">Aucun créneau enregistré.</p>
        )}
        {slots.map((slot) => (
          <div key={slot.id} className="rounded-md border p-3">
            <form action={saveSlot} className="grid gap-3 sm:grid-cols-4">
              <input type="hidden" name="id" value={slot.id} />
              {daySelect("day_of_week", slot.day_of_week)}
              <input name="start_time" defaultValue={slot.start_time} className={inputClass} required />
              <input name="end_time" defaultValue={slot.end_time} className={inputClass} required />
              <input name="level" defaultValue={slot.level} className={inputClass} />
              <input
                name="category_label"
                defaultValue={slot.category_label}
                className={`${inputClass} sm:col-span-2`}
                required
              />
              <input name="professor_name" defaultValue={slot.professor_name} className={inputClass} required />
              <input name="display_order" type="number" defaultValue={slot.display_order} className={inputClass} />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="is_active" defaultChecked={slot.is_active} className="h-4 w-4" />
                Actif
              </label>
              <div className="sm:col-span-3">
                <Button type="submit" size="sm" variant="outline">Mettre à jour</Button>
              </div>
            </form>
            <form action={deleteSlot} className="mt-2">
              <input type="hidden" name="id" value={slot.id} />
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
