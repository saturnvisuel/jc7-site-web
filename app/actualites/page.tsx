import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { Reveal } from "@/components/ui/reveal";
import { ScrollToTop } from "@/components/scroll-to-top";
import { CalendarDays, Newspaper } from "lucide-react";
import { getPublishedNews } from "@/lib/content";

export const revalidate = 60;

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function ActualitesPage() {
  const news = await getPublishedNews();

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <ScrollToTop />

      <section className="bg-gradient-to-br from-red-600 via-red-500 to-red-700 text-white py-16 sm:py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
            Actualités du club
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
            Compétitions, stages, passages de grade et vie du dojo
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {news.length === 0 ? (
            <div className="text-center bg-white rounded-2xl border border-gray-200 p-10 shadow-sm">
              <Newspaper className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Aucune actualité pour le moment
              </h2>
              <p className="text-gray-600 mb-6">
                Les prochaines news du club seront publiées ici.
              </p>
              <Button asChild className="bg-red-600 hover:bg-red-700">
                <Link href="/contact">Nous contacter</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {news.map((item, index) => (
                <Reveal key={item.id} delay={index * 80}>
                  <article className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <div className="flex items-center gap-2 text-sm text-red-600 font-medium mb-3">
                      <CalendarDays className="h-4 w-4" />
                      {formatDate(item.published_at)}
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                      {item.title}
                    </h2>
                    <p className="text-gray-600 leading-relaxed">{item.excerpt}</p>
                    {item.content && (
                      <p className="mt-4 text-gray-700 leading-relaxed whitespace-pre-line">
                        {item.content}
                      </p>
                    )}
                  </article>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
