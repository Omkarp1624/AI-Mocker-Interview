/** @type {import('drizzle-kit').Config} */

export default({
  dialect: "postgresql",
  schema: "./src/utils/schema.js",
  dbCredentials: {
      url : process.env.NEXT_PUBLIC_DRIZZLE_DB_URL
  }
});
