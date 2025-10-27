-- CreateEnum
CREATE TYPE "EquipmentType" AS ENUM ('SEM', 'TEM');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin', 'tecnico');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('active', 'disabled');

-- CreateEnum
CREATE TYPE "KeyAlgorithm" AS ENUM ('Ed25519');

-- CreateEnum
CREATE TYPE "KeyHandleStatus" AS ENUM ('active', 'revoked', 'expired');

-- CreateEnum
CREATE TYPE "ManifestVerdictSource" AS ENUM ('metadata');

-- CreateTable
CREATE TABLE "Institution" (
    "id" TEXT NOT NULL,
    "sigla" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Institution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lab" (
    "id" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lab_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Equipment" (
    "id" TEXT NOT NULL,
    "labId" TEXT NOT NULL,
    "type" "EquipmentType" NOT NULL,
    "inventoryCode" TEXT,
    "specs" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Equipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'active',
    "labId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLoginAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KeyHandle" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "algorithm" "KeyAlgorithm" NOT NULL DEFAULT 'Ed25519',
    "keyId" TEXT NOT NULL,
    "status" "KeyHandleStatus" NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "activatedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "KeyHandle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Record" (
    "id" VARCHAR(100) NOT NULL,
    "labId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "equipmentId" TEXT NOT NULL,
    "manifestHash" TEXT NOT NULL,
    "jwsSignature" TEXT NOT NULL,
    "logLeafHash" TEXT NOT NULL,
    "logIndex" INTEGER,
    "logRoot" TEXT NOT NULL,
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Record_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Manifest" (
    "id" TEXT NOT NULL,
    "recordId" TEXT NOT NULL,
    "imageSha256" TEXT NOT NULL,
    "metadata" JSONB NOT NULL,
    "verdict" BOOLEAN NOT NULL,
    "provenanceScore" INTEGER NOT NULL,
    "verdictSource" "ManifestVerdictSource" NOT NULL DEFAULT 'metadata',
    "timestamp" TIMESTAMP(3) NOT NULL,
    "schemaVersion" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Manifest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MerkleLeaf" (
    "id" TEXT NOT NULL,
    "recordId" TEXT NOT NULL,
    "leafHash" TEXT NOT NULL,
    "logIndex" INTEGER NOT NULL,
    "treeSize" BIGINT NOT NULL,
    "rootHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MerkleLeaf_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MerkleSTH" (
    "id" TEXT NOT NULL,
    "treeSize" BIGINT NOT NULL,
    "rootHash" TEXT NOT NULL,
    "signature" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MerkleSTH_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Revocation" (
    "id" TEXT NOT NULL,
    "recordId" TEXT NOT NULL,
    "reason" TEXT,
    "createdByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Revocation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Institution_sigla_key" ON "Institution"("sigla");

-- CreateIndex
CREATE UNIQUE INDEX "Institution_domain_key" ON "Institution"("domain");

-- CreateIndex
CREATE UNIQUE INDEX "Lab_institutionId_name_key" ON "Lab"("institutionId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "KeyHandle_status_idx" ON "KeyHandle"("status");

-- CreateIndex
CREATE UNIQUE INDEX "KeyHandle_userId_keyId_key" ON "KeyHandle"("userId", "keyId");

-- CreateIndex
CREATE INDEX "Record_labId_idx" ON "Record"("labId");

-- CreateIndex
CREATE INDEX "Record_userId_idx" ON "Record"("userId");

-- CreateIndex
CREATE INDEX "Record_equipmentId_idx" ON "Record"("equipmentId");

-- CreateIndex
CREATE UNIQUE INDEX "Record_logIndex_key" ON "Record"("logIndex");

-- CreateIndex
CREATE UNIQUE INDEX "Manifest_recordId_key" ON "Manifest"("recordId");

-- CreateIndex
CREATE UNIQUE INDEX "MerkleLeaf_recordId_key" ON "MerkleLeaf"("recordId");

-- CreateIndex
CREATE INDEX "MerkleLeaf_logIndex_idx" ON "MerkleLeaf"("logIndex");

-- CreateIndex
CREATE UNIQUE INDEX "MerkleSTH_treeSize_key" ON "MerkleSTH"("treeSize");

-- CreateIndex
CREATE UNIQUE INDEX "Revocation_recordId_key" ON "Revocation"("recordId");

-- AddForeignKey
ALTER TABLE "Lab" ADD CONSTRAINT "Lab_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Equipment" ADD CONSTRAINT "Equipment_labId_fkey" FOREIGN KEY ("labId") REFERENCES "Lab"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_labId_fkey" FOREIGN KEY ("labId") REFERENCES "Lab"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KeyHandle" ADD CONSTRAINT "KeyHandle_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Record" ADD CONSTRAINT "Record_labId_fkey" FOREIGN KEY ("labId") REFERENCES "Lab"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Record" ADD CONSTRAINT "Record_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Record" ADD CONSTRAINT "Record_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Manifest" ADD CONSTRAINT "Manifest_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "Record"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MerkleLeaf" ADD CONSTRAINT "MerkleLeaf_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "Record"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Revocation" ADD CONSTRAINT "Revocation_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "Record"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Revocation" ADD CONSTRAINT "Revocation_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

