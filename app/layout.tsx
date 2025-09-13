// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { CookiesProvider } from "next-client-cookies/server";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Belinkama | Plateforme de recherche de logements au Gabon",
  description:
    "Belinkama est une plateforme au Gabon pour trouver facilement des maisons, studios, chambres et locaux à louer. Trouvez votre logement rapidement.",
  keywords: [
    "Belinkama",
    "location maison Gabon",
    "location studio Gabon",
    "chambre à louer Gabon",
    "logement Libreville",
    "location appartement Gabon",
    "immobilier Gabon",
  ],
  authors: [{ name: "Belinkama" }],
  creator: "Belinkama",
  publisher: "Belinkama",
  openGraph: {
    title: "Belinkama - Trouvez votre logement à louer au Gabon",
    description:
      "Plateforme de recherche de logements à louer au Gabon : maisons, studios, chambres, appartements et locaux.",
    url: "https://www.belinkama.com", // 👉 mets ton vrai domaine
    siteName: "Belinkama",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Belinkama - Location de logements au Gabon",
    description:
      "Trouvez facilement un logement à louer au Gabon : maisons, studios, chambres, appartements et locaux.",
    creator: "@belinkama", // 👉 si tu as un compte Twitter
  },
  alternates: {
    canonical: "https://www.belinkama.com", // 👉 mets ton vrai domaine
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" data-theme="emerald">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <CookiesProvider>{children}</CookiesProvider>
        </Providers>
      </body>
    </html>
  );
}
