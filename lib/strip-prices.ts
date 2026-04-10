import type {
  SyscomProduct,
  SyscomProductDetail,
  SyscomSearchResult,
  Product,
  ProductDetail,
  SearchResult,
} from "./syscom-types";
import { getExchangeRate } from "./syscom-client";

const MARGIN = 0.30; // 30% de margen sobre precio Syscom

function stockLabel(qty: number): "disponible" | "agotado" | "bajo" {
  if (qty <= 0) return "agotado";
  if (qty <= 5) return "bajo";
  return "disponible";
}

function applyMargin(usdPrice: string | number, exchangeRate: number): { precio: number; precio_formato: string } {
  const raw = typeof usdPrice === "string" ? parseFloat(usdPrice) : usdPrice;
  if (!raw || isNaN(raw) || raw <= 0) {
    return { precio: 0, precio_formato: "Consultar precio" };
  }
  const mxn = raw * exchangeRate;
  const final = Math.ceil(mxn * (1 + MARGIN) * 100) / 100;
  const formatted = final.toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  });
  return { precio: final, precio_formato: `${formatted} MXN` };
}

function bestPrice(precios: SyscomProduct["precios"]): string {
  const especial = parseFloat(precios?.precio_especial ?? "0");
  const descuento = parseFloat(precios?.precio_descuento ?? "0");
  const lista = parseFloat(precios?.precio_lista ?? "0");

  if (especial > 0) return precios.precio_especial;
  if (descuento > 0) return precios.precio_descuento;
  return precios.precio_lista ?? "0";
}

function transformProduct(p: SyscomProduct, fx: number): Product {
  const { precios, ...rest } = p;
  const { precio, precio_formato } = applyMargin(bestPrice(precios), fx);
  return { ...rest, stock: stockLabel(p.total_existencia), precio, precio_formato };
}

function transformProductDetail(p: SyscomProductDetail, fx: number): ProductDetail {
  const { precios, ...rest } = p;
  const { precio, precio_formato } = applyMargin(bestPrice(precios), fx);
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
