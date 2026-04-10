import { NextResponse } from "next/server";
import { sendBotLeadNotification } from "@/lib/mailer";

const notifiedSessions = new Set<string>();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sessionId, name, email, phone, messages, productsShown } = body;

    if (!sessionId || !messages) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const userMsgCount = messages.filter((m: { role: string }) => m.role === "user").length;
    if (userMsgCount >= 2 && !notifiedSessions.has(sessionId)) {
      notifiedSessions.add(sessionId);
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
