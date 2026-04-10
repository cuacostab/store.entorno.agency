"use client";

import { Box, Typography } from "@mui/material";
import { ReactNode } from "react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({
  title = "Sin datos",
  description = "No hay información para mostrar",
  icon,
  action,
}: EmptyStateProps) {
  return (
    <Box sx={{ textAlign: "center", py: 8, px: 3 }}>
      {icon && <Box sx={{ mb: 2, fontSize: 48, color: "text.secondary" }}>{icon}</Box>}
      <Typography variant="h6" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: action ? 3 : 0 }}>
        {description}
      </Typography>
      {action}
    </Box>
  );
}
