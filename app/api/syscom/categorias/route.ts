import { NextResponse } from "next/server";
import { getCategories } from "@/lib/syscom-client";

export async function GET() {
  try {
    const data = await getCategories();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Syscom categories error:", err);
    return NextResponse.json({ error: "Error al obtener categorías" }, { status: 500 });
  }
}
