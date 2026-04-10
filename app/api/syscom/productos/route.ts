import { NextRequest, NextResponse } from "next/server";
import { searchProducts } from "@/lib/syscom-client";
import { stripSearchResult } from "@/lib/strip-prices";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const data = await searchProducts({
      query: searchParams.get("q") ?? undefined,
      category: searchParams.get("categoria") ?? undefined,
      brand: searchParams.get("marca") ?? undefined,
      page: Number(searchParams.get("pagina") ?? 1),
    });
    return NextResponse.json(await stripSearchResult(data));
  } catch (err) {
    console.error("Syscom search error:", err);
    return NextResponse.json({ error: "Error al buscar productos" }, { status: 500 });
  }
}
