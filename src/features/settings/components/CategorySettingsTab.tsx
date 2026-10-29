import React, { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import type { Category, Transaction } from '../../../types';
import { CategoryListItem } from './CategoryListItem';

interface CategorySettingsTabProps {
  categories: Category[];
  transactions?: Transaction[];
  onAddCategory: (cat: Omit<Category, 'id'>) => Promise<void>;
  onUpdateCategory: (cat: Category) => Promise<void>;
  onDeleteCategory: (id: string) => Promise<void>;
}

const PRESET_COLORS = [
  '#FF453A',
  '#FF9F0A',
  '#FFD60A',
  '#34C759',
  '#0A84FF',
  '#BF5AF2',
  '#FF375F',
];

export const CategorySettingsTab: React.FC<CategorySettingsTabProps> = ({
  categories,
  transactions = [],
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
}) => {
  const [newCatName, setNewCatName] = useState('');
  const [newCatBudget, setNewCatBudget] = useState('');
  const [newCatColor, setNewCatColor] = useState('#0A84FF');
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

  const currentMonthKey = new Date().toISOString().slice(0, 7);
  const categorySpentMap = useMemo(() => {
    const map = new Map<string, number>();
    transactions
      .filter((t) => t.date.startsWith(currentMonthKey) && t.type === 'EXPENSE')
      .forEach((t) => {
        const k = t.categoryId || 'unknown';
        map.set(k, (map.get(k) || 0) + t.amount);
      });
    return map;
  }, [transactions, currentMonthKey]);

  const formatInputNumber = (val: string) => {
    const num = parseInt(val.replace(/\D/g, '') || '0', 10);
    return num > 0 ? new Intl.NumberFormat('vi-VN').format(num) : '';
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const parsedBudget = parseInt(newCatBudget.replace(/\D/g, '') || '0', 10);
    await onAddCategory({
      name: newCatName.trim(),
      type: 'EXPENSE',
      icon: 'Tag',
      color: newCatColor,
      monthlyBudget: parsedBudget > 0 ? parsedBudget : undefined,
    });
    setNewCatName('');
    setNewCatBudget('');
  };

  return (
    <div className="space-y-3">
      {/* Form thêm danh mục: Không còn các hạn mức cho sẵn 1M/2M/5M */}
      <form
        onSubmit={handleCreateCategory}
        className="p-3.5 rounded-[20px] bg-[#18181D] border border-white/[0.07] space-y-3"
      >
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Tên danh mục"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            className="flex-1 min-w-0 bg-[#0E0E11] px-3.5 py-2 rounded-full text-[13px] text-white border border-white/[0.08] outline-none placeholder:text-white/30 focus:border-white/25"
          />
          <input
            type="text"
            inputMode="numeric"
            placeholder="Hạn mức"
            value={formatInputNumber(newCatBudget)}
            onChange={(e) => setNewCatBudget(e.target.value.replace(/\D/g, ''))}
            className="w-28 bg-[#0E0E11] px-3 py-2 rounded-full text-[13px] text-white border border-white/[0.08] outline-none placeholder:text-white/30 focus:border-white/25 tabular-nums"
          />
          <button
            type="submit"
            disabled={!newCatName.trim()}
            className="w-9 h-9 rounded-full bg-[#0A84FF] text-white flex items-center justify-center disabled:opacity-30 active:scale-95 transition-all flex-shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-1">
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setNewCatColor(c)}
              className={`w-4 h-4 rounded-full transition-transform ${
                newCatColor === c
                  ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-[#18181D]'
                  : 'opacity-70 hover:opacity-100'
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </form>

      {/* Danh sách danh mục */}
      <div className="space-y-2">
        {categories.map((cat) => (
          <CategoryListItem
            key={cat.id}
            category={cat}
            monthSpent={categorySpentMap.get(cat.id) || 0}
            isEditing={editingCategoryId === cat.id}
            onToggleEdit={() =>
              setEditingCategoryId((prev) => (prev === cat.id ? null : cat.id))
            }
            onCloseEdit={() => setEditingCategoryId(null)}
            onDelete={onDeleteCategory}
            onUpdateCategory={onUpdateCategory}
          />
        ))}
      </div>
    </div>
  );
};
