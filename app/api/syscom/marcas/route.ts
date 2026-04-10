import { NextResponse } from "next/server";
import { getBrands } from "@/lib/syscom-client";

export async function GET() {
  try {
    const data = await getBrands();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Syscom brands error:", err);
    return NextResponse.json({ error: "Error al obtener marcas" }, { status: 500 });
  }
}
