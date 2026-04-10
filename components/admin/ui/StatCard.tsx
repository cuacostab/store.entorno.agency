"use client";

import { ReactNode } from "react";
import { Paper, Typography, Box, Skeleton, useTheme } from "@mui/material";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  color?: string;
  trend?: { value: number; label?: string };
  loading?: boolean;
}

export function StatCard({ title, value, icon, color, trend, loading }: StatCardProps) {
  const theme = useTheme();
  const mainColor = color ?? theme.palette.primary.main;

  if (loading) {
    return (
      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <Skeleton variant="text" width={100} height={20} />
        <Skeleton variant="text" width={80} height={40} sx={{ mt: 1 }} />
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Box>
          <Typography variant="body2" sx={{ color: theme.palette.grey[600], fontWeight: 500, fontSize: 13 }}>
            {title}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, mt: 1, color: mainColor }}>
            {value}
          </Typography>
          {trend && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 1 }}>
              <Typography
                variant="caption"
                sx={{ fontWeight: 600, color: trend.value >= 0 ? "success.main" : "error.main" }}
              >
                {trend.value >= 0 ? "+" : ""}{trend.value}%
              </Typography>
              {trend.label && (
                <Typography variant="caption" color="text.secondary">
                  {trend.label}
                </Typography>
              )}
            </Box>
          )}
        </Box>
        {icon && (
          <Box sx={{
            p: 1.5, borderRadius: 2,
            backgroundColor: `${mainColor}15`,
            color: mainColor,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {icon}
          </Box>
        )}
      </Box>
    </Paper>
  );
}

export function StatGrid({ children }: { children: ReactNode }) {
  return (
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(4, 1fr)" }, gap: 3 }}>
      {children}
    </Box>
  );
}
