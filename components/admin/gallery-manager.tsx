"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ImageIcon, Plus, Trash2, Upload, X } from "lucide-react";
import { formatFileSize, GALLERY_BUCKET } from "@/lib/format";
import {
  uploadGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
} from "@/app/admin/contenu/actions";

interface GalleryRow {
  id: string;
  title: string | null;
  caption: string | null;
  file_path: string;
  file_name: string;
  file_size: number;
  display_order: number;
  is_published: boolean;
}

const inputClass =
  "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500";

const ACCEPT = ".jpg,.jpeg,.png,.webp,.avif";

/** URL publique d'un objet du bucket, construite côté client. */
function publicUrl(filePath: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  return `${base}/storage/v1/object/public/${GALLERY_BUCKET}/${filePath}`;
}

export function GalleryManager({ images }: { images: GalleryRow[] }) {
  const [creating, setCreating] = useState(false);
  const [preview, setPreview] = useState<{ name: string; url: string } | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectFile = (file: File) => {
    setPreview({ name: file.name, url: URL.createObjectURL(file) });
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragging(false);

    const dropped = event.dataTransfer.files?.[0];
    if (!dropped || !fileInputRef.current) return;

    const transfer = new DataTransfer();
    transfer.items.add(dropped);
    fileInputRef.current.files = transfer.files;
    selectFile(dropped);
  };

  const closeCreate = () => {
    setCreating(false);
    setPreview(null);
  };

  return (
    <section className="rounded-lg bg-background p-4 sm:p-6 shadow">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-bold">Carrousel photo</h2>
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
        Photos affichées dans le carrousel de la page d&apos;accueil. L&apos;ordre d&apos;affichage
        suit le numéro indiqué.
      </p>

      {creating && (
        <form
          action={async (formData) => {
            await uploadGalleryImage(formData);
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
            {preview ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={preview.url}
                alt="Aperçu"
                className="max-h-40 rounded-md object-contain"
              />
            ) : (
              <Upload className="h-8 w-8 text-gray-400" />
            )}
            <span className="text-sm font-medium text-gray-700">
              {preview?.name ?? "Glissez une image ici ou cliquez pour parcourir"}
            </span>
            <span className="text-xs text-muted-foreground">
              JPG, PNG, WebP ou AVIF — 5 Mo maximum
            </span>
            <input
              ref={fileInputRef}
              type="file"
              name="file"
              accept={ACCEPT}
              required
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) selectFile(file);
                else setPreview(null);
              }}
            />
          </label>

          <input name="title" placeholder="Titre (optionnel)" className={inputClass} />
          <input name="caption" placeholder="Légende affichée (optionnelle)" className={inputClass} />
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              name="display_order"
              type="number"
              defaultValue={images.length + 1}
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
        {images.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Aucune photo. Le carrousel reste masqué sur la page d&apos;accueil.
          </p>
        )}
        {images.map((image) => (
          <div key={image.id} className="rounded-md border p-3">
            <div className="mb-3 flex items-start gap-3">
              <div className="h-16 w-24 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={publicUrl(image.file_path)}
                  alt={image.title ?? image.file_name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{image.file_name}</p>
                <p className="text-xs text-muted-foreground">{formatFileSize(image.file_size)}</p>
                {!image.is_published && (
                  <span className="mt-1 inline-block rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-800">
                    Masquée
                  </span>
                )}
              </div>
              <ImageIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
            </div>

            <form action={updateGalleryImage} className="space-y-3">
              <input type="hidden" name="id" value={image.id} />
              <input
                name="title"
                defaultValue={image.title ?? ""}
                placeholder="Titre (optionnel)"
                className={inputClass}
              />
              <input
                name="caption"
                defaultValue={image.caption ?? ""}
                placeholder="Légende affichée (optionnelle)"
                className={inputClass}
              />
              <div className="flex flex-wrap items-center gap-4">
                <input
                  name="display_order"
                  type="number"
                  defaultValue={image.display_order}
                  className="w-24 rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    name="is_published"
                    defaultChecked={image.is_published}
                    className="h-4 w-4"
                  />
                  Visible
                </label>
                <Button type="submit" size="sm" variant="outline">
                  Mettre à jour
                </Button>
              </div>
            </form>

            <form action={deleteGalleryImage} className="mt-2">
              <input type="hidden" name="id" value={image.id} />
              <input type="hidden" name="file_path" value={image.file_path} />
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
    </section>
  );
}
