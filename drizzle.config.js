import { config } from "dotenv";

config({ path: ".env.local" }); // Load .env.local

/** @type {import('drizzle-kit').Config} */

export default {
  dialect: "postgresql",
  schema: "./src/utils/schema.js",
  dbCredentials: {
    url: process.env.DRIZZLE_DB_URL,
  },
};