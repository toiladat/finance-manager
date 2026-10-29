import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
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
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="flex flex-col items-center w-full"
    >
      <div className="relative w-full max-w-[310px] rounded-[28px] bg-[#18181D]/90 backdrop-blur-2xl border border-white/15 p-5 text-left">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-1.5 text-[#0A84FF] text-[12px] font-black tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>LOCKET RECAP</span>
          </div>
          <span className="text-[12px] font-semibold text-white/50">{currentMonthName}</span>
        </div>

        <div className="py-3 space-y-2.5 text-[13px]">
          <div className="flex justify-between items-center">
            <span className="text-white/60">Tổng chi tiêu</span>
            <span className="font-extrabold text-white text-[15px] tabular-nums">
              {formatCurrency(totalSpent)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/60">Khoảnh khắc đã ghi</span>
            <span className="font-semibold text-white tabular-nums">{photoCount} ảnh</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/60">Chi nhiều nhất cho</span>
            <span className="font-semibold" style={{ color: topCategory.color }}>
              {topCategory.name}
            </span>
          </div>
          {peakDate && (
            <div className="flex justify-between items-center">
              <span className="text-white/60">Ngày chi cao điểm</span>
              <span className="font-semibold text-white/90 tabular-nums">
                Ngày {peakDayNumber}/{peakMonthNumber}
              </span>
            </div>
          )}
        </div>

        <div className="border-t border-dashed border-white/20 pt-3 text-center">
          <span className="text-[11px] font-medium text-white/50 block">
            Nhật ký chi tiêu • {currentMonthName}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
