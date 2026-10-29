import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera } from 'lucide-react';
import type { DaySpendingGroup, Category } from '../../../types';
import { DayAlbumMemoryCard } from './DayAlbumMemoryCard';

interface DayAlbumModalProps {
  isOpen: boolean;
  onClose: () => void;
  dayGroup: DaySpendingGroup | null;
  categories: Category[];
  onDeleteTransaction: (id: string) => void;
  onAddMorePhoto: (date: string) => void;
}

export const DayAlbumModal: React.FC<DayAlbumModalProps> = ({
  isOpen,
  onClose,
  dayGroup,
  categories,
  onDeleteTransaction,
  onAddMorePhoto,
}) => {
  if (!isOpen || !dayGroup) return null;

  const dateObj = new Date(dayGroup.date);
  const dayName = dateObj.toLocaleDateString('vi-VN', { weekday: 'long' });
  const formattedDayTitle = `${dayName.charAt(0).toUpperCase() + dayName.slice(1)}, ngày ${dayGroup.dayNumber}`;

  const getCategory = (catId?: string | null) => {
    if (!catId) return { name: 'Chưa phân loại', color: '#8E8E93' };
    return categories.find((c) => c.id === catId) || { name: 'Chưa phân loại', color: '#8E8E93' };
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + ' ₫';
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 select-none">
        {/* Backdrop kính mờ chuẩn iOS */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/75 backdrop-blur-xl"
          style={{ WebkitBackdropFilter: 'blur(20px)' }}
        />

        {/* Modal Window Sheet */}
        <motion.div
          initial={{ y: '100%', opacity: 0.6 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 350 }}
          className="relative w-full max-w-md h-[92dvh] sm:h-auto sm:max-h-[88vh] bg-[#111116] sm:border sm:border-white/12 rounded-t-[32px] sm:rounded-[36px] overflow-hidden flex flex-col justify-between z-10 shadow-2xl"
        >
          {/* iOS Handle Bar trên mobile */}
          <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mt-2.5 mb-1 sm:hidden flex-shrink-0" />

          {/* Header Card với thông tin tổng quan ngày */}
          <div className="px-5 pt-3 pb-3 border-b border-white/[0.08] bg-black/30 backdrop-blur-md flex-shrink-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] font-semibold text-white/60 tracking-wider uppercase">
                {formattedDayTitle}
              </span>
              <motion.button
                whileTap={{ scale: 0.88 }}
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Total Expense Hero */}
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-[30px] font-black text-white tracking-tight tabular-nums block leading-tight">
                  {formatCurrency(dayGroup.totalExpense)}
                </span>
              </div>
              <span className="text-[12px] font-medium text-[#8E8E93] tabular-nums">
                {dayGroup.transactions.length} ảnh
              </span>
            </div>
          </div>

          {/* Danh sách các khoảnh khắc Memory Cards Locket */}
          <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-4">
            {dayGroup.transactions.map((tx, idx) => (
              <DayAlbumMemoryCard
                key={tx.id}
                transaction={tx}
                category={getCategory(tx.categoryId)}
                onDelete={onDeleteTransaction}
                index={idx}
              />
            ))}
          </div>

          {/* Floating Bottom CTA Dock */}
          <div className="p-4 pb-[max(18px,env(safe-area-inset-bottom,18px))] border-t border-white/[0.08] bg-black/40 backdrop-blur-2xl flex-shrink-0">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onAddMorePhoto(dayGroup.date)}
              className="w-full py-3.5 px-6 rounded-full bg-white text-black hover:bg-white/95 font-bold text-[15px] shadow-[0_4px_24px_rgba(255,255,255,0.18)] flex items-center justify-center gap-2.5 transition-all cursor-pointer"
            >
              <Camera className="w-4 h-4 stroke-[2.4] text-black" />
              <span>Chụp thêm chi tiêu ngày {dayGroup.dayNumber}</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
