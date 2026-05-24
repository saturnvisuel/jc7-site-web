import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "JC7 - Judo Courneuvien 7",
  description: "Club de judo à La Courneuve - Inscriptions et informations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
