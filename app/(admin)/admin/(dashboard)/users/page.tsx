import { db } from "@/lib/db";
import { PageShell } from "@/components/admin/ui/PageShell";
import { UsersTable } from "./UsersTable";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Link from "next/link";

export default async function UsersPage() {
  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  const serialized = users.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    isActive: u.isActive,
    lastLoginAt: u.lastLoginAt?.toISOString() ?? null,
    createdAt: u.createdAt.toISOString(),
  }));

  return (
    <PageShell
      title="Usuarios"
      subtitle="Gestión de usuarios del panel de administración"
      actions={
        <Button
          component={Link}
          href="/admin/users/new"
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          sx={{ textTransform: "none", fontWeight: 600 }}
        >
          Nuevo usuario
        </Button>
      }
    >
      <UsersTable users={serialized} />
    </PageShell>
  );
}
