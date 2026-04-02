-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "consumption" REAL NOT NULL,
    "fuelPriceTag" REAL NOT NULL,
    "wearCostPerKm" REAL NOT NULL,
    "age" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PricingSettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "hourlyRate" REAL NOT NULL DEFAULT 50.0,
    "travelHourlyRate" REAL NOT NULL DEFAULT 30.0,
    "hardshipThreshold" REAL NOT NULL DEFAULT 8.0,
    "hardshipSurcharge" REAL NOT NULL DEFAULT 1.2,
    "fuelPriceDefault" REAL NOT NULL DEFAULT 1.8,
    "complexityCoeffs" TEXT NOT NULL,
    "multiToolCoeffs" TEXT NOT NULL,
    "multiIACoeffs" TEXT NOT NULL,
    "riskCoeffs" TEXT NOT NULL,
    "accountCreationCost" REAL NOT NULL DEFAULT 50.0,
    "subscriptionSetupCost" REAL NOT NULL DEFAULT 30.0,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SoftwareSubscription" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "monthlyCost" REAL NOT NULL,
    "category" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ServicePack" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "hours" REAL NOT NULL,
    "price" REAL NOT NULL,
    "discount" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Quote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "totalAmount" REAL NOT NULL,
    "subtotalAmount" REAL NOT NULL,
    "adjustmentsAmount" REAL NOT NULL DEFAULT 0.0,
    "adjustmentNote" TEXT,
    "calculationDetail" TEXT,
    "clientId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Quote_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DeliveryEstimate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "quoteId" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "distance" REAL NOT NULL,
    "duration" REAL NOT NULL,
    "tripType" TEXT,
    "roadType" TEXT,
    "tolls" REAL NOT NULL DEFAULT 0.0,
    "vehicleId" TEXT,
    "fuelPrice" REAL,
    "animalCount" INTEGER NOT NULL DEFAULT 1,
    "animalType" TEXT,
    "constraints" TEXT,
    CONSTRAINT "DeliveryEstimate_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AutomationEstimate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "quoteId" TEXT NOT NULL,
    "baseHours" REAL NOT NULL,
    "complexity" REAL NOT NULL DEFAULT 1.0,
    "toolCount" INTEGER NOT NULL DEFAULT 1,
    "iaCount" INTEGER NOT NULL DEFAULT 0,
    "accountCount" INTEGER NOT NULL DEFAULT 0,
    "subscriptionCount" INTEGER NOT NULL DEFAULT 0,
    "isLocalInstall" BOOLEAN NOT NULL DEFAULT false,
    "isCloudInstall" BOOLEAN NOT NULL DEFAULT true,
    "hasDatabase" BOOLEAN NOT NULL DEFAULT false,
    "hasMaintenance" BOOLEAN NOT NULL DEFAULT false,
    "hasDocumentation" BOOLEAN NOT NULL DEFAULT false,
    "hasTraining" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "AutomationEstimate_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Diagram" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "sourceText" TEXT NOT NULL,
    "transcriptionText" TEXT,
    "interpretedLogic" TEXT,
    "mermaidCode" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "DeliveryEstimate_quoteId_key" ON "DeliveryEstimate"("quoteId");

-- CreateIndex
CREATE UNIQUE INDEX "AutomationEstimate_quoteId_key" ON "AutomationEstimate"("quoteId");
