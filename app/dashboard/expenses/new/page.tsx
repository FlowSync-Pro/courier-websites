import Link from "next/link";
import { client } from "@/config/site";
import { ExpenseForm } from "@/components/expense-form";
import { dashboardLevel, EXPENSE_CATEGORIES } from "@/lib/catalog";
import { todayISO } from "@/lib/utils";

export default function NewExpensePage() {
  const level = dashboardLevel();
  return (
    <div className="grid gap-4">
      <div>
        <Link href="/dashboard/expenses" className="text-sm font-semibold text-accent-ink">
          Back to expenses
        </Link>
        <h1 className="font-display text-4xl font-bold">Log an expense</h1>
      </div>
      <div className="rounded-lg border border-line bg-white p-4">
        <ExpenseForm
          level={level}
          categories={EXPENSE_CATEGORIES.map(([id, label]) => ({ id, label }))}
          vehicles={client.vehicles.map((vehicle) => ({ id: vehicle.id, name: vehicle.name }))}
          defaultDate={todayISO(client.timezone)}
        />
      </div>
    </div>
  );
}
