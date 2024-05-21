import { PrismaClient } from "@prisma/client";
import users from "./db-data/users.json";

const prisma = new PrismaClient();

async function main() {
  // Seed users
  for (const user of users) {
    await prisma.user.create({
      data: {
        externalUserId: user.external_user_id,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
        name: user.name,
        username: user.username,
        email: user.email,
      } as any,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
