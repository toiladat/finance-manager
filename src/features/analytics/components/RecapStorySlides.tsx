import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import type { Transaction, Category } from '../../../types';

interface RecapStorySlidesProps {
  slideIndex: number;
  availableMonths: Array<{ key: string; label: string; fullLabel: string }>;
  activeMonthKey: string;
  onSelectMonthKey: (key: string) => void;
  currentMonthName: string;
  previewPhotos: string[];
  photoCount: number;
  totalSpent: number;
  biggestExpense?: Transaction;
  peakWeekday: string;
  peakDayNumber: number;
  peakMonthNumber: number;
  peakPhoto?: string;
  peakAmount: number;
  topCategory: Category;
  topCatAmount: number;
  topCatPercent: number;
  topCatPhotos: string[];
  formatCurrency: (val: number) => string;
  formatDateVi: (dateStr: string) => string;
}

export const RecapStorySlides: React.FC<RecapStorySlidesProps> = ({
  slideIndex,
  availableMonths,
  activeMonthKey,
  onSelectMonthKey,
  currentMonthName,
  previewPhotos,
  photoCount,
  totalSpent,
  biggestExpense,
  peakWeekday,
  peakDayNumber,
  peakMonthNumber,
  peakPhoto,
  peakAmount,
  topCategory,
  topCatAmount,
  topCatPercent,
  topCatPhotos,
  formatCurrency,
  formatDateVi,
}) => {
  return (
    <>
      {slideIndex === 0 && (
        <motion.div
          key="slide-0"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', damping: 26 }}
          className="flex flex-col items-center w-full"
        >
          {availableMonths.length > 1 && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 p-1 rounded-full bg-white/[0.08] backdrop-blur-md border border-white/10 mb-3 pointer-events-auto"
            >
              {availableMonths.map((m) => (
                <button
                  key={m.key}
                  onClick={() => onSelectMonthKey(m.key)}
                  className={`px-3 py-1 rounded-full text-[12px] font-bold transition-all ${
                    m.key === activeMonthKey ? 'bg-white text-black' : 'text-white/60 hover:text-white'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          )}

          <span className="text-[11px] font-bold text-white/40 tracking-[0.25em] uppercase mb-3">
            NHẬT KÝ ẢNH • {currentMonthName}
          </span>

          <div className="relative w-56 h-56 my-4 flex items-center justify-center">
            {previewPhotos.length >= 2 && (
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: -8, x: -16, y: 8 }}
                className="absolute w-44 h-44 rounded-2xl overflow-hidden border-2 border-white/20 bg-card"
              >
                <img src={previewPhotos[1]} alt="Memo 2" className="w-full h-full object-cover" />
              </motion.div>
            )}
            {previewPhotos.length >= 3 && (
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 7, x: 18, y: -6 }}
                className="absolute w-44 h-44 rounded-2xl overflow-hidden border-2 border-white/20 bg-card"
              >
                <img src={previewPhotos[2]} alt="Memo 3" className="w-full h-full object-cover" />
              </motion.div>
            )}
            <motion.div className="relative z-10 w-48 h-48 rounded-[24px] overflow-hidden border-2 border-white/40 bg-black">
              {previewPhotos[0] ? (
                <img src={previewPhotos[0]} alt="Memo Cover" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/40 text-[12px] p-4">
                  <span>Chưa có ảnh</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 inset-x-3 text-center">
                <span className="text-[12px] font-semibold text-white">{photoCount} khoảnh khắc</span>
              </div>
            </motion.div>
          </div>

          <div className="mt-4 text-center">
            <span className="text-[34px] font-black text-white tracking-tight tabular-nums block leading-tight">
              {formatCurrency(totalSpent)}
            </span>
            <span className="text-[13px] text-white/50 block mt-1">Tổng chi tiêu trong tháng này</span>
          </div>
        </motion.div>
      )}

      {slideIndex === 1 && (
        <motion.div
          key="slide-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25 }}
          className="flex flex-col items-center w-full"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF453A]/15 border border-[#FF453A]/30 text-[#FF453A] text-[11px] font-bold tracking-wider uppercase mb-3">
            <span>Khoản chi lớn nhất</span>
          </div>

          {biggestExpense ? (
            <div className="relative w-full max-w-[280px] aspect-[4/5] rounded-[28px] overflow-hidden border border-white/20 bg-black rotate-[-1.5deg]">
              {biggestExpense.photoUrl ? (
                <img src={biggestExpense.photoUrl} alt="Chi tiêu" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-[#181820] flex items-center justify-center text-white/40">Không có ảnh</div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-between p-4 text-left">
                <div className="self-end">
                  <div className="px-3 py-1.5 rounded-full bg-white text-black text-[13px] font-black tracking-tight flex items-center gap-1">
                    <ArrowUpRight className="w-3.5 h-3.5 stroke-[3]" />
                    <span>{formatCurrency(biggestExpense.amount)}</span>
                  </div>
                </div>
                <div>
                  <span className="text-[15px] font-bold text-white block">{biggestExpense.note || 'Khoản chi không tên'}</span>
                  <span className="text-[12px] text-white/60 mt-0.5 block">Ngày {formatDateVi(biggestExpense.date)}</span>
                </div>
              </div>
            </div>
          ) : (
            <span className="text-white/40 text-[14px]">Chưa có chi tiêu</span>
          )}
        </motion.div>
      )}

      {slideIndex === 2 && (
        <motion.div
          key="slide-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="flex flex-col items-center w-full"
        >
          <span className="text-[11px] font-bold text-white/40 tracking-[0.25em] uppercase mb-3">NGÀY CHI NHIỀU NHẤT</span>
          <div className="w-24 h-28 rounded-2xl bg-white text-black flex flex-col items-center overflow-hidden my-2">
            <div className="w-full bg-[#FF3B30] py-1 text-center text-[11px] font-black text-white uppercase tracking-wider">{peakWeekday}</div>
            <div className="flex-1 flex flex-col items-center justify-center">
              <span className="text-[38px] font-black leading-none text-black">{peakDayNumber}</span>
              <span className="text-[10px] font-bold text-gray-500 uppercase mt-0.5">Tháng {peakMonthNumber}</span>
            </div>
          </div>
          {peakPhoto && (
            <div className="w-20 h-20 rounded-2xl overflow-hidden border border-white/20 my-2">
              <img src={peakPhoto} alt="Peak day" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="mt-3 text-center">
            <span className="text-[34px] font-black text-[#FF453A] tabular-nums tracking-tight block my-0.5">{formatCurrency(peakAmount)}</span>
            <span className="text-[12px] text-white/40 block">đã chi trong ngày này</span>
          </div>
        </motion.div>
      )}

      {slideIndex === 3 && (
        <motion.div
          key="slide-3"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="flex flex-col items-center w-full"
        >
          <span className="text-[11px] font-bold text-white/40 tracking-[0.25em] uppercase mb-2">DANH MỤC ĐẦU BẢNG</span>
          <div className="my-3 text-center">
            <span className="text-[34px] font-black tracking-tight block" style={{ color: topCategory.color }}>{topCategory.name}</span>
            <span className="text-[26px] font-black text-white tabular-nums tracking-tight block mt-1">{formatCurrency(topCatAmount)}</span>
          </div>
          <div className="w-full max-w-[260px] p-3 rounded-2xl bg-white/[0.06] border border-white/10 text-center my-2">
            <div className="flex items-center justify-between text-[12px] font-semibold mb-1.5">
              <span className="text-white/60">Tỷ trọng chi tiêu</span>
              <span className="text-white font-bold tabular-nums">{topCatPercent}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${topCatPercent}%`, backgroundColor: topCategory.color }} />
            </div>
          </div>
          {topCatPhotos.length > 0 && (
            <div className="flex items-center gap-2 mt-3">
              {topCatPhotos.map((url, idx) => (
                <div key={idx} className="w-14 h-14 rounded-xl overflow-hidden border border-white/20">
                  <img src={url} alt="Cat photo" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </>
  );
};
