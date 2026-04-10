"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { parseMarkdown } from "@/lib/markdown";
import { ProductCardChat } from "./ProductCardChat";

type ProductCard = {
  producto_id: number;
  titulo: string;
  modelo: string;
  marca: string;
  img_portada: string;
  stock: "disponible" | "agotado" | "bajo";
  link: string;
  precio?: number;
  precio_formato?: string;
};

type Message = { role: "user" | "bot"; text: string; products?: ProductCard[] };

let sessionId = "";
function getSession() {
  if (!sessionId) sessionId = Math.random().toString(36).slice(2);
  return sessionId;
}

export function BotWidget() {
  const enabled = process.env.NEXT_PUBLIC_BOT_ENABLED === "true";
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "¡Hola! Soy el asistente de eNtorno. ¿Qué tipo de equipo necesitas? Puedo buscar en nuestro catálogo de seguridad, redes y tecnología." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [productsShown, setProductsShown] = useState<string[]>([]);
  const lastMsgRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  useEffect(() => {
    lastMsgRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [messages, loading]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const saveToDb = useCallback(async (msgs: Message[], products: string[], leadData?: Record<string, string> | null) => {
    if (msgs.filter(m => m.role === "user").length < 1) return;
    const firstUserMsg = msgs.find(m => m.role === "user")?.text ?? "";
    const inferredName = leadData?.name ?? firstUserMsg.slice(0, 50);
    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: getSession(),
          name: inferredName,
          email: leadData?.email ?? "",
          phone: leadData?.phone ?? "",
          messages: msgs.map(m => ({ role: m.role, text: m.text })),
          productsShown: products,
        }),
      });
    } catch {}
  }, []);

  useEffect(() => {
    const onBeforeUnload = () => {
      if (messages.filter(m => m.role === "user").length > 0) {
        navigator.sendBeacon("/api/lead", JSON.stringify({
          sessionId: getSession(),
          messages: messages.map(m => ({ role: m.role, text: m.text })),
          productsShown,
        }));
      }
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [messages, productsShown]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    const newMsgs: Message[] = [...messages, { role: "user", text }];
    setMessages(newMsgs);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: getSession(), chatInput: text }),
      });
      const data = await res.json();
      const reply: string = data.text ?? "Sin respuesta.";
      const products: ProductCard[] = Array.isArray(data.products) ? data.products : [];
      const leadData = data.leadData ?? null;

      const newProducts = products.map(p => p.titulo).filter(t => !productsShown.includes(t));
      const updatedProducts = [...productsShown, ...newProducts];
      if (newProducts.length) setProductsShown(updatedProducts);

      const finalMsgs: Message[] = [...newMsgs, { role: "bot", text: reply, products }];
      setMessages(finalMsgs);
      saveToDb(finalMsgs, updatedProducts, leadData);
    } catch {
      setMessages([...newMsgs, { role: "bot", text: "Hubo un error al conectar. Intenta de nuevo." }]);
    } finally {
      setLoading(false);
    }
  }

  function resetChat() {
    if (messages.filter(m => m.role === "user").length > 0) saveToDb(messages, productsShown);
    sessionId = "";
    setMessages([{ role: "bot", text: "¡Hola! Soy el asistente de eNtorno. ¿Qué tipo de equipo necesitas?" }]);
    setInput("");
    setLoading(false);
    setProductsShown([]);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  }

  if (!enabled) return null;

  const BotAvatar = () => (
    <div style={{ flexShrink: 0, width: 30, height: 30, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", border: "1.5px solid var(--brand)", overflow: "hidden" }}>
      <img src="/entorno/favicon.png" alt="N" style={{ width: 20, height: 20, objectFit: "contain" }} />
    </div>
  );

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-[9998] bg-black/30 backdrop-blur-[1px]" onMouseDown={e => { if (e.target === e.currentTarget) setOpen(false); }}>
          <div className="fixed bottom-5 right-5 z-[9999] w-[370px] max-w-[calc(100vw-40px)] flex flex-col overflow-hidden rounded-2xl shadow-2xl" style={{ height: 580, boxShadow: "0 20px 60px rgba(0,0,0,0.25)", border: "1px solid rgba(0,0,0,0.08)" }}>
            {/* Header */}
            <div className="relative flex items-center justify-center flex-shrink-0" style={{ padding: "14px 0", background: "linear-gradient(135deg, var(--brand) 0%, color-mix(in srgb, var(--brand) 65%, #000) 100%)" }}>
              <span style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>eNtorno Store</span>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                <button onClick={resetChat} className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/15 transition-colors" style={{ color: "rgba(255,255,255,0.9)", border: "1px solid rgba(255,255,255,0.2)" }} aria-label="Reiniciar" title="Reiniciar conversación">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 4v6h6" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" /></svg>
                </button>
                <button onClick={() => setOpen(false)} className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/15 transition-colors" style={{ color: "rgba(255,255,255,0.9)", border: "1px solid rgba(255,255,255,0.2)" }} aria-label="Cerrar">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4" style={{ display: "flex", flexDirection: "column", gap: 10, background: "#f0f2f5" }}>
              {messages.map((m, i) => {
                const isLast = i === messages.length - 1;
                return (
                  <div key={i} ref={isLast ? lastMsgRef : undefined} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", gap: 8, alignItems: "flex-end", animation: "chatFadeIn 0.3s ease" }}>
                    {m.role === "bot" && <BotAvatar />}
                    <div style={{ maxWidth: "78%", display: "flex", flexDirection: "column", gap: 6 }}>
                      <div
                        className="chat-msg"
                        style={{
                          padding: "10px 14px",
                          borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                          background: m.role === "user" ? "var(--brand)" : "#fff",
                          color: m.role === "user" ? "#ffffff" : "#111827",
                          fontSize: 13, lineHeight: 1.6,
                          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                          wordBreak: "break-word",
                        }}
                        dangerouslySetInnerHTML={{ __html: m.role === "bot" ? parseMarkdown(m.text) : m.text.replace(/</g, "&lt;") }}
                      />
                      {m.products && m.products.length > 0 && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          {m.products.map((p, pi) => (
                            <ProductCardChat key={pi} product={p} />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {loading && (
                <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
                  <BotAvatar />
                  <div style={{ padding: "10px 16px", borderRadius: "16px 16px 16px 4px", background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", display: "flex", gap: 4, alignItems: "center" }}>
                    {[0, 1, 2].map(i => (
                      <span key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--brand)", opacity: 0.5, animation: `botBounce 1.2s ${i * 0.2}s infinite` }} />
                    ))}
                  </div>
                </div>
              )}
              <div />
            </div>

            {/* Input */}
            <div className="flex-shrink-0" style={{ borderTop: "1px solid #e5e7eb", background: "#ffffff" }}>
              <div className="flex items-center gap-2 px-3 py-3">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="Escribe tu mensaje..."
                  disabled={loading}
                  style={{ flex: 1, border: "1px solid #e5e7eb", borderRadius: 999, padding: "9px 16px", fontSize: 13, outline: "none", background: "#f9fafb", color: "#111827" }}
                />
                <button
                  onClick={send}
                  disabled={loading || !input.trim()}
                  style={{
                    flexShrink: 0, width: 36, height: 36, borderRadius: "50%",
                    background: input.trim() && !loading ? "var(--brand)" : "#e5e7eb",
                    border: "none", cursor: input.trim() && !loading ? "pointer" : "default",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "background 0.2s",
                  }}
                  aria-label="Enviar"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={input.trim() && !loading ? "#fff" : "#aaa"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating button */}
      {!open && (
        <div className="fixed bottom-5 right-5 z-[9997]">
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:opacity-95 active:scale-[0.97]"
            style={{ background: "var(--brand)", borderRadius: 999 }}
          >
            <span className="inline-block h-2 w-2 rounded-full animate-pulse" style={{ background: "rgba(255,255,255,0.8)" }} />
            ¿Hablamos?
          </button>
        </div>
      )}

      <style>{`
        @keyframes botBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
          30% { transform: translateY(-5px); opacity: 1; }
        }
        @keyframes chatFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
