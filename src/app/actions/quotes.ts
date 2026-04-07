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

    revalidatePath("/dashboard");
    return { success: true, id: quote.id };
  } catch (error) {
    console.error("Failed to create delivery quote:", error);
    return { success: false, error: "Erreur lors de la sauvegarde du devis." };
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

    revalidatePath("/dashboard");
    return { success: true, id: quote.id };
  } catch (error) {
    console.error("Failed to create automation quote:", error);
    return { success: false, error: "Erreur lors de la sauvegarde du devis." };
  }
}
