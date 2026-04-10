import Link from "next/link";

export function Footer() {
  return (
    <footer className="text-gray-300" style={{ background: "var(--footer)" }}>
      <div className="container6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <span className="font-bold text-lg text-white">
              e<span style={{ color: "var(--brand)" }}>N</span>torno
              <span className="text-sm font-normal text-gray-400 ml-1">Store</span>
            </span>
            <p className="mt-3 text-sm text-gray-400 leading-relaxed">
              Soluciones en seguridad, redes y tecnología.<br />
              Aliado oficial Syscom.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white text-sm mb-3">Navegación</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white transition">Inicio</Link></li>
              <li><Link href="/productos" className="hover:text-white transition">Productos</Link></li>
              <li><Link href="/contacto" className="hover:text-white transition">Contacto</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white text-sm mb-3">Contacto</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>contacto@entorno.agency</li>
              <li>
                <a href="https://entorno.agency" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                  entorno.agency
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-700 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} eNtorno. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
