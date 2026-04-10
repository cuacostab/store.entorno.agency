"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { SmartTable, type Column } from "@/components/admin/ui/SmartTable";
import { Chip, TextField, Button, Box, Avatar } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

type Product = {
  id: string;
  producto_id: number;
  titulo: string;
  modelo: string;
  marca: string;
  stock: "disponible" | "agotado" | "bajo";
  total_existencia: number;
  precio: number;
  precio_formato: string;
  img_portada: string;
};

const stockColors: Record<string, "success" | "warning" | "error"> = {
  disponible: "success",
  bajo: "warning",
  agotado: "error",
};

const stockLabels: Record<string, string> = {
  disponible: "En stock",
  bajo: "Bajo",
  agotado: "Agotado",
};

const columns: Column<Product>[] = [
  {
    id: "img_portada",
    label: "",
    width: 50,
    sortable: false,
    renderCell: (row) => (
      <Avatar
        src={row.img_portada?.trim() || undefined}
        variant="rounded"
        sx={{ width: 40, height: 40, bgcolor: "#f5f5f5" }}
      >
        📦
      </Avatar>
    ),
  },
  {
    id: "titulo",
    label: "Producto",
    renderCell: (row) => (
      <Box>
        <Box sx={{ fontSize: 13, fontWeight: 600, maxWidth: 350, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {row.titulo}
        </Box>
        <Box sx={{ fontSize: 11, color: "text.secondary" }}>
          {row.modelo} · {row.marca}
        </Box>
      </Box>
    ),
  },
  {
    id: "precio",
    label: "Precio venta",
    align: "right",
    renderCell: (row) => (
      <Box sx={{ fontWeight: 600, color: "primary.main", fontSize: 13 }}>
        {row.precio_formato}
      </Box>
    ),
  },
  {
    id: "total_existencia",
    label: "Existencia",
    align: "center",
    renderCell: (row) => row.total_existencia,
  },
  {
    id: "stock",
    label: "Estado",
    renderCell: (row) => (
      <Chip
        label={stockLabels[row.stock] ?? row.stock}
        color={stockColors[row.stock] ?? "default"}
        size="small"
      />
    ),
  },
];

export function ProductsTable({
  products, totalCount, currentPage, totalPages, query,
}: {
  products: Product[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  query: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(query);

  function handleSearch() {
    const params = new URLSearchParams(searchParams.toString());
    if (search.trim()) {
      params.set("q", search.trim());
    } else {
      params.delete("q");
    }
    params.delete("pagina");
    router.push(`/admin/products?${params.toString()}`);
  }

  return (
    <Box>
      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        <TextField
          size="small"
          placeholder="Buscar en catálogo Syscom..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          sx={{ flex: 1 }}
        />
        <Button variant="contained" onClick={handleSearch} startIcon={<SearchIcon />} sx={{ textTransform: "none" }}>
          Buscar
        </Button>
      </Box>

      <SmartTable
        data={products}
        columns={columns}
        emptyTitle="Sin resultados"
        emptyDescription="Intenta con otros términos de búsqueda"
        rowActions={[
          {
            label: "Ver en tienda",
            icon: <OpenInNewIcon fontSize="small" />,
            onClick: (row) => window.open(`/productos/${row.producto_id}`, "_blank"),
          },
        ]}
      />

      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mt: 2 }}>
          <Button
            size="small"
            disabled={currentPage <= 1}
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString());
              params.set("pagina", String(currentPage - 1));
              router.push(`/admin/products?${params.toString()}`);
            }}
          >
            Anterior
          </Button>
          <Chip label={`Página ${currentPage} de ${totalPages}`} size="small" />
          <Button
            size="small"
            disabled={currentPage >= totalPages}
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString());
              params.set("pagina", String(currentPage + 1));
              router.push(`/admin/products?${params.toString()}`);
            }}
          >
            Siguiente
          </Button>
        </Box>
      )}
    </Box>
  );
}
