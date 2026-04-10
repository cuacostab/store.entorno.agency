"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import Image from "next/image";
import Link from "next/link";

export function CheckoutForm() {
  const { items, totalItems, totalPriceFormatted, totalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    extNum: "",
    intNum: "",
    neighborhood: "",
    city: "",
    state: "",
    zip: "",
  });

  function update(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) return;
    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(i => ({
            product_id: i.producto_id,
            title: i.titulo,
            description: `${i.marca} — ${i.modelo}`,
            picture_url: i.img_portada?.trim() || undefined,
            quantity: i.quantity,
            unit_price: i.precio,
          })),
          customerName: form.name,
          customerEmail: form.email,
          customerPhone: form.phone,
          shippingAddress: {
            street: form.street,
            extNum: form.extNum,
            intNum: form.intNum,
            neighborhood: form.neighborhood,
            city: form.city,
            state: form.state,
            zip: form.zip,
          },
        }),
      });

      const data = await res.json();
      if (data.init_point) {
        clearCart();
        window.location.href = data.init_point;
      } else {
        alert(data.error || "Error al crear el pago");
        setLoading(false);
      }
    } catch {
      alert("Error de conexión. Intenta de nuevo.");
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16 mt-8">
        <p className="text-4xl mb-4">🛒</p>
        <p className="text-gray-500 text-lg">Tu carrito está vacío</p>
        <Link href="/productos" className="mt-4 inline-block text-sm font-semibold px-6 py-2 rounded-btn text-white" style={{ background: "var(--brand)" }}>
          Ver catálogo
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-8">
      {/* Order summary */}
      <div className="p-5 rounded-card border border-gray-100 bg-white" style={{ boxShadow: "var(--shadow-card)" }}>
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Resumen del pedido ({totalItems} productos)</h2>
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.producto_id} className="flex items-center gap-3">
              {item.img_portada?.trim() ? (
                <div className="relative w-12 h-12 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                  <Image src={item.img_portada} alt="" fill className="object-contain p-1" sizes="48px" />
                </div>
              ) : (
                <div className="w-12 h-12 flex-shrink-0 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center text-lg text-gray-300">📦</div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-800 line-clamp-1">{item.titulo}</p>
                <p className="text-xs text-gray-400">{item.modelo} × {item.quantity}</p>
              </div>
              <p className="text-sm font-semibold" style={{ color: "var(--brand)" }}>
                {(item.precio * item.quantity).toLocaleString("es-MX", { style: "currency", currency: "MXN" })}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
          <span className="text-sm text-gray-500">Total (IVA incluido)</span>
          <span className="text-lg font-bold">{totalPriceFormatted}</span>
        </div>
      </div>

      {/* Customer info */}
      <div className="p-5 rounded-card border border-gray-100 bg-white" style={{ boxShadow: "var(--shadow-card)" }}>
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Datos de contacto</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Nombre completo *</label>
            <input type="text" required value={form.name} onChange={e => update("name", e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Email *</label>
            <input type="email" required value={form.email} onChange={e => update("email", e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">Teléfono *</label>
            <input type="tel" required value={form.phone} onChange={e => update("phone", e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition" />
          </div>
        </div>
      </div>

      {/* Shipping address */}
      <div className="p-5 rounded-card border border-gray-100 bg-white" style={{ boxShadow: "var(--shadow-card)" }}>
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Dirección de envío</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">Calle *</label>
            <input type="text" required value={form.street} onChange={e => update("street", e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Núm. exterior *</label>
            <input type="text" required value={form.extNum} onChange={e => update("extNum", e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Núm. interior</label>
            <input type="text" value={form.intNum} onChange={e => update("intNum", e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Colonia *</label>
            <input type="text" required value={form.neighborhood} onChange={e => update("neighborhood", e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Ciudad *</label>
            <input type="text" required value={form.city} onChange={e => update("city", e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Estado *</label>
            <input type="text" required value={form.state} onChange={e => update("state", e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Código postal *</label>
            <input type="text" required value={form.zip} onChange={e => update("zip", e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition" pattern="[0-9]{5}" title="5 dígitos" />
          </div>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 text-sm font-semibold text-white rounded-btn transition hover:opacity-90 disabled:opacity-50"
        style={{ background: "var(--accent)" }}
      >
        {loading ? "Procesando..." : `Pagar ${totalPriceFormatted} con MercadoPago`}
      </button>
      <p className="text-xs text-gray-400 text-center">IVA incluido. Serás redirigido a MercadoPago para completar el pago.</p>
    </form>
  );
}
