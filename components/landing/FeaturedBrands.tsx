const brands = [
  { id: "hikvision", name: "Hikvision" },
  { id: "zkteco", name: "ZKTeco" },
  { id: "ubiquiti", name: "Ubiquiti" },
  { id: "epcom", name: "Epcom" },
  { id: "accesspro", name: "AccessPRO" },
  { id: "cambiumnetworks", name: "Cambium Networks" },
  { id: "panduit", name: "Panduit" },
  { id: "dahua", name: "Dahua" },
];

export function FeaturedBrands() {
  return (
    <section className="py-16">
      <div className="container6">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Marcas L&iacute;deres</h2>
          <p className="mt-3 text-gray-500">Trabajamos con las mejores marcas del mercado</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {brands.map(b => (
            <a
              key={b.id}
              href={`/productos?marca=${b.id}`}
              className="text-sm font-semibold text-gray-400 hover:text-gray-700 transition px-4 py-3 rounded-lg hover:bg-gray-50"
            >
              {b.name}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
