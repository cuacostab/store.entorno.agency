import { NextResponse } from "next/server";
import { sendBotLeadNotification } from "@/lib/mailer";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sessionId, name, email, phone, messages, productsShown } = body;

    if (!sessionId || !messages) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    // Upsert lead in DB
    const existing = await db.lead.findFirst({ where: { sessionId } });
    const leadData = {
      name: name ?? "Anónimo",
      email: email ?? null,
      phone: phone ?? null,
      source: "bot",
      productsShown: productsShown ? JSON.stringify(productsShown) : null,
      conversation: messages ? JSON.stringify(messages.slice(-20)) : null,
      sessionId,
    };

    if (existing) {
      await db.lead.update({ where: { id: existing.id }, data: leadData });
    } else {
      await db.lead.create({ data: leadData });
    }

    // Send email notification on 2+ user messages (first time only)
    const userMsgCount = messages.filter((m: { role: string }) => m.role === "user").length;
    if (userMsgCount >= 2 && !existing) {
      try {
        await sendBotLeadNotification({
          name: name ?? "Anónimo",
          email: email ?? "",
          phone: phone ?? "",
          messages: messages ?? [],
          productsShown: productsShown ?? [],
        });
      } catch (err) {
        console.error("Lead email error:", err);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Lead capture error:", err);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
