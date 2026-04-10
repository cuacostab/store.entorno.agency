import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { getProduct } from "@/lib/syscom-client";
import { stripProductDetail } from "@/lib/strip-prices";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});

type CartItemInput = {
  product_id: number;
  title: string;
  description: string;
  picture_url?: string;
  quantity: number;
  unit_price: number;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3002";

    let mpItems: {
      id: string;
      title: string;
      description: string;
      picture_url?: string;
      quantity: number;
      unit_price: number;
      currency_id: string;
    }[];

    // Cart mode: items array from CartDrawer
    if (Array.isArray(body.items) && body.items.length > 0) {
      mpItems = (body.items as CartItemInput[]).map(item => {
        const qty = Math.max(1, Math.min(item.quantity || 1, 100));
        return {
          id: String(item.product_id),
          title: item.title,
          description: item.description || "",
          picture_url: item.picture_url || undefined,
          quantity: qty,
          unit_price: item.unit_price,
          currency_id: "MXN",
        };
      });
    }
    // Single product mode: product_id from BuyButton
    else if (body.product_id) {
      const qty = Math.max(1, Math.min(Number(body.quantity) || 1, 100));
      const raw = await getProduct(body.product_id);
      const product = await stripProductDetail(raw);

      if (product.precio <= 0) {
        return NextResponse.json({ error: "Producto sin precio disponible" }, { status: 400 });
      }

      mpItems = [{
        id: String(product.producto_id),
        title: product.titulo,
        description: `${product.marca} — ${product.modelo}`,
        picture_url: product.img_portada?.trim() || undefined,
        quantity: qty,
        unit_price: product.precio,
        currency_id: "MXN",
      }];
    } else {
      return NextResponse.json({ error: "Se requiere product_id o items[]" }, { status: 400 });
    }

    const preference = new Preference(client);
    const result = await preference.create({
      body: {
        items: mpItems,
        back_urls: {
          success: `${baseUrl}/checkout/success`,
          failure: `${baseUrl}/checkout/failure`,
          pending: `${baseUrl}/checkout/pending`,
        },
        auto_return: "approved",
        statement_descriptor: "eNtorno Store",
      },
    });

    return NextResponse.json({
      id: result.id,
      init_point: result.init_point,
    });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json({ error: "Error al crear checkout" }, { status: 500 });
  }
}
