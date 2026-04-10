import { db } from "@/lib/db";
import { PageShell } from "@/components/admin/ui/PageShell";
import { OrdersTable } from "./OrdersTable";

export default async function OrdersPage() {
  const orders = await db.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const serialized = orders.map(o => ({
    ...o,
    createdAt: o.createdAt.toISOString(),
    updatedAt: o.updatedAt.toISOString(),
  }));

  return (
    <PageShell title="Pedidos" subtitle="Todos los pedidos de la tienda">
      <OrdersTable orders={serialized} />
    </PageShell>
  );
}
