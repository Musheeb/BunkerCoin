/*
  Warnings:

  - The primary key for the `Admin` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the `PrivilegeMapping` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PrivilegeMapping" DROP CONSTRAINT "PrivilegeMapping_adminId_fkey";

-- DropIndex
DROP INDEX "Admin_uuid_key";

-- AlterTable
ALTER TABLE "Admin" DROP CONSTRAINT "Admin_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Admin_pkey" PRIMARY KEY ("uuid");

-- DropTable
DROP TABLE "PrivilegeMapping";

-- CreateTable
CREATE TABLE "PrivilegeMaster" (
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrivilegeMaster_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "AdminPrivilege" (
    "uuid" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "adminUuid" TEXT NOT NULL,
    "privilegeMasterUuid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminPrivilege_pkey" PRIMARY KEY ("uuid")
);

-- AddForeignKey
ALTER TABLE "AdminPrivilege" ADD CONSTRAINT "AdminPrivilege_adminUuid_fkey" FOREIGN KEY ("adminUuid") REFERENCES "Admin"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminPrivilege" ADD CONSTRAINT "AdminPrivilege_privilegeMasterUuid_fkey" FOREIGN KEY ("privilegeMasterUuid") REFERENCES "PrivilegeMaster"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
