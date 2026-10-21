import { client } from "@/config/site";
import { serviceName, vehicleName } from "@/lib/catalog";
import type { ExpenseRow, JobRow } from "@/lib/db";
import { profitByGroup, vehicleBooks, type MoneyGroup } from "@/lib/money";
import { expensesInMonth, jobsInMonth, listClients } from "@/lib/queries";

function sumJobs(jobs: JobRow[]) {
  return jobs.reduce((total, job) => total + job.amount_cents, 0);
}

function sumExpenses(expenses: ExpenseRow[]) {
  return expenses.reduce((total, expense) => total + expense.amount_cents, 0);
}

function groupsFromJobs(jobs: JobRow[], keyOf: (job: JobRow) => string, labelOf: (job: JobRow) => string) {
  const map = new Map<string, MoneyGroup>();
  for (const job of jobs) {
    const key = keyOf(job);
    const current = map.get(key) ?? { key, label: labelOf(job), incomeCents: 0 };
    current.incomeCents += job.amount_cents;
    map.set(key, current);
  }
  return [...map.values()].sort((a, b) => b.incomeCents - a.incomeCents);
}

export async function monthBooks(month: string) {
  const jobs = await jobsInMonth(month);
  const expenses = await expensesInMonth(month);
  const incomeCents = sumJobs(jobs);
  const expenseCents = sumExpenses(expenses);
  const byClient = profitByGroup(
    groupsFromJobs(jobs, (job) => job.client_id, (job) => job.client_name || "Client"),
    expenseCents,
  );
  const byService = profitByGroup(
    groupsFromJobs(jobs, (job) => job.service_id || "unspecified", (job) => serviceName(job.service_id)),
    expenseCents,
  );
  const incomeByVehicle = new Map<string, number>();
  const expenseByVehicle = new Map<string, number>();
  for (const job of jobs) {
    const key = job.vehicle_id || "";
    incomeByVehicle.set(key, (incomeByVehicle.get(key) ?? 0) + job.amount_cents);
  }
  for (const expense of expenses) {
    const key = expense.vehicle_id || "";
    expenseByVehicle.set(key, (expenseByVehicle.get(key) ?? 0) + expense.amount_cents);
  }
  const vehicles = [
    ...client.vehicles.map((vehicle) => ({ id: vehicle.id, label: vehicle.name })),
    ...[...incomeByVehicle.keys(), ...expenseByVehicle.keys()]
      .filter((id) => id && !client.vehicles.some((vehicle) => vehicle.id === id))
      .map((id) => ({ id, label: vehicleName(id) })),
  ];
  return {
    jobs,
    expenses,
    incomeCents,
    expenseCents,
    profitCents: incomeCents - expenseCents,
    byClient,
    byService,
    byVehicle: vehicleBooks(vehicles, incomeByVehicle, expenseByVehicle),
    overheadCents: expenseByVehicle.get("") ?? 0,
    recurring: (await listClients()).filter((item) => item.recurring),
  };
}
