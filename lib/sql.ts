export type SqlValue = string | number | null;
export type SqlParams = SqlValue[];
export type SqlRow = Record<string, string | number | null>;

export type Executor = {
  all(sql: string, params?: SqlParams): Promise<SqlRow[]>;
  get(sql: string, params?: SqlParams): Promise<SqlRow | null>;
  run(sql: string, params?: SqlParams): Promise<void>;
};

export type Database = Executor & {
  transaction<T>(fn: (tx: Executor) => Promise<T>): Promise<T>;
};

const NUMERIC = new Set([
  "amount_cents",
  "miles",
  "paid",
  "liftgate",
  "waiting_minutes",
  "driver_pay_cents",
  "driver_paid",
  "recurring",
]);

export function normalizeRow(value: unknown): SqlRow {
  const source = value as Record<string, unknown>;
  const row: SqlRow = {};
  for (const [key, raw] of Object.entries(source)) {
    if (raw == null) {
      row[key] = null;
      continue;
    }
    if (typeof raw === "number") {
      row[key] = raw;
      continue;
    }
    if (typeof raw === "bigint") {
      row[key] = Number(raw);
      continue;
    }
    if (typeof raw === "boolean") {
      row[key] = raw ? 1 : 0;
      continue;
    }
    if (raw instanceof Date) {
      row[key] = raw.toISOString();
      continue;
    }
    const text = String(raw);
    if (NUMERIC.has(key) && text !== "" && Number.isFinite(Number(text))) {
      row[key] = Number(text);
      continue;
    }
    row[key] = text;
  }
  return row;
}

const primaryDatabaseUrls = ["DATABASE_URL", "POSTGRES_URL"] as const;
const storageDatabaseUrls = ["STORAGE_DATABASE_URL", "STORAGE_POSTGRES_URL"] as const;

function readEnv(name: string) {
  return process.env[name]?.trim() ?? "";
}

function isPooledDatabaseUrl(url: string) {
  return url.includes("-pooler.") || /(?:\?|&)pgbouncer=true(?:&|$)/.test(url);
}

function firstDatabaseUrl(names: readonly string[]) {
  const values = names.map(readEnv).filter((value) => value.length > 0);
  return values.find(isPooledDatabaseUrl) ?? values[0] ?? "";
}

export function databaseUrl() {
  // Neon on Vercel injects pooled strings as DATABASE_URL and POSTGRES_URL,
  // often prefixed with STORAGE_. Unpooled names are not read.
  return firstDatabaseUrl(primaryDatabaseUrls) || firstDatabaseUrl(storageDatabaseUrls);
}

export function blobToken() {
  return (process.env.BLOB_READ_WRITE_TOKEN || "").trim();
}
