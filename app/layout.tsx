import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BotWidgetLazy } from "@/components/bot/BotWidgetLazy";
import { CartProvider } from "@/lib/cart-context";
import { CartDrawer } from "@/components/cart/CartDrawer";
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
      <body className="flex flex-col min-h-screen" suppressHydrationWarning>
        <CartProvider>
          <Navbar />
          <main className="flex-1 pt-16">
            {children}
          </main>
          <Footer />
          <CartDrawer />
          <BotWidgetLazy />
        </CartProvider>
      </body>
    </html>
  );
}
