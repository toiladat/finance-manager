import React from 'react';
import { Flame, ShoppingCart, User } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Category } from '../../../types';

interface HeaderProps {
  userName?: string;
  avatarUrl?: string;
  todayExpense: number;
  totalExpenseCount: number;
  categories: Category[];
  selectedCategoryId: string;
  onSelectCategory: (catId: string) => void;
  onOpenSettingsModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  userName = 'Lâm Lơ',
  avatarUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  todayExpense,
  totalExpenseCount,
  categories,
  selectedCategoryId,
  onSelectCategory,
  onOpenSettingsModal,
}) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + 'đ';
  };

  const [currentTime, setCurrentTime] = React.useState(() => new Date());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Tự động cập nhật mỗi phút
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour >= 5 && hour < 11) return 'Chào buổi sáng 🌅';
    if (hour >= 11 && hour < 14) return 'Chào buổi trưa ☀️';
    if (hour >= 14 && hour < 18) return 'Chào buổi chiều 🌤️';
    if (hour >= 18 && hour < 22) return 'Chào buổi tối ✨';
    return 'Khuya rồi nghỉ ngơi thôi 🌙';
  };

  return (
    <header className="pt-[calc(env(safe-area-inset-top,0px)+14px)] px-4 pb-2 flex flex-col gap-3">
      {/* 1. Profile & Greeting Bar */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[13px] text-ios-gray-1 font-medium flex items-center gap-1.5">
            {getGreeting()}
          </span>
          <h1 className="text-[22px] font-bold tracking-tight text-white m-0">
            {userName}
          </h1>
          {/* Status chips: Hôm nay & Tổng số khoản chi tiêu */}
          <div className="flex items-center gap-2 mt-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.06] border border-hairline text-[11px] font-medium text-white/90">
              <ShoppingCart className="w-3 h-3 text-[#FF453A]" />
              <span>Đã chi {formatCurrency(todayExpense)} hôm nay</span>
            </div>
            <div
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-ios-orange/15 border border-ios-orange/30 text-[11px] font-semibold text-ios-orange"
              title="Tổng số khoản chi tiêu đã ghi"
            >
              <Flame className="w-3 h-3 fill-ios-orange text-ios-orange" />
              <span>{totalExpenseCount}</span>
            </div>
          </div>
        </div>

        {/* Right action: Avatar Cài đặt */}
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={onOpenSettingsModal}
          className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-white/20 p-0.5 bg-card-elevated flex items-center justify-center text-white"
          title="Cài đặt & Danh mục"
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover rounded-full" />
          ) : (
            <User className="w-5 h-5 text-white/70" />
          )}
        </motion.button>
      </div>

      {/* 2. Dynamic Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-0.5">
        {/* Tất cả */}
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={() => onSelectCategory('ALL')}
          className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-[12px] font-medium flex items-center gap-1.5 transition-all border ${
            selectedCategoryId === 'ALL'
              ? 'bg-ios-blue text-white border-transparent shadow-sm font-semibold'
              : 'bg-card border-hairline text-ios-gray-1 hover:text-white'
          }`}
        >
          <span>🗂️</span>
          <span>Tất cả</span>
        </motion.button>

        {/* Danh mục thực tế từ Database */}
        {categories
          .filter((c) => c.type === 'EXPENSE')
          .map((cat) => {
            const isSelected = selectedCategoryId === cat.id;
            return (
              <motion.button
                key={cat.id}
                whileTap={{ scale: 0.94 }}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-[12px] font-medium flex items-center gap-1.5 transition-all border ${
                  isSelected
                    ? 'bg-ios-blue text-white border-transparent shadow-sm font-semibold'
                    : 'bg-card border-hairline text-ios-gray-1 hover:text-white'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
                <span>{cat.name}</span>
              </motion.button>
            );
          })}
      </div>
    </header>
  );
};
