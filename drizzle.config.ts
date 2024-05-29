import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';
dotenv.config();

export default {
  schema: './schema/schema.ts',
  driver: 'pg',
  out: './schema/migration',
  dbCredentials: {
    connectionString: process.env.DB_URL!,
  },
} satisfies Config;
