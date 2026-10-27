import React, { useEffect, useRef } from 'react';
import type { MonthSpendingData, DaySpendingGroup } from '../../../types';
import { CalendarDayCell } from './CalendarDayCell';

interface CalendarGridProps {
  monthsData: MonthSpendingData[];
  onSelectDay: (dayGroup: DaySpendingGroup) => void;
  onSelectEmptyDay: (dateStr: string) => void;
}

const WEEKDAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  monthsData,
  onSelectDay,
  onSelectEmptyDay,
}) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonthNum = now.getMonth();
  const todayDate = now.getDate();

  const currentMonthRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  // Cuộn ngay đến tháng hiện tại khi mở app (tháng cũ ở trên, cuộn lên để xem lại quá khứ)
  useEffect(() => {
    if (isInitialMount.current && currentMonthRef.current) {
      isInitialMount.current = false;
      currentMonthRef.current.scrollIntoView({ behavior: 'instant', block: 'start' });
    }
  }, [monthsData]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + 'đ';
  };

  return (
    <div className="px-3 pb-32 space-y-4 pt-1">
      {monthsData.map((monthData, monthIndex) => {
        const isCurrentMonth =
          monthData.year === currentYear && monthData.month === currentMonthNum;

        return (
          <section
            key={monthData.monthKey}
            ref={isCurrentMonth ? currentMonthRef : undefined}
            className="flex flex-col scroll-mt-36"
          >
            {/* Đường line mờ lơ lửng phân tách giữa các tháng - Đồng nhất cho tất cả các tháng */}
            <div className={`flex items-center gap-3 px-2 ${monthIndex === 0 ? 'mb-4 mt-2' : 'my-7'}`}>
              <div className="flex-1 h-px bg-white/[0.08]" />
              <div className="flex items-center gap-1.5 px-1">
                <span className="text-[12px] font-semibold text-white/90 tracking-wide">
                  {monthData.label}
                </span>
                {monthData.totalExpense > 0 && (
                  <span className="text-[11px] text-ios-gray-1 font-medium">
                    • {formatCurrency(monthData.totalExpense)}
                  </span>
                )}
              </div>
              <div className="flex-1 h-px bg-white/[0.08]" />
            </div>

            {/* 2. Hàng thứ trong tuần */}
            <div className="grid grid-cols-7 mb-3 text-center">
              {WEEKDAYS.map((wd) => (
                <span key={wd} className="text-[12px] font-semibold text-ios-gray-1 tracking-tight">
                  {wd}
                </span>
              ))}
            </div>

            {/* 3. Lưới các ngày trong tháng */}
            <div className="grid grid-cols-7 gap-y-4 gap-x-1.5 items-start justify-items-center">
              {/* Ô trống bù đầu tháng */}
              {Array.from({ length: monthData.startOffset }).map((_, i) => (
                <div key={`offset-${monthData.monthKey}-${i}`} className="w-11 h-16" />
              ))}

              {/* Các ngày trong tháng */}
              {Array.from({ length: monthData.totalDays }).map((_, index) => {
                const dayNum = index + 1;
                const dayGroup = monthData.daysData.get(dayNum);
                const isToday = isCurrentMonth && dayNum === todayDate;

                const dateStr = `${monthData.year}-${String(monthData.month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;

                return (
                  <CalendarDayCell
                    key={`day-${monthData.monthKey}-${dayNum}`}
                    dayNumber={dayNum}
                    dayGroup={dayGroup}
                    isToday={isToday}
                    onSelectDay={onSelectDay}
                    onSelectEmptyDay={() => onSelectEmptyDay(dateStr)}
                  />
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
};
