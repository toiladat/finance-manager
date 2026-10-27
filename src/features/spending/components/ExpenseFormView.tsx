import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, PenLine, Check } from 'lucide-react';
import type { Category } from '../../../types';

interface ExpenseFormViewProps {
  photoPreview: string;
  rawAmount: string;
  selectedCategoryId: string | null;
  note: string;
  categories: Category[];
  isSubmitting: boolean;
  onRetakePhoto: () => void;
  onChangeAmount: (val: string) => void;
  onSelectCategory: (id: string | null) => void;
  onChangeNote: (val: string) => void;
  onSubmit: () => void;
}

export const ExpenseFormView: React.FC<ExpenseFormViewProps> = ({
  photoPreview,
  rawAmount,
  selectedCategoryId,
  note,
  categories,
  isSubmitting,
  onRetakePhoto,
  onChangeAmount,
  onSelectCategory,
  onChangeNote,
  onSubmit,
}) => {
  const formatDisplayAmount = (str: string) => {
    const num = parseInt(str.replace(/\D/g, '') || '0', 10);
    return num === 0 ? '' : new Intl.NumberFormat('vi-VN').format(num);
  };

  const isAmountValid = parseInt(rawAmount.replace(/\D/g, '') || '0', 10) > 0;

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-4">
      {/* Khung ảnh chụp bo góc squircle chuẩn Locket */}
      <div className="relative w-full aspect-[4/3] rounded-[26px] overflow-hidden bg-black border border-white/10 shadow-xl">
        <img src={photoPreview} alt="Captured" className="w-full h-full object-cover" />

        {/* Nút chụp lại */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onRetakePhoto}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white/90 hover:text-white flex items-center justify-center shadow-md transition-colors"
          title="Chụp lại ảnh khác"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </motion.button>
      </div>

      {/* Ô nhập số tiền to bản */}
      <div className="flex flex-col items-center py-1">
        <div className="flex items-baseline justify-center gap-1.5 w-full">
          <input
            type="text"
            inputMode="numeric"
            placeholder="0"
            value={formatDisplayAmount(rawAmount)}
            onChange={(e) => onChangeAmount(e.target.value)}
            className="bg-transparent text-center text-[42px] font-black text-white tracking-tight tabular-nums outline-none min-w-[100px] max-w-[280px] placeholder:text-white/20"
            autoFocus
          />
          <span className="text-[20px] font-semibold text-white/45">₫</span>
        </div>
      </div>

      {/* Ô Ghi chú tối giản */}
      <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-white/[0.05] border border-white/10 focus-within:border-white/25 focus-within:bg-white/[0.08] transition-all">
        <PenLine className="w-4 h-4 text-white/40 flex-shrink-0" />
        <input
          type="text"
          placeholder="Ghi chú"
          value={note}
          onChange={(e) => onChangeNote(e.target.value)}
          className="w-full bg-transparent text-[13px] text-white outline-none placeholder:text-white/30"
        />
      </div>

      {/* Chọn danh mục chi tiêu */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        <motion.button
          whileTap={{ scale: 0.94 }}
          type="button"
          onClick={() => onSelectCategory(null)}
          className={`px-3.5 py-1.5 rounded-full text-[12px] font-medium flex-shrink-0 transition-all ${
            selectedCategoryId === null
              ? 'bg-white text-black font-semibold shadow-sm'
              : 'bg-white/[0.05] border border-white/10 text-white/60 hover:text-white'
          }`}
        >
          <span>Chưa phân loại</span>
        </motion.button>

        {categories
          .filter((c) => c.type === 'EXPENSE')
          .map((cat) => {
            const isSelected = selectedCategoryId === cat.id;
            return (
              <motion.button
                key={cat.id}
                whileTap={{ scale: 0.94 }}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                style={
                  isSelected
                    ? {
                        backgroundColor: `${cat.color}25`,
                        borderColor: `${cat.color}80`,
                        boxShadow: `0 0 14px ${cat.color}35`,
                      }
                    : undefined
                }
                className={`px-3.5 py-1.5 rounded-full text-[12px] font-medium flex items-center gap-1.5 flex-shrink-0 transition-all border ${
                  isSelected
                    ? 'text-white font-semibold'
                    : 'bg-white/[0.05] border-white/10 text-white/60 hover:text-white'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
                <span>{cat.name}</span>
              </motion.button>
            );
          })}
      </div>

      {/* Nút lưu chi tiêu */}
      <div className="pt-2 pb-[max(8px,env(safe-area-inset-bottom,8px))]">
        <motion.button
          whileTap={{ scale: 0.97 }}
          disabled={isSubmitting || !isAmountValid}
          onClick={onSubmit}
          className={`w-full py-3.5 rounded-full font-bold text-[15px] flex items-center justify-center gap-2 transition-all shadow-md ${
            !isAmountValid
              ? 'bg-white/[0.08] text-white/30 border border-white/5 cursor-not-allowed'
              : 'bg-white text-black hover:bg-white/95 active:scale-98 shadow-[0_4px_20px_rgba(255,255,255,0.15)]'
          }`}
        >
          <Check className="w-4 h-4 stroke-[2.5]" />
          <span>Lại tốn tiền</span>
        </motion.button>
      </div>
    </div>
  );
};
