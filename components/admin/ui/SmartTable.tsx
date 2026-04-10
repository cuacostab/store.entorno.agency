"use client";

import { ReactNode, useState, useCallback, useMemo } from "react";
import {
  Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, TablePagination, TableSortLabel, IconButton, Menu, MenuItem,
  Typography, alpha, Toolbar, TextField, InputAdornment, Tooltip, Chip,
  useTheme, Skeleton,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import { EmptyState } from "./EmptyState";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Column<T> {
  id: keyof T | string;
  label: string;
  width?: number | string;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  renderCell?: (row: T) => ReactNode;
}

export interface RowAction<T> {
  label: string;
  icon?: ReactNode;
  onClick: (row: T) => void;
  hidden?: (row: T) => boolean;
  color?: "inherit" | "primary" | "secondary" | "error" | "info" | "success" | "warning";
}

interface SmartTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  totalCount?: number;
  rowsPerPageOptions?: number[];
  rowActions?: RowAction<T>[];
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  title?: string;
  subtitle?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  onRowClick?: (row: T) => void;
  getRowId?: (row: T) => string;
  actions?: ReactNode;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function SmartTable<T extends Record<string, unknown>>({
  data,
  columns,
  loading = false,
  totalCount,
  rowsPerPageOptions = [10, 25, 50],
  rowActions = [],
  searchable = false,
  searchPlaceholder = "Buscar...",
  onSearchChange,
  title,
  subtitle,
  emptyTitle = "Sin datos",
  emptyDescription = "No hay información para mostrar",
  onRowClick,
  getRowId = (row) => (row as { id?: string }).id ?? String(Math.random()),
  actions,
}: SmartTableProps<T>) {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
  const [sortBy, setSortBy] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchValue, setSearchValue] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = useState<T | null>(null);

  // Sorting
  const handleSort = useCallback((field: string) => {
    const isAsc = sortBy === field && sortOrder === "asc";
    setSortBy(field);
    setSortOrder(isAsc ? "desc" : "asc");
    setPage(0);
  }, [sortBy, sortOrder]);

  // Sorted + paginated data
  const displayedData = useMemo(() => {
    let result = [...data];

    // Client-side sort
    if (sortBy) {
      result.sort((a, b) => {
        const aVal = a[sortBy];
        const bVal = b[sortBy];
        if (aVal == null) return 1;
        if (bVal == null) return -1;
        const cmp = String(aVal).localeCompare(String(bVal), "es", { numeric: true });
        return sortOrder === "asc" ? cmp : -cmp;
      });
    }

    // Client-side pagination
    if (totalCount === undefined) {
      const start = page * rowsPerPage;
      result = result.slice(start, start + rowsPerPage);
    }

    return result;
  }, [data, sortBy, sortOrder, page, rowsPerPage, totalCount]);

  const count = totalCount ?? data.length;

  // Action menu
  const handleActionClick = (event: React.MouseEvent<HTMLElement>, row: T) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleActionClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  // Search
  const handleSearch = (value: string) => {
    setSearchValue(value);
    setPage(0);
    onSearchChange?.(value);
  };

  const hasActions = rowActions.length > 0;

  return (
    <Paper sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", overflow: "hidden" }}>
      {/* Toolbar */}
      <Toolbar sx={{ px: { sm: 2 }, pr: { xs: 1, sm: 1 }, minHeight: { xs: 64 } }}>
        <Box sx={{ flex: "1 1 100%" }}>
          {title && (
            <Typography variant="h6" component="div" gutterBottom={!!subtitle}>
              {title}
            </Typography>
          )}
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>

        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          {searchable && (
            <TextField
              size="small"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" sx={{ color: theme.palette.grey[500] }} />
                    </InputAdornment>
                  ),
                  endAdornment: searchValue ? (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => handleSearch("")} sx={{ p: 0.5 }}>
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ) : undefined,
                },
              }}
              sx={{ minWidth: 200 }}
            />
          )}
          {actions}
        </Box>
      </Toolbar>

      {/* Table */}
      <TableContainer>
        {loading ? (
          <Box sx={{ p: 3 }}>
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={44} sx={{ mb: 1, borderRadius: 1 }} />
            ))}
          </Box>
        ) : displayedData.length === 0 ? (
          <EmptyState title={emptyTitle} description={emptyDescription} />
        ) : (
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((col) => (
                  <TableCell
                    key={String(col.id)}
                    align={col.align ?? "left"}
                    sx={{
                      fontWeight: 600,
                      fontSize: 13,
                      backgroundColor: theme.palette.grey[50],
                      borderColor: theme.palette.grey[200],
                      width: col.width,
                    }}
                  >
                    {col.sortable !== false ? (
                      <TableSortLabel
                        active={sortBy === String(col.id)}
                        direction={sortBy === String(col.id) ? sortOrder : "asc"}
                        onClick={() => handleSort(String(col.id))}
                      >
                        {col.label}
                      </TableSortLabel>
                    ) : (
                      col.label
                    )}
                  </TableCell>
                ))}
                {hasActions && (
                  <TableCell
                    align="right"
                    sx={{ fontWeight: 600, fontSize: 13, backgroundColor: theme.palette.grey[50], width: 60 }}
                  />
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedData.map((row, index) => (
                <TableRow
                  key={getRowId(row)}
                  hover
                  onClick={() => onRowClick?.(row)}
                  sx={{
                    cursor: onRowClick ? "pointer" : "default",
                    "&:hover": { backgroundColor: alpha(theme.palette.primary.main, 0.04) },
                  }}
                >
                  {columns.map((col) => (
                    <TableCell key={String(col.id)} align={col.align ?? "left"} sx={{ fontSize: 13 }}>
                      {col.renderCell
                        ? col.renderCell(row)
                        : String(row[col.id as keyof T] ?? "—")}
                    </TableCell>
                  ))}
                  {hasActions && (
                    <TableCell align="right" sx={{ p: 0.5 }}>
                      <IconButton
                        size="small"
                        onClick={(e) => handleActionClick(e, row)}
                        sx={{ color: theme.palette.grey[500] }}
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {/* Pagination */}
      {count > rowsPerPageOptions[0] && (
        <TablePagination
          component="div"
          count={count}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={rowsPerPageOptions}
          labelRowsPerPage="Filas por página:"
          labelDisplayedRows={({ from, to, count: c }) => `${from}-${to} de ${c}`}
        />
      )}

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleActionClose}
        slotProps={{ paper: { sx: { borderRadius: 2, boxShadow: "0 4px 20px rgba(0,0,0,0.12)", minWidth: 160 } } }}
      >
        {selectedRow &&
          rowActions
            .filter((a) => !a.hidden?.(selectedRow))
            .map((action, i) => (
              <MenuItem
                key={i}
                onClick={() => {
                  action.onClick(selectedRow);
                  handleActionClose();
                }}
                sx={{ fontSize: 13, gap: 1.5, color: action.color === "error" ? "error.main" : undefined }}
              >
                {action.icon}
                {action.label}
              </MenuItem>
            ))}
      </Menu>
    </Paper>
  );
}
