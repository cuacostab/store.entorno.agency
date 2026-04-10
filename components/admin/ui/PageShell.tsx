"use client";

import { ReactNode } from "react";
import {
  Box, Typography, Breadcrumbs, Skeleton, Paper, Alert, AlertTitle,
} from "@mui/material";
import {
  NavigateNext as NavigateNextIcon,
  Home as HomeIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

interface PageShellProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  loading?: boolean;
  infoMessage?: string;
  infoTitle?: string;
  infoSeverity?: "info" | "warning" | "error" | "success";
}

export function PageShell({
  title, subtitle, actions, children, loading = false,
  infoMessage, infoTitle, infoSeverity = "info",
}: PageShellProps) {
  const theme = useTheme();

  return (
    <Box sx={{ width: "100%" }}>
      <Paper
        elevation={0}
        sx={{ p: 2.5, mb: 3, backgroundColor: "#ffffff", borderRadius: "12px" }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2, mb: infoMessage ? 2 : 0 }}>
          <Box sx={{ flex: "1 1 auto", minWidth: 0 }}>
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" sx={{ color: theme.palette.grey[500] }} />} sx={{ "& .MuiBreadcrumbs-separator": { mx: 0.5 } }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <HomeIcon fontSize="small" sx={{ color: theme.palette.grey[600] }} />
              </Box>
              <Typography sx={{ color: theme.palette.grey[900], fontSize: "1rem", fontWeight: 500 }}>
                {title}
              </Typography>
            </Breadcrumbs>
          </Box>
          {actions && (
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              {loading ? <Skeleton variant="rectangular" width={100} height={36} /> : actions}
            </Box>
          )}
        </Box>

        {subtitle && !loading && (
          <Typography variant="body2" sx={{ color: theme.palette.grey[600], mt: 0.5, fontSize: "0.875rem" }}>
            {subtitle}
          </Typography>
        )}

        {infoMessage && (
          <Alert
            severity={infoSeverity}
            icon={<InfoIcon />}
            sx={{ mt: 2, borderRadius: "8px" }}
          >
            {infoTitle && <AlertTitle>{infoTitle}</AlertTitle>}
            {infoMessage}
          </Alert>
        )}
      </Paper>

      <Box>
        {loading ? (
          <Paper sx={{ p: 3, borderRadius: "12px", backgroundColor: "#ffffff" }}>
            <Skeleton variant="rectangular" height={400} />
          </Paper>
        ) : (
          children
        )}
      </Box>
    </Box>
  );
}

export function Section({
  title, subtitle, actions, children, divider = false, spacing = 3,
}: {
  title?: string; subtitle?: string; actions?: ReactNode;
  children: ReactNode; divider?: boolean; spacing?: number;
}) {
  const theme = useTheme();

  return (
    <Paper elevation={0} sx={{ mb: spacing, borderRadius: 0, backgroundColor: "transparent" }}>
      {(title || actions) && (
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, pb: divider ? 2 : 0, borderBottom: divider ? "1px solid" : "none", borderColor: "divider" }}>
          <Box>
            {title && (
              <Typography variant="h6" component="h2" gutterBottom={!!subtitle} sx={{ fontWeight: 600, color: theme.palette.grey[900] }}>
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography variant="body2" sx={{ color: theme.palette.grey[600] }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          {actions && <Box>{actions}</Box>}
        </Box>
      )}
      {children}
    </Paper>
  );
}
