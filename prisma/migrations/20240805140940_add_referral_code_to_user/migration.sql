/*
  Warnings:

  - Added the required column `referralCode` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
-- Add the new columns with default values where necessary
ALTER TABLE "User" 
ADD COLUMN "bcWallet" BIGINT,
ADD COLUMN "comissionWallet" DOUBLE PRECISION,
ADD COLUMN "referralCode" TEXT DEFAULT 'default_value', -- Add default value
ADD COLUMN "referredBy" TEXT,
ADD COLUMN "token" JSONB DEFAULT '[]';

-- Update existing rows with a default value for the new column
UPDATE "User" SET "referralCode" = 'default_value';

-- If needed, you can later alter the column to make it non-nullable
-- ALTER TABLE "User" ALTER COLUMN "referralCode" SET NOT NULL;