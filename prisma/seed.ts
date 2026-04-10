import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await hash("Admin123$", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@entorno.agency" },
    update: {},
    create: {
      email: "admin@entorno.agency",
      password,
      name: "Admin eNtorno",
      role: "admin",
      isActive: true,
    },
  });

  console.log("Seeded admin user:", admin.email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
