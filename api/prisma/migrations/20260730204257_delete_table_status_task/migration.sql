/*
  Warnings:

  - You are about to drop the column `status_id` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the `StatusTask` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "StatusTask" DROP CONSTRAINT "StatusTask_project_id_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_status_id_fkey";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "status_id";

-- DropTable
DROP TABLE "StatusTask";
