import React, { useState } from 'react';
import { Trash2, Check, X } from 'lucide-react';
import type { Category } from '../../../types';

interface CategoryListItemProps {
  category: Category;
  onDelete: (id: string) => void;
  onUpdateCategory: (cat: Category) => Promise<void>;
}

const QUICK_BUDGETS = [
  { label: '500k', value: 500000 },
  { label: '1tr', value: 1000000 },
  { label: '2tr', value: 2000000 },
  { label: '3tr', value: 3000000 },
  { label: '5tr', value: 5000000 },
];

export const CategoryListItem: React.FC<CategoryListItemProps> = ({
  category,
  onDelete,
  onUpdateCategory,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [budgetInput, setBudgetInput] = useState(
    category.monthlyBudget ? category.monthlyBudget.toString() : ''
  );

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

  const handleSave = async (customValue?: number) => {
    const finalBudget =
      customValue !== undefined
        ? customValue
        : parseInt(budgetInput.replace(/\D/g, '') || '0', 10);

    await onUpdateCategory({
      ...category,
      monthlyBudget: finalBudget > 0 ? finalBudget : undefined,
    });
    setBudgetInput(finalBudget > 0 ? finalBudget.toString() : '');
    setIsEditing(false);
  };

  return (
    <div className="px-3.5 py-2.5 bg-[#18181D] border-b border-white/[0.06] last:border-b-0 transition-colors">
      {/* Dòng chính: Tinh gọn chuẩn iOS Settings Row */}
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
            onClick={() => {
              setBudgetInput(category.monthlyBudget ? category.monthlyBudget.toString() : '');
              setIsEditing(!isEditing);
            }}
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

      {/* Khay đặt hạn mức mở rộng mượt mà khi bấm vào */}
      {isEditing && (
        <div className="mt-2.5 pt-2.5 border-t border-white/[0.06] space-y-2">
          {/* Hàng chọn nhanh 1 chạm */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {QUICK_BUDGETS.map((preset) => {
              const isSelected = budget === preset.value;
              return (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => handleSave(preset.value)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold tabular-nums transition-all active:scale-95 ${
                    isSelected
                      ? 'bg-[#0A84FF] text-white'
                      : 'bg-[#222228] text-white/70 hover:text-white'
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
            {budget > 0 && (
              <button
                type="button"
                onClick={() => handleSave(0)}
                className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#FF453A]/15 text-[#FF453A] ml-auto active:scale-95"
              >
                Gỡ
              </button>
            )}
          </div>

          {/* Ô nhập số tùy chỉnh */}
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              inputMode="numeric"
              placeholder="Hoặc nhập số tiền khác (₫)..."
              value={formatNumber(budgetInput)}
              onChange={(e) => setBudgetInput(e.target.value.replace(/\D/g, ''))}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              className="flex-1 bg-[#0E0E11] px-3 py-1.5 rounded-xl text-[12px] text-white outline-none border border-white/[0.08] focus:border-white/25 tabular-nums placeholder:text-white/30"
              autoFocus
            />
            <button
              type="button"
              onClick={() => handleSave()}
              className="px-3 py-1.5 rounded-xl bg-white text-black text-[12px] font-semibold flex items-center gap-1 active:scale-95"
            >
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Lưu</span>
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="p-1.5 rounded-xl bg-[#222228] text-white/60 hover:text-white active:scale-95"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
