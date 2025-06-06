import { config } from 'dotenv';
import { defineConfig } from "drizzle-kit";

config({ path: '.env' });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not defined');
}

export default defineConfig({
  schema: "./src/db/Schema/**/*.{ts,js}",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
