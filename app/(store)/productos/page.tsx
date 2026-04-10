import { Suspense } from "react";
import { searchProducts } from "@/lib/syscom-client";
import { stripSearchResult } from "@/lib/strip-prices";
import { ProductGrid } from "@/components/products/ProductGrid";
import { SearchBar } from "@/components/products/SearchBar";
import { Filters } from "@/components/products/Filters";
import { Pagination } from "@/components/products/Pagination";
import { getCategories } from "@/lib/syscom-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catálogo de Productos — eNtorno Store",
  description: "Explora nuestro catálogo completo de productos de seguridad, redes y tecnología. Busca por categoría, marca o palabras clave.",
};

type Props = {
  searchParams: Promise<Record<string, string | undefined>>;
};

async function ProductResults({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const q = searchParams.q;
  const categoria = searchParams.categoria;
  const marca = searchParams.marca;
  const page = Number(searchParams.pagina ?? 1);

  // Need at least one filter for Syscom API
  if (!q && !categoria && !marca) {
    // Default: show videovigilancia category
    const data = await searchProducts({ category: "22", page });
    const result = await stripSearchResult(data);
    return (
      <>
        <p className="text-sm text-gray-500 mb-6">
          Mostrando <strong>{result.cantidad}</strong> productos en Videovigilancia. Usa la búsqueda o filtros para explorar más.
        </p>
        <ProductGrid products={result.productos} />
        <Pagination page={result.pagina} totalPages={result.paginas} />
      </>
    );
  }

  const data = await searchProducts({ query: q, category: categoria, brand: marca, page });
  const result = await stripSearchResult(data);

  return (
    <>
      <p className="text-sm text-gray-500 mb-6">
        {result.cantidad > 0
          ? <>Se encontraron <strong>{result.cantidad}</strong> productos{q ? <> para &quot;{q}&quot;</> : null}</>
          : "No se encontraron resultados"
        }
      </p>
      <ProductGrid products={result.productos} />
      <Pagination page={result.pagina} totalPages={result.paginas} />
    </>
  );
}

export default async function ProductosPage({ searchParams }: Props) {
  const params = await searchParams;
  let categories;
  try {
    categories = await getCategories();
  } catch {}

  return (
    <div className="container6 py-8">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">Catálogo de Productos</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <Suspense fallback={null}>
            <SearchBar />
          </Suspense>
        </div>
        <Suspense fallback={null}>
          <Filters categories={categories} />
        </Suspense>
      </div>

      <Suspense fallback={<div className="text-center py-16 text-gray-400">Cargando productos...</div>}>
        <ProductResults searchParams={params} />
      </Suspense>
    </div>
  );
}
