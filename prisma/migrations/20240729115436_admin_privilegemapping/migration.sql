-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isSuper" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrivilegeMapping" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "privilegesId" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "adminId" INTEGER NOT NULL,

    CONSTRAINT "PrivilegeMapping_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_uuid_key" ON "Admin"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PrivilegeMapping_uuid_key" ON "PrivilegeMapping"("uuid");

-- AddForeignKey
ALTER TABLE "PrivilegeMapping" ADD CONSTRAINT "PrivilegeMapping_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
