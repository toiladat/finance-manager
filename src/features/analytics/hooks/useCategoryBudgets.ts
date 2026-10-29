import { useMemo } from 'react';
import type { Category, Transaction } from '../../../types';
import { buildDailySpending } from '../utils/dailySpending';

export interface CategoryBudgetItem {
  category: Category;
  spent: number;
  txCount: number;
  photos: string[];
  percentOfTotal: number;
  budget: number;
  hasBudget: boolean;
  budgetPercent: number;
  remainingBudget: number;
  overBudgetAmount: number;
  isWarning80: boolean;
  isExceeded100: boolean;
  safeDailySpend: number;
}

interface UseCategoryBudgetsProps {
  transactions: Transaction[];
  categories: Category[];
  monthKey: string; // 'YYYY-MM'
}

export function useCategoryBudgets({
  transactions,
  categories,
  monthKey,
}: UseCategoryBudgetsProps) {
  return useMemo(() => {
    const monthExpenses = transactions.filter(
      (t) => t.date.startsWith(monthKey) && t.type === 'EXPENSE'
    );
    const totalMonthSpent = monthExpenses.reduce((sum, t) => sum + t.amount, 0);

    const [yearStr, monthStr] = monthKey.split('-');
    const year = parseInt(yearStr || '2026', 10);
    const month = parseInt(monthStr || '10', 10);
    const totalDaysInMonth = new Date(year, month, 0).getDate();

    const today = new Date();
    const isCurrentMonth =
      today.getFullYear() === year && today.getMonth() + 1 === month;
    const currentDay = isCurrentMonth ? today.getDate() : 1;
    const daysRemaining = isCurrentMonth
      ? Math.max(1, totalDaysInMonth - currentDay + 1)
      : totalDaysInMonth;

    const spentMap = new Map<string, number>();
    const countMap = new Map<string, number>();
    const photosMap = new Map<string, string[]>();

    monthExpenses.forEach((t) => {
      const k = t.categoryId || 'unknown';
      spentMap.set(k, (spentMap.get(k) || 0) + t.amount);
      countMap.set(k, (countMap.get(k) || 0) + 1);
      if (t.photoUrl) {
        const list = photosMap.get(k) || [];
        if (list.length < 3) list.push(t.photoUrl);
        photosMap.set(k, list);
      }
    });

    const items: CategoryBudgetItem[] = [];

    categories
      .filter((c) => c.type === 'EXPENSE')
      .forEach((cat) => {
        const spent = spentMap.get(cat.id) || 0;
        const txCount = countMap.get(cat.id) || 0;
        const photos = photosMap.get(cat.id) || [];
        const budget = cat.monthlyBudget || 0;
        const hasBudget = budget > 0;
        const budgetRatio = hasBudget ? spent / budget : 0;
        const budgetPercent = Math.round(budgetRatio * 100);
        const remainingBudget = Math.max(0, budget - spent);
        const overBudgetAmount = hasBudget ? Math.max(0, spent - budget) : 0;
        const safeDailySpend = hasBudget ? Math.round(remainingBudget / daysRemaining) : 0;

        if (spent > 0 || hasBudget) {
          items.push({
            category: cat,
            spent,
            txCount,
            photos,
            percentOfTotal:
              totalMonthSpent > 0 ? Math.round((spent / totalMonthSpent) * 100) : 0,
            budget,
            hasBudget,
            budgetPercent,
            remainingBudget,
            overBudgetAmount,
            isWarning80: hasBudget && budgetRatio >= 0.8 && budgetRatio < 1.0,
            isExceeded100: hasBudget && budgetRatio >= 1.0,
            safeDailySpend,
          });
        }
      });

    const unknownSpent = spentMap.get('unknown') || 0;
    if (unknownSpent > 0) {
      items.push({
        category: {
          id: 'unknown',
          name: 'Chưa phân loại',
          type: 'EXPENSE',
          color: '#8E8E93',
          icon: 'Tag',
        },
        spent: unknownSpent,
        txCount: countMap.get('unknown') || 0,
        photos: photosMap.get('unknown') || [],
        percentOfTotal:
          totalMonthSpent > 0 ? Math.round((unknownSpent / totalMonthSpent) * 100) : 0,
        budget: 0,
        hasBudget: false,
        budgetPercent: 0,
        remainingBudget: 0,
        overBudgetAmount: 0,
        isWarning80: false,
        isExceeded100: false,
        safeDailySpend: 0,
      });
    }

    items.sort((a, b) => b.spent - a.spent);

    const totalBudget = items.reduce((sum, item) => sum + item.budget, 0);
    const warningCount = items.filter((i) => i.isWarning80 || i.isExceeded100).length;
    const dailySpending = buildDailySpending({
      expenses: monthExpenses,
      monthKey,
      totalDays: totalDaysInMonth,
    });

    return {
      items,
      totalMonthSpent,
      totalBudget,
      daysRemaining,
      warningCount,
      dailySpending,
    };
  }, [transactions, categories, monthKey]);
}
