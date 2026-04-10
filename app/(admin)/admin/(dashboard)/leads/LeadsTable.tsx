"use client";

import { SmartTable, type Column } from "@/components/admin/ui/SmartTable";
import { Chip } from "@mui/material";

type Lead = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  source: string;
  status: string;
  productsShown: string | null;
  createdAt: string;
};

const statusColors: Record<string, "info" | "warning" | "success" | "error" | "default"> = {
  new: "info",
  contacted: "warning",
  quoted: "warning",
  converted: "success",
  lost: "error",
};

const statusLabels: Record<string, string> = {
  new: "Nuevo",
  contacted: "Contactado",
  quoted: "Cotizado",
  converted: "Convertido",
  lost: "Perdido",
};

const sourceLabels: Record<string, string> = {
  bot: "Chat Bot",
  contact_form: "Formulario",
  checkout: "Checkout",
};

const columns: Column<Lead>[] = [
  {
    id: "createdAt",
    label: "Fecha",
    renderCell: (row) =>
      new Date(row.createdAt).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" }),
  },
  { id: "name", label: "Nombre" },
  {
    id: "email",
    label: "Contacto",
    renderCell: (row) => row.email || row.phone || "—",
  },
  {
    id: "source",
    label: "Fuente",
    renderCell: (row) => (
      <Chip label={sourceLabels[row.source] ?? row.source} size="small" variant="outlined" />
    ),
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
    id: "productsShown",
    label: "Productos",
    sortable: false,
    renderCell: (row) => {
      if (!row.productsShown) return "—";
      try {
        const products = JSON.parse(row.productsShown);
        return products.slice(0, 2).join(", ") || "—";
      } catch { return "—"; }
    },
  },
];

export function LeadsTable({ leads }: { leads: Lead[] }) {
  return (
    <SmartTable
      data={leads}
      columns={columns}
      searchable
      searchPlaceholder="Buscar leads..."
      emptyTitle="No hay leads aún"
      emptyDescription="Los leads aparecerán aquí cuando interactúen con el bot o el formulario de contacto."
    />
  );
}
