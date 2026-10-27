import React from 'react';
import { AlertTriangle, AlertOctagon, CheckCircle2, TrendingUp } from 'lucide-react';
import type { CategoryBudgetItem } from '../hooks/useCategoryBudgets';

interface CategoryBudgetCardProps {
  items: CategoryBudgetItem[];
}

export const CategoryBudgetCard: React.FC<CategoryBudgetCardProps> = ({ items }) => {
  const budgetItems = items.filter((i) => i.hasBudget);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(val);

  if (budgetItems.length === 0) {
    return (
      <div className="w-full p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-center my-2">
        <TrendingUp className="w-6 h-6 text-white/30 mx-auto mb-1.5" />
        <span className="text-[13px] font-medium text-white/70 block">Chưa đặt hạn mức</span>
        <span className="text-[11px] text-white/40 block mt-0.5">
          Vào Cài đặt &gt; Danh mục để thiết lập hạn mức tháng cho từng danh mục
        </span>
      </div>
    );
  }

  return (
    <div className="w-full space-y-2.5 my-2">
      {budgetItems.map((item) => {
        const {
          category,
          spent,
          budget,
          budgetPercent,
          remainingBudget,
          isWarning80,
          isExceeded100,
          safeDailySpend,
        } = item;

        const getBarColor = () => {
          if (isExceeded100) return '#FF453A';
          if (isWarning80) return '#FF9F0A';
          return '#34C759';
        };

        return (
          <div
            key={category.id}
            className={`p-3 rounded-2xl border transition-all ${
              isExceeded100
                ? 'bg-[#FF453A]/10 border-[#FF453A]/30'
                : isWarning80
                ? 'bg-[#FF9F0A]/10 border-[#FF9F0A]/30'
                : 'bg-white/[0.04] border-white/[0.08]'
            }`}
          >
            {/* Hàng 1: Icon + Tên + Badge trạng thái */}
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: category.color }}
                />
                <span className="text-[13px] font-semibold text-white/90 truncate">
                  {category.name}
                </span>
              </div>

              {isExceeded100 ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#FF453A] tabular-nums">
                  <AlertOctagon className="w-3.5 h-3.5" />
                  <span>{budgetPercent}% (Vượt)</span>
                </span>
              ) : isWarning80 ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#FF9F0A] tabular-nums">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{budgetPercent}% (Cận)</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#34C759] tabular-nums">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{budgetPercent}%</span>
                </span>
              )}
            </div>

            {/* Hàng 2: Thanh tiến độ có vạch mốc 80% */}
            <div className="relative w-full h-2 rounded-full bg-white/[0.08] overflow-hidden my-1">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${Math.min(100, budgetPercent)}%`,
                  backgroundColor: getBarColor(),
                }}
              />
              {/* Vạch mốc 80% */}
              <div className="absolute top-0 bottom-0 left-[80%] w-[1.5px] bg-white/30 pointer-events-none" />
            </div>

            {/* Hàng 3: Chi tiết số tiền & gợi ý ngân sách/ngày */}
            <div className="flex items-center justify-between text-[11px] text-white/50 pt-0.5">
              <span className="tabular-nums">
                Đã tiêu <b className="text-white/80">{formatCurrency(spent)}₫</b> / {formatCurrency(budget)}₫
              </span>
              {isExceeded100 ? (
                <span className="text-[#FF453A] font-semibold tabular-nums">
                  +{formatCurrency(spent - budget)}₫
                </span>
              ) : (
                <span className="text-white/60 tabular-nums">
                  Còn {formatCurrency(remainingBudget)}₫ (~{formatCurrency(safeDailySpend)}₫/ngày)
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
