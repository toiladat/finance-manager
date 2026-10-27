import React, { useState } from 'react';
import { Trash2, Edit3, Check, X, ShieldAlert } from 'lucide-react';
import type { Category } from '../../../types';

interface CategoryListItemProps {
  category: Category;
  monthSpent: number;
  onDelete: (id: string) => void;
  onUpdateCategory: (cat: Category) => Promise<void>;
}

export const CategoryListItem: React.FC<CategoryListItemProps> = ({
  category,
  monthSpent,
  onDelete,
  onUpdateCategory,
}) => {
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState(
    category.monthlyBudget ? category.monthlyBudget.toString() : ''
  );

  const budget = category.monthlyBudget || 0;
  const hasBudget = budget > 0;
  const ratio = hasBudget ? monthSpent / budget : 0;
  const percent = Math.round(ratio * 100);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(val);

  const getStatusColor = () => {
    if (!hasBudget) return '#0A84FF';
    if (ratio >= 1) return '#FF453A';
    if (ratio >= 0.8) return '#FF9F0A';
    return '#34C759';
  };

  const handleSaveBudget = async () => {
    const parsed = parseInt(budgetInput.replace(/\D/g, '') || '0', 10);
    await onUpdateCategory({
      ...category,
      monthlyBudget: parsed > 0 ? parsed : undefined,
    });
    setIsEditingBudget(false);
  };

  return (
    <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex flex-col gap-2 hover:bg-white/[0.06] transition-all">
      {/* Hàng trên: Tên + Màu + Thao tác */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            className="w-3 h-3 rounded-full flex-shrink-0 shadow-sm"
            style={{ backgroundColor: category.color }}
          />
          <span className="text-[13px] font-semibold text-white/90 truncate">{category.name}</span>
          {hasBudget && ratio >= 0.8 && (
            <ShieldAlert
              className={`w-3.5 h-3.5 flex-shrink-0 ${ratio >= 1 ? 'text-[#FF453A]' : 'text-[#FF9F0A]'}`}
            />
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsEditingBudget(!isEditingBudget)}
            className="p-1.5 text-white/30 hover:text-white/80 transition-colors"
            title="Sửa hạn mức"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              if (confirm(`Xóa danh mục "${category.name}"?`)) {
                onDelete(category.id);
              }
            }}
            className="p-1.5 text-white/30 hover:text-[#FF453A] transition-colors"
            title="Xóa danh mục"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Chế độ sửa hạn mức inline */}
      {isEditingBudget ? (
        <div className="flex items-center gap-2 pt-1 border-t border-white/[0.06]">
          <span className="text-[11px] text-white/40">Hạn mức tháng:</span>
          <input
            type="text"
            inputMode="numeric"
            placeholder="0₫ (Tắt)"
            value={budgetInput ? formatCurrency(parseInt(budgetInput.replace(/\D/g, '') || '0', 10)) : ''}
            onChange={(e) => setBudgetInput(e.target.value.replace(/\D/g, ''))}
            className="flex-1 bg-black/50 px-2.5 py-1 rounded-lg text-[12px] text-white outline-none border border-white/15 focus:border-white/30 tabular-nums"
            autoFocus
          />
          <button
            onClick={handleSaveBudget}
            className="p-1.5 rounded-lg bg-ios-blue text-white text-[11px] font-bold"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsEditingBudget(false)}
            className="p-1.5 rounded-lg bg-white/10 text-white/60 text-[11px]"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : hasBudget ? (
        /* Thanh tiến độ hạn mức */
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-white/50">
              Đã tiêu: <b className="text-white/80 tabular-nums">{formatCurrency(monthSpent)}₫</b>
            </span>
            <span
              className="font-bold tabular-nums"
              style={{ color: getStatusColor() }}
            >
              {percent}% / {formatCurrency(budget)}₫
            </span>
          </div>

          <div className="w-full h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, percent)}%`,
                backgroundColor: getStatusColor(),
              }}
            />
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between text-[11px] text-white/40">
          <span>Đã tiêu tháng này: {formatCurrency(monthSpent)}₫</span>
          <button
            onClick={() => setIsEditingBudget(true)}
            className="text-[11px] text-ios-blue/80 hover:text-ios-blue font-medium"
          >
            + Đặt hạn mức
          </button>
        </div>
      )}
    </div>
  );
};
