import React from 'react';
import { Home, PieChart, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export type TabType = 'home' | 'stats';

interface BottomTabBarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onOpenQuickAdd: () => void;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  currentTab,
  onSelectTab,
  onOpenQuickAdd,
}) => {
  const tabs = [
    { id: 'home' as TabType, label: 'Trang chủ', icon: Home },
    { id: 'stats' as TabType, label: 'Thống kê', icon: PieChart },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none pb-[calc(env(safe-area-inset-bottom,0px)+12px)] px-4 flex items-center justify-center">
      {/* Floating Action Button (+) */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.92 }}
        onClick={onOpenQuickAdd}
        className="absolute bottom-20 right-6 w-14 h-14 rounded-full bg-gradient-to-tr from-[#0A84FF] to-[#60A5FA] text-white shadow-xl flex items-center justify-center border-2 border-white/20 pointer-events-auto z-50 group"
      >
        <Plus className="w-7 h-7 stroke-[2.5] group-active:rotate-90 transition-transform duration-200" />
      </motion.button>

      {/* Sleek 2-Tab Floating Glassmorphic Pill */}
      <div className="w-64 h-14 bg-[#18181D]/90 backdrop-blur-2xl border border-hairline rounded-full flex items-center justify-around px-2 shadow-2xl pointer-events-auto">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          const Icon = tab.icon;

          return (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.92 }}
              onClick={() => onSelectTab(tab.id)}
              className={`flex items-center justify-center gap-2 flex-1 h-10 rounded-full transition-all ${
                isActive
                  ? 'bg-card-elevated text-white shadow-sm border border-white/10'
                  : 'text-ios-gray-1 hover:text-white/80'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.2] text-ios-blue' : 'stroke-[1.8]'}`} />
              <span className={`text-[12px] font-medium ${isActive ? 'font-semibold text-white' : ''}`}>
                {tab.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
