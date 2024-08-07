-- CreateEnum
CREATE TYPE "BunkerMarketDevStatus" AS ENUM ('CURRENT', 'SOLD', 'UNSOLD');

-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "id" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "AdminPrivilege" ADD COLUMN     "id" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "PrivilegeMaster" ADD COLUMN     "id" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "Referral" ADD COLUMN     "id" SERIAL NOT NULL;

-- CreateTable
CREATE TABLE "AdminBunkerCoinPool" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "adminId" TEXT NOT NULL,
    "bunkercoin" INTEGER NOT NULL,
    "totalBunkercoin" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminBunkerCoinPool_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Configuration" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Configuration_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "BunkerMarketDev" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "coinsToBeSold" BIGINT NOT NULL,
    "coinsSold" BIGINT NOT NULL,
    "coinsUnsold" BIGINT NOT NULL,
    "rate" DECIMAL(65,30) NOT NULL,
    "fundsToBeRaised" BIGINT NOT NULL,
    "fundsRaised" BIGINT NOT NULL,
    "fundsRemained" BIGINT NOT NULL,
    "status" "BunkerMarketDevStatus" NOT NULL DEFAULT 'UNSOLD',

    CONSTRAINT "BunkerMarketDev_pkey" PRIMARY KEY ("uuid")
);

-- AddForeignKey
ALTER TABLE "AdminBunkerCoinPool" ADD CONSTRAINT "AdminBunkerCoinPool_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
