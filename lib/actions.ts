"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { client } from "@/config/site";
import { dashboardLevel, EXPENSE_CATEGORIES, offeredServices } from "@/lib/catalog";
import {
  clearSession,
  dashboardCredentials,
  passwordsMatch,
  requireUser,
  startSession,
} from "@/lib/auth";
import { getDatabase } from "@/lib/db";
import { findClientByContact, getClient } from "@/lib/queries";
import { saveUpload } from "@/lib/uploads";
import { clip, digits, dollarsToCents } from "@/lib/utils";

export type FormState = {
  ok: boolean;
  message: string;
  errors: Record<string, string>;
};

function refreshBooks() {
  revalidatePath("/dashboard", "layout");
}

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = clip(formData.get("email"), 160).toLowerCase();
  const password = String(formData.get("password") ?? "");
  const expected = dashboardCredentials();
  const emailOk = passwordsMatch(email, expected.email.toLowerCase());
  const passwordOk = passwordsMatch(password, expected.password);
  if (!emailOk || !passwordOk) {
    return { ok: false, message: "That email or password does not match.", errors: {} };
  }
  await startSession();
  redirect("/dashboard");
}

export async function logout() {
  await clearSession();
  redirect("/login");
}

export async function submitQuote(_prev: FormState, formData: FormData): Promise<FormState> {
  const name = clip(formData.get("name"), 120);
  const businessName = clip(formData.get("businessName"), 160);
  const phone = clip(formData.get("phone"), 40);
  const email = clip(formData.get("email"), 160).toLowerCase();
  const pickup = clip(formData.get("pickup"), 240);
  const dropoff = clip(formData.get("dropoff"), 240);
  const description = clip(formData.get("description"), 500);
  const pieces = clip(formData.get("pieces"), 80);
  const weight = clip(formData.get("weight"), 80);
  const dateNeeded = clip(formData.get("dateNeeded"), 20);
  const notes = clip(formData.get("notes"), 1000);
  const errors: Record<string, string> = {};

  if (name.length < 2) errors.name = "Add your name.";
  if (digits(phone).length < 7) errors.phone = "Add a phone number.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Add a real email.";
  if (pickup.length < 4) errors.pickup = "Add the pickup address.";
  if (dropoff.length < 4) errors.dropoff = "Add the drop-off address.";
  if (description.length < 2) errors.description = "Say what is being delivered.";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateNeeded)) errors.dateNeeded = "Choose the date you need it.";
  if (Object.keys(errors).length) {
    return { ok: false, message: "Check the highlighted fields.", errors };
  }

  const photo = await saveUpload(formData.get("photo"));
  if (!photo.ok) return { ok: false, message: photo.error, errors: {} };

  const phoneKey = digits(phone);
  const now = new Date().toISOString();
  const siteId = client.id;
  const database = await getDatabase();
  const existing = await findClientByContact(phoneKey, email);
  const clientId = existing?.id ?? crypto.randomUUID();

  await database.transaction(async (tx) => {
    if (existing) {
      await tx.run(
        `UPDATE clients
         SET business_name = CASE WHEN business_name = '' THEN ? ELSE business_name END,
             name = CASE WHEN name = '' THEN ? ELSE name END
         WHERE id = ? AND site_id = ?`,
        [businessName, name, existing.id, siteId],
      );
    } else {
      await tx.run(
        `INSERT INTO clients
         (id, site_id, name, business_name, phone, email, phone_key, email_key, notes, source, recurring, schedule, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, '', 'quote', 0, '', ?)`,
        [clientId, siteId, name, businessName, phone, email, phoneKey, email, now],
      );
    }
    await tx.run(
      `INSERT INTO quotes
       (id, site_id, client_id, pickup, dropoff, description, pieces, weight, date_needed, photo_path, notes, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', ?)`,
      [
        crypto.randomUUID(),
        siteId,
        clientId,
        pickup,
        dropoff,
        description,
        pieces,
        weight,
        dateNeeded,
        photo.name,
        notes,
        now,
      ],
    );
  });

  refreshBooks();
  return {
    ok: true,
    message: `Request received. We'll call or text ${phone}.`,
    errors: {},
  };
}

export async function setQuoteStatus(formData: FormData) {
  await requireUser();
  const id = clip(formData.get("id"), 80);
  const status = clip(formData.get("status"), 20);
  if (!["new", "quoted", "won", "lost"].includes(status)) return;
  const database = await getDatabase();
  await database.run(`UPDATE quotes SET status = ? WHERE id = ? AND site_id = ?`, [status, id, client.id]);
  refreshBooks();
}

export async function addClient(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireUser();
  const name = clip(formData.get("name"), 120);
  const businessName = clip(formData.get("businessName"), 160);
  const phone = clip(formData.get("phone"), 40);
  const email = clip(formData.get("email"), 160).toLowerCase();
  const notes = clip(formData.get("notes"), 1000);
  const schedule = clip(formData.get("schedule"), 240);
  const recurring = formData.get("recurring") === "on" ? 1 : 0;
  if (name.length < 2) {
    return { ok: false, message: "Add the client's name.", errors: { name: "Add the client's name." } };
  }
  const now = new Date().toISOString();
  const database = await getDatabase();
  await database.run(
    `INSERT INTO clients
     (id, site_id, name, business_name, phone, email, phone_key, email_key, notes, source, recurring, schedule, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'manual', ?, ?, ?)`,
    [
      crypto.randomUUID(),
      client.id,
      name,
      businessName,
      phone,
      email,
      digits(phone),
      email,
      notes,
      dashboardLevel() === "B" ? recurring : 0,
      dashboardLevel() === "B" ? schedule : "",
      now,
    ],
  );
  refreshBooks();
  return { ok: true, message: `${name} is on the client list.`, errors: {} };
}

export async function setRecurring(formData: FormData) {
  await requireUser();
  if (dashboardLevel() !== "B") return;
  const id = clip(formData.get("id"), 80);
  const schedule = clip(formData.get("schedule"), 240);
  const recurring = formData.get("recurring") === "on" ? 1 : 0;
  const database = await getDatabase();
  await database.run(`UPDATE clients SET recurring = ?, schedule = ? WHERE id = ? AND site_id = ?`, [
    recurring,
    schedule,
    id,
    client.id,
  ]);
  refreshBooks();
}

function moneyError(label: string, raw: string) {
  const cents = dollarsToCents(raw);
  if (cents == null) return { cents: null, error: `${label} needs a dollar amount, like 180 or 46.20.` };
  return { cents, error: "" };
}

export async function createJob(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireUser();
  const level = dashboardLevel();
  const clientId = clip(formData.get("clientId"), 80);
  const serviceId = clip(formData.get("serviceId"), 40);
  const jobDate = clip(formData.get("jobDate"), 20);
  const pickup = clip(formData.get("pickup"), 240);
  const dropoff = clip(formData.get("dropoff"), 240);
  const amountRaw = clip(formData.get("amount"), 20);
  const milesRaw = clip(formData.get("miles"), 20);
  const notes = clip(formData.get("notes"), 1000);
  const errors: Record<string, string> = {};

  if (!(await getClient(clientId))) errors.clientId = "Choose a client.";
  if (!offeredServices().some((service) => service.id === serviceId)) errors.serviceId = "Choose a service.";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(jobDate)) errors.jobDate = "Choose the job date.";
  if (pickup.length < 2) errors.pickup = "Add the pickup.";
  if (dropoff.length < 2) errors.dropoff = "Add the drop-off.";
  const amount = moneyError("Amount charged", amountRaw);
  if (amount.error) errors.amount = amount.error;

  let miles: number | null = null;
  if (milesRaw) {
    if (!/^\d+(\.\d+)?$/.test(milesRaw)) errors.miles = "Miles should be a number.";
    else miles = Number(milesRaw);
  }

  let vehicleId = "";
  let driverName = "";
  let pallets = "";
  let pieces = "";
  let weight = "";
  let liftgate = 0;
  let waiting: number | null = null;
  let driverPay: number | null = null;
  let podName = "";

  if (level === "B") {
    vehicleId = clip(formData.get("vehicleId"), 80);
    if (vehicleId && !client.vehicles.some((vehicle) => vehicle.id === vehicleId)) {
      errors.vehicleId = "Choose a vehicle.";
    }
    if (!vehicleId) errors.vehicleId = "Choose the vehicle that ran this job.";
    driverName = clip(formData.get("driverName"), 120);
    pallets = clip(formData.get("pallets"), 40);
    pieces = clip(formData.get("pieces"), 40);
    weight = clip(formData.get("weight"), 40);
    liftgate = formData.get("liftgate") === "on" ? 1 : 0;
    const waitingRaw = clip(formData.get("waitingMinutes"), 10);
    if (waitingRaw) {
      if (!/^\d+$/.test(waitingRaw)) errors.waitingMinutes = "Waiting time should be whole minutes.";
      else waiting = Number(waitingRaw);
    }
    const driverPayRaw = clip(formData.get("driverPay"), 20);
    if (driverPayRaw) {
      const parsed = moneyError("Driver pay", driverPayRaw);
      if (parsed.error) errors.driverPay = parsed.error;
      else driverPay = parsed.cents;
    }
    const pod = await saveUpload(formData.get("pod"));
    if (!pod.ok) errors.pod = pod.error;
    else podName = pod.name;
  }

  if (Object.keys(errors).length || amount.cents == null) {
    return { ok: false, message: "Check the highlighted fields.", errors };
  }

  const amountCents = amount.cents;
  const now = new Date().toISOString();
  const siteId = client.id;
  const database = await getDatabase();
  await database.transaction(async (tx) => {
    if (driverName) {
      await tx.run(
        `INSERT INTO drivers (id, site_id, name, phone, created_at)
         VALUES (?, ?, ?, '', ?)
         ON CONFLICT (site_id, name) DO NOTHING`,
        [crypto.randomUUID(), siteId, driverName, now],
      );
    }
    await tx.run(
      `INSERT INTO jobs
       (id, site_id, client_id, service_id, vehicle_id, driver_name, job_date, pickup, dropoff, amount_cents, miles, paid,
        pallets, pieces, weight, liftgate, waiting_minutes, pod_photo_path, driver_pay_cents, driver_paid, notes,
        payment_url, invoice_status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, '', 'unbilled', ?)`,
      [
        crypto.randomUUID(),
        siteId,
        clientId,
        serviceId,
        vehicleId,
        driverName,
        jobDate,
        pickup,
        dropoff,
        amountCents,
        miles,
        formData.get("paid") === "on" ? 1 : 0,
        pallets,
        pieces,
        weight,
        liftgate,
        waiting,
        podName,
        driverPay,
        notes,
        now,
      ],
    );
  });

  refreshBooks();
  redirect("/dashboard/jobs?saved=1");
}

export async function setJobPaid(formData: FormData) {
  await requireUser();
  const id = clip(formData.get("id"), 80);
  const paid = formData.get("paid") === "1" ? 1 : 0;
  const database = await getDatabase();
  await database.run(`UPDATE jobs SET paid = ? WHERE id = ? AND site_id = ?`, [paid, id, client.id]);
  refreshBooks();
}

export async function setDriverPaid(formData: FormData) {
  await requireUser();
  if (dashboardLevel() !== "B") return;
  const id = clip(formData.get("id"), 80);
  const paid = formData.get("paid") === "1" ? 1 : 0;
  const database = await getDatabase();
  await database.run(`UPDATE jobs SET driver_paid = ? WHERE id = ? AND site_id = ?`, [paid, id, client.id]);
  refreshBooks();
}

export async function createExpense(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireUser();
  const category = clip(formData.get("category"), 40);
  const amountRaw = clip(formData.get("amount"), 20);
  const expenseDate = clip(formData.get("expenseDate"), 20);
  const notes = clip(formData.get("notes"), 500);
  const errors: Record<string, string> = {};
  if (!EXPENSE_CATEGORIES.some(([key]) => key === category)) errors.category = "Choose a category.";
  const amount = moneyError("Amount", amountRaw);
  if (amount.error) errors.amount = amount.error;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(expenseDate)) errors.expenseDate = "Choose the date.";

  let vehicleId = "";
  if (dashboardLevel() === "B") {
    vehicleId = clip(formData.get("vehicleId"), 80);
    if (vehicleId && !client.vehicles.some((vehicle) => vehicle.id === vehicleId)) {
      errors.vehicleId = "Choose a vehicle or overhead.";
    }
  }

  const receipt = await saveUpload(formData.get("receipt"));
  if (!receipt.ok) errors.receipt = receipt.error;

  if (Object.keys(errors).length || amount.cents == null || !receipt.ok) {
    return { ok: false, message: "Check the highlighted fields.", errors };
  }

  const database = await getDatabase();
  await database.run(
    `INSERT INTO expenses
     (id, site_id, category, amount_cents, expense_date, vehicle_id, receipt_path, notes, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      crypto.randomUUID(),
      client.id,
      category,
      amount.cents,
      expenseDate,
      vehicleId,
      receipt.name,
      notes,
      new Date().toISOString(),
    ],
  );
  refreshBooks();
  redirect("/dashboard/expenses?saved=1");
}

export async function addDriver(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireUser();
  if (dashboardLevel() !== "B") redirect("/dashboard");
  const name = clip(formData.get("name"), 120);
  const phone = clip(formData.get("phone"), 40);
  if (name.length < 2) {
    return { ok: false, message: "Add the driver's name.", errors: { name: "Add the driver's name." } };
  }
  const database = await getDatabase();
  await database.run(
    `INSERT INTO drivers (id, site_id, name, phone, created_at)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT (site_id, name) DO UPDATE SET phone = excluded.phone`,
    [crypto.randomUUID(), client.id, name, phone, new Date().toISOString()],
  );
  refreshBooks();
  return { ok: true, message: `${name} is on the driver list.`, errors: {} };
}
