"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/productos", label: "Productos" },
  { href: "/contacto", label: "Contacto" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar-bg fixed top-0 left-0 right-0 z-50 border-b border-gray-200/60">
      <div className="container6 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/entorno/favicon.png" alt="eNtorno" width={32} height={32} />
          <span className="font-bold text-lg tracking-tight">
            e<span style={{ color: "var(--brand)" }}>N</span>torno
            <span className="text-sm font-normal text-gray-400 ml-1">Store</span>
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {links.map(l => (
            <Link key={l.href} href={l.href} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition">
              {l.label}
            </Link>
          ))}
          <Link
            href="/contacto"
            className="text-sm font-semibold text-white px-4 py-2 rounded-btn transition"
            style={{ background: "var(--brand)" }}
          >
            Cotizar
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="M18 6L6 18M6 6l12 12" /> : <><path d="M3 12h18" /><path d="M3 6h18" /><path d="M3 18h18" /></>}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-200/60 bg-white">
          <div className="container6 py-4 flex flex-col gap-3">
            {links.map(l => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-sm font-medium text-gray-700 py-2">
                {l.label}
              </Link>
            ))}
            <Link href="/contacto" onClick={() => setOpen(false)} className="text-sm font-semibold text-white px-4 py-2 rounded-btn text-center" style={{ background: "var(--brand)" }}>
              Cotizar
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
