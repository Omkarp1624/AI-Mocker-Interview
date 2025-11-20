// import { drizzle } from "drizzle-orm/neon-http";
// import { neon } from "@neondatabase/serverless";
// import { config } from "dotenv";
// import * as schema from "./schema";
// config({ path: ".env.local" });

// const sql = neon(process.env.DRIZZLE_DB_URL);
// export const db = drizzle({ client: sql, schema });

import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

// Check if database URL exists (only on server)
if (!process.env.DRIZZLE_DB_URL) {
  throw new Error(
    'Database URL not found. Make sure DRIZZLE_DB_URL is set in .env.local'
  );
}

const sql = neon(process.env.DRIZZLE_DB_URL);
export const db = drizzle({ client: sql, schema });

