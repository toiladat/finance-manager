import React, { useState, useEffect } from 'react';
import { Trash2, Check, X } from 'lucide-react';
import type { Category } from '../../../types';

interface CategoryListItemProps {
  category: Category;
  monthSpent: number;
  isEditing: boolean;
  onToggleEdit: () => void;
  onCloseEdit: () => void;
  onDelete: (id: string) => void;
  onUpdateCategory: (cat: Category) => Promise<void>;
}

export const CategoryListItem: React.FC<CategoryListItemProps> = ({
  category,
  monthSpent,
  isEditing,
  onToggleEdit,
  onCloseEdit,
  onDelete,
  onUpdateCategory,
}) => {
  const [budgetInput, setBudgetInput] = useState(
    category.monthlyBudget ? category.monthlyBudget.toString() : ''
  );

  useEffect(() => {
    if (isEditing) {
      setBudgetInput(category.monthlyBudget ? category.monthlyBudget.toString() : '');
    }
  }, [isEditing, category.monthlyBudget]);

  const budget = category.monthlyBudget || 0;
  const hasBudget = budget > 0;
  const ratio = hasBudget ? monthSpent / budget : 0;
  const percent = Math.round(ratio * 100);
  const isOver = hasBudget && ratio >= 1;

  // Màu progress theo màu danh mục, nếu quá hạn thì màu đỏ
  const barColor = isOver ? '#FF453A' : category.color;

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(val);

  const formatInputNumber = (val: string) => {
    const num = parseInt(val.replace(/\D/g, '') || '0', 10);
    return num > 0 ? formatCurrency(num) : '';
  };

  const handleSave = async () => {
    const finalBudget = parseInt(budgetInput.replace(/\D/g, '') || '0', 10);
    await onUpdateCategory({
      ...category,
      monthlyBudget: finalBudget > 0 ? finalBudget : undefined,
    });
    onCloseEdit();
  };

  return (
    <div className="p-3.5 rounded-[20px] bg-[#18181D] border border-white/[0.07] flex flex-col gap-2 transition-all">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: category.color }}
          />
          <span className="text-[14px] font-semibold text-white truncate">
            {category.name}
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            type="button"
            onClick={onToggleEdit}
            className={`px-2.5 py-1 rounded-full text-[12px] font-medium tabular-nums transition-all active:scale-95 ${
              hasBudget
                ? isOver
                  ? 'bg-[#FF453A]/15 text-[#FF453A] font-semibold'
                  : 'bg-white/[0.06] text-white/80 hover:text-white'
                : 'text-[#8E8E93] hover:text-white'
            }`}
          >
            {hasBudget
              ? `${formatCurrency(monthSpent)} / ${formatCurrency(budget)}₫`
              : '+ Hạn mức'}
          </button>

          <button
            type="button"
            onClick={() => {
              if (confirm(`Xóa "${category.name}"?`)) {
                onDelete(category.id);
              }
            }}
            className="p-1.5 text-white/25 hover:text-[#FF453A] transition-colors active:scale-95"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {isEditing ? (
        <div className="pt-2 border-t border-white/[0.06] flex items-center gap-1.5">
          <input
            type="text"
            inputMode="numeric"
            placeholder="Hạn mức"
            value={formatInputNumber(budgetInput)}
            onChange={(e) => setBudgetInput(e.target.value.replace(/\D/g, ''))}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') onCloseEdit();
            }}
            className="flex-1 bg-[#0E0E11] px-3 py-1.5 rounded-full text-[12px] text-white outline-none border border-white/[0.08] focus:border-white/25 tabular-nums placeholder:text-white/30"
            autoFocus
          />
          <button
            type="button"
            onClick={handleSave}
            className="px-3 py-1.5 rounded-full bg-white text-black text-[12px] font-semibold flex items-center justify-center active:scale-95"
          >
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
          <button
            type="button"
            onClick={onCloseEdit}
            className="p-1.5 rounded-full bg-[#222228] text-white/60 hover:text-white active:scale-95"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        hasBudget && (
          <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, percent)}%`,
                backgroundColor: barColor,
              }}
            />
          </div>
        )
      )}
    </div>
  );
};
