import { PrismaClient } from "@prisma/client";
import events from "./dev-data/events.json";
import eventUsers from "./dev-data/events_users.json";

const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRaw`TRUNCATE TABLE "Event" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "EventUser" RESTART IDENTITY CASCADE`;

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
        price: event.price,
        tagline: event.tagline,
      } as any,
    });
  }

  // Seed eventOnUsers
  for (const eventOnUser of eventUsers) {
    await prisma.eventUser.create({
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
