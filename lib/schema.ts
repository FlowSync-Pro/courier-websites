import { client as summit } from "@/config/clients/summit-line";
import type { Executor } from "@/lib/sql";
import { todayISO } from "@/lib/utils";

const DEMO_CUSTOMER = "11111111-1111-4111-8111-111111111111";
const DEMO_QUOTE = "22222222-2222-4222-8222-222222222222";
const DEMO_DRIVER = "55555555-5555-4555-8555-555555555555";
const DEMO_JOB = "33333333-3333-4333-8333-333333333333";
const DEMO_EXPENSE = "44444444-4444-4444-8444-444444444444";

export const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS clients (
    id TEXT PRIMARY KEY,
    site_id TEXT NOT NULL DEFAULT '',
    name TEXT NOT NULL,
    business_name TEXT NOT NULL DEFAULT '',
    phone TEXT NOT NULL DEFAULT '',
    email TEXT NOT NULL DEFAULT '',
    phone_key TEXT NOT NULL DEFAULT '',
    email_key TEXT NOT NULL DEFAULT '',
    notes TEXT NOT NULL DEFAULT '',
    source TEXT NOT NULL,
    recurring INTEGER NOT NULL DEFAULT 0,
    schedule TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS quotes (
    id TEXT PRIMARY KEY,
    site_id TEXT NOT NULL DEFAULT '',
    client_id TEXT NOT NULL,
    pickup TEXT NOT NULL,
    dropoff TEXT NOT NULL,
    description TEXT NOT NULL,
    pieces TEXT NOT NULL DEFAULT '',
    weight TEXT NOT NULL DEFAULT '',
    date_needed TEXT NOT NULL DEFAULT '',
    photo_path TEXT NOT NULL DEFAULT '',
    notes TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'new',
    created_at TEXT NOT NULL,
    FOREIGN KEY (client_id) REFERENCES clients(id)
  )`,
  `CREATE TABLE IF NOT EXISTS jobs (
    id TEXT PRIMARY KEY,
    site_id TEXT NOT NULL DEFAULT '',
    client_id TEXT NOT NULL,
    service_id TEXT NOT NULL DEFAULT '',
    vehicle_id TEXT NOT NULL DEFAULT '',
    driver_name TEXT NOT NULL DEFAULT '',
    job_date TEXT NOT NULL,
    pickup TEXT NOT NULL,
    dropoff TEXT NOT NULL,
    amount_cents INTEGER NOT NULL,
    miles REAL,
    paid INTEGER NOT NULL DEFAULT 0,
    pallets TEXT NOT NULL DEFAULT '',
    pieces TEXT NOT NULL DEFAULT '',
    weight TEXT NOT NULL DEFAULT '',
    liftgate INTEGER NOT NULL DEFAULT 0,
    waiting_minutes INTEGER,
    pod_photo_path TEXT NOT NULL DEFAULT '',
    driver_pay_cents INTEGER,
    driver_paid INTEGER NOT NULL DEFAULT 0,
    notes TEXT NOT NULL DEFAULT '',
    payment_url TEXT NOT NULL DEFAULT '',
    invoice_status TEXT NOT NULL DEFAULT 'unbilled',
    created_at TEXT NOT NULL,
    FOREIGN KEY (client_id) REFERENCES clients(id)
  )`,
  `CREATE TABLE IF NOT EXISTS expenses (
    id TEXT PRIMARY KEY,
    site_id TEXT NOT NULL DEFAULT '',
    category TEXT NOT NULL,
    amount_cents INTEGER NOT NULL,
    expense_date TEXT NOT NULL,
    vehicle_id TEXT NOT NULL DEFAULT '',
    receipt_path TEXT NOT NULL DEFAULT '',
    notes TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS drivers (
    id TEXT PRIMARY KEY,
    site_id TEXT NOT NULL DEFAULT '',
    name TEXT NOT NULL,
    phone TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS invoices (
    id TEXT PRIMARY KEY,
    site_id TEXT NOT NULL DEFAULT '',
    client_id TEXT,
    job_id TEXT,
    amount_cents INTEGER,
    status TEXT,
    payment_url TEXT,
    issued_on TEXT,
    created_at TEXT
  )`,
];

const INDEXES = [
  `CREATE INDEX IF NOT EXISTS idx_clients_site ON clients(site_id)`,
  `CREATE INDEX IF NOT EXISTS idx_quotes_site ON quotes(site_id, client_id)`,
  `CREATE INDEX IF NOT EXISTS idx_jobs_site_date ON jobs(site_id, job_date)`,
  `CREATE INDEX IF NOT EXISTS idx_expenses_site_date ON expenses(site_id, expense_date)`,
  `CREATE UNIQUE INDEX IF NOT EXISTS drivers_site_name ON drivers(site_id, name)`,
];

const TENANT_TABLES = ["clients", "quotes", "jobs", "expenses", "drivers", "invoices"] as const;

export async function applySchema(db: Executor) {
  for (const statement of SCHEMA) {
    await db.run(statement);
  }
}

export async function createIndexes(db: Executor) {
  for (const statement of INDEXES) {
    await db.run(statement);
  }
}

export async function backfillSqliteSite(db: Executor, siteId: string) {
  for (const table of TENANT_TABLES) {
    const columns = await db.all(`PRAGMA table_info(${table})`);
    if (!columns.some((column) => column.name === "site_id")) {
      await db.run(`ALTER TABLE ${table} ADD COLUMN site_id TEXT NOT NULL DEFAULT ''`);
    }
    await db.run(`UPDATE ${table} SET site_id = ? WHERE site_id = ''`, [siteId]);
  }
}

/** Summit Line sample books, inserted once when that site has no customers yet. */
export async function seedSummitDemo(db: Executor) {
  const existing = await db.get(`SELECT id FROM clients WHERE site_id = ? LIMIT 1`, [summit.id]);
  if (existing) return;
  const now = new Date().toISOString();
  const day = todayISO(summit.timezone);
  await db.run(
    `INSERT INTO clients
     (id, site_id, name, business_name, phone, email, phone_key, email_key, notes, source, recurring, schedule, created_at)
     VALUES (?, ?, 'Riley Chen', 'Chen Supply', '(555) 014-2290', 'riley@chensupply.demo', '15550142290', 'riley@chensupply.demo', '', 'quote', 0, '', ?)`,
    [DEMO_CUSTOMER, summit.id, now],
  );
  await db.run(
    `INSERT INTO quotes
     (id, site_id, client_id, pickup, dropoff, description, pieces, weight, date_needed, photo_path, notes, status, created_at)
     VALUES (?, ?, ?, '1200 E Vernon Ave, Los Angeles', '400 S Milliken Ave, Ontario', 'Four pallets of tile', '4', '1800 lb', ?, '', 'Sample quote so a fresh database is not empty.', 'new', ?)`,
    [DEMO_QUOTE, summit.id, DEMO_CUSTOMER, day, now],
  );
  await db.run(
    `INSERT INTO drivers (id, site_id, name, phone, created_at)
     VALUES (?, ?, 'Luis Ortega', '', ?)
     ON CONFLICT (site_id, name) DO NOTHING`,
    [DEMO_DRIVER, summit.id, now],
  );
  await db.run(
    `INSERT INTO jobs
     (id, site_id, client_id, service_id, vehicle_id, driver_name, job_date, pickup, dropoff, amount_cents, miles, paid,
      pallets, pieces, weight, liftgate, waiting_minutes, pod_photo_path, driver_pay_cents, driver_paid, notes,
      payment_url, invoice_status, created_at)
     VALUES (?, ?, ?, 'pallets', 'box-26', 'Luis Ortega', ?, '1200 E Vernon Ave, Los Angeles', '400 S Milliken Ave, Ontario',
      24000, 42, 0, '4', '4', '1800 lb', 1, 25, '', 8000, 0, 'Sample load.', '', 'unbilled', ?)`,
    [DEMO_JOB, summit.id, DEMO_CUSTOMER, day, now],
  );
  await db.run(
    `INSERT INTO expenses
     (id, site_id, category, amount_cents, expense_date, vehicle_id, receipt_path, notes, created_at)
     VALUES (?, ?, 'fuel', 4620, ?, 'box-26', '', 'Sample fuel stop.', ?)`,
    [DEMO_EXPENSE, summit.id, day, now],
  );
}
