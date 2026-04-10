import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getProduct } from "@/lib/syscom-client";
import { stripProductDetail } from "@/lib/strip-prices";
import { AddToCartButton } from "@/components/products/AddToCartButton";
import type { Metadata } from "next";

export const revalidate = 3600; // ISR: 1 hour

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const product = await getProduct(id);
    return {
      title: `${product.titulo} — eNtorno Store`,
      description: product.descripcion?.replace(/<[^>]*>/g, "").slice(0, 160) ?? `${product.titulo} - ${product.marca}. Solicita cotización.`,
    };
  } catch {
    return { title: "Producto no encontrado — eNtorno Store" };
  }
}

const stockLabels = {
  disponible: { text: "En stock", cls: "badge-disponible" },
  bajo: { text: "Pocas unidades", cls: "badge-bajo" },
  agotado: { text: "Agotado", cls: "badge-agotado" },
};

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  let product;
  try {
    const raw = await getProduct(id);
    product = await stripProductDetail(raw);
  } catch {
    notFound();
  }

  const s = stockLabels[product.stock];

  // Filter out empty image URLs
  const allImages = product.imagenes?.length
    ? product.imagenes.filter(img => img.url?.trim()).sort((a, b) => a.orden - b.orden)
    : [];
  if (allImages.length === 0 && product.img_portada?.trim()) {
    allImages.push({ orden: 0, url: product.img_portada });
  }

  return (
    <div className="container6 py-8">
      <Link href="/productos" className="text-sm text-gray-500 hover:text-gray-700 transition mb-6 inline-flex items-center gap-1">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
        Volver al catálogo
      </Link>

      {/* Top section: image + info + actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
        {/* Images */}
        <div className="space-y-4">
          {allImages.length > 0 ? (
            <div className="relative aspect-square bg-gray-50 rounded-card overflow-hidden border border-gray-100">
              <Image
                src={allImages[0].url}
                alt={product.titulo}
                fill
                className="object-contain p-8"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
          ) : (
            <div className="aspect-square bg-gray-50 rounded-card border border-gray-100 flex items-center justify-center">
              <span className="text-6xl text-gray-200">📦</span>
            </div>
          )}
          {allImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {allImages.slice(1, 6).map((img, i) => (
                <div key={i} className="relative w-20 h-20 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                  <Image src={img.url} alt="" fill className="object-contain p-2" sizes="80px" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info + Actions */}
        <div>
          <div className="flex items-start gap-3 mb-2">
            {product.marca_logo?.trim() && (
              <img src={product.marca_logo} alt={product.marca} className="h-6 object-contain" />
            )}
            <span className="text-sm text-gray-500 font-medium">{product.marca}</span>
          </div>

          <h1 className="text-xl md:text-2xl font-bold tracking-tight leading-snug">{product.titulo}</h1>
          <p className="text-sm text-gray-500 mt-1">Modelo: {product.modelo}</p>

          <div className="flex items-center gap-3 mt-4">
            {product.precio > 0 ? (
              <span className="text-2xl font-bold" style={{ color: "var(--brand)" }}>
                {product.precio_formato}
              </span>
            ) : (
              <span className="text-lg text-gray-400 font-medium">Consultar precio</span>
            )}
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${s.cls}`}>
              {s.text}
            </span>
          </div>
          {product.precio > 0 && (
            <p className="text-xs text-gray-400 mt-1">IVA incluido</p>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-4">
            {product.precio > 0 && product.stock !== "agotado" && (
              <AddToCartButton product={{
                producto_id: product.producto_id,
                titulo: product.titulo,
                modelo: product.modelo,
                marca: product.marca,
                img_portada: product.img_portada,
                precio: product.precio,
                precio_formato: product.precio_formato,
              }} />
            )}
            <Link
              href={`/contacto?producto=${encodeURIComponent(product.modelo)}`}
              className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-semibold rounded-btn transition hover:opacity-90"
              style={{ border: "1px solid var(--brand)", color: "var(--brand)" }}
            >
              Solicitar Cotización
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom section: description, specs, resources — full width below images */}
      <div className="mt-10 max-w-4xl">
        {product.descripcion && (
          <div className="mb-8">
            <h3 className="text-base font-semibold text-gray-800 mb-3">Descripción</h3>
            <div
              className="prose prose-sm max-w-none text-gray-600 leading-relaxed
                [&_table]:w-full [&_table]:text-xs [&_table]:border-collapse
                [&_td]:border [&_td]:border-gray-200 [&_td]:px-2 [&_td]:py-1
                [&_th]:border [&_th]:border-gray-200 [&_th]:px-2 [&_th]:py-1 [&_th]:bg-gray-50 [&_th]:font-semibold
                [&_tr:nth-child(even)]:bg-gray-50/50
                [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg
                [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5
                [&_a]:text-blue-600 [&_a]:underline
                [&_p]:mb-2 [&_br]:block [&_br]:mb-1"
              dangerouslySetInnerHTML={{ __html: product.descripcion }}
            />
          </div>
        )}

        {product.caracteristicas && product.caracteristicas.length > 0 && (
          <div className="mb-8">
            <h3 className="text-base font-semibold text-gray-800 mb-3">Características</h3>
            <ul className="space-y-1.5">
              {product.caracteristicas.map((c, i) => (
                <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {product.recursos && product.recursos.length > 0 && (
          <div className="mb-8">
            <h3 className="text-base font-semibold text-gray-800 mb-3">Recursos</h3>
            <div className="flex flex-wrap gap-2">
              {product.recursos.map((r, i) => (
                <a key={i} href={r.path} target="_blank" rel="noopener noreferrer" className="text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition">
                  📄 {r.recurso}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
