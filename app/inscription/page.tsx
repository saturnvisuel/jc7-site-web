import { RegistrationForm } from "@/components/registration-form";

export default function InscriptionPage() {
  return (
    <main className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-4">Inscription JC7</h1>
            <p className="text-lg text-muted-foreground">
              Remplissez le formulaire ci-dessous pour vous inscrire au club de judo
            </p>
          </div>
          <RegistrationForm />
        </div>
      </div>
    </main>
  );
}
