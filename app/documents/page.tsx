import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { Reveal } from "@/components/ui/reveal";
import { ScrollToTop } from "@/components/scroll-to-top";
import { Download, FileText } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getPublicDocuments } from "@/lib/content";
import { formatFileSize, DOCUMENTS_BUCKET } from "@/lib/format";

export const revalidate = 60;

export default async function DocumentsPage() {
  const documents = await getPublicDocuments();
  const supabase = createClient();

  const items = documents.map((doc) => ({
    ...doc,
    url: supabase.storage.from(DOCUMENTS_BUCKET).getPublicUrl(doc.file_path).data.publicUrl,
  }));

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <ScrollToTop />

      <section className="bg-gradient-to-br from-red-600 via-red-500 to-red-700 text-white py-16 sm:py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
            Documents utiles
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
            Règlement, fiches d&apos;inscription et informations pratiques à télécharger
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {items.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
              <FileText className="mx-auto mb-4 h-12 w-12 text-gray-300" />
              <h2 className="mb-2 text-xl font-bold text-gray-900">
                Aucun document disponible
              </h2>
              <p className="mb-6 text-gray-600">
                Les documents du club seront mis en ligne prochainement.
              </p>
              <Button asChild className="bg-red-600 hover:bg-red-700">
                <Link href="/contact">Nous contacter</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((doc, index) => (
                <Reveal key={doc.id} delay={index * 80}>
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-xl"
                  >
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-red-100 transition-transform group-hover:scale-110">
                      <FileText className="h-6 w-6 text-red-600" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h2 className="font-bold text-gray-900">{doc.title}</h2>
                      {doc.description && (
                        <p className="mt-1 text-sm text-gray-600">{doc.description}</p>
                      )}
                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatFileSize(doc.file_size)}
                      </p>
                    </div>

                    <Download className="h-5 w-5 flex-shrink-0 text-gray-400 transition-colors group-hover:text-red-600" />
                  </a>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
