import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./common-styles.css";
import { AppShell } from "@/components/layout/AppShell";
import { AutoSyncProvider } from "@/components/layout/AutoSyncProvider";
import Script from 'next/script';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DigitalSaurien - Gestion Indépendante",
  description: "Solution complète de devis et logigrammes pour prestataires indépendants.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <AppShell>
          {children}
        </AppShell>
        
        <AutoSyncProvider />
        {/* Scripts Google pour la persistance Cloud */}
        <Script src="https://apis.google.com/js/api.js" strategy="afterInteractive" />
        <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" />
      </body>
    </html>
  );
}
