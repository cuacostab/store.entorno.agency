import { db } from "@/lib/db";
import { PageShell } from "@/components/admin/ui/PageShell";
import { AuditTable } from "./AuditTable";

export default async function AuditPage() {
  const logs = await db.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { user: { select: { name: true, email: true } } },
  });

  const serialized = logs.map(l => ({
    id: l.id,
    action: l.action,
    entityType: l.entityType,
    entityId: l.entityId,
    userName: l.user?.name ?? "Sistema",
    userEmail: l.user?.email ?? "",
    metadata: l.metadata,
    ipAddress: l.ipAddress,
    createdAt: l.createdAt.toISOString(),
  }));

  return (
    <PageShell title="Auditoría" subtitle="Registro de actividad del sistema">
      <AuditTable logs={serialized} />
    </PageShell>
  );
}
