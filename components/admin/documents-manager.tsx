"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Trash2, Upload, X } from "lucide-react";
import { formatFileSize } from "@/lib/format";
import { uploadDocument, updateDocument, deleteDocument } from "@/app/admin/contenu/actions";

interface DocumentRow {
  id: string;
  title: string;
  description: string | null;
  file_path: string;
  file_name: string;
  file_size: number;
  display_order: number;
  is_published: boolean;
}

const inputClass =
  "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500";

const ACCEPT = ".pdf,.jpg,.jpeg,.png,.doc,.docx";

export function DocumentsManager({ documents }: { documents: DocumentRow[] }) {
  const [creating, setCreating] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragging(false);

    const dropped = event.dataTransfer.files?.[0];
    if (!dropped || !fileInputRef.current) return;

    const transfer = new DataTransfer();
    transfer.items.add(dropped);
    fileInputRef.current.files = transfer.files;
    setFileName(dropped.name);
  };

  const closeCreate = () => {
    setCreating(false);
    setFileName(null);
  };

  return (
    <section className="rounded-lg bg-background p-4 sm:p-6 shadow">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-bold">Documents téléchargeables</h2>
        <Button
          size="sm"
          variant={creating ? "outline" : "default"}
          onClick={() => (creating ? closeCreate() : setCreating(true))}
        >
          {creating ? <X className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
          {creating ? "Annuler" : "Ajouter"}
        </Button>
      </div>
      <p className="mb-4 text-sm text-muted-foreground">
        Règlement intérieur, fiche d&apos;inscription papier, calendrier... visibles sur la page
        Documents du site.
      </p>

      {creating && (
        <form
          action={async (formData) => {
            await uploadDocument(formData);
            closeCreate();
          }}
          className="mb-6 space-y-3 rounded-md border border-dashed p-4"
        >
          <label
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed p-6 text-center transition-colors ${
              dragging ? "border-red-500 bg-red-50" : "border-gray-300 hover:bg-gray-50"
            }`}
          >
            <Upload className="h-8 w-8 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">
              {fileName ?? "Glissez un fichier ici ou cliquez pour parcourir"}
            </span>
            <span className="text-xs text-muted-foreground">
              PDF, JPG, PNG ou Word — 10 Mo maximum
            </span>
            <input
              ref={fileInputRef}
              type="file"
              name="file"
              accept={ACCEPT}
              required
              className="sr-only"
              onChange={(event) => setFileName(event.target.files?.[0]?.name ?? null)}
            />
          </label>

          <input name="title" placeholder="Titre affiché sur le site" className={inputClass} required />
          <input name="description" placeholder="Description (optionnelle)" className={inputClass} />
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              name="display_order"
              type="number"
              defaultValue={documents.length + 1}
              className={inputClass}
            />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="is_published" defaultChecked className="h-4 w-4" />
              Visible sur le site
            </label>
          </div>
          <Button type="submit" size="sm">
            Mettre en ligne
          </Button>
        </form>
      )}

      <div className="space-y-3">
        {documents.length === 0 && (
          <p className="text-sm text-muted-foreground">Aucun document en ligne.</p>
        )}
        {documents.map((doc) => (
          <div key={doc.id} className="rounded-md border p-3">
            <div className="mb-3 flex items-start gap-3">
              <FileText className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{doc.file_name}</p>
                <p className="text-xs text-muted-foreground">{formatFileSize(doc.file_size)}</p>
              </div>
            </div>

            <form action={updateDocument} className="space-y-3">
              <input type="hidden" name="id" value={doc.id} />
              <input name="title" defaultValue={doc.title} className={inputClass} required />
              <input
                name="description"
                defaultValue={doc.description ?? ""}
                placeholder="Description (optionnelle)"
                className={inputClass}
              />
              <div className="flex flex-wrap items-center gap-4">
                <input
                  name="display_order"
                  type="number"
                  defaultValue={doc.display_order}
                  className="w-24 rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    name="is_published"
                    defaultChecked={doc.is_published}
                    className="h-4 w-4"
                  />
                  Visible
                </label>
                <Button type="submit" size="sm" variant="outline">
                  Mettre à jour
                </Button>
              </div>
            </form>

            <form action={deleteDocument} className="mt-2">
              <input type="hidden" name="id" value={doc.id} />
              <input type="hidden" name="file_path" value={doc.file_path} />
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
