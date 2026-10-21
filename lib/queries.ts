import { client } from "@/config/site";
import { getDatabase, type ClientRow, type DriverRow, type ExpenseRow, type JobRow, type QuoteRow } from "@/lib/db";

function as<T>(value: Record<string, string | number | null> | null): T | null {
  return value as T | null;
}

function list<T>(value: Array<Record<string, string | number | null>>): T[] {
  return value as T[];
}

export async function listClients() {
  const db = await getDatabase();
  return list<ClientRow>(
    await db.all(`SELECT * FROM clients WHERE site_id = ? ORDER BY created_at DESC`, [client.id]),
  );
}

export async function getClient(id: string) {
  const db = await getDatabase();
  return as<ClientRow>(await db.get(`SELECT * FROM clients WHERE id = ? AND site_id = ?`, [id, client.id]));
}

export async function findClientByContact(phoneKey: string, emailKey: string) {
  const db = await getDatabase();
  if (phoneKey) {
    const byPhone = as<ClientRow>(
      await db.get(`SELECT * FROM clients WHERE phone_key = ? AND site_id = ?`, [phoneKey, client.id]),
    );
    if (byPhone) return byPhone;
  }
  if (emailKey) {
    return as<ClientRow>(
      await db.get(`SELECT * FROM clients WHERE email_key = ? AND site_id = ?`, [emailKey, client.id]),
    );
  }
  return null;
}

export async function listQuotes() {
  const db = await getDatabase();
  return list<QuoteRow>(
    await db.all(
      `SELECT quotes.*, clients.name AS client_name, clients.business_name, clients.phone, clients.email
       FROM quotes
       JOIN clients ON clients.id = quotes.client_id AND clients.site_id = quotes.site_id
       WHERE quotes.site_id = ?
       ORDER BY quotes.created_at DESC`,
      [client.id],
    ),
  );
}

export async function listJobs() {
  const db = await getDatabase();
  return list<JobRow>(
    await db.all(
      `SELECT jobs.*, clients.name AS client_name
       FROM jobs
       JOIN clients ON clients.id = jobs.client_id AND clients.site_id = jobs.site_id
       WHERE jobs.site_id = ?
       ORDER BY jobs.job_date DESC, jobs.created_at DESC`,
      [client.id],
    ),
  );
}

export async function listExpenses() {
  const db = await getDatabase();
  return list<ExpenseRow>(
    await db.all(
      `SELECT * FROM expenses WHERE site_id = ? ORDER BY expense_date DESC, created_at DESC`,
      [client.id],
    ),
  );
}

export async function listDrivers() {
  const db = await getDatabase();
  return list<DriverRow>(
    await db.all(`SELECT * FROM drivers WHERE site_id = ? ORDER BY lower(name)`, [client.id]),
  );
}

export async function jobsInMonth(month: string) {
  const jobs = await listJobs();
  return jobs.filter((job) => job.job_date.startsWith(month));
}

export async function expensesInMonth(month: string) {
  const expenses = await listExpenses();
  return expenses.filter((expense) => expense.expense_date.startsWith(month));
}
