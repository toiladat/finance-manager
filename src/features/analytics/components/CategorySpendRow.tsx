import React from 'react';
import type { CategoryBudgetItem } from '../hooks/useCategoryBudgets';
import { formatAmount, getBudgetTone } from '../utils/budgetFormat';

interface CategorySpendRowProps {
  item: CategoryBudgetItem;
  amount: number;
  showBudget: boolean;
}

export const CategorySpendRow: React.FC<CategorySpendRowProps> = ({
  item,
  amount,
  showBudget,
}) => {
  const { category, photos, budget, hasBudget, budgetPercent } = item;
  const withBudget = showBudget && hasBudget;

  return (
    <div className="flex items-center gap-3 px-3.5 py-3">
      <div className="relative w-10 h-10 flex-shrink-0">
        {photos[0] ? (
          <img
            src={photos[0]}
            alt=""
            className="w-10 h-10 rounded-[12px] object-cover border border-white/15"
          />
        ) : (
          <div className="w-10 h-10 rounded-[12px]" style={{ backgroundColor: category.color }} />
        )}
        <span
          className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[#18181D]"
          style={{ backgroundColor: category.color }}
        />
      </div>

      <div className="flex-1 min-w-0">
        <span className="block text-[17px] text-white truncate">{category.name}</span>
        {withBudget && (
          <div className="w-full h-1 rounded-full bg-white/[0.08] overflow-hidden mt-2">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, budgetPercent)}%`,
                backgroundColor: getBudgetTone(item, category.color),
              }}
            />
          </div>
        )}
      </div>

      <div className="text-right flex-shrink-0 tabular-nums">
        <span
          className="block text-[17px] font-semibold"
          style={{ color: withBudget && item.isExceeded100 ? '#FF453A' : '#FFFFFF' }}
        >
          {formatAmount(amount)}
        </span>
        {withBudget && (
          <span className="block text-[13px] text-[#8E8E93]">/ {formatAmount(budget)}</span>
        )}
      </div>
    </div>
  );
};

