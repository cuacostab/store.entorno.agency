import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/syscom-types";

const stockLabels = {
  disponible: { text: "En stock", cls: "badge-disponible" },
  bajo: { text: "Pocas unidades", cls: "badge-bajo" },
  agotado: { text: "Agotado", cls: "badge-agotado" },
};

export function ProductCard({ product }: { product: Product }) {
  const s = stockLabels[product.stock];

  return (
    <Link
      href={`/productos/${product.producto_id}`}
      className="anim-hover-glow flex flex-col bg-white rounded-card border border-gray-100 overflow-hidden"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div className="relative aspect-square bg-gray-50 flex items-center justify-center p-4">
        {product.img_portada?.trim() ? (
          <Image
            src={product.img_portada}
            alt={product.titulo}
            fill
            className="object-contain p-4"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="text-gray-300 text-4xl">📦</div>
        )}
        <span className={`absolute top-3 right-3 text-xs font-semibold px-2 py-0.5 rounded-full ${s.cls}`}>
          {s.text}
        </span>
      </div>

      <div className="flex flex-col flex-1 p-4">
        <p className="text-xs text-gray-400 font-medium">{product.marca}</p>
        <h3 className="mt-1 text-sm font-semibold leading-snug line-clamp-2">{product.titulo}</h3>
        <p className="mt-1 text-xs text-gray-500">{product.modelo}</p>

        <div className="mt-auto pt-3">
          {product.precio > 0 ? (
            <p className="text-base font-bold" style={{ color: "var(--brand)" }}>
              {product.precio_formato}
            </p>
          ) : (
            <p className="text-sm text-gray-400 font-medium">Consultar precio</p>
          )}
          <span className="mt-2 block w-full text-center text-xs font-semibold py-2 rounded-btn text-white" style={{ background: "var(--brand)" }}>
            Solicitar Cotización
          </span>
        </div>
      </div>
    </Link>
  );
}
