import React, { useState, useEffect } from 'react';
import { Trash2, Check, X } from 'lucide-react';
import type { Category } from '../../../types';

interface CategoryListItemProps {
  category: Category;
  isEditing: boolean;
  onToggleEdit: () => void;
  onCloseEdit: () => void;
  onDelete: (id: string) => void;
  onUpdateCategory: (cat: Category) => Promise<void>;
}

export const CategoryListItem: React.FC<CategoryListItemProps> = ({
  category,
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

  const formatCompact = (val: number) => {
    if (val >= 1000000) {
      const m = val / 1000000;
      return `${Number.isInteger(m) ? m : m.toFixed(1).replace('.', ',')}tr`;
    }
    if (val >= 1000) {
      return `${Math.round(val / 1000)}k`;
    }
    return new Intl.NumberFormat('vi-VN').format(val);
  };

  const formatNumber = (val: string) => {
    const num = parseInt(val.replace(/\D/g, '') || '0', 10);
    return num > 0 ? new Intl.NumberFormat('vi-VN').format(num) : '';
  };

  const handleSave = async () => {
    const finalBudget = parseInt(budgetInput.replace(/\D/g, '') || '0', 10);
    await onUpdateCategory({
      ...category,
      monthlyBudget: finalBudget > 0 ? finalBudget : undefined,
    });
    setBudgetInput(finalBudget > 0 ? finalBudget.toString() : '');
    onCloseEdit();
  };

  return (
    <div className="px-3.5 py-2.5 bg-[#18181D] border-b border-white/[0.06] last:border-b-0 transition-colors">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: category.color }}
          />
          <span className="text-[14px] font-medium text-white truncate">
            {category.name}
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            type="button"
            onClick={onToggleEdit}
            className={`px-2.5 py-1 rounded-full text-[12px] font-medium tabular-nums transition-all active:scale-95 ${
              budget > 0
                ? 'bg-white/[0.08] text-white border border-white/10'
                : 'text-[#8E8E93] hover:text-white bg-transparent'
            }`}
          >
            {budget > 0 ? `${formatCompact(budget)}/tháng` : '+ Hạn mức'}
          </button>

          <button
            type="button"
            onClick={() => {
              if (confirm(`Xóa danh mục "${category.name}"?`)) {
                onDelete(category.id);
              }
            }}
            className="p-1.5 text-white/25 hover:text-[#FF453A] transition-colors active:scale-95"
            title="Xóa danh mục"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {isEditing && (
        <div className="mt-2 pt-2 border-t border-white/[0.06] flex items-center gap-1.5">
          <input
            type="text"
            inputMode="numeric"
            placeholder="Số tiền"
            value={formatNumber(budgetInput)}
            onChange={(e) => setBudgetInput(e.target.value.replace(/\D/g, ''))}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            className="flex-1 bg-[#0E0E11] px-3 py-1.5 rounded-full text-[12px] text-white outline-none border border-white/[0.08] focus:border-white/25 tabular-nums placeholder:text-white/30"
            autoFocus
          />
          <button
            type="button"
            onClick={handleSave}
            className="px-3 py-1.5 rounded-full bg-white text-black text-[12px] font-semibold flex items-center justify-center active:scale-95"
            title="Lưu"
          >
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
          <button
            type="button"
            onClick={onCloseEdit}
            className="p-1.5 rounded-full bg-[#222228] text-white/60 hover:text-white active:scale-95"
            title="Đóng"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
