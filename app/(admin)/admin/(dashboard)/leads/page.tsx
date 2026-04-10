import { db } from "@/lib/db";
import { PageShell } from "@/components/admin/ui/PageShell";
import { LeadsTable } from "./LeadsTable";

export default async function LeadsPage() {
  const leads = await db.lead.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const serialized = leads.map(l => ({
    ...l,
    createdAt: l.createdAt.toISOString(),
    updatedAt: l.updatedAt.toISOString(),
  }));

  return (
    <PageShell title="Leads" subtitle="Leads capturados del bot y formulario de contacto">
      <LeadsTable leads={serialized} />
    </PageShell>
  );
}
