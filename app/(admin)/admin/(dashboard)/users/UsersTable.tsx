"use client";

import { SmartTable, type Column } from "@/components/admin/ui/SmartTable";
import { Chip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
};

const roleLabels: Record<string, string> = {
  admin: "Administrador",
  viewer: "Visor",
};

const columns: Column<User>[] = [
  { id: "name", label: "Nombre" },
  { id: "email", label: "Email" },
  {
    id: "role",
    label: "Rol",
    renderCell: (row) => (
      <Chip
        label={roleLabels[row.role] ?? row.role}
        color={row.role === "admin" ? "primary" : "default"}
        size="small"
        variant="outlined"
      />
    ),
  },
  {
    id: "isActive",
    label: "Estado",
    renderCell: (row) => (
      <Chip
        label={row.isActive ? "Activo" : "Inactivo"}
        color={row.isActive ? "success" : "error"}
        size="small"
      />
    ),
  },
  {
    id: "lastLoginAt",
    label: "Último acceso",
    renderCell: (row) =>
      row.lastLoginAt
        ? new Date(row.lastLoginAt).toLocaleDateString("es-MX", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })
        : "Nunca",
  },
  {
    id: "createdAt",
    label: "Creado",
    renderCell: (row) =>
      new Date(row.createdAt).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" }),
  },
];

export function UsersTable({ users }: { users: User[] }) {
  return (
    <SmartTable
      data={users}
      columns={columns}
      searchable
      searchPlaceholder="Buscar usuarios..."
      emptyTitle="No hay usuarios"
      emptyDescription="Crea el primer usuario para comenzar."
      rowActions={[
        {
          label: "Editar",
          icon: <EditIcon fontSize="small" />,
          onClick: (row) => alert(`Editar usuario: ${row.name}`),
        },
        {
          label: "Desactivar",
          icon: <BlockIcon fontSize="small" />,
          color: "error",
          onClick: (row) => alert(`Desactivar usuario: ${row.name}`),
          hidden: (row) => !row.isActive,
        },
        {
          label: "Activar",
          icon: <CheckCircleIcon fontSize="small" />,
          color: "success",
          onClick: (row) => alert(`Activar usuario: ${row.name}`),
          hidden: (row) => row.isActive,
        },
      ]}
    />
  );
}
