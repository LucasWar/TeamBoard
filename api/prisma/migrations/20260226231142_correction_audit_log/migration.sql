-- DropForeignKey
ALTER TABLE "AuditLog" DROP CONSTRAINT "AuditLog_organization_id_fkey";

-- AlterTable
ALTER TABLE "AuditLog" ALTER COLUMN "organization_id" DROP NOT NULL,
ALTER COLUMN "entity_type" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
