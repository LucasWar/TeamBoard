/*
  Warnings:

  - A unique constraint covering the columns `[name,project_id]` on the table `StatusTask` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "StatusTask_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "StatusTask_name_project_id_key" ON "StatusTask"("name", "project_id");
