// ─── Syscom API Types ────────────────────────────────────────────────────────

export type SyscomCategory = {
  id: string;
  nombre: string;
  nivel: number;
};

export type SyscomCategoryDetail = SyscomCategory & {
  origen?: SyscomCategory[];
  subcategorías?: SyscomCategory[];
};

export type SyscomBrand = {
  id: string;
  nombre: string;
};

export type SyscomBrandDetail = {
  titulo: string;
  descripcion: string;
  logo: string;
  categorías: {
    nombre: string;
    id: string;
    imagen: string;
    cantidad: number;
  }[];
};

export type SyscomProductPrices = {
  precio_1: string;
  precio_especial: string;
  precio_descuento: string;
  precio_lista: string;
  volumen?: Record<string, string>;
};

export type SyscomProduct = {
  producto_id: number;
  modelo: string;
  total_existencia: number;
  titulo: string;
  marca: string;
  sat_key: string;
  img_portada: string;
  categorias?: SyscomCategory[];
  categorías?: SyscomCategory[];
  marca_logo: string;
  link: string;
  iconos: Record<string, string>;
  precios: SyscomProductPrices;
};

export type SyscomProductDetail = SyscomProduct & {
  existencia?: Record<string, number>;
  caracteristicas?: string[];
  imagenes?: { orden: number; url: string }[];
  descripcion?: string;
  recursos?: { recurso: string; path: string }[];
};

export type SyscomSearchResult = {
  cantidad: number;
  pagina: number;
  paginas: number;
  productos: SyscomProduct[];
};

// ─── Public types (con precio + margen, sin precio original) ─────────────────

export type Product = Omit<SyscomProduct, "precios"> & {
  stock: "disponible" | "agotado" | "bajo";
  precio: number;        // precio con margen (MXN)
  precio_formato: string; // "$1,234.00 MXN"
};

export type ProductDetail = Omit<SyscomProductDetail, "precios"> & {
  stock: "disponible" | "agotado" | "bajo";
  precio: number;
  precio_formato: string;
};

export type SearchResult = {
  cantidad: number;
  pagina: number;
  paginas: number;
  productos: Product[];
};
