import { useMemo } from 'react';
import type { Category, Transaction } from '../../../types';

export interface CategoryBudgetItem {
  category: Category;
  spent: number;
  percentOfTotal: number;
  budget: number;
  hasBudget: boolean;
  budgetPercent: number;
  remainingBudget: number;
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
    // 1. Lọc giao dịch chi tiêu trong tháng được chọn
    const monthExpenses = transactions.filter(
      (t) => t.date.startsWith(monthKey) && t.type === 'EXPENSE'
    );
    const totalMonthSpent = monthExpenses.reduce((sum, t) => sum + t.amount, 0);

    // 2. Tính số ngày còn lại trong tháng
    const [yearStr, monthStr] = monthKey.split('-');
    const year = parseInt(yearStr || '2026', 10);
    const month = parseInt(monthStr || '10', 10); // 1-12
    const totalDaysInMonth = new Date(year, month, 0).getDate();

    const today = new Date();
    const isCurrentMonth =
      today.getFullYear() === year && today.getMonth() + 1 === month;
    const currentDay = isCurrentMonth ? today.getDate() : 1;
    const daysRemaining = isCurrentMonth
      ? Math.max(1, totalDaysInMonth - currentDay + 1)
      : totalDaysInMonth;

    // 3. Gom chi tiêu theo categoryId
    const spentMap = new Map<string, number>();
    monthExpenses.forEach((t) => {
      const k = t.categoryId || 'unknown';
      spentMap.set(k, (spentMap.get(k) || 0) + t.amount);
    });

    // 4. Danh sách các danh mục có chi tiêu hoặc có đặt hạn mức
    const items: CategoryBudgetItem[] = [];

    // Duyệt qua tất cả categories đã khai báo
    categories
      .filter((c) => c.type === 'EXPENSE')
      .forEach((cat) => {
        const spent = spentMap.get(cat.id) || 0;
        const budget = cat.monthlyBudget || 0;
        const hasBudget = budget > 0;
        const budgetRatio = hasBudget ? spent / budget : 0;
        const budgetPercent = Math.round(budgetRatio * 100);
        const remainingBudget = Math.max(0, budget - spent);
        const safeDailySpend = hasBudget ? Math.round(remainingBudget / daysRemaining) : 0;

        // Chỉ đưa vào danh sách nếu có phát sinh chi tiêu hoặc có cài hạn mức
        if (spent > 0 || hasBudget) {
          items.push({
            category: cat,
            spent,
            percentOfTotal:
              totalMonthSpent > 0 ? Math.round((spent / totalMonthSpent) * 100) : 0,
            budget,
            hasBudget,
            budgetPercent,
            remainingBudget,
            isWarning80: hasBudget && budgetRatio >= 0.8 && budgetRatio < 1.0,
            isExceeded100: hasBudget && budgetRatio >= 1.0,
            safeDailySpend,
          });
        }
      });

    // Khoản chưa phân loại (nếu có)
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
        percentOfTotal:
          totalMonthSpent > 0 ? Math.round((unknownSpent / totalMonthSpent) * 100) : 0,
        budget: 0,
        hasBudget: false,
        budgetPercent: 0,
        remainingBudget: 0,
        isWarning80: false,
        isExceeded100: false,
        safeDailySpend: 0,
      });
    }

    // Sắp xếp: Ưu tiên các mục bị vượt hoặc cận hạn mức lên đầu, sau đó sắp theo số tiền đã chi
    items.sort((a, b) => {
      if (a.isExceeded100 !== b.isExceeded100) return a.isExceeded100 ? -1 : 1;
      if (a.isWarning80 !== b.isWarning80) return a.isWarning80 ? -1 : 1;
      return b.spent - a.spent;
    });

    const totalBudget = items.reduce((sum, item) => sum + item.budget, 0);
    const warningCount = items.filter((i) => i.isWarning80 || i.isExceeded100).length;

    return {
      items,
      totalMonthSpent,
      totalBudget,
      daysRemaining,
      warningCount,
    };
  }, [transactions, categories, monthKey]);
}
