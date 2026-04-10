import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pago exitoso — eNtorno Store",
};

export default function CheckoutSuccess() {
  return (
    <div className="container6 py-20 text-center">
      <div className="max-w-md mx-auto">
        <div className="text-6xl mb-6">✅</div>
        <h1 className="text-2xl font-bold tracking-tight">¡Pago exitoso!</h1>
        <p className="mt-4 text-gray-500 leading-relaxed">
          Tu pago ha sido procesado correctamente. Recibirás un correo de confirmación
          con los detalles de tu compra.
        </p>
        <p className="mt-2 text-gray-400 text-sm">
          Nos pondremos en contacto contigo para coordinar la entrega.
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
