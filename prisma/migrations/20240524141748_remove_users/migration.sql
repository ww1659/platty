/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `events_on_users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "events_on_users" DROP CONSTRAINT "events_on_users_eventId_fkey";

-- DropForeignKey
ALTER TABLE "events_on_users" DROP CONSTRAINT "events_on_users_userId_fkey";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "events_on_users";

-- CreateTable
CREATE TABLE "EventUser" (
    "event_id" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventUser_pkey" PRIMARY KEY ("event_id","user_id")
);

-- AddForeignKey
ALTER TABLE "EventUser" ADD CONSTRAINT "EventUser_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
