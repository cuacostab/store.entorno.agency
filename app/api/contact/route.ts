import { NextResponse } from "next/server";
import { sendContactNotification } from "@/lib/mailer";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, message, products } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Nombre, email y mensaje son requeridos" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 });
    }

    // Persist lead in DB
    await db.lead.create({
      data: {
        name,
        email,
        phone: phone ?? null,
        source: "contact_form",
        productsShown: products ? JSON.stringify([products]) : null,
        notes: message,
      },
    });

    // Send email notification
    await sendContactNotification({ name, email, phone: phone ?? "", message, products: products ?? "" });

    return NextResponse.json({ success: true, message: "Mensaje enviado correctamente" });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json({ error: "Error al enviar el mensaje" }, { status: 500 });
  }
}
