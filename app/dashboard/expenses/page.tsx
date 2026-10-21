import Link from "next/link";
import { categoryLabel, dashboardLevel, vehicleName } from "@/lib/catalog";
import { listExpenses } from "@/lib/queries";
import { buttonVariants } from "@/components/ui/button";
import { formatDay, formatMoney } from "@/lib/utils";

export default async function ExpensesPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const params = await searchParams;
  const level = dashboardLevel();
  const expenses = await listExpenses();
  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-4xl font-bold">Expenses</h1>
        <Link href="/dashboard/expenses/new" className={buttonVariants()}>
          Log an expense
        </Link>
      </div>
      {params.saved ? (
        <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-900">Expense saved.</p>
      ) : null}
      {expenses.length === 0 ? (
        <p className="rounded-lg border border-line bg-white p-4 text-muted">
          No expenses yet. Fuel, maintenance, insurance, tolls, parking, phone, and supplies go here.
        </p>
      ) : (
        <ul className="grid gap-3">
          {expenses.map((expense) => (
            <li key={expense.id} className="flex gap-3 rounded-lg border border-line bg-white p-4">
              {expense.receipt_path ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`/media/${expense.receipt_path}`}
                  alt="Receipt"
                  className="h-16 w-16 shrink-0 rounded-md object-cover"
                />
              ) : null}
              <div className="min-w-0 flex-1">
                <p className="font-semibold">
                  {categoryLabel(expense.category)} · {formatMoney(expense.amount_cents)}
                </p>
                <p className="text-sm text-muted">
                  {formatDay(expense.expense_date)}
                  {level === "B" ? ` · ${expense.vehicle_id ? vehicleName(expense.vehicle_id) : "Overhead"}` : ""}
                </p>
                {expense.notes ? <p className="text-sm">{expense.notes}</p> : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
