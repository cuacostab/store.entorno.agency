"use client";

import { useCart } from "@/lib/cart-context";
import { useState } from "react";
import Image from "next/image";

export function CartDrawer() {
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalPriceFormatted, isOpen, close } = useCart();
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
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
        }),
      });
      const data = await res.json();
      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        alert(data.error || "Error al crear el pago");
      }
    } catch {
      alert("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[9990] bg-black/30 backdrop-blur-[1px]" onClick={close} />

      {/* Drawer */}
      <div className="fixed top-0 right-0 z-[9991] h-full w-[400px] max-w-[calc(100vw-20px)] bg-white shadow-2xl flex flex-col" style={{ animation: "slideIn 0.25s ease" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold">Carrito ({totalItems})</h2>
          <button onClick={close} className="p-1.5 rounded-lg hover:bg-gray-100 transition" aria-label="Cerrar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">🛒</p>
              <p className="text-gray-400 text-sm">Tu carrito está vacío</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map(item => (
                <div key={item.producto_id} className="flex gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50/50">
                  {item.img_portada?.trim() ? (
                    <div className="relative w-16 h-16 flex-shrink-0 bg-white rounded-lg overflow-hidden border border-gray-100">
                      <Image src={item.img_portada} alt={item.titulo} fill className="object-contain p-1" sizes="64px" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 flex-shrink-0 bg-white rounded-lg border border-gray-100 flex items-center justify-center text-2xl text-gray-200">📦</div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 line-clamp-2 leading-snug">{item.titulo}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.modelo}</p>
                    <p className="text-sm font-bold mt-1" style={{ color: "var(--brand)" }}>{item.precio_formato}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.producto_id, item.quantity - 1)}
                        className="w-6 h-6 rounded-md border border-gray-200 flex items-center justify-center text-xs hover:bg-gray-100 transition"
                      >
                        −
                      </button>
                      <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.producto_id, item.quantity + 1)}
                        className="w-6 h-6 rounded-md border border-gray-200 flex items-center justify-center text-xs hover:bg-gray-100 transition"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.producto_id)}
                        className="ml-auto text-xs text-red-400 hover:text-red-600 transition"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 px-5 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Total</span>
              <span className="text-lg font-bold">{totalPriceFormatted}</span>
            </div>
            <p className="text-xs text-gray-400">IVA incluido</p>
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full py-3 text-sm font-semibold text-white rounded-btn transition hover:opacity-90 disabled:opacity-50"
              style={{ background: "var(--accent)" }}
            >
              {loading ? "Procesando..." : "Pagar con MercadoPago"}
            </button>
            <button
              onClick={clearCart}
              className="w-full py-2 text-xs text-gray-400 hover:text-gray-600 transition"
            >
              Vaciar carrito
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}
