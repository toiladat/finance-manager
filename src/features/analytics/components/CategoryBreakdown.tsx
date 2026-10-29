import React, { useState } from 'react';
import type { CategoryBudgetItem } from '../hooks/useCategoryBudgets';
import type { DailySpend } from '../utils/dailySpending';
import { formatAmount } from '../utils/budgetFormat';
import { DailySpendingChart } from './DailySpendingChart';
import { CategorySpendRow } from './CategorySpendRow';

interface CategoryBreakdownProps {
  items: CategoryBudgetItem[];
  dailySpending: DailySpend[];
  totalSpent: number;
  monthLabel: string;
}

export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({
  items,
  dailySpending,
  totalSpent,
  monthLabel,
}) => {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const day = selectedDay ? dailySpending[selectedDay - 1] : undefined;
  const caption = day ? day.label : `Tổng chi ${monthLabel.toLowerCase()}`;
  const headline = day ? day.total : totalSpent;

  const rows = items.map((item) => ({
    item,
    amount: day ? day.byCategory[item.category.id] ?? 0 : item.spent,
  }));
  const visibleRows = day
    ? rows.filter((row) => row.amount > 0).sort((a, b) => b.amount - a.amount)
    : rows;

  const toggleDay = (value: number) =>
    setSelectedDay((prev) => (prev === value ? null : value));

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="flex flex-col w-full h-full gap-4 pointer-events-auto text-left"
    >
      <div className="px-1">
        <span className="block text-[13px] font-medium text-[#8E8E93]">{caption}</span>
        <span className="block text-[40px] font-bold text-white tabular-nums tracking-tight leading-tight">
          {formatAmount(headline)}₫
        </span>
      </div>

      <DailySpendingChart
        days={dailySpending}
        items={items}
        selectedDay={selectedDay}
        onSelectDay={toggleDay}
      />

      {visibleRows.length > 0 && (
        <div className="min-h-0 overflow-y-auto no-scrollbar rounded-[20px] bg-[#18181D] border border-white/[0.07]">
          {visibleRows.map(({ item, amount }, index) => (
            <React.Fragment key={item.category.id}>
              {index > 0 && <div className="ml-[66px] h-px bg-white/[0.07]" />}
              <CategorySpendRow item={item} amount={amount} showBudget={!day} />
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};
