import { PrismaClient } from "@prisma/client";
import users from "./db-data/users.json";
import events from "./db-data/events.json";
import eventOnUsers from "./db-data/events_users.json";

const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Event" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "events_on_users" RESTART IDENTITY CASCADE`;

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

  // Seed events
  for (const event of events) {
    await prisma.event.create({
      data: {
        title: event.title,
        description: event.description,
        location: event.location,
        startTime: event.start_time,
        endTime: event.end_time,
        createdAt: event.created_at,
        updatedAt: event.updated_at,
        imageUrl: event.image_url,
      } as any,
    });
  }

  // Seed eventOnUsers
  for (const eventOnUser of eventOnUsers) {
    await prisma.eventOnUser.create({
      data: {
        userId: eventOnUser.userId,
        eventId: eventOnUser.eventId,
        assignedAt: eventOnUser.assigned_at,
      },
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
