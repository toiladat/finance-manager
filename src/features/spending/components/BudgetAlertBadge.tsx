import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { BudgetAlertInfo } from '../hooks/useCategoryBudgetAlert';

interface BudgetAlertBadgeProps {
  alertInfo: BudgetAlertInfo;
}

const formatNum = (val: number) =>
  new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(val);

export const BudgetAlertBadge: React.FC<BudgetAlertBadgeProps> = ({ alertInfo }) => {
  const { status, categoryName, categoryColor, budget, projectedTotal, percent } = alertInfo;

  if (status === 'NONE') return null;

  const isExceeded = status === 'EXCEEDED_100';
  const accentColor = isExceeded ? '#FF453A' : categoryColor || '#0A84FF';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ type: 'spring', stiffness: 420, damping: 32 }}
        className="w-full px-3.5 py-2.5 rounded-2xl bg-[#18181D] border border-white/[0.07]"
      >
        <div className="flex items-center justify-between gap-2 text-[12px] mb-1.5">
          <span className="font-medium text-white/80 truncate">{categoryName}</span>

          <div className="flex items-baseline gap-1 tabular-nums flex-shrink-0">
            <span className={`font-bold ${isExceeded ? 'text-[#FF453A]' : 'text-white'}`}>
              {formatNum(projectedTotal)}
            </span>
            <span className="text-[#8E8E93]">/ {formatNum(budget)}₫</span>
          </div>
        </div>

        <div className="w-full h-1 rounded-full bg-white/[0.07] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${Math.min(100, percent)}%`,
              backgroundColor: accentColor,
            }}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
