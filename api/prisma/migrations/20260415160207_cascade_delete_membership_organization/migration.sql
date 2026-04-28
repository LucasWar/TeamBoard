-- DropForeignKey
ALTER TABLE "membership" DROP CONSTRAINT "membership_organization_id_fkey";

-- AddForeignKey
ALTER TABLE "membership" ADD CONSTRAINT "membership_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
