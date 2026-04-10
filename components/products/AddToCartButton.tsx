"use client";

import { useCart } from "@/lib/cart-context";

type Props = {
  product: {
    producto_id: number;
    titulo: string;
    modelo: string;
    marca: string;
    img_portada: string;
    precio: number;
    precio_formato: string;
  };
  size?: "sm" | "md";
};

export function AddToCartButton({ product, size = "md" }: Props) {
  const { addItem } = useCart();

  function handleAdd() {
    addItem({
      producto_id: product.producto_id,
      titulo: product.titulo,
      modelo: product.modelo,
      marca: product.marca,
      img_portada: product.img_portada,
      precio: product.precio,
      precio_formato: product.precio_formato,
    });
  }

  if (product.precio <= 0) return null;

  if (size === "sm") {
    return (
      <button
        onClick={handleAdd}
        className="w-full text-center text-xs font-semibold py-2 rounded-btn text-white transition hover:opacity-90"
        style={{ background: "var(--brand)" }}
      >
        Agregar al carrito
      </button>
    );
  }

  return (
    <button
      onClick={handleAdd}
      className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-semibold text-white rounded-btn transition hover:opacity-90"
      style={{ background: "var(--accent)" }}
    >
      Agregar al carrito
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
    </button>
  );
}
