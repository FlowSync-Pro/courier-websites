import fs from "fs";
import path from "path";
import { client } from "@/config/site";
import { applySchema, backfillSqliteSite, createIndexes, seedSummitDemo } from "@/lib/schema";
import { databaseUrl, normalizeRow, type Database, type Executor, type SqlParams } from "@/lib/sql";

export type { SqlRow } from "@/lib/sql";

type SqliteStatement = {
  all(...params: Array<string | number | null>): unknown[];
  get(...params: Array<string | number | null>): unknown;
  run(...params: Array<string | number | null>): unknown;
};

type SqliteDatabase = {
  exec(sql: string): void;
  prepare(sql: string): SqliteStatement;
};

type Holder = {
  postgres?: Promise<Database>;
  sqlite: Map<string, Promise<Database>>;
};

const globalForDb = globalThis as unknown as { courierHolder?: Holder };

function holder() {
  if (!globalForDb.courierHolder) globalForDb.courierHolder = { sqlite: new Map() };
  return globalForDb.courierHolder;
}

function sqliteExecutor(raw: SqliteDatabase): Executor {
  return {
    async all(sql, params = []) {
      return raw.prepare(sql).all(...params).map(normalizeRow);
    },
    async get(sql, params = []) {
      const value = raw.prepare(sql).get(...params);
      return value ? normalizeRow(value) : null;
    },
    async run(sql, params = []) {
      raw.prepare(sql).run(...params);
    },
  };
}

function lockSqlite(raw: SqliteDatabase, direct: Executor): Database {
  let tail = Promise.resolve();
  const lock = <T>(fn: () => Promise<T>) => {
    const next = tail.then(fn, fn);
    tail = next.then(
      () => undefined,
      () => undefined,
    );
    return next;
  };
  return {
    all: (sql, params) => lock(() => direct.all(sql, params)),
    get: (sql, params) => lock(() => direct.get(sql, params)),
    run: (sql, params) => lock(() => direct.run(sql, params)),
    transaction: (fn) =>
      lock(async () => {
        raw.exec("BEGIN IMMEDIATE");
        try {
          const value = await fn(direct);
          raw.exec("COMMIT");
          return value;
        } catch (error) {
          raw.exec("ROLLBACK");
          throw error;
        }
      }),
  };
}

async function openSqlite(siteId: string): Promise<Database> {
  const { DatabaseSync } = await import("node:sqlite");
  const dir = path.join(process.cwd(), "data");
  fs.mkdirSync(dir, { recursive: true });
  const safeId = siteId.replace(/[^a-z0-9-]/gi, "") || "client";
  const raw = new DatabaseSync(path.join(dir, `${safeId}.db`)) as unknown as SqliteDatabase;
  raw.exec("PRAGMA journal_mode = WAL;");
  raw.exec("PRAGMA foreign_keys = ON;");
  const direct = sqliteExecutor(raw);
  await applySchema(direct);
  await backfillSqliteSite(direct, siteId);
  await createIndexes(direct);
  await direct.run("BEGIN IMMEDIATE");
  try {
    await seedSummitDemo(direct);
    raw.exec("COMMIT");
  } catch (error) {
    raw.exec("ROLLBACK");
    throw error;
  }
  return lockSqlite(raw, direct);
}

function toPostgres(sql: string) {
  let index = 0;
  return sql.replace(/\?/g, () => `$${++index}`);
}

type PostgresQuery = {
  unsafe(query: string, params: SqlParams): Promise<Array<Record<string, unknown>>>;
  begin<T>(fn: (tx: PostgresQuery) => Promise<T>): Promise<T>;
};

function postgresExecutor(sql: PostgresQuery): Executor {
  return {
    async all(query, params = []) {
      const rows = await sql.unsafe(toPostgres(query), params);
      return rows.map(normalizeRow);
    },
    async get(query, params = []) {
      const rows = await this.all(query, params);
      return rows[0] ?? null;
    },
    async run(query, params = []) {
      await sql.unsafe(toPostgres(query), params);
    },
  };
}

async function openPostgres(url: string): Promise<Database> {
  const postgres = (await import("postgres")).default;
  const sql = postgres(url, {
    max: 1,
    idle_timeout: 20,
    connect_timeout: 15,
    prepare: false,
  }) as unknown as PostgresQuery;
  const direct = postgresExecutor(sql);
  await applySchema(direct);
  await createIndexes(direct);
  const database: Database = {
    ...direct,
    transaction: (fn) => sql.begin((tx) => fn(postgresExecutor(tx))),
  };
  await database.transaction((tx) => seedSummitDemo(tx));
  return database;
}

async function connect(): Promise<Database> {
  const url = databaseUrl();
  const store = holder();
  if (url) {
    if (!store.postgres) {
      store.postgres = openPostgres(url).catch((error: unknown) => {
        store.postgres = undefined;
        throw error;
      });
    }
    return store.postgres;
  }
  const siteId = client.id;
  let pending = store.sqlite.get(siteId);
  if (!pending) {
    pending = openSqlite(siteId).catch((error: unknown) => {
      store.sqlite.delete(siteId);
      throw error;
    });
    store.sqlite.set(siteId, pending);
  }
  return pending;
}

async function syncDrivers(db: Database) {
  const now = new Date().toISOString();
  for (const driver of client.drivers) {
    const name = driver.name.trim();
    if (!name) continue;
    await db.run(
      `INSERT INTO drivers (id, site_id, name, phone, created_at)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT (site_id, name) DO NOTHING`,
      [crypto.randomUUID(), client.id, name, driver.phone?.trim() || "", now],
    );
  }
}

export async function getDatabase() {
  const db = await connect();
  await syncDrivers(db);
  return db;
}

export async function prepareDatabase() {
  await getDatabase();
}

export type ClientRow = {
  id: string;
  name: string;
  business_name: string;
  phone: string;
  email: string;
  phone_key: string;
  email_key: string;
  notes: string;
  source: string;
  recurring: number;
  schedule: string;
  created_at: string;
};

export type QuoteRow = {
  id: string;
  client_id: string;
  pickup: string;
  dropoff: string;
  description: string;
  pieces: string;
  weight: string;
  date_needed: string;
  photo_path: string;
  notes: string;
  status: string;
  created_at: string;
  client_name?: string;
  business_name?: string;
  phone?: string;
  email?: string;
};

export type JobRow = {
  id: string;
  client_id: string;
  service_id: string;
  vehicle_id: string;
  driver_name: string;
  job_date: string;
  pickup: string;
  dropoff: string;
  amount_cents: number;
  miles: number | null;
  paid: number;
  pallets: string;
  pieces: string;
  weight: string;
  liftgate: number;
  waiting_minutes: number | null;
  pod_photo_path: string;
  driver_pay_cents: number | null;
  driver_paid: number;
  notes: string;
  payment_url: string;
  invoice_status: string;
  created_at: string;
  client_name?: string;
};

export type ExpenseRow = {
  id: string;
  category: string;
  amount_cents: number;
  expense_date: string;
  vehicle_id: string;
  receipt_path: string;
  notes: string;
  created_at: string;
};

export type DriverRow = {
  id: string;
  name: string;
  phone: string;
  created_at: string;
};
