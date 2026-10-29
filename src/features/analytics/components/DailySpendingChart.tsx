import React from 'react';
import type { CategoryBudgetItem } from '../hooks/useCategoryBudgets';
import { formatAmount, formatCompact } from '../utils/budgetFormat';
import { getNiceMax } from '../utils/dailySpending';
import type { DailySpend } from '../utils/dailySpending';

const PLOT_HEIGHT = 112;

interface DayBarProps {
  day: DailySpend;
  items: CategoryBudgetItem[];
  axisMax: number;
  isDimmed: boolean;
  onSelect: () => void;
}

const DayBar: React.FC<DayBarProps> = ({ day, items, axisMax, isDimmed, onSelect }) => (
  <button
    type="button"
    onClick={onSelect}
    aria-label={`${day.label}: ${formatAmount(day.total)}₫`}
    className="flex-1 h-full px-[1.5px] flex items-end transition-opacity duration-200"
    style={{ opacity: isDimmed ? 0.35 : 1 }}
  >
    {day.total > 0 ? (
      <div
        className="w-full flex flex-col-reverse gap-[1.5px] rounded-[3px] overflow-hidden"
        style={{ height: `${(day.total / axisMax) * 100}%`, minHeight: 4 }}
      >
        {items
          .filter((item) => day.byCategory[item.category.id])
          .map((item) => (
            <div
              key={item.category.id}
              style={{
                flex: day.byCategory[item.category.id],
                backgroundColor: item.category.color,
              }}
            />
          ))}
      </div>
    ) : (
      <div className="w-full h-[3px] rounded-full bg-white/[0.12]" />
    )}
  </button>
);

interface DailySpendingChartProps {
  days: DailySpend[];
  items: CategoryBudgetItem[];
  selectedDay: number | null;
  onSelectDay: (day: number) => void;
}

export const DailySpendingChart: React.FC<DailySpendingChartProps> = ({
  days,
  items,
  selectedDay,
  onSelectDay,
}) => {
  const peak = Math.max(0, ...days.map((d) => d.total));
  const axisMax = getNiceMax(peak);

  return (
    <div className="rounded-[20px] bg-[#18181D] border border-white/[0.07] px-4 pt-5 pb-3">
      <div className="flex gap-2">
        <div className="relative flex-1" style={{ height: PLOT_HEIGHT }}>
          <div className="absolute inset-x-0 top-0 border-t border-white/[0.08]" />
          <div className="absolute inset-x-0 top-1/2 border-t border-white/[0.08]" />
          <div className="absolute inset-x-0 bottom-0 border-t border-white/[0.14]" />
          <div className="relative h-full flex items-end">
            {days.map((day) => (
              <DayBar
                key={day.day}
                day={day}
                items={items}
                axisMax={axisMax}
                isDimmed={selectedDay !== null && selectedDay !== day.day}
                onSelect={() => onSelectDay(day.day)}
              />
            ))}
          </div>
        </div>

        <div className="relative w-9 text-[11px] text-[#8E8E93] tabular-nums" style={{ height: PLOT_HEIGHT }}>
          {peak > 0 && (
            <>
              <span className="absolute right-0 top-0 -translate-y-1/2">{formatCompact(axisMax)}</span>
              <span className="absolute right-0 top-1/2 -translate-y-1/2">{formatCompact(axisMax / 2)}</span>
            </>
          )}
        </div>
      </div>

      <div className="flex gap-2 mt-1.5">
        <div className="flex-1 flex">
          {days.map((day) => (
            <div
              key={day.day}
              className="flex-1 flex justify-center text-[11px] text-[#8E8E93] tabular-nums"
            >
              <span className="shrink-0">{day.day % 7 === 1 ? day.day : ''}</span>
            </div>
          ))}
        </div>
        <div className="w-9" />
      </div>
    </div>
  );
};

