import type {
  SyscomProduct,
  SyscomProductDetail,
  SyscomSearchResult,
  Product,
  ProductDetail,
  SearchResult,
} from "./syscom-types";
import { getExchangeRate } from "./syscom-client";

const MARGIN = 0.35; // 35% de margen (cubre comisión MercadoPago ~4%)

function stockLabel(qty: number): "disponible" | "agotado" | "bajo" {
  if (qty <= 0) return "agotado";
  if (qty <= 5) return "bajo";
  return "disponible";
}

/**
 * Precios de Syscom API están en USD.
 * Nuestro costo = precio_descuento (USD) × tipo_cambio = MXN sin IVA
 * Precio de venta = costo × (1 + MARGIN) × 1.16 (IVA) = precio final IVA incluido
 * El precio que se muestra y se cobra ya incluye IVA.
 */
function calcPrice(precios: SyscomProduct["precios"], fx: number): { precio: number; precio_formato: string } {
  const descuento = parseFloat(precios?.precio_descuento ?? "0");

  if (!descuento || isNaN(descuento) || descuento <= 0) {
    return { precio: 0, precio_formato: "Consultar precio" };
  }

  const costoMxn = descuento * fx;
  const ventaConIva = Math.ceil(costoMxn * (1 + MARGIN) * 1.16 * 100) / 100;

  const formatted = ventaConIva.toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  });

  return { precio: ventaConIva, precio_formato: `${formatted} MXN` };
}

function transformProduct(p: SyscomProduct, fx: number): Product {
  const { precios, ...rest } = p;
  const { precio, precio_formato } = calcPrice(precios, fx);
  return { ...rest, stock: stockLabel(p.total_existencia), precio, precio_formato };
}

function transformProductDetail(p: SyscomProductDetail, fx: number): ProductDetail {
  const { precios, ...rest } = p;
  const { precio, precio_formato } = calcPrice(precios, fx);
  return { ...rest, stock: stockLabel(p.total_existencia), precio, precio_formato };
}

export async function stripProduct(p: SyscomProduct): Promise<Product> {
  const fx = await getExchangeRate();
  return transformProduct(p, fx);
}

export async function stripProductDetail(p: SyscomProductDetail): Promise<ProductDetail> {
  const fx = await getExchangeRate();
  return transformProductDetail(p, fx);
}

export async function stripSearchResult(r: SyscomSearchResult): Promise<SearchResult> {
  const fx = await getExchangeRate();
  return {
    cantidad: r.cantidad,
    pagina: r.pagina,
    paginas: r.paginas,
    productos: (r.productos ?? []).map(p => transformProduct(p, fx)),
  };
}
