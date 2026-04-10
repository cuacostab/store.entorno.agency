import Link from "next/link";

const categories = [
  { id: "22", name: "Videovigilancia", icon: "🎥", description: "Cámaras IP, DVR/NVR, analíticas de video" },
  { id: "37", name: "Control de Acceso", icon: "🔐", description: "Lectores biométricos, torniquetes, cerraduras" },
  { id: "26", name: "Redes", icon: "🌐", description: "Switches, access points, routers empresariales" },
  { id: "65811", name: "Cableado Estructurado", icon: "🔌", description: "Cable UTP, fibra óptica, patch panels" },
];

export function FeaturedCategories() {
  return (
    <section className="py-20" style={{ background: "var(--bg-light)" }}>
      <div className="container6">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Categorías Principales</h2>
          <p className="mt-3 text-gray-500">Encuentra el equipo que necesitas para tu proyecto</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map(cat => (
            <Link
              key={cat.id}
              href={`/productos?categoria=${cat.id}`}
              className="anim-hover-glow bg-white rounded-card p-6 border border-gray-100"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <span className="text-3xl">{cat.icon}</span>
              <h3 className="mt-4 font-semibold text-lg">{cat.name}</h3>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed">{cat.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
