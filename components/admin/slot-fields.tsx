"use client";

export interface Slot {
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

export const LEVELS = ["Tous niveaux", "Débutant", "Confirmé", "Avancé"];

const inputClass =
  "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500";

/** Champ avec étiquette : sans elle, impossible de savoir quel input est lequel. */
function Field({
  label,
  hint,
  className,
  children,
}: {
  label: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="mb-1 block text-xs font-medium text-gray-500">
        {label}
        {hint && <span className="font-normal text-gray-400"> · {hint}</span>}
      </span>
      {children}
    </label>
  );
}

/** Champs partagés entre la création et l'édition d'un créneau. */
export function SlotFields({ slot, dayLabels }: { slot?: Slot; dayLabels: string[] }) {
  return (
    <>
      <Field label="Jour">
        <select name="day_of_week" defaultValue={slot?.day_of_week ?? 1} className={inputClass}>
          {dayLabels.map((label, index) =>
            index === 0 ? null : (
              <option key={index} value={index}>
                {label}
              </option>
            )
          )}
        </select>
      </Field>
      <Field label="Début">
        <input
          name="start_time"
          defaultValue={slot?.start_time}
          placeholder="17h00"
          className={inputClass}
          required
        />
      </Field>
      <Field label="Fin">
        <input
          name="end_time"
          defaultValue={slot?.end_time}
          placeholder="18h00"
          className={inputClass}
          required
        />
      </Field>
      <Field label="Catégorie" hint="affichée sur le site" className="sm:col-span-2">
        <input
          name="category_label"
          defaultValue={slot?.category_label}
          placeholder="Baby Judo (4-5 ans)"
          className={inputClass}
          required
        />
      </Field>
      <Field label="Professeur">
        <input
          name="professor_name"
          defaultValue={slot?.professor_name}
          list="slot-professors"
          placeholder="Adam"
          className={inputClass}
          required
        />
      </Field>
      <Field label="Niveau">
        <input
          name="level"
          defaultValue={slot?.level ?? "Tous niveaux"}
          list="slot-levels"
          className={inputClass}
        />
      </Field>
      <Field label="Ordre" hint="dans la journée">
        <input
          name="display_order"
          type="number"
          defaultValue={slot?.display_order ?? 1}
          className={inputClass}
        />
      </Field>
      <label className="flex items-center gap-2 self-end pb-2 text-sm">
        <input
          type="checkbox"
          name="is_active"
          defaultChecked={slot?.is_active ?? true}
          className="h-4 w-4"
        />
        Visible sur le site
      </label>
    </>
  );
}
