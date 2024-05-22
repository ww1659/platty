import prisma from "./connection";

export async function getAllEvents() {
  return await prisma.event.findMany({
    include: {
      users: {
        include: {
          user: true,
        },
      },
    },
  });
}

export async function getEventById(eventId: string) {
  return await prisma.event.findUnique({
    where: {
      id: parseInt(eventId),
    },
    include: {
      users: {
        include: {
          user: true,
        },
      },
    },
  });
}
