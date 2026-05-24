import { PrismaClient } from './generated/prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool } from '@neondatabase/serverless';

let prismaClient: PrismaClient;
const connectionString = process.env.DATABASE_URL!;

if (connectionString && connectionString.includes('neon.tech')) {
  // Use Neon serverless adapter over WebSockets for cloud environments
  const pool = new Pool({ connectionString });
  const adapter = new PrismaNeon(pool);
  prismaClient = new PrismaClient({ adapter });
} else {
  // Use direct TCP client for local Docker PostgreSQL development
  prismaClient = new PrismaClient();
}

export const prisma = prismaClient;
export * from './generated/prisma/client';