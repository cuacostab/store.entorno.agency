import { NextResponse } from "next/server";
import { getProduct } from "@/lib/syscom-client";
import { stripProductDetail } from "@/lib/strip-prices";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const data = await getProduct(id);
    return NextResponse.json(await stripProductDetail(data));
  } catch (err) {
    console.error("Syscom product detail error:", err);
    return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
  }
}
