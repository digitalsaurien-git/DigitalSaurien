import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pkg from "pg";
const { Pool } = pkg;

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const createPrismaClient = () => {
  // STRICT MOCK MODE for Visual Review
  console.log("Initializing Prisma MOCK Client");
  
  const mockData: any = {
    client: {
      findMany: async () => [
        { id: '1', name: 'Jean Dupont', email: 'jean@dupont.com', phone: '0612345678' },
        { id: '2', name: 'Marie Leroy', email: 'marie@leroy.fr', phone: '0144556677' },
        { id: '3', name: 'Sarl Reptile-Exo', email: 'contact@reptile-exo.com', phone: '0490123456' }
      ],
      findFirst: async () => null,
      count: async () => 3,
    },
    quote: {
      findMany: async () => [
        { id: '101', clientId: '1', type: 'LIVRAISON', amount: 450.50, status: 'PAID', date: new Date() },
        { id: '102', clientId: '2', type: 'AUTOMATION', amount: 1250, status: 'PENDING', date: new Date() }
      ],
      findFirst: async () => null,
      count: async () => 2,
    },
    pricingSettings: {
      findFirst: async () => ({
        basePrice: 50,
        kmRate: 1.2,
        expressFee: 30,
        standardServiceLimit: 200,
      }),
    },
    diagram: {
      findMany: async () => [],
    }
  };

  return new Proxy({} as any, {
    get: (target, prop: string) => {
      if (mockData[prop]) return mockData[prop];
      return new Proxy({}, {
        get: () => async () => null
      });
    }
  });
};

// FORCE override to clear potentially cached broken instance
export const prisma = createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
