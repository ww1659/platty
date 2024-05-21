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
