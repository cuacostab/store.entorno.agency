import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PageShell, Section } from "@/components/admin/ui/PageShell";
import { Typography, Paper } from "@mui/material";

export default async function SettingsPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  return (
    <PageShell title="Ajustes" subtitle="Configuración del panel de administración">
      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Perfil</Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Nombre:</strong> {session.user?.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          <strong>Email:</strong> {session.user?.email}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          <strong>Rol:</strong> {(session.user as { role?: string })?.role ?? "viewer"}
        </Typography>
      </Paper>
    </PageShell>
  );
}
