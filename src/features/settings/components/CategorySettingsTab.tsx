import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import type { Category } from '../../../types';
import { CategoryListItem } from './CategoryListItem';

interface CategorySettingsTabProps {
  categories: Category[];
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
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
}) => {
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('#0A84FF');

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    await onAddCategory({
      name: newCatName.trim(),
      type: 'EXPENSE',
      icon: 'Tag',
      color: newCatColor,
    });
    setNewCatName('');
  };

  return (
    <div className="space-y-4">
      {/* Form tạo danh mục mới tối giản */}
      <form
        onSubmit={handleCreateCategory}
        className="p-3 rounded-[20px] bg-[#18181D] border border-white/[0.07] space-y-2.5"
      >
        <div className="flex items-center gap-2">
          <span
            className="w-3.5 h-3.5 rounded-full flex-shrink-0 ml-1"
            style={{ backgroundColor: newCatColor }}
          />
          <input
            type="text"
            placeholder="Thêm danh mục mới..."
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            className="flex-1 min-w-0 bg-transparent py-1 text-[14px] text-white outline-none placeholder:text-white/30"
          />
          <button
            type="submit"
            disabled={!newCatName.trim()}
            className="px-3.5 py-1.5 rounded-full bg-[#0A84FF] text-white text-[12px] font-semibold flex items-center gap-1 disabled:opacity-30 active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Thêm</span>
          </button>
        </div>

        {/* Bảng màu tinh gọn */}
        <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] px-1">
          <span className="text-[11px] text-[#8E8E93]">Màu nhận diện</span>
          <div className="flex items-center gap-2">
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
        </div>
      </form>

      {/* Danh sách danh mục dạng iOS Inset Grouped List */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider">
            Danh mục ({categories.length})
          </span>
          <span className="text-[11px] text-[#8E8E93]">
            Chạm để đặt hạn mức
          </span>
        </div>

        <div className="rounded-[20px] bg-[#18181D] border border-white/[0.07] overflow-hidden">
          {categories.map((cat) => (
            <CategoryListItem
              key={cat.id}
              category={cat}
              onDelete={onDeleteCategory}
              onUpdateCategory={onUpdateCategory}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
