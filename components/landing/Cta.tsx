import Link from "next/link";

export function Cta() {
  return (
    <section className="py-20" style={{ background: "linear-gradient(135deg, var(--brand) 0%, var(--brand-dark) 100%)" }}>
      <div className="container6 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
          &iquest;Necesitas ayuda con tu proyecto?
        </h2>
        <p className="mt-4 text-blue-100 max-w-xl mx-auto">
          Nuestro equipo de consultores te ayuda a elegir el equipo adecuado
          y te entrega una cotizaci&oacute;n personalizada.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/contacto"
            className="px-8 py-3.5 text-sm font-semibold rounded-btn transition"
            style={{ background: "#fff", color: "var(--brand)" }}
          >
            Solicitar Cotizaci&oacute;n
          </Link>
          <Link
            href="/productos"
            className="px-8 py-3.5 text-sm font-semibold text-white rounded-btn transition hover:bg-white/15"
            style={{ border: "1px solid rgba(255,255,255,0.35)" }}
          >
            Explorar Cat&aacute;logo
          </Link>
        </div>
      </div>
    </section>
  );
}
