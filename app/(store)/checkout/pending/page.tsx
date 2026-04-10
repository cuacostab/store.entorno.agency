import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pago pendiente — eNtorno Store",
};

export default function CheckoutPending() {
  return (
    <div className="container6 py-20 text-center">
      <div className="max-w-md mx-auto">
        <div className="text-6xl mb-6">⏳</div>
        <h1 className="text-2xl font-bold tracking-tight">Pago pendiente</h1>
        <p className="mt-4 text-gray-500 leading-relaxed">
          Tu pago está siendo procesado. Te notificaremos por correo
          cuando se confirme.
        </p>
        <p className="mt-2 text-gray-400 text-sm">
          Si pagaste en efectivo (OXXO, 7-Eleven), el pago puede tardar hasta 24 horas en acreditarse.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/productos"
            className="px-6 py-3 text-sm font-semibold text-white rounded-btn transition hover:opacity-90"
            style={{ background: "var(--brand)" }}
          >
            Seguir comprando
          </Link>
          <Link
            href="/"
            className="px-6 py-3 text-sm font-medium text-gray-600 rounded-btn border border-gray-200 hover:bg-gray-50 transition"
          >
            Ir al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
