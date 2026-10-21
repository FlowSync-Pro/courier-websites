export type MoneyGroup = { key: string; label: string; incomeCents: number };

export function allocateExpenses(incomes: number[], totalExpenses: number) {
  const totalIncome = incomes.reduce((sum, value) => sum + value, 0);
  if (totalIncome <= 0 || totalExpenses <= 0) return incomes.map(() => 0);
  const raw = incomes.map((income) => (totalExpenses * income) / totalIncome);
  const floors = raw.map((value) => Math.floor(value));
  let remainder = totalExpenses - floors.reduce((sum, value) => sum + value, 0);
  const order = raw
    .map((value, index) => ({ index, fraction: value - Math.floor(value) }))
    .sort((a, b) => b.fraction - a.fraction);
  for (const item of order) {
    if (remainder <= 0) break;
    floors[item.index] += 1;
    remainder -= 1;
  }
  return floors;
}

export function profitByGroup(groups: MoneyGroup[], totalExpenses: number) {
  const shares = allocateExpenses(
    groups.map((group) => group.incomeCents),
    totalExpenses,
  );
  return groups.map((group, index) => ({
    ...group,
    expenseCents: shares[index] ?? 0,
    profitCents: group.incomeCents - (shares[index] ?? 0),
  }));
}

export type VehicleBooks = {
  id: string;
  label: string;
  incomeCents: number;
  directExpenseCents: number;
  overheadCents: number;
  profitCents: number;
};

export function vehicleBooks(
  vehicles: { id: string; label: string }[],
  incomeByVehicle: Map<string, number>,
  expenseByVehicle: Map<string, number>,
) {
  const overhead = expenseByVehicle.get("") ?? 0;
  const incomes = vehicles.map((vehicle) => incomeByVehicle.get(vehicle.id) ?? 0);
  const overheadShares = allocateExpenses(incomes, overhead);
  return vehicles.map((vehicle, index) => {
    const incomeCents = incomes[index] ?? 0;
    const directExpenseCents = expenseByVehicle.get(vehicle.id) ?? 0;
    const overheadCents = overheadShares[index] ?? 0;
    return {
      id: vehicle.id,
      label: vehicle.label,
      incomeCents,
      directExpenseCents,
      overheadCents,
      profitCents: incomeCents - directExpenseCents - overheadCents,
    } satisfies VehicleBooks;
  });
}
