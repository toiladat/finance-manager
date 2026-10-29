import React from 'react';
import { motion } from 'framer-motion';
import type { Category } from '../../../types';

interface RecapPassSlideProps {
  currentMonthName: string;
  totalSpent: number;
  photoCount: number;
  topCategory: Category;
  peakDate: string;
  peakDayNumber: number;
  peakMonthNumber: number;
  formatCurrency: (val: number) => string;
}

export const RecapPassSlide: React.FC<RecapPassSlideProps> = ({
  currentMonthName,
  totalSpent,
  photoCount,
  topCategory,
  peakDate,
  peakDayNumber,
  peakMonthNumber,
  formatCurrency,
}) => {
  return (
    <motion.div
      key="slide-5"
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      className="flex flex-col items-center w-full"
    >
      <div className="relative w-full max-w-[310px] rounded-[28px] bg-[#18181D] border border-white/[0.08] p-5 text-left">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <span className="text-[14px] font-bold text-white">{currentMonthName}</span>
          <span className="text-[12px] text-[#8E8E93] tabular-nums">{photoCount} ảnh</span>
        </div>

        <div className="py-4 space-y-3 text-[13px]">
          <div className="flex justify-between items-center">
            <span className="text-[#8E8E93]">Tổng chi tiêu</span>
            <span className="font-bold text-white text-[15px] tabular-nums">
              {formatCurrency(totalSpent)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#8E8E93]">Chi nhiều nhất</span>
            <span className="font-semibold" style={{ color: topCategory.color }}>
              {topCategory.name}
            </span>
          </div>
          {peakDate && (
            <div className="flex justify-between items-center">
              <span className="text-[#8E8E93]">Ngày cao điểm</span>
              <span className="font-semibold text-white tabular-nums">
                {peakDayNumber}/{peakMonthNumber}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
