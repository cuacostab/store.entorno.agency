import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0c1222 0%, #1e293b 50%, #0f172a 100%)" }}>
      <div className="container6 relative z-10 py-24 md:py-32 text-center">
        <span className="inline-block text-xs font-semibold tracking-wider uppercase px-3 py-1 rounded-full mb-6" style={{ background: "rgba(16,144,224,0.15)", color: "var(--brand)" }}>
          Aliado Oficial Syscom
        </span>
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
          Soluciones en Seguridad,<br />
          <span style={{ color: "var(--brand)" }}>Redes y Tecnolog&iacute;a</span>
        </h1>
        <p className="mt-6 text-base md:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Explora el cat&aacute;logo completo de productos de seguridad, videovigilancia, control de acceso,
          redes y cableado estructurado. Solicita tu cotizaci&oacute;n personalizada.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/productos"
            className="px-8 py-3.5 text-sm font-semibold text-white rounded-btn shadow-lg transition hover:opacity-90"
            style={{ background: "var(--brand)" }}
          >
            Ver Cat&aacute;logo
          </Link>
          <Link
            href="/contacto"
            className="px-8 py-3.5 text-sm font-semibold text-white rounded-btn transition hover:bg-white/15"
            style={{ border: "1px solid rgba(255,255,255,0.25)" }}
          >
            Solicitar Cotizaci&oacute;n
          </Link>
        </div>
      </div>
      {/* Decorative grid */}
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='1'%3E%3Cpath d='M0 0h1v40H0zm39 0h1v40h-1zM0 0h40v1H0zm0 39h40v1H0z'/%3E%3C/g%3E%3C/svg%3E\")" }} />
    </section>
  );
}
