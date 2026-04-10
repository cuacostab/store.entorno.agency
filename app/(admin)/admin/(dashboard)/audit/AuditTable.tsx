"use client";

import { SmartTable, type Column } from "@/components/admin/ui/SmartTable";
import { Chip } from "@mui/material";

type AuditEntry = {
  id: string;
  action: string;
  entityType: string | null;
  entityId: string | null;
  userName: string;
  userEmail: string;
  metadata: string | null;
  ipAddress: string | null;
  createdAt: string;
};

const actionLabels: Record<string, string> = {
  "user.login": "Inicio de sesión",
  "user.created": "Usuario creado",
  "user.updated": "Usuario actualizado",
  "order.created": "Pedido creado",
  "order.status_changed": "Estado de pedido",
  "lead.created": "Lead capturado",
  "lead.status_changed": "Estado de lead",
  "settings.updated": "Ajustes actualizados",
};

const entityColors: Record<string, "primary" | "success" | "warning" | "info" | "default"> = {
  user: "primary",
  order: "success",
  lead: "warning",
  settings: "info",
};

const columns: Column<AuditEntry>[] = [
  {
    id: "createdAt",
    label: "Fecha",
    width: 160,
    renderCell: (row) =>
      new Date(row.createdAt).toLocaleDateString("es-MX", {
        day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
      }),
  },
  { id: "userName", label: "Usuario", width: 150 },
  {
    id: "action",
    label: "Acción",
    renderCell: (row) => actionLabels[row.action] ?? row.action,
  },
  {
    id: "entityType",
    label: "Entidad",
    width: 120,
    renderCell: (row) =>
      row.entityType ? (
        <Chip
          label={row.entityType}
          color={entityColors[row.entityType] ?? "default"}
          size="small"
          variant="outlined"
        />
      ) : "—",
  },
  {
    id: "entityId",
    label: "ID",
    width: 120,
    renderCell: (row) => row.entityId ? row.entityId.slice(0, 8) + "..." : "—",
  },
  {
    id: "ipAddress",
    label: "IP",
    width: 120,
    renderCell: (row) => row.ipAddress ?? "—",
  },
];

export function AuditTable({ logs }: { logs: AuditEntry[] }) {
  return (
    <SmartTable
      data={logs}
      columns={columns}
      searchable
      searchPlaceholder="Buscar en auditoría..."
      emptyTitle="Sin registros"
      emptyDescription="Los registros de auditoría aparecerán aquí conforme se realicen acciones en el sistema."
    />
  );
}
