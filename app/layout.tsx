import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "eNtorno Store — Seguridad, Redes y Tecnología",
  description: "Catálogo de productos de seguridad, videovigilancia, control de acceso, redes y cableado estructurado. Aliado oficial Syscom. Solicita tu cotización.",
  openGraph: {
    title: "eNtorno Store — Seguridad, Redes y Tecnología",
    description: "Catálogo de productos de seguridad, videovigilancia, control de acceso, redes y cableado. Cotización personalizada.",
    siteName: "eNtorno Store",
    type: "website",
  },
  icons: { icon: "/entorno/favicon.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
