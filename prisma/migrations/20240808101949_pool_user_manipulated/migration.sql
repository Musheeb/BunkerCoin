-- AlterTable
ALTER TABLE "AdminBunkerCoinPool" ALTER COLUMN "bunkercoin" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "AdminPrivilege" ALTER COLUMN "status" SET DEFAULT true;

-- AlterTable
ALTER TABLE "PrivilegeMaster" ALTER COLUMN "status" SET DEFAULT true;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lastLoginTimestamp" TIMESTAMP(3),
ADD COLUMN     "loginCount" INTEGER DEFAULT 0;
