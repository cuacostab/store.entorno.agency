import { searchProducts, getExchangeRate } from "@/lib/syscom-client";
import { stripSearchResult } from "@/lib/strip-prices";
import { PageShell } from "@/components/admin/ui/PageShell";
import { ProductsTable } from "./ProductsTable";

type Props = {
  searchParams: Promise<Record<string, string | undefined>>;
};

export default async function AdminProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  const q = params.q || "hikvision";
  const category = params.categoria;
  const brand = params.marca;
  const page = Number(params.pagina ?? 1);

  const [data, fx] = await Promise.all([
    searchProducts({ query: q, category, brand, page }),
    getExchangeRate(),
  ]);
  const result = await stripSearchResult(data);

  const serialized = result.productos.map(p => ({
    id: String(p.producto_id),
    producto_id: p.producto_id,
    titulo: p.titulo,
    modelo: p.modelo,
    marca: p.marca,
    stock: p.stock,
    total_existencia: p.total_existencia,
    precio: p.precio,
    precio_formato: p.precio_formato,
    img_portada: p.img_portada,
  }));

  return (
    <PageShell
      title="Productos"
      subtitle={`${result.cantidad} productos encontrados — TC: $${fx.toFixed(2)} MXN/USD — Margen: 35%`}
    >
      <ProductsTable
        products={serialized}
        totalCount={result.cantidad}
        currentPage={result.pagina}
        totalPages={result.paginas}
        query={q}
      />
    </PageShell>
  );
}
