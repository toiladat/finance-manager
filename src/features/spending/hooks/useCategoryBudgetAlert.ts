import { useMemo, useEffect, useRef } from 'react';
import type { Category, Transaction } from '../../../types';

export type BudgetAlertStatus = 'NONE' | 'NORMAL' | 'WARNING_80' | 'EXCEEDED_100';

interface UseCategoryBudgetAlertProps {
  categoryId: string | null;
  rawAmount: string;
  transactions: Transaction[];
  categories: Category[];
}

export interface BudgetAlertInfo {
  status: BudgetAlertStatus;
  categoryName: string;
  categoryColor: string;
  budget: number;
  currentSpent: number;
  projectedTotal: number;
  percent: number;
  overAmount: number;
  remainingAmount: number;
}

export function useCategoryBudgetAlert({
  categoryId,
  rawAmount,
  transactions,
  categories,
}: UseCategoryBudgetAlertProps): BudgetAlertInfo {
  const prevStatusRef = useRef<BudgetAlertStatus>('NONE');

  const alertInfo = useMemo<BudgetAlertInfo>(() => {
    if (!categoryId) {
      return {
        status: 'NONE',
        categoryName: '',
        categoryColor: '#0A84FF',
        budget: 0,
        currentSpent: 0,
        projectedTotal: 0,
        percent: 0,
        overAmount: 0,
        remainingAmount: 0,
      };
    }

    const category = categories.find((c) => c.id === categoryId);
    if (!category || !category.monthlyBudget || category.monthlyBudget <= 0) {
      return {
        status: 'NONE',
        categoryName: category?.name || '',
        categoryColor: category?.color || '#0A84FF',
        budget: 0,
        currentSpent: 0,
        projectedTotal: 0,
        percent: 0,
        overAmount: 0,
        remainingAmount: 0,
      };
    }

    const currentMonthKey = new Date().toISOString().slice(0, 7); // 'YYYY-MM'
    const currentSpent = transactions
      .filter((t) => t.date.startsWith(currentMonthKey) && t.categoryId === categoryId && t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0);

    const enteredAmount = parseInt(rawAmount.replace(/\D/g, '') || '0', 10);
    const projectedTotal = currentSpent + enteredAmount;
    const budget = category.monthlyBudget;
    const ratio = projectedTotal / budget;
    const percent = Math.round(ratio * 100);

    let status: BudgetAlertStatus = 'NORMAL';
    if (ratio >= 1.0) {
      status = 'EXCEEDED_100';
    } else if (ratio >= 0.8) {
      status = 'WARNING_80';
    }

    return {
      status,
      categoryName: category.name,
      categoryColor: category.color,
      budget,
      currentSpent,
      projectedTotal,
      percent,
      overAmount: Math.max(0, projectedTotal - budget),
      remainingAmount: Math.max(0, budget - projectedTotal),
    };
  }, [categoryId, rawAmount, transactions, categories]);

  // Haptic feedback khi chuyển trạng thái sang WARNING_80 hoặc EXCEEDED_100
  useEffect(() => {
    if (alertInfo.status !== prevStatusRef.current) {
      if (alertInfo.status === 'EXCEEDED_100') {
        navigator.vibrate?.([20, 40, 20]);
      } else if (alertInfo.status === 'WARNING_80') {
        navigator.vibrate?.([15]);
      }
      prevStatusRef.current = alertInfo.status;
    }
  }, [alertInfo.status]);

  return alertInfo;
}
