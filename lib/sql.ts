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

export function databaseUrl() {
  return (process.env.DATABASE_URL || process.env.POSTGRES_URL || "").trim();
}

export function blobToken() {
  return (process.env.BLOB_READ_WRITE_TOKEN || "").trim();
}
