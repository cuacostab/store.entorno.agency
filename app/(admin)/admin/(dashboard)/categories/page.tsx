import { getCategories } from "@/lib/syscom-client";
import { PageShell } from "@/components/admin/ui/PageShell";
import { CategoriesTable } from "./CategoriesTable";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  const serialized = categories.map(c => ({
    id: String(c.id),
    nombre: c.nombre,
    nivel: c.nivel,
  }));

  return (
    <PageShell title="Categorías" subtitle={`${categories.length} categorías de Syscom`}>
      <CategoriesTable categories={serialized} />
    </PageShell>
  );
}
