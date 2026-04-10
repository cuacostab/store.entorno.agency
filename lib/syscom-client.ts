import type {
  SyscomCategory,
  SyscomBrand,
  SyscomSearchResult,
  SyscomProductDetail,
} from "./syscom-types";

// ─── OAuth Token ─────────────────────────────────────────────────────────────

let tokenCache: { token: string; expiresAt: number } | null = null;

async function getToken(): Promise<string> {
  if (tokenCache && Date.now() < tokenCache.expiresAt) {
    return tokenCache.token;
  }

  const clientId = process.env.SYSCOM_CLIENT_ID;
  const clientSecret = process.env.SYSCOM_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new Error("SYSCOM credentials not configured");

  const res = await fetch("https://developers.syscom.mx/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "client_credentials",
    }),
  });

  if (!res.ok) throw new Error(`Syscom OAuth failed: ${res.status}`);

  const data = await res.json();
  tokenCache = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in ?? 365 * 24 * 3600) * 1000 - 60_000,
  };
  return tokenCache.token;
}

// ─── In-memory cache ─────────────────────────────────────────────────────────

type CacheEntry<T> = { data: T; expiresAt: number };
const cache = new Map<string, CacheEntry<unknown>>();

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry || Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

function setCache<T>(key: string, data: T, ttlMs: number) {
  cache.set(key, { data, expiresAt: Date.now() + ttlMs });
}

// Clean expired entries periodically
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [k, v] of cache) {
      if (now > v.expiresAt) cache.delete(k);
    }
  }, 5 * 60_000);
}

// ─── API helpers ─────────────────────────────────────────────────────────────

const BASE = "https://developers.syscom.mx/api/v1";

async function syscomFetch<T>(path: string): Promise<T> {
  const token = await getToken();
  const res = await fetch(`${BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 0 },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Syscom API ${res.status}: ${text}`);
  }
  return res.json();
}

// ─── TTLs ────────────────────────────────────────────────────────────────────

const TTL_SEARCH = 15 * 60_000;      // 15 min
const TTL_DETAIL = 60 * 60_000;      // 1 hour
const TTL_CATALOG = 24 * 60 * 60_000; // 24 hours

// ─── Public API ──────────────────────────────────────────────────────────────

export async function getCategories(): Promise<SyscomCategory[]> {
  const key = "categories";
  const cached = getCached<SyscomCategory[]>(key);
  if (cached) return cached;

  const data = await syscomFetch<SyscomCategory[]>("/categorias");
  setCache(key, data, TTL_CATALOG);
  return data;
}

export async function getBrands(): Promise<SyscomBrand[]> {
  const key = "brands";
  const cached = getCached<SyscomBrand[]>(key);
  if (cached) return cached;

  const data = await syscomFetch<SyscomBrand[]>("/marcas");
  setCache(key, data, TTL_CATALOG);
  return data;
}

export async function searchProducts(params: {
  query?: string;
  category?: string;
  brand?: string;
  page?: number;
}): Promise<SyscomSearchResult> {
  const qs = new URLSearchParams();
  if (params.query) qs.set("busqueda", params.query.replace(/\s+/g, "+"));
  if (params.category) qs.set("categoria", params.category);
  if (params.brand) qs.set("marca", params.brand);
  if (params.page && params.page > 1) qs.set("pagina", String(params.page));
  qs.set("stock", "1");

  const key = `search:${qs.toString()}`;
  const cached = getCached<SyscomSearchResult>(key);
  if (cached) return cached;

  const data = await syscomFetch<SyscomSearchResult>(`/productos?${qs}`);
  setCache(key, data, TTL_SEARCH);
  return data;
}

export async function getProduct(id: string | number): Promise<SyscomProductDetail> {
  const key = `product:${id}`;
  const cached = getCached<SyscomProductDetail>(key);
  if (cached) return cached;

  const data = await syscomFetch<SyscomProductDetail>(`/productos/${id}`);
  setCache(key, data, TTL_DETAIL);
  return data;
}

// ─── Exchange rate ───────────────────────────────────────────────────────────

export type SyscomExchangeRate = {
  normal: string;
  un_dia: string;
  una_semana: string;
  dos_semanas: string;
  tres_semanas: string;
  un_mes: string;
};

const TTL_FX = 4 * 60 * 60_000; // 4 hours

export async function getExchangeRate(): Promise<number> {
  const key = "exchange_rate";
  const cached = getCached<number>(key);
  if (cached) return cached;

  const data = await syscomFetch<SyscomExchangeRate>("/tipocambio");
  const rate = parseFloat(data.normal);
  if (!rate || isNaN(rate) || rate <= 0) throw new Error("Invalid exchange rate");
  setCache(key, rate, TTL_FX);
  return rate;
}

export async function getRelatedProducts(id: string | number): Promise<SyscomSearchResult> {
  const key = `related:${id}`;
  const cached = getCached<SyscomSearchResult>(key);
  if (cached) return cached;

  const data = await syscomFetch<SyscomSearchResult>(`/productos/${id}/relacionados`);
  setCache(key, data, TTL_SEARCH);
  return data;
}
