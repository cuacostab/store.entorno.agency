import { NextResponse } from "next/server";
import { chat } from "@/lib/chat-engine";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sessionId, chatInput } = body;

    if (!sessionId || !chatInput || typeof chatInput !== "string") {
      return NextResponse.json({ error: "Missing sessionId or chatInput" }, { status: 400 });
    }

    const result = await chat(sessionId, chatInput.trim());
    return NextResponse.json(result);
  } catch (err) {
    console.error("Chat error:", err);
    return NextResponse.json(
      { error: "Error al procesar tu mensaje", text: "Hubo un error. Intenta de nuevo." },
      { status: 500 },
    );
  }
}
