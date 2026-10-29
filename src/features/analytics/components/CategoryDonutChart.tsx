import React, { useState } from 'react';
import type { CategoryBudgetItem } from '../hooks/useCategoryBudgets';

interface CategoryDonutChartProps {
  items: CategoryBudgetItem[];
  totalSpent: number;
}

const formatCompact = (val: number) => {
  if (val >= 1000000) {
    const m = val / 1000000;
    return `${Number.isInteger(m) ? m : m.toFixed(1).replace('.', ',')}tr`;
  }
  return val >= 1000 ? `${Math.round(val / 1000)}k` : new Intl.NumberFormat('vi-VN').format(val);
};

const formatFull = (val: number) =>
  new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(val) + '₫';

export const CategoryDonutChart: React.FC<CategoryDonutChartProps> = ({ items, totalSpent }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const activeItems = items.filter((i) => i.spent > 0);
  const selectedItem = items.find((i) => i.category.id === selectedId) || null;

  const radius = 64;
  const strokeWidth = 16;
  const circumference = 2 * Math.PI * radius;

  let accumulatedRatio = 0;
  const segments = activeItems.map((item) => {
    const ratio = totalSpent > 0 ? item.spent / totalSpent : 0;
    const strokeDasharray = `${Math.max(0, ratio * circumference - 2)} ${circumference}`;
    const strokeDashoffset = -(accumulatedRatio * circumference);
    accumulatedRatio += ratio;
    return { id: item.category.id, color: item.category.color, strokeDasharray, strokeDashoffset };
  });

  return (
    <div onClick={(e) => e.stopPropagation()} className="flex flex-col items-center w-full pointer-events-auto">
      {/* Vòng tròn Apple Donut Ring */}
      <div className="relative w-40 h-40 flex items-center justify-center my-1">
        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
          <circle cx="80" cy="80" r={radius} fill="transparent" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth} />
          {segments.map((seg) => (
            <circle
              key={seg.id}
              cx="80"
              cy="80"
              r={radius}
              fill="transparent"
              stroke={seg.color}
              strokeWidth={selectedId === seg.id ? strokeWidth + 3 : strokeWidth}
              strokeDasharray={seg.strokeDasharray}
              strokeDashoffset={seg.strokeDashoffset}
              strokeLinecap="round"
              className="cursor-pointer transition-all duration-300"
              style={{ opacity: selectedId === null || selectedId === seg.id ? 1 : 0.25 }}
              onClick={() => setSelectedId(selectedId === seg.id ? null : seg.id)}
            />
          ))}
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-3">
          {selectedItem ? (
            <>
              <span className="text-[11px] font-bold truncate max-w-[105px]" style={{ color: selectedItem.category.color }}>
                {selectedItem.category.name}
              </span>
              <span className="text-[16px] font-black text-white tabular-nums tracking-tight mt-0.5">
                {formatFull(selectedItem.spent)}
              </span>
              <span className="text-[10px] font-medium text-[#8E8E93] tabular-nums">
                {selectedItem.hasBudget ? `${selectedItem.budgetPercent}% hạn mức` : `${selectedItem.percentOfTotal}% tổng chi`}
              </span>
            </>
          ) : (
            <>
              <span className="text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider">Tổng chi</span>
              <span className="text-[16px] font-black text-white tabular-nums tracking-tight mt-0.5">{formatFull(totalSpent)}</span>
              <span className="text-[10px] text-[#8E8E93]">{items.length} danh mục</span>
            </>
          )}
        </div>
      </div>

      {/* Danh sách Danh mục & Hạn mức gộp chung */}
      <div className="w-full mt-2 rounded-[22px] bg-[#18181D]/90 border border-white/[0.08] overflow-hidden divide-y divide-white/[0.06] max-h-[34vh] overflow-y-auto no-scrollbar">
        {items.length === 0 ? (
          <div className="py-6 text-center text-[12px] text-[#8E8E93]">Chưa có dữ liệu chi tiêu trong tháng này</div>
        ) : (
          items.map((item) => {
            const isSelected = selectedId === item.category.id;
            const barColor = item.hasBudget
              ? item.isExceeded100
                ? '#FF453A'
                : item.isWarning80
                ? '#FF9F0A'
                : '#34C759'
              : item.category.color;
            const barWidth = Math.min(100, item.hasBudget ? item.budgetPercent : item.percentOfTotal);

            return (
              <button
                key={item.category.id}
                type="button"
                onClick={() => setSelectedId(isSelected ? null : item.category.id)}
                className={`w-full px-3.5 py-2.5 text-left transition-colors active:scale-[0.99] ${
                  isSelected ? 'bg-white/[0.08]' : 'hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.category.color }} />
                    <span className="text-[13px] font-medium text-white truncate">{item.category.name}</span>
                    {item.isExceeded100 && (
                      <span className="px-1.5 py-0.5 rounded-full bg-[#FF453A]/20 text-[#FF453A] text-[9px] font-bold uppercase">Vượt</span>
                    )}
                    {!item.isExceeded100 && item.isWarning80 && (
                      <span className="px-1.5 py-0.5 rounded-full bg-[#FF9F0A]/20 text-[#FF9F0A] text-[9px] font-bold">
                        {item.budgetPercent}%
                      </span>
                    )}
                  </div>

                  <div className="flex items-baseline gap-1 text-[12px] tabular-nums flex-shrink-0">
                    <span className="font-semibold text-white">{formatCompact(item.spent)}</span>
                    <span className="text-[11px] text-[#8E8E93]">
                      {item.hasBudget ? `/ ${formatCompact(item.budget)}` : `• ${item.percentOfTotal}%`}
                    </span>
                  </div>
                </div>

                <div className="w-full h-[3px] rounded-full bg-white/[0.07] overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${barWidth}%`, backgroundColor: barColor }} />
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
