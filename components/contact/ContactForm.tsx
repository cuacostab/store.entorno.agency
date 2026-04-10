"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

export function ContactForm() {
  const searchParams = useSearchParams();
  const productParam = searchParams.get("producto") ?? "";

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    products: productParam,
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  function update(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", phone: "", products: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="text-center py-12">
        <p className="text-4xl mb-4">✅</p>
        <h3 className="text-xl font-bold">¡Mensaje enviado!</h3>
        <p className="text-gray-500 mt-2">Nos pondremos en contacto contigo a la brevedad.</p>
        <button onClick={() => setStatus("idle")} className="mt-6 text-sm font-semibold px-6 py-2 rounded-btn text-white" style={{ background: "var(--brand)" }}>
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
          <input type="text" required value={form.name} onChange={e => update("name", e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
          <input type="email" required value={form.email} onChange={e => update("email", e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
          <input type="tel" value={form.phone} onChange={e => update("phone", e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Productos de interés</label>
          <input type="text" value={form.products} onChange={e => update("products", e.target.value)} placeholder="ej: cámaras Hikvision, switch PoE" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje *</label>
        <textarea required rows={5} value={form.message} onChange={e => update("message", e.target.value)} placeholder="Cuéntanos sobre tu proyecto o lo que necesitas..." className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition resize-none" />
      </div>

      {status === "error" && (
        <p className="text-sm text-red-600">Hubo un error al enviar. Intenta de nuevo.</p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full sm:w-auto px-8 py-3 text-sm font-semibold text-white rounded-btn transition disabled:opacity-60"
        style={{ background: "var(--brand)" }}
      >
        {status === "sending" ? "Enviando..." : "Enviar mensaje"}
      </button>
    </form>
  );
}
