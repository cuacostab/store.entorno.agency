import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { getProduct } from "@/lib/syscom-client";
import { stripProductDetail } from "@/lib/strip-prices";
import { db } from "@/lib/db";

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
    let orderItems: CartItemInput[];

    // Cart mode
    if (Array.isArray(body.items) && body.items.length > 0) {
      orderItems = body.items as CartItemInput[];
      mpItems = orderItems.map(item => ({
        id: String(item.product_id),
        title: item.title,
        description: item.description || "",
        picture_url: item.picture_url || undefined,
        quantity: Math.max(1, Math.min(item.quantity || 1, 100)),
        unit_price: item.unit_price,
        currency_id: "MXN",
      }));
    }
    // Single product mode
    else if (body.product_id) {
      const qty = Math.max(1, Math.min(Number(body.quantity) || 1, 100));
      const raw = await getProduct(body.product_id);
      const product = await stripProductDetail(raw);

      if (product.precio <= 0) {
        return NextResponse.json({ error: "Producto sin precio disponible" }, { status: 400 });
      }

      orderItems = [{
        product_id: product.producto_id,
        title: product.titulo,
        description: `${product.marca} — ${product.modelo}`,
        picture_url: product.img_portada?.trim(),
        quantity: qty,
        unit_price: product.precio,
      }];
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

    const total = mpItems.reduce((sum, i) => sum + i.unit_price * i.quantity, 0);

    // Persist order in DB
    const order = await db.order.create({
      data: {
        customerName: body.customerName ?? "Cliente",
        customerEmail: body.customerEmail ?? "",
        customerPhone: body.customerPhone ?? "",
        shippingAddress: body.shippingAddress ? JSON.stringify(body.shippingAddress) : null,
        items: JSON.stringify(orderItems),
        subtotal: total,
        total,
        status: "pending",
      },
    });

    const preference = new Preference(client);
    const result = await preference.create({
      body: {
        items: mpItems,
        external_reference: order.id,
        payer: {
          name: body.customerName ?? undefined,
          email: body.customerEmail ?? undefined,
          phone: body.customerPhone ? { number: body.customerPhone } : undefined,
          address: body.shippingAddress ? {
            street_name: body.shippingAddress.street ?? "",
            street_number: String(body.shippingAddress.extNum ?? ""),
            zip_code: body.shippingAddress.zip ?? "",
          } : undefined,
        },
        back_urls: {
          success: `${baseUrl}/checkout/success`,
          failure: `${baseUrl}/checkout/failure`,
          pending: `${baseUrl}/checkout/pending`,
        },
        auto_return: "approved",
        statement_descriptor: "eNtorno Store",
      },
    });

    // Update order with preference ID
    await db.order.update({
      where: { id: order.id },
      data: { preferenceId: result.id },
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
