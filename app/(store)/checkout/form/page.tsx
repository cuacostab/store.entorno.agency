import { Suspense } from "react";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout — eNtorno Store",
  description: "Completa tu compra",
};

export default function CheckoutFormPage() {
  return (
    <div className="container6 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Finalizar compra</h1>
        <p className="mt-2 text-gray-500 text-sm">Completa tus datos para proceder al pago.</p>

        <Suspense fallback={null}>
          <CheckoutForm />
        </Suspense>
      </div>
    </div>
  );
}
