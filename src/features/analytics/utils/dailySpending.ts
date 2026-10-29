import type { Transaction } from '../../../types';

export interface DailySpend {
  day: number;
  label: string;
  total: number;
  byCategory: Record<string, number>;
}

interface BuildDailySpendingParams {
  expenses: Transaction[];
  monthKey: string; // 'YYYY-MM'
  totalDays: number;
}

const capitalize = (text: string): string => text.charAt(0).toUpperCase() + text.slice(1);

export function buildDailySpending({
  expenses,
  monthKey,
  totalDays,
}: BuildDailySpendingParams): DailySpend[] {
  const [year, month] = monthKey.split('-').map(Number);

  const days: DailySpend[] = Array.from({ length: totalDays }, (_, index) => ({
    day: index + 1,
    label: capitalize(
      new Date(year, month - 1, index + 1).toLocaleDateString('vi-VN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      })
    ),
    total: 0,
    byCategory: {},
  }));

  expenses.forEach((tx) => {
    const target = days[parseInt(tx.date.split('-')[2], 10) - 1];
    if (!target) return;
    const key = tx.categoryId || 'unknown';
    target.byCategory[key] = (target.byCategory[key] || 0) + tx.amount;
    target.total += tx.amount;
  });

  return days;
}

/** Làm tròn trục Y lên mốc dễ đọc (1, 2, 2.5, 5 × 10ⁿ) giống Swift Charts. */
export function getNiceMax(value: number): number {
  if (value <= 0) return 1;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  const step = [1, 2, 2.5, 5, 10].find((m) => m * magnitude >= value) ?? 10;
  return step * magnitude;
}

