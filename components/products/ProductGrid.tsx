import type { Product } from "@/lib/syscom-types";
import { ProductCard } from "./ProductCard";

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-4xl mb-4">🔍</p>
        <p className="text-gray-500 text-lg">No se encontraron productos</p>
        <p className="text-gray-400 text-sm mt-2">Intenta con otros términos de búsqueda o filtros</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map(p => (
        <ProductCard key={p.producto_id} product={p} />
      ))}
    </div>
  );
}
