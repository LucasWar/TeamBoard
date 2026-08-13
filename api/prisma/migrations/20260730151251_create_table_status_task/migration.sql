/*
  Warnings:

  - You are about to drop the column `status` on the `Task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "status",
ADD COLUMN     "status_id" UUID;

-- CreateTable
CREATE TABLE "StatusTask" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "project_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StatusTask_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StatusTask_name_key" ON "StatusTask"("name");

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "StatusTask"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StatusTask" ADD CONSTRAINT "StatusTask_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
