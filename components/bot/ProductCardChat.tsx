import Link from "next/link";

type Props = {
  product: {
    producto_id: number;
    titulo: string;
    modelo: string;
    marca: string;
    img_portada: string;
    stock: "disponible" | "agotado" | "bajo";
    link: string;
    precio_formato?: string;
  };
};

const stockLabels = {
  disponible: { text: "En stock", bg: "#dcfce7", color: "#166534" },
  bajo: { text: "Pocas unidades", bg: "#fef3c7", color: "#92400e" },
  agotado: { text: "Agotado", bg: "#fecaca", color: "#991b1b" },
};

export function ProductCardChat({ product }: Props) {
  const s = stockLabels[product.stock];

  return (
    <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden", border: "1px solid #e5e7eb", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
      <div style={{ display: "flex", gap: 10, padding: 10 }}>
        {product.img_portada?.trim() && (
          <img
            src={product.img_portada}
            alt={product.titulo}
            style={{ width: 60, height: 60, objectFit: "contain", borderRadius: 8, background: "#f9fafb", flexShrink: 0 }}
          />
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#111827", lineHeight: 1.3, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {product.titulo}
          </p>
          <p style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>
            {product.modelo} &middot; {product.marca}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
            {product.precio_formato && (
              <span style={{ fontSize: 12, fontWeight: 700, color: "#1090e0" }}>{product.precio_formato}</span>
            )}
            <span style={{ display: "inline-block", fontSize: 10, fontWeight: 600, padding: "2px 6px", borderRadius: 999, background: s.bg, color: s.color }}>
              {s.text}
            </span>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 6, padding: "6px 10px 10px", borderTop: "1px solid #f3f4f6" }}>
        <Link
          href={product.link}
          style={{ flex: 1, textAlign: "center", fontSize: 11, fontWeight: 600, padding: "6px 0", borderRadius: 8, background: "var(--brand)", color: "#fff", textDecoration: "none" }}
        >
          Ver detalle
        </Link>
        <Link
          href={`/contacto?producto=${encodeURIComponent(product.modelo)}`}
          style={{ flex: 1, textAlign: "center", fontSize: 11, fontWeight: 600, padding: "6px 0", borderRadius: 8, border: "1px solid var(--brand)", color: "var(--brand)", textDecoration: "none" }}
        >
          Cotizar
        </Link>
      </div>
    </div>
  );
}
