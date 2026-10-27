import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Trash2, Tag, Sparkles } from 'lucide-react';
import type { Transaction } from '../../../types';

interface DayAlbumMemoryCardProps {
  transaction: Transaction;
  category: { name: string; color: string };
  onDelete: (id: string) => void;
  index: number;
}

export const DayAlbumMemoryCard: React.FC<DayAlbumMemoryCardProps> = ({
  transaction,
  category,
  onDelete,
  index,
}) => {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  useEffect(() => {
    if (isConfirmingDelete) {
      const timer = setTimeout(() => setIsConfirmingDelete(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isConfirmingDelete]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + ' ₫';
  };

  const formatTime = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isConfirmingDelete) {
      onDelete(transaction.id);
    } else {
      setIsConfirmingDelete(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ type: 'spring', damping: 26, stiffness: 360, delay: index * 0.05 }}
      className="relative w-full rounded-[26px] overflow-hidden border border-white/12 bg-[#16161B] shadow-[0_8px_24px_rgba(0,0,0,0.4)] group select-none"
    >
      {transaction.photoUrl ? (
        /* ================= PHOTO HERO LOCKET CARD ================= */
        <div className="relative w-full aspect-[4/3] bg-black overflow-hidden">
          <img
            src={transaction.photoUrl}
            alt={transaction.note || 'Khoảnh khắc chi tiêu'}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Vignette Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/40 pointer-events-none" />

          {/* Top Bar: Category badge & Delete button */}
          <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
            <div
              className="px-3 py-1 rounded-full bg-black/55 backdrop-blur-xl border border-white/20 text-[11px] font-semibold text-white flex items-center gap-1.5 shadow-lg"
              style={{ WebkitBackdropFilter: 'blur(16px)' }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: category.color,
                  boxShadow: `0 0 8px ${category.color}`,
                }}
              />
              <span className="tracking-tight">{category.name}</span>
            </div>

            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={handleDeleteClick}
              className={`h-8 px-2.5 rounded-full backdrop-blur-xl border border-white/20 text-white flex items-center gap-1.5 transition-all shadow-lg cursor-pointer ${
                isConfirmingDelete
                  ? 'bg-red-500 font-bold text-[11px] shadow-[0_0_12px_rgba(239,68,68,0.5)]'
                  : 'bg-black/55 hover:bg-red-500/80 active:bg-red-600 text-white/70 hover:text-white'
              }`}
              title={isConfirmingDelete ? 'Chạm lần nữa để xóa' : 'Xóa khoảnh khắc này'}
            >
              <Trash2 className="w-3.5 h-3.5" />
              {isConfirmingDelete }
            </motion.button>
          </div>

          {/* Bottom Bar: Amount, Time, and Note */}
          <div className="absolute bottom-0 inset-x-0 p-4 z-10 flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-[24px] font-black text-white tabular-nums tracking-tight drop-shadow-md">
                {formatCurrency(transaction.amount)}
              </span>

              <div className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[11px] font-medium text-white/85 flex items-center gap-1.5 shadow-sm">
                <Clock className="w-3 h-3 text-white/70" />
                <span>{formatTime(transaction.timestamp)}</span>
              </div>
            </div>

            {transaction.note && (
              <p className="text-[13px] text-white/90 font-medium leading-snug line-clamp-2 drop-shadow-sm flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#FFD60A] flex-shrink-0" />
                <span>{transaction.note}</span>
              </p>
            )}
          </div>
        </div>
      ) : (
        /* ================= NO PHOTO TEXT CARD ================= */
        <div className="p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-[11px] font-semibold text-white">
              <Tag className="w-3 h-3" style={{ color: category.color }} />
              <span>{category.name}</span>
            </div>

            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={handleDeleteClick}
              className={`px-2.5 py-1 rounded-full border border-white/10 flex items-center gap-1.5 transition-all cursor-pointer ${
                isConfirmingDelete
                  ? 'bg-red-500 text-white font-bold text-[11px]'
                  : 'text-white/40 hover:text-red-400'
              }`}
              title={isConfirmingDelete ? 'Chạm lần nữa để xóa' : 'Xóa khoảnh khắc này'}
            >
              <Trash2 className="w-3.5 h-3.5" />
              {isConfirmingDelete && <span>Xóa?</span>}
            </motion.button>
          </div>

          <div className="flex items-baseline justify-between">
            <span className="text-[22px] font-black text-white tabular-nums tracking-tight">
              {formatCurrency(transaction.amount)}
            </span>
            <span className="text-[11px] text-white/50">{formatTime(transaction.timestamp)}</span>
          </div>

          {transaction.note && (
            <p className="text-[13px] text-white/80 font-normal">{transaction.note}</p>
          )}
        </div>
      )}
    </motion.div>
  );
};
