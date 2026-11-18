import { neon, NeonQueryFunction } from "@neondatabase/serverless";

let sqlClient: NeonQueryFunction<false, false> | null = null;

export function getConnectionString(): string {
  return (
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL_NON_POOLING ||
    ""
  );
}

export function getDb() {
  const connectionString = getConnectionString();
  if (!connectionString) {
    throw new Error(
      "Database connection string not found. Please set POSTGRES_URL or DATABASE_URL."
    );
  }

  if (!sqlClient) {
    sqlClient = neon(connectionString);
  }
  return sqlClient;
}
