import { prepareDatabase } from "@/lib/db";
import { databaseUrl } from "@/lib/sql";

async function main() {
  const url = databaseUrl();
  if (!url) {
    console.log("No DATABASE_URL or POSTGRES_URL set. Preparing the local SQLite file for the active client.");
  }
  await prepareDatabase();
  console.log(url ? "Postgres tables are ready. Summit Line demo rows are present if that site was empty." : "SQLite is ready.");
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
