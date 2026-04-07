'use server'

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createDeliveryQuote(data: {
  clientId: string;
  title: string;
  total: number;
  subtotal: number;
  breakdown: any;
  origin: string;
  destination: string;
  distance: number;
  duration: number;
  tolls: number;
  animalCount: number;
  fuelPrice: number;
}) {
  console.log("Creating Delivery Quote for client:", data.clientId);
  try {
    const quote = await prisma.quote.create({
      data: {
        title: data.title || `Livraison ${data.origin} → ${data.destination}`,
        type: "DELIVERY",
        status: "DRAFT",
        totalAmount: data.total,
        subtotalAmount: data.subtotal,
        calculationDetail: JSON.stringify(data.breakdown),
        clientId: data.clientId,
        deliveryEstimate: {
          create: {
            origin: data.origin,
            destination: data.destination,
            distance: data.distance,
            duration: data.duration,
            tolls: data.tolls,
            animalCount: data.animalCount,
            fuelPrice: data.fuelPrice,
          }
        }
      }
    });

    console.log("Success! Created Delivery Quote ID:", quote.id);
    revalidatePath("/dashboard");
    return { success: true, id: quote.id };
  } catch (error) {
    console.error("CRITICAL error in createDeliveryQuote:", error);
    return { success: false, error: `Erreur technique : ${error instanceof Error ? error.message : "Inconnue"}` };
  }
}

export async function createAutomationQuote(data: {
  clientId: string;
  title: string;
  total: number;
  subtotal: number;
  breakdown: any;
  baseHours: number;
  complexity: number;
  toolCount: number;
  iaCount: number;
  accountsCreated: number;
  hasDatabase: boolean;
  hasMaintenance: boolean;
}) {
  console.log("Creating Automation Quote for client:", data.clientId);
  try {
    const quote = await prisma.quote.create({
      data: {
        title: data.title || `Automatisation - ${data.clientId}`,
        type: "AUTOMATION",
        status: "DRAFT",
        totalAmount: data.total,
        subtotalAmount: data.subtotal,
        calculationDetail: JSON.stringify(data.breakdown),
        clientId: data.clientId,
        automationEstimate: {
          create: {
            baseHours: data.baseHours,
            complexity: data.complexity,
            toolCount: data.toolCount,
            iaCount: data.iaCount,
            accountCount: data.accountsCreated,
            hasDatabase: data.hasDatabase,
            hasMaintenance: data.hasMaintenance,
          }
        }
      }
    });

    console.log("Success! Created Automation Quote ID:", quote.id);
    revalidatePath("/dashboard");
    return { success: true, id: quote.id };
  } catch (error) {
    console.error("CRITICAL error in createAutomationQuote:", error);
    return { success: false, error: `Erreur technique : ${error instanceof Error ? error.message : "Inconnue"}` };
  }
}
