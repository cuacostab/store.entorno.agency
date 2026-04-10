"use client";

import { SmartTable, type Column } from "@/components/admin/ui/SmartTable";
import { Chip } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

type Category = {
  id: string;
  nombre: string;
  nivel: number;
};

const columns: Column<Category>[] = [
  { id: "id", label: "ID", width: 100 },
  { id: "nombre", label: "Nombre" },
  {
    id: "nivel",
    label: "Nivel",
    width: 100,
    renderCell: (row) => (
      <Chip label={`Nivel ${row.nivel}`} size="small" variant="outlined" />
    ),
  },
];

export function CategoriesTable({ categories }: { categories: Category[] }) {
  return (
    <SmartTable
      data={categories}
      columns={columns}
      searchable
      searchPlaceholder="Buscar categorías..."
      emptyTitle="Sin categorías"
      emptyDescription="No se pudieron cargar las categorías de Syscom."
      rowActions={[
        {
          label: "Ver productos",
          icon: <OpenInNewIcon fontSize="small" />,
          onClick: (row) => window.open(`/productos?categoria=${row.id}`, "_blank"),
        },
      ]}
    />
  );
}
