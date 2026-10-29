import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, AlertCircle } from 'lucide-react';
import type { BudgetAlertInfo } from '../hooks/useCategoryBudgetAlert';

interface BudgetAlertBadgeProps {
  alertInfo: BudgetAlertInfo;
}

export const BudgetAlertBadge: React.FC<BudgetAlertBadgeProps> = ({ alertInfo }) => {
  const { status, categoryName, categoryColor, percent, overAmount, remainingAmount } = alertInfo;

  if (status === 'NONE') return null;

  const formatCompact = (val: number) => {
    if (val >= 1000000) {
      const m = val / 1000000;
      return `${Number.isInteger(m) ? m : m.toFixed(1).replace('.', ',')}tr`;
    }
    if (val >= 1000) {
      return `${Math.round(val / 1000)}k`;
    }
    return `${val}₫`;
  };

  const isExceeded = status === 'EXCEEDED_100';
  const isWarning = status === 'WARNING_80';

  const accentColor = isExceeded
    ? '#FF453A'
    : isWarning
    ? '#FF9F0A'
    : categoryColor || '#34C759';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ type: 'spring', stiffness: 420, damping: 32 }}
        className={`w-full px-3.5 py-2 rounded-2xl border transition-colors ${
          isExceeded
            ? 'bg-[#FF453A]/12 border-[#FF453A]/30'
            : isWarning
            ? 'bg-[#FF9F0A]/12 border-[#FF9F0A]/30'
            : 'bg-[#18181D] border-white/[0.07]'
        }`}
      >
        <div className="flex items-center justify-between gap-2 text-[12px]">
          <div className="flex items-center gap-1.5 min-w-0">
            {isExceeded ? (
              <AlertCircle className="w-3.5 h-3.5 text-[#FF453A] flex-shrink-0" />
            ) : isWarning ? (
              <AlertTriangle className="w-3.5 h-3.5 text-[#FF9F0A] flex-shrink-0" />
            ) : (
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: accentColor }}
              />
            )}
            <span
              className={`font-semibold truncate ${
                isExceeded
                  ? 'text-[#FF453A]'
                  : isWarning
                  ? 'text-[#FF9F0A]'
                  : 'text-white/80'
              }`}
            >
              {isExceeded
                ? `Vượt hạn mức ${categoryName}`
                : isWarning
                ? `Sắp chạm hạn mức ${categoryName}`
                : `Hạn mức ${categoryName}`}
            </span>
          </div>

          <span className="text-[11px] font-semibold tabular-nums text-white/70 flex-shrink-0">
            {isExceeded
              ? `${percent}% (+${formatCompact(overAmount)})`
              : `${percent}% • Còn ${formatCompact(remainingAmount)}`}
          </span>
        </div>

        {/* Thanh micro-progress 3px tinh gọn */}
        <div className="w-full h-1 rounded-full bg-white/[0.08] overflow-hidden mt-1.5">
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
