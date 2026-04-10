"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  Toolbar, Typography, Divider, Box,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import InventoryIcon from "@mui/icons-material/Inventory";
import CategoryIcon from "@mui/icons-material/Category";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import HistoryIcon from "@mui/icons-material/History";
import SettingsIcon from "@mui/icons-material/Settings";
import StorefrontIcon from "@mui/icons-material/Storefront";
import LogoutIcon from "@mui/icons-material/Logout";
import { signOut } from "next-auth/react";

const DRAWER_WIDTH = 250;

const navSections = [
  {
    title: "General",
    items: [
      { label: "Dashboard", href: "/admin", icon: <DashboardIcon /> },
    ],
  },
  {
    title: "Catálogo",
    items: [
      { label: "Productos", href: "/admin/products", icon: <InventoryIcon /> },
      { label: "Categorías", href: "/admin/categories", icon: <CategoryIcon /> },
      { label: "Precios", href: "/admin/pricing", icon: <AttachMoneyIcon /> },
    ],
  },
  {
    title: "Ventas",
    items: [
      { label: "Pedidos", href: "/admin/orders", icon: <ShoppingCartIcon /> },
      { label: "Leads", href: "/admin/leads", icon: <PeopleIcon /> },
    ],
  },
  {
    title: "Sistema",
    items: [
      { label: "Usuarios", href: "/admin/users", icon: <PersonIcon /> },
      { label: "Auditoría", href: "/admin/audit", icon: <HistoryIcon /> },
      { label: "Ajustes", href: "/admin/settings", icon: <SettingsIcon /> },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: DRAWER_WIDTH,
          boxSizing: "border-box",
          borderRight: "1px solid #e5e7eb",
          bgcolor: "#ffffff",
        },
      }}
    >
      <Toolbar sx={{ gap: 1.5 }}>
        <Box sx={{ width: 28, height: 28, borderRadius: 1.5, bgcolor: "#1090e0", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <StorefrontIcon sx={{ fontSize: 16, color: "#fff" }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: -0.5, fontSize: 17 }}>
          e<span style={{ color: "#1090e0" }}>N</span>torno
          <Typography component="span" variant="caption" sx={{ ml: 0.5, color: "text.secondary" }}>
            Admin
          </Typography>
        </Typography>
      </Toolbar>
      <Divider />

      <Box sx={{ flex: 1, overflowY: "auto", py: 1 }}>
        {navSections.map((section) => (
          <Box key={section.title} sx={{ px: 1.5, mb: 1 }}>
            <Typography variant="overline" sx={{ px: 1, fontSize: 10, fontWeight: 700, color: "text.disabled", letterSpacing: 1.5 }}>
              {section.title}
            </Typography>
            <List disablePadding>
              {section.items.map((item) => {
                const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                return (
                  <ListItemButton
                    key={item.href}
                    component={Link}
                    href={item.href}
                    selected={active}
                    sx={{
                      borderRadius: 2,
                      mb: 0.3,
                      py: 0.8,
                      "&.Mui-selected": {
                        bgcolor: "rgba(16,144,224,0.08)",
                        "&:hover": { bgcolor: "rgba(16,144,224,0.12)" },
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36, color: active ? "primary.main" : "text.secondary" }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      slotProps={{ primary: { sx: { fontSize: 13, fontWeight: active ? 600 : 400 } } }}
                    />
                  </ListItemButton>
                );
              })}
            </List>
          </Box>
        ))}
      </Box>

      <Divider />
      <Box sx={{ p: 1.5 }}>
        <ListItemButton
          component={Link}
          href="/"
          sx={{ borderRadius: 2, mb: 0.5 }}
        >
          <ListItemIcon sx={{ minWidth: 36 }}><StorefrontIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary="Ver tienda" slotProps={{ primary: { sx: { fontSize: 13 } } }} />
        </ListItemButton>
        <ListItemButton
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          sx={{ borderRadius: 2 }}
        >
          <ListItemIcon sx={{ minWidth: 36 }}><LogoutIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary="Cerrar sesión" slotProps={{ primary: { sx: { fontSize: 13 } } }} />
        </ListItemButton>
      </Box>
    </Drawer>
  );
}

export { DRAWER_WIDTH };
