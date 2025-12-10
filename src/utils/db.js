// src/utils/db.js
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

// These logs should appear ONLY in the terminal (server), never in browser
console.log("NODE_ENV (server):", process.env.NODE_ENV);
console.log(
  "DRIZZLE_DB_URL on server present?",
  !!process.env.DRIZZLE_DB_URL
);

if (!process.env.DRIZZLE_DB_URL) {
  throw new Error(
    "Database URL not found. Make sure DRIZZLE_DB_URL is set in .env.local"
  );
}

const sql = neon(process.env.DRIZZLE_DB_URL);
export const db = drizzle(sql, { schema });
