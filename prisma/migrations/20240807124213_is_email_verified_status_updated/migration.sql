-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isEmailVerified" BOOLEAN DEFAULT false,
ALTER COLUMN "status" SET DEFAULT true;
