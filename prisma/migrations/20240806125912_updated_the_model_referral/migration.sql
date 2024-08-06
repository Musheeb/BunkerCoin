-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "otp" INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "otp" INTEGER;

-- CreateTable
CREATE TABLE "Referral" (
    "uuid" UUID NOT NULL,
    "parentId" UUID,
    "userId" UUID NOT NULL,

    CONSTRAINT "Referral_pkey" PRIMARY KEY ("uuid")
);

-- AddForeignKey
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "User"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;
