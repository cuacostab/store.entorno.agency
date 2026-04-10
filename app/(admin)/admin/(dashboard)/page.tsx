import { db } from "@/lib/db";
import { PageShell } from "@/components/admin/ui/PageShell";
import { StatCard, StatGrid } from "@/components/admin/ui/StatCard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PendingIcon from "@mui/icons-material/HourglassEmpty";
import PeopleIcon from "@mui/icons-material/People";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

async function getStats() {
  const [orderCount, leadCount, pendingOrders, revenue] = await Promise.all([
    db.order.count(),
    db.lead.count(),
    db.order.count({ where: { status: "pending" } }),
    db.order.aggregate({ _sum: { total: true }, where: { status: "approved" } }),
  ]);

  return {
    orderCount,
    leadCount,
    pendingOrders,
    revenue: revenue._sum.total ?? 0,
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const revenueFormatted = stats.revenue.toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
  });

  return (
    <PageShell title="Dashboard" subtitle="Resumen general de la tienda">
      <StatGrid>
        <StatCard
          title="Pedidos totales"
          value={stats.orderCount}
          icon={<ShoppingCartIcon />}
          color="#1090e0"
        />
        <StatCard
          title="Pendientes"
          value={stats.pendingOrders}
          icon={<PendingIcon />}
          color="#f59e0b"
        />
        <StatCard
          title="Leads"
          value={stats.leadCount}
          icon={<PeopleIcon />}
          color="#10b981"
        />
        <StatCard
          title="Revenue"
          value={revenueFormatted}
          icon={<AttachMoneyIcon />}
          color="#1090e0"
        />
      </StatGrid>
    </PageShell>
  );
}
