/*
  Warnings:

  - A unique constraint covering the columns `[user_id,organizationId]` on the table `notifications` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "due_date" SET DATA TYPE DATE;

-- CreateIndex
CREATE UNIQUE INDEX "notifications_user_id_organizationId_key" ON "notifications"("user_id", "organizationId");
