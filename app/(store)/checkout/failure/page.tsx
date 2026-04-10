import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pago no completado — eNtorno Store",
};

export default function CheckoutFailure() {
  return (
    <div className="container6 py-20 text-center">
      <div className="max-w-md mx-auto">
        <div className="text-6xl mb-6">❌</div>
        <h1 className="text-2xl font-bold tracking-tight">Pago no completado</h1>
        <p className="mt-4 text-gray-500 leading-relaxed">
          Hubo un problema al procesar tu pago. No se realizó ningún cargo.
          Puedes intentar de nuevo o contactarnos para ayuda.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/productos"
            className="px-6 py-3 text-sm font-semibold text-white rounded-btn transition hover:opacity-90"
            style={{ background: "var(--brand)" }}
          >
            Volver al catálogo
          </Link>
          <Link
            href="/contacto"
            className="px-6 py-3 text-sm font-medium text-gray-600 rounded-btn border border-gray-200 hover:bg-gray-50 transition"
          >
            Contactar soporte
          </Link>
        </div>
      </div>
    </div>
  );
}
