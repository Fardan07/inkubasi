-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "plan" TEXT NOT NULL DEFAULT 'Free',
    "emailReminders" BOOLEAN NOT NULL DEFAULT true,
    "workspaceName" TEXT NOT NULL DEFAULT 'Personal workspace',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contract" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "nameId" TEXT,
    "company" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'Other',
    "typeId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Review',
    "statusId" TEXT,
    "date" TEXT NOT NULL,
    "dateId" TEXT,
    "color" TEXT NOT NULL DEFAULT 'blue',
    "summary" TEXT,
    "riskScore" INTEGER NOT NULL DEFAULT 80,
    "contractType" TEXT,
    "legalSummary" TEXT,
    "riskBreakdownJson" TEXT,
    "aiClausesJson" TEXT,
    "metaJson" TEXT,
    "userId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Contract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Clause" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "titleId" TEXT,
    "status" TEXT NOT NULL,
    "statusId" TEXT,
    "source" TEXT NOT NULL,
    "sourceId" TEXT,
    "text" TEXT NOT NULL,
    "textId" TEXT,
    "meaning" TEXT NOT NULL,
    "meaningEn" TEXT,
    "why" TEXT NOT NULL,
    "whyEn" TEXT,
    "original" TEXT NOT NULL,
    "contractId" INTEGER NOT NULL,

    CONSTRAINT "Clause_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImportantDate" (
    "id" SERIAL NOT NULL,
    "day" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleId" TEXT,
    "contractName" TEXT NOT NULL,
    "contractId" TEXT,
    "date" TEXT NOT NULL,
    "dateId" TEXT,
    "tag" TEXT NOT NULL,
    "tagId" TEXT,
    "kind" TEXT NOT NULL,
    "reminderEnabled" BOOLEAN NOT NULL DEFAULT true,
    "userId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ImportantDate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Clause" ADD CONSTRAINT "Clause_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImportantDate" ADD CONSTRAINT "ImportantDate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
