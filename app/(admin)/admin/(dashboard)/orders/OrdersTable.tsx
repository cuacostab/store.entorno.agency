"use client";

import { SmartTable, type Column } from "@/components/admin/ui/SmartTable";
import { Chip } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

type Order = {
  id: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: string;
  items: string;
  createdAt: string;
};

const statusColors: Record<string, "warning" | "success" | "error" | "info" | "default"> = {
  pending: "warning",
  approved: "success",
  rejected: "error",
  in_process: "info",
  refunded: "default",
};

const statusLabels: Record<string, string> = {
  pending: "Pendiente",
  approved: "Aprobado",
  rejected: "Rechazado",
  in_process: "En proceso",
  refunded: "Reembolsado",
};

const columns: Column<Order>[] = [
  {
    id: "createdAt",
    label: "Fecha",
    renderCell: (row) =>
      new Date(row.createdAt).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" }),
  },
  { id: "customerName", label: "Cliente" },
  { id: "customerEmail", label: "Email" },
  {
    id: "total",
    label: "Total",
    align: "right",
    renderCell: (row) => row.total.toLocaleString("es-MX", { style: "currency", currency: "MXN" }),
  },
  {
    id: "status",
    label: "Estado",
    renderCell: (row) => (
      <Chip
        label={statusLabels[row.status] ?? row.status}
        color={statusColors[row.status] ?? "default"}
        size="small"
      />
    ),
  },
  {
    id: "items",
    label: "Items",
    sortable: false,
    renderCell: (row) => {
      try { return `${JSON.parse(row.items).length} producto(s)`; } catch { return "—"; }
    },
  },
];

export function OrdersTable({ orders }: { orders: Order[] }) {
  return (
    <SmartTable
      data={orders}
      columns={columns}
      searchable
      searchPlaceholder="Buscar pedidos..."
      emptyTitle="No hay pedidos aún"
      emptyDescription="Los pedidos aparecerán aquí cuando los clientes compren desde la tienda."
      rowActions={[
        {
          label: "Ver detalle",
          icon: <VisibilityIcon fontSize="small" />,
          onClick: (row) => window.open(`/productos/${JSON.parse(row.items)?.[0]?.product_id ?? ""}`, "_blank"),
        },
      ]}
    />
  );
}
