"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { EyeOff, Plus, Trash2, X } from "lucide-react";
import { saveSlot, deleteSlot } from "@/app/admin/contenu/actions";
import { LEVELS, SlotFields, type Slot } from "@/components/admin/slot-fields";

export function SlotsManager({
  slots,
  dayLabels,
  professorNames = [],
}: {
  slots: Slot[];
  dayLabels: string[];
  professorNames?: string[];
}) {
  const [creating, setCreating] = useState(false);

  const days = useMemo(() => {
    const grouped = new Map<number, Slot[]>();
    for (const slot of slots) {
      const existing = grouped.get(slot.day_of_week);
      if (existing) existing.push(slot);
      else grouped.set(slot.day_of_week, [slot]);
    }
    return [...grouped.entries()].sort(([a], [b]) => a - b);
  }, [slots]);

  return (
    <section className="rounded-lg bg-background p-4 sm:p-6 shadow">
      <datalist id="slot-professors">
        {professorNames.map((name) => (
          <option key={name} value={name} />
        ))}
      </datalist>
      <datalist id="slot-levels">
        {LEVELS.map((level) => (
          <option key={level} value={level} />
        ))}
      </datalist>

      <div className="mb-1 flex items-center justify-between gap-3">
        <h2 className="text-lg sm:text-xl font-bold">Créneaux du planning</h2>
        <Button
          size="sm"
          variant={creating ? "outline" : "default"}
          onClick={() => setCreating(!creating)}
        >
          {creating ? <X className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
          {creating ? "Annuler" : "Ajouter un créneau"}
        </Button>
      </div>
      <p className="mb-4 text-sm text-muted-foreground">
        {slots.length} créneau{slots.length > 1 ? "x" : ""} sur {days.length} jour
        {days.length > 1 ? "s" : ""}. Les modifications sont visibles sur le site après
        enregistrement.
      </p>

      {creating && (
        <form
          action={saveSlot}
          className="mb-6 grid gap-3 rounded-md border-2 border-dashed border-red-200 bg-red-50/40 p-4 sm:grid-cols-3"
        >
          <p className="sm:col-span-3 text-sm font-semibold text-gray-900">Nouveau créneau</p>
          <SlotFields dayLabels={dayLabels} />
          <div className="sm:col-span-3">
            <Button type="submit" size="sm">
              Enregistrer
            </Button>
          </div>
        </form>
      )}

      {slots.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aucun créneau enregistré.</p>
      ) : (
        <div className="space-y-8">
          {days.map(([dayIndex, daySlots]) => (
            <div key={dayIndex}>
              <div className="mb-3 flex items-center gap-2 border-b pb-2">
                <h3 className="text-sm font-bold uppercase tracking-wide text-gray-900">
                  {dayLabels[dayIndex] ?? `Jour ${dayIndex}`}
                </h3>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                  {daySlots.length} créneau{daySlots.length > 1 ? "x" : ""}
                </span>
              </div>

              <div className="space-y-3">
                {daySlots.map((slot) => (
                  <div
                    key={slot.id}
                    className={`rounded-lg border p-4 ${
                      slot.is_active ? "bg-white" : "border-dashed bg-gray-50"
                    }`}
                  >
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className="rounded bg-gray-900 px-2 py-0.5 text-xs font-bold text-white">
                        {slot.start_time} → {slot.end_time}
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {slot.category_label}
                      </span>
                      <span className="text-sm text-gray-500">
                        {slot.professor_name} · {slot.level}
                      </span>
                      {!slot.is_active && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                          <EyeOff className="h-3 w-3" />
                          Masqué sur le site
                        </span>
                      )}
                    </div>

                    <form action={saveSlot} className="grid gap-3 sm:grid-cols-3">
                      <input type="hidden" name="id" value={slot.id} />
                      <SlotFields slot={slot} dayLabels={dayLabels} />
                      <div className="sm:col-span-3">
                        <Button type="submit" size="sm" variant="outline">
                          Mettre à jour
                        </Button>
                      </div>
                    </form>

                    <form
                      action={deleteSlot}
                      className="mt-2 border-t pt-2"
                      onSubmit={(event) => {
                        if (
                          !confirm(
                            `Supprimer définitivement le créneau ${slot.start_time} → ${slot.end_time} (${slot.category_label}) ?`
                          )
                        ) {
                          event.preventDefault();
                        }
                      }}
                    >
                      <input type="hidden" name="id" value={slot.id} />
                      <Button
                        type="submit"
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Supprimer
                      </Button>
                    </form>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
