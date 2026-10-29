import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { CategoryBudgetItem } from '../hooks/useCategoryBudgets';

interface CategoryDonutChartProps {
  items: CategoryBudgetItem[];
  totalSpent: number;
  monthLabel?: string;
}

const formatNum = (val: number) =>
  new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(val);

export const CategoryDonutChart: React.FC<CategoryDonutChartProps> = ({
  items,
  totalSpent,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const activeItems = items.filter((i) => i.spent > 0);
  const selectedItem = items.find((i) => i.category.id === selectedId) || null;

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="flex flex-col w-full gap-4 pointer-events-auto"
    >
      {/* Tổng tiền & Thanh tỷ lệ màu */}
      <div className="w-full px-1">
        <div className="text-center mb-4">
          <span className="text-[36px] font-black text-white tabular-nums tracking-tight block leading-none">
            {formatNum(selectedItem ? selectedItem.spent : totalSpent)}₫
          </span>
        </div>

        {activeItems.length > 0 && (
          <div className="w-full h-3 rounded-full bg-[#18181D] flex items-center gap-1 p-0.5 overflow-hidden">
            {activeItems.map((item) => {
              const isHighlighted = selectedId === null || selectedId === item.category.id;
              return (
                <button
                  key={item.category.id}
                  type="button"
                  onClick={() =>
                    setSelectedId(selectedId === item.category.id ? null : item.category.id)
                  }
                  style={{
                    width: `${Math.max(6, item.percentOfTotal)}%`,
                    backgroundColor: item.category.color,
                    opacity: isHighlighted ? 1 : 0.25,
                  }}
                  className="h-full rounded-full transition-all duration-300 cursor-pointer"
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Danh sách danh mục tối giản: chỉ Tên + Số tiền / Hạn mức + Thanh tiến độ */}
      <div className="w-full space-y-2 max-h-[50vh] overflow-y-auto no-scrollbar">
        {items.map((item) => {
          const isSelected = selectedId === item.category.id;
          const fillPercent = item.hasBudget
            ? Math.min(100, item.budgetPercent)
            : Math.min(100, item.percentOfTotal);
          const barColor = item.isExceeded100 ? '#FF453A' : item.category.color;

          return (
            <motion.button
              key={item.category.id}
              type="button"
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedId(isSelected ? null : item.category.id)}
              className={`w-full p-3.5 rounded-[20px] bg-[#18181D] border text-left transition-colors ${
                isSelected ? 'border-white/25 bg-[#202027]' : 'border-white/[0.06]'
              }`}
            >
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.category.color }}
                  />
                  <span className="text-[14px] font-semibold text-white truncate">
                    {item.category.name}
                  </span>
                </div>

                <div className="flex items-baseline gap-1 text-[14px] tabular-nums flex-shrink-0">
                  <span
                    className={`font-bold ${
                      item.isExceeded100 ? 'text-[#FF453A]' : 'text-white'
                    }`}
                  >
                    {formatNum(item.spent)}
                  </span>
                  {item.hasBudget ? (
                    <span className="text-[12px] text-[#8E8E93]">
                      / {formatNum(item.budget)}₫
                    </span>
                  ) : (
                    <span className="text-[12px] text-[#8E8E93]">₫</span>
                  )}
                </div>
              </div>

              <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${fillPercent}%`,
                    backgroundColor: barColor,
                  }}
                />
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
