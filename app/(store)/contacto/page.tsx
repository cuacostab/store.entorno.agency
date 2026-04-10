import { Suspense } from "react";
import { ContactForm } from "@/components/contact/ContactForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto — eNtorno Store",
  description: "Solicita tu cotización personalizada. Nuestro equipo te ayuda a elegir el equipo adecuado para tu proyecto.",
};

export default function ContactoPage() {
  return (
    <div className="container6 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Solicitar Cotización</h1>
        <p className="mt-3 text-gray-500 leading-relaxed">
          Cuéntanos sobre tu proyecto y te enviaremos una cotización personalizada.
          También puedes explorar nuestro <a href="/productos" className="font-medium" style={{ color: "var(--brand)" }}>catálogo de productos</a>.
        </p>

        <div className="mt-8 p-6 md:p-8 bg-white rounded-card border border-gray-100" style={{ boxShadow: "var(--shadow-card)" }}>
          <Suspense fallback={null}>
            <ContactForm />
          </Suspense>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl bg-gray-50 border border-gray-100">
            <p className="text-sm font-semibold text-gray-700">Email</p>
            <p className="text-sm text-gray-500 mt-1">contacto@entorno.agency</p>
          </div>
          <div className="p-5 rounded-xl bg-gray-50 border border-gray-100">
            <p className="text-sm font-semibold text-gray-700">Sitio principal</p>
            <a href="https://entorno.agency" target="_blank" rel="noopener noreferrer" className="text-sm mt-1 inline-block" style={{ color: "var(--brand)" }}>
              entorno.agency
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
