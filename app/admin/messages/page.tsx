import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { Button } from "@/components/ui/button";
import { DeleteMessageButton } from "@/components/admin/delete-message-button";
import { setMessageStatus } from "./actions";
import { Check, Mail, Phone, RotateCcw } from "lucide-react";

export const dynamic = "force-dynamic";

const SUBJECT_LABELS: Record<string, string> = {
  information: "Demande d'information",
  inscription: "Inscription / Cours d'essai",
  tarifs: "Tarifs et modalités",
  horaires: "Horaires des cours",
  autre: "Autre",
};

interface ContactMessage {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  age_range: string | null;
  subject: string;
  message: string;
  newsletter: boolean;
  status: "new" | "handled";
  created_at: string;
}

export default async function AdminMessagesPage() {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) redirect("/login");

  const { data, error } = await supabaseAdmin
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  const messages = (data ?? []) as ContactMessage[];
  const newCount = messages.filter((message) => message.status === "new").length;

  return (
    <div className="min-h-screen bg-muted/50">
      <header className="bg-background border-b">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h1 className="text-xl sm:text-2xl font-bold">Messages de contact</h1>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/admin/dashboard">Tableau de bord</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {error && (
          <div className="rounded-lg border-l-4 border-amber-500 bg-amber-50 p-4 text-sm text-amber-900">
            <p className="font-semibold">Migration non appliquée</p>
            <p className="mt-1">
              Exécutez <code>supabase/migrations/009_contact_messages.sql</code> dans l&apos;éditeur
              SQL Supabase pour activer la réception des messages.
            </p>
          </div>
        )}

        <p className="text-sm text-muted-foreground">
          {messages.length} message{messages.length > 1 ? "s" : ""} au total, dont {newCount} à
          traiter.
        </p>

        {messages.length === 0 && !error ? (
          <p className="rounded-lg bg-background p-6 text-sm text-muted-foreground shadow">
            Aucun message reçu pour le moment.
          </p>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <article
                key={message.id}
                className={`rounded-lg border-l-4 bg-background p-4 sm:p-6 shadow ${
                  message.status === "new" ? "border-red-600" : "border-gray-300"
                }`}
              >
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <h2 className="text-base font-bold">
                    {message.first_name} {message.last_name}
                  </h2>
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                    {SUBJECT_LABELS[message.subject] ?? message.subject}
                  </span>
                  {message.status === "new" ? (
                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
                      À traiter
                    </span>
                  ) : (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                      Traité
                    </span>
                  )}
                  {message.newsletter && (
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                      Newsletter
                    </span>
                  )}
                  <span className="ml-auto text-xs text-muted-foreground">
                    {new Date(message.created_at).toLocaleString("fr-FR")}
                  </span>
                </div>

                <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                  <a
                    href={`mailto:${message.email}`}
                    className="inline-flex items-center gap-1.5 text-red-600 hover:underline"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    {message.email}
                  </a>
                  {message.phone && (
                    <span className="inline-flex items-center gap-1.5 text-gray-600">
                      <Phone className="h-3.5 w-3.5" />
                      {message.phone}
                    </span>
                  )}
                  {message.age_range && (
                    <span className="text-gray-600">Âge : {message.age_range} ans</span>
                  )}
                </div>

                <p className="whitespace-pre-line rounded-md bg-muted/50 p-3 text-sm text-gray-800">
                  {message.message}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-2 border-t pt-3">
                  <form action={setMessageStatus}>
                    <input type="hidden" name="id" value={message.id} />
                    <input
                      type="hidden"
                      name="status"
                      value={message.status === "new" ? "handled" : "new"}
                    />
                    <Button type="submit" size="sm" variant="outline">
                      {message.status === "new" ? (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Marquer comme traité
                        </>
                      ) : (
                        <>
                          <RotateCcw className="mr-2 h-4 w-4" />
                          Remettre à traiter
                        </>
                      )}
                    </Button>
                  </form>
                  <Button size="sm" variant="ghost" asChild>
                    <a href={`mailto:${message.email}?subject=Re: JC7 - votre demande`}>
                      Répondre par email
                    </a>
                  </Button>
                  <DeleteMessageButton
                    id={message.id}
                    author={`${message.first_name} ${message.last_name}`}
                  />
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
