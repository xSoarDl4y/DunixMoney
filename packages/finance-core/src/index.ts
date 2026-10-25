export type TransactionType = "income" | "expense";

export type Transaction = {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  note?: string;
};

export function sumByType(items: Transaction[], type: TransactionType): number {
  return items.filter(x => x.type === type).reduce((sum, x) => sum + Math.round(x.amount), 0);
}

export function getSummary(items: Transaction[]) {
  const income = sumByType(items, "income");
  const expense = sumByType(items, "expense");
  return { income, expense, balance: income - expense, netCashflow: income - expense };
}

export function formatVND(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency", currency: "VND", maximumFractionDigits: 0
  }).format(amount);
}
