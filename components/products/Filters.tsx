"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { SyscomCategory } from "@/lib/syscom-types";

const FEATURED_CATEGORIES: { id: string; name: string }[] = [
  { id: "22", name: "Videovigilancia" },
  { id: "37", name: "Control de Acceso" },
  { id: "26", name: "Redes" },
  { id: "65811", name: "Cableado Estructurado" },
  { id: "32", name: "Automatización" },
  { id: "30", name: "Energía" },
  { id: "38", name: "Detección de Fuego" },
  { id: "25", name: "Radiocomunicación" },
];

const FEATURED_BRANDS = [
  { id: "hikvision", name: "Hikvision" },
  { id: "zkteco", name: "ZKTeco" },
  { id: "ubiquiti", name: "Ubiquiti" },
  { id: "epcom", name: "Epcom" },
  { id: "dahua", name: "Dahua" },
  { id: "panduit", name: "Panduit" },
  { id: "accesspro", name: "AccessPRO" },
  { id: "tplink", name: "TP-Link" },
];

export function Filters({ categories }: { categories?: SyscomCategory[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCat = searchParams.get("categoria") ?? "";
  const currentBrand = searchParams.get("marca") ?? "";

  const cats = categories?.length ? categories.map(c => ({ id: String(c.id), name: c.nombre })) : FEATURED_CATEGORIES;

  function setFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("pagina");
    router.push(`/productos?${params.toString()}`);
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <select
        value={currentCat}
        onChange={e => setFilter("categoria", e.target.value)}
        className="px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm outline-none focus:border-blue-300 transition"
      >
        <option value="">Todas las categorías</option>
        {cats.map(c => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      <select
        value={currentBrand}
        onChange={e => setFilter("marca", e.target.value)}
        className="px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm outline-none focus:border-blue-300 transition"
      >
        <option value="">Todas las marcas</option>
        {FEATURED_BRANDS.map(b => (
          <option key={b.id} value={b.id}>{b.name}</option>
        ))}
      </select>
    </div>
  );
}
