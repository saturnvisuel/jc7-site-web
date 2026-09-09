import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { Button } from "@/components/ui/button";
import { DAY_LABELS } from "@/lib/content";
import { ProfessorsManager } from "@/components/admin/professors-manager";
import { SlotsManager } from "@/components/admin/slots-manager";
import { NewsManager } from "@/components/admin/news-manager";
import { DocumentsManager } from "@/components/admin/documents-manager";
import { GalleryManager } from "@/components/admin/gallery-manager";
import { ContentTabs } from "@/components/admin/content-tabs";

export const dynamic = "force-dynamic";

/** Avertissement affiché quand la migration Supabase correspondante manque. */
function MigrationNotice({
  title,
  file,
  purpose,
}: {
  title: string;
  file: string;
  purpose: string;
}) {
  return (
    <div className="rounded-lg border-l-4 border-amber-500 bg-amber-50 p-4 text-sm text-amber-900">
      <p className="font-semibold">{title}</p>
      <p className="mt-1">
        Exécutez <code>{file}</code> dans l&apos;éditeur SQL Supabase pour activer {purpose}.
      </p>
    </div>
  );
}

export default async function AdminContenuPage() {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) redirect("/login");

  const [professorsRes, slotsRes, newsRes, documentsRes, galleryRes] = await Promise.all([
    supabaseAdmin.from("professors").select("*").order("display_order", { ascending: true }),
    supabaseAdmin
      .from("schedule_slots")
      .select("*")
      .order("day_of_week", { ascending: true })
      .order("display_order", { ascending: true }),
    supabaseAdmin.from("news").select("*").order("published_at", { ascending: false }),
    supabaseAdmin.from("documents").select("*").order("display_order", { ascending: true }),
    supabaseAdmin.from("gallery_images").select("*").order("display_order", { ascending: true }),
  ]);

  const missingTables =
    Boolean(professorsRes.error) && Boolean(slotsRes.error) && Boolean(newsRes.error);

  return (
    <div className="min-h-screen bg-muted/50">
      <header className="bg-background border-b">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h1 className="text-xl sm:text-2xl font-bold">Contenu du site</h1>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/admin/dashboard">Tableau de bord</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Voir le site</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {missingTables && (
          <div className="rounded-lg border-l-4 border-amber-500 bg-amber-50 p-4 text-sm text-amber-900">
            <p className="font-semibold">Migration non appliquée</p>
            <p className="mt-1">
              Exécutez <code>supabase/migrations/005_site_content.sql</code> dans l&apos;éditeur SQL
              Supabase pour activer la gestion de contenu. Le site public continue de fonctionner
              avec les données de secours.
            </p>
          </div>
        )}

        <ContentTabs
          tabs={[
            {
              id: "professeurs",
              label: "Professeurs",
              count: professorsRes.data?.length ?? 0,
              content: <ProfessorsManager professors={professorsRes.data ?? []} />,
            },
            {
              id: "creneaux",
              label: "Créneaux",
              count: slotsRes.data?.length ?? 0,
              content: <SlotsManager slots={slotsRes.data ?? []} dayLabels={[...DAY_LABELS]} />,
            },
            {
              id: "actualites",
              label: "Actualités",
              count: newsRes.data?.length ?? 0,
              content: <NewsManager news={newsRes.data ?? []} />,
            },
            {
              id: "documents",
              label: "Documents",
              count: documentsRes.data?.length ?? 0,
              content: documentsRes.error ? (
                <MigrationNotice
                  title="Documents indisponibles"
                  file="supabase/migrations/006_public_documents.sql"
                  purpose="les documents téléchargeables"
                />
              ) : (
                <DocumentsManager documents={documentsRes.data ?? []} />
              ),
            },
            {
              id: "carrousel",
              label: "Carrousel photo",
              count: galleryRes.data?.length ?? 0,
              content: galleryRes.error ? (
                <MigrationNotice
                  title="Carrousel indisponible"
                  file="supabase/migrations/007_gallery.sql"
                  purpose="le carrousel photo de la page d'accueil"
                />
              ) : (
                <GalleryManager images={galleryRes.data ?? []} />
              ),
            },
          ]}
        />
      </main>
    </div>
  );
}
