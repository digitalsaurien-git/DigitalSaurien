import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'

dotenv.config()

/**
 * DigitalSaurien - Database Client
 * Standard SQLite Initialization
 */

import path from 'path';

const prismaClientSingleton = () => {
  let dbUrl = process.env.DATABASE_URL;
  if (dbUrl && dbUrl.startsWith('file:./')) {
    const dbPath = path.join(process.cwd(), dbUrl.replace('file:./', '')).replace(/\\/g, '/');
    dbUrl = `file:${dbPath}`;
  } else if (!dbUrl) {
    const dbPath = path.join(process.cwd(), 'dev.db').replace(/\\/g, '/');
    dbUrl = `file:${dbPath}`;
  }

  return new PrismaClient({
    datasources: {
      db: {
        url: dbUrl
      }
    },
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
