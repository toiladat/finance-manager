import React, { useState } from 'react';
import type { CategoryBudgetItem } from '../hooks/useCategoryBudgets';

interface CategoryDonutChartProps {
  items: CategoryBudgetItem[];
  totalSpent: number;
}

export const CategoryDonutChart: React.FC<CategoryDonutChartProps> = ({ items, totalSpent }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const activeItems = items.filter((i) => i.spent > 0);
  const selectedItem = activeItems.find((i) => i.category.id === selectedId) || null;

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(val);

  // SVG Donut metrics
  const radius = 68;
  const strokeWidth = 18;
  const circumference = 2 * Math.PI * radius;

  // Tính stroke-dasharray và stroke-dashoffset cho từng phân khúc
  let accumulatedPercent = 0;
  const segments = activeItems.map((item) => {
    const itemRatio = totalSpent > 0 ? item.spent / totalSpent : 0;
    const strokeDasharray = `${itemRatio * circumference} ${circumference}`;
    const strokeDashoffset = -(accumulatedPercent * circumference);
    accumulatedPercent += itemRatio;

    return {
      id: item.category.id,
      name: item.category.name,
      color: item.category.color,
      spent: item.spent,
      percent: item.percentOfTotal,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  return (
    <div className="flex flex-col items-center w-full">
      {/* Vòng tròn Donut Ring SVG */}
      <div className="relative w-48 h-48 flex items-center justify-center my-2">
        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 180 180">
          {/* Base background ring */}
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="transparent"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={strokeWidth}
          />

          {/* Data segments */}
          {segments.map((seg) => {
            const isHighlighted = selectedId === null || selectedId === seg.id;
            return (
              <circle
                key={seg.id}
                cx="90"
                cy="90"
                r={radius}
                fill="transparent"
                stroke={seg.color}
                strokeWidth={selectedId === seg.id ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={seg.strokeDasharray}
                strokeDashoffset={seg.strokeDashoffset}
                strokeLinecap="round"
                className="cursor-pointer transition-all duration-300"
                style={{
                  opacity: isHighlighted ? 1 : 0.25,
                  filter: selectedId === seg.id ? `drop-shadow(0 0 8px ${seg.color})` : undefined,
                }}
                onClick={() => setSelectedId(selectedId === seg.id ? null : seg.id)}
              />
            );
          })}
        </svg>

        {/* Nội dung trung tâm tâm vòng tròn */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
          {selectedItem ? (
            <>
              <span
                className="text-[12px] font-bold truncate max-w-[120px]"
                style={{ color: selectedItem.category.color }}
              >
                {selectedItem.category.name}
              </span>
              <span className="text-[16px] font-black text-white tabular-nums tracking-tight mt-0.5">
                {formatCurrency(selectedItem.spent)}₫
              </span>
              <span className="text-[11px] font-semibold text-white/50">
                {selectedItem.percentOfTotal}% tổng chi
              </span>
            </>
          ) : (
            <>
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">
                Tổng Chi
              </span>
              <span className="text-[17px] font-black text-white tabular-nums tracking-tight mt-0.5">
                {formatCurrency(totalSpent)}₫
              </span>
              <span className="text-[10px] text-white/40">
                {activeItems.length} danh mục
              </span>
            </>
          )}
        </div>
      </div>

      {/* Legend Pills tương tác */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-sm mt-1 px-2">
        {activeItems.map((item) => {
          const isSelected = selectedId === item.category.id;
          return (
            <button
              key={item.category.id}
              onClick={() => setSelectedId(isSelected ? null : item.category.id)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium flex items-center gap-1.5 transition-all border ${
                isSelected
                  ? 'bg-white/20 text-white border-white/30 shadow-md scale-105'
                  : 'bg-white/[0.04] text-white/60 border-white/[0.08] hover:text-white'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.category.color }}
              />
              <span className="truncate max-w-[80px]">{item.category.name}</span>
              <span className="font-bold tabular-nums text-white/80">{item.percentOfTotal}%</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
