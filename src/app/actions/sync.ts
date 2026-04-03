'use server'

import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client"

/**
 * Server Actions for Database Sync
 * Export/Import all models as a single JSON object
 */

export async function exportDatabaseData() {
  try {
    const clients = await prisma.client.findMany({ include: { quotes: true } });
    const vehicles = await prisma.vehicle.findMany();
    const settings = await prisma.pricingSettings.findFirst();
    const subscriptions = await prisma.softwareSubscription.findMany();
    const servicePacks = await prisma.servicePack.findMany();
    const diagrams = await prisma.diagram.findMany();

    return {
      version: "1.0",
      timestamp: new Date().toISOString(),
      data: {
        clients,
        vehicles,
        settings,
        subscriptions,
        servicePacks,
        diagrams
      }
    };
  } catch (error) {
    console.error("Export Error:", error);
    throw new Error("Failed to export data");
  }
}

export async function importDatabaseData(json: any) {
  try {
    if (!json.data) throw new Error("Invalid format");

    const { clients, vehicles, settings, subscriptions, servicePacks, diagrams } = json.data;

    // Use a transaction to ensure atomic import
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Clear existing (optional, but requested for "Sync")
      // In a real app, we might want to merge, but for simple "Drive Restore", overwriting is common.
      await tx.quote.deleteMany();
      await tx.client.deleteMany();
      await tx.vehicle.deleteMany();
      if (settings) await tx.pricingSettings.deleteMany();
      await tx.softwareSubscription.deleteMany();
      await tx.servicePack.deleteMany();
      await tx.diagram.deleteMany();

      // Re-insert
      if (clients) {
        for (const client of clients) {
          const { quotes, ...clientData } = client;
          await tx.client.create({ data: clientData });
          if (quotes) {
            await tx.quote.createMany({ data: quotes });
          }
        }
      }
      if (vehicles) await tx.vehicle.createMany({ data: vehicles });
      if (settings) await tx.pricingSettings.create({ data: settings });
      if (subscriptions) await tx.softwareSubscription.createMany({ data: subscriptions });
      if (servicePacks) await tx.servicePack.createMany({ data: servicePacks });
      if (diagrams) await tx.diagram.createMany({ data: diagrams });
    });

    return { success: true };
  } catch (error) {
    console.error("Import Error:", error);
    throw new Error("Failed to import data");
  }
}
