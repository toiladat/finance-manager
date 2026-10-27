import React from 'react';
import { motion } from 'framer-motion';
import type { DaySpendingGroup } from '../../../types';

interface CalendarDayCellProps {
  dayNumber: number;
  dayGroup?: DaySpendingGroup;
  isToday: boolean;
  onSelectDay: (dayGroup: DaySpendingGroup) => void;
  onSelectEmptyDay: (dayNumber: number) => void;
}

export const CalendarDayCell: React.FC<CalendarDayCellProps> = ({
  dayNumber,
  dayGroup,
  isToday,
  onSelectDay,
  onSelectEmptyDay,
}) => {
  const hasTransactions = !!dayGroup && dayGroup.transactions.length > 0;
  const hasPhotos = !!dayGroup && dayGroup.photos.length > 0;
  const photoCount = dayGroup ? dayGroup.photos.length : 0;
  const topPhoto = hasPhotos ? dayGroup.photos[dayGroup.photos.length - 1] : null;

  // Day number label element with Apple iOS 'Today' highlight
  const dayNumberLabel = isToday ? (
    <div className="w-5 h-5 rounded-full bg-ios-blue text-white font-bold flex items-center justify-center text-[10.5px] tabular-nums mt-1 shadow-sm">
      {dayNumber}
    </div>
  ) : (
    <span className="text-[12px] font-medium text-white/90 mt-1 tabular-nums">
      {dayNumber}
    </span>
  );

  if (hasTransactions && dayGroup) {
    // 1. Case Có ảnh khoảnh khắc
    if (hasPhotos && topPhoto) {
      return (
        <motion.div
          whileTap={{ scale: 0.94 }}
          onClick={() => onSelectDay(dayGroup)}
          className="flex flex-col items-center cursor-pointer select-none relative group"
        >
          {/* Stacked Deck Container */}
          <div className="relative w-12 h-12 flex items-center justify-center">
            {photoCount >= 3 && (
              <div className="absolute inset-0 rounded-[14px] bg-white/[0.08] border border-white/20 transform rotate-6 translate-x-1 -translate-y-1 pointer-events-none" />
            )}
            {photoCount >= 2 && (
              <div className="absolute inset-0 rounded-[14px] bg-white/[0.12] border border-white/30 transform -rotate-3 -translate-x-0.5 -translate-y-0.5 pointer-events-none" />
            )}

            {/* Primary Top Photo Card */}
            <div
              className={`relative w-full h-full rounded-[14px] overflow-hidden shadow-sm bg-card-elevated z-10 border ${
                isToday ? 'border-ios-blue ring-2 ring-ios-blue/30' : 'border-white/40'
              }`}
            >
              <img
                src={topPhoto}
                alt={`Ngày ${dayNumber}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />

              {/* Multi-photo badge (+N) */}
              {photoCount > 1 && (
                <div className="absolute top-0.5 right-0.5 px-1 py-0.2 bg-black/75 backdrop-blur-md rounded-full border border-white/30 text-[9px] font-bold text-white leading-tight">
                  +{photoCount - 1}
                </div>
              )}

              {/* Category dot */}
              {dayGroup.topCategory && (
                <div
                  className="absolute bottom-0.5 left-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] shadow-sm"
                  style={{ backgroundColor: dayGroup.topCategory.color || '#0A84FF' }}
                >
                  ●
                </div>
              )}
            </div>
          </div>

          {dayNumberLabel}
        </motion.div>
      );
    }

    // 2. Case Có chi tiêu nhưng không có ảnh (Thẻ Squircle màu danh mục)
    const catColor = dayGroup.topCategory?.color || '#0A84FF';
    const txCount = dayGroup.transactions.length;

    return (
      <motion.div
        whileTap={{ scale: 0.94 }}
        onClick={() => onSelectDay(dayGroup)}
        className="flex flex-col items-center cursor-pointer select-none relative group"
      >
        <div className="relative w-12 h-12 flex items-center justify-center">
          <div
            className={`relative w-full h-full rounded-[14px] overflow-hidden border shadow-sm flex flex-col items-center justify-center p-1 transition-all group-hover:scale-105 ${
              isToday ? 'ring-2 ring-ios-blue/40' : ''
            }`}
            style={{
              borderColor: isToday ? '#0A84FF' : `${catColor}70`,
              background: `radial-gradient(circle at 50% 30%, ${catColor}30, rgba(28, 28, 30, 0.95))`,
            }}
          >
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm"
              style={{ backgroundColor: `${catColor}35`, color: catColor }}
            >
              ●
            </div>

            {txCount > 1 && (
              <div className="absolute top-0.5 right-0.5 px-1 py-0.2 bg-black/75 backdrop-blur-md rounded-full border border-white/30 text-[9px] font-bold text-white leading-tight">
                +{txCount - 1}
              </div>
            )}

            <div
              className="absolute bottom-1 left-1.5 w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: catColor }}
            />
          </div>
        </div>

        {dayNumberLabel}
      </motion.div>
    );
  }

  // 3. Case Ngày trống hoàn toàn
  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      onClick={() => onSelectEmptyDay(dayNumber)}
      className="flex flex-col items-center cursor-pointer select-none group"
    >
      <div
        className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
          isToday
            ? 'bg-ios-blue/15 border-2 border-ios-blue text-ios-blue font-bold shadow-sm shadow-ios-blue/20'
            : 'bg-white/[0.04] border border-white/[0.06] text-ios-gray-1 group-hover:text-white group-active:bg-white/[0.08]'
        }`}
      >
        <span className="text-[12px] tabular-nums font-medium">
          {dayNumber}
        </span>
      </div>
    </motion.div>
  );
};
