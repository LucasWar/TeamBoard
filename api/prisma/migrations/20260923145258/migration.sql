/*
  Warnings:

  - You are about to drop the column `replaced_by_token_id` on the `RefreshToken` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[token_hash]` on the table `RefreshToken` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "RefreshToken" DROP CONSTRAINT "RefreshToken_replaced_by_token_id_fkey";

-- AlterTable
ALTER TABLE "RefreshToken" DROP COLUMN "replaced_by_token_id",
ADD COLUMN     "last_used_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "revoked_reason" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_token_hash_key" ON "RefreshToken"("token_hash");
