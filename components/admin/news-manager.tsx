"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, X } from "lucide-react";
import { saveNews, deleteNews } from "@/app/admin/contenu/actions";

interface NewsRow {
  id: string;
  title: string;
  excerpt: string;
  content: string | null;
  published: boolean;
  published_at: string;
}

const inputClass =
  "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500";

export function NewsManager({ news }: { news: NewsRow[] }) {
  const [creating, setCreating] = useState(false);

  return (
    <section className="rounded-lg bg-background p-4 sm:p-6 shadow">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-bold">Actualités</h2>
        <Button size="sm" variant={creating ? "outline" : "default"} onClick={() => setCreating(!creating)}>
          {creating ? <X className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
          {creating ? "Annuler" : "Ajouter"}
        </Button>
      </div>

      {creating && (
        <form action={saveNews} className="mb-6 space-y-3 rounded-md border border-dashed p-4">
          <input name="title" placeholder="Titre" className={inputClass} required />
          <input name="excerpt" placeholder="Résumé (affiché sur la page d'accueil)" className={inputClass} required />
          <textarea name="content" rows={4} placeholder="Contenu complet (optionnel)" className={inputClass} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="published" defaultChecked className="h-4 w-4" />
            Publier immédiatement
          </label>
          <Button type="submit" size="sm">Enregistrer</Button>
        </form>
      )}

      <div className="space-y-3">
        {news.length === 0 && (
          <p className="text-sm text-muted-foreground">Aucune actualité enregistrée.</p>
        )}
        {news.map((item) => (
          <div key={item.id} className="rounded-md border p-3">
            <form action={saveNews} className="space-y-3">
              <input type="hidden" name="id" value={item.id} />
              <input name="title" defaultValue={item.title} className={inputClass} required />
              <input name="excerpt" defaultValue={item.excerpt} className={inputClass} required />
              <textarea name="content" rows={3} defaultValue={item.content ?? ""} className={inputClass} />
              <div className="flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="published" defaultChecked={item.published} className="h-4 w-4" />
                  Publiée
                </label>
                <span className="text-xs text-muted-foreground">
                  {new Date(item.published_at).toLocaleDateString("fr-FR")}
                </span>
                <Button type="submit" size="sm" variant="outline">Mettre à jour</Button>
              </div>
            </form>
            <form action={deleteNews} className="mt-2">
              <input type="hidden" name="id" value={item.id} />
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
