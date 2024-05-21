/*
  Warnings:

  - You are about to drop the column `externalUserId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[external_user_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `external_user_id` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "external_user_id";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "externalUserId",
ADD COLUMN     "external_user_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_external_user_id_key" ON "User"("external_user_id");
