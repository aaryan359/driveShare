import { PrismaClient } from './generated/prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool } from '@neondatabase/serverless';

let prismaClient: PrismaClient;
const connectionString = process.env.DATABASE_URL!;

if (connectionString && connectionString.includes('neon.tech')) {
  // Use Neon serverless adapter over WebSockets for cloud environments
  const pool = new Pool({ connectionString });
  const adapter = new PrismaNeon(pool as any);
  prismaClient = new PrismaClient({ adapter } as any);
} else {
  // Use direct TCP client for local Docker PostgreSQL development
  prismaClient = new PrismaClient({} as any);
}

export const prisma = prismaClient;
export * from './generated/prisma/client';