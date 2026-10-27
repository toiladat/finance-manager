import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, AlertOctagon, CheckCircle2 } from 'lucide-react';
import type { BudgetAlertInfo } from '../hooks/useCategoryBudgetAlert';

interface BudgetAlertBadgeProps {
  alertInfo: BudgetAlertInfo;
}

export const BudgetAlertBadge: React.FC<BudgetAlertBadgeProps> = ({ alertInfo }) => {
  const { status, categoryName, budget, projectedTotal, percent, overAmount, remainingAmount } = alertInfo;

  if (status === 'NONE') return null;

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(val);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -6, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -6, scale: 0.98 }}
        transition={{ type: 'spring', damping: 24, stiffness: 300 }}
        className="w-full"
      >
        {status === 'EXCEEDED_100' && (
          <div className="p-3 rounded-2xl bg-[#FF453A]/15 border border-[#FF453A]/30 flex items-start gap-2.5 shadow-lg shadow-[#FF453A]/5">
            <AlertOctagon className="w-4 h-4 text-[#FF453A] flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[12px] font-bold text-[#FF453A] tracking-tight">
                  Vượt hạn mức ({percent}%)
                </span>
                <span className="text-[11px] font-bold text-[#FF453A]/90 tabular-nums">
                  +{formatCurrency(overAmount)}
                </span>
              </div>
              <p className="text-[11px] text-white/70 mt-0.5 leading-snug">
                Dự kiến chi {formatCurrency(projectedTotal)} / hạn mức {formatCurrency(budget)} của danh mục &ldquo;{categoryName}&rdquo;
              </p>
            </div>
          </div>
        )}

        {status === 'WARNING_80' && (
          <div className="p-3 rounded-2xl bg-[#FF9F0A]/15 border border-[#FF9F0A]/30 flex items-start gap-2.5 shadow-lg shadow-[#FF9F0A]/5">
            <AlertTriangle className="w-4 h-4 text-[#FF9F0A] flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[12px] font-bold text-[#FF9F0A] tracking-tight">
                  Cận hạn mức ({percent}%)
                </span>
                <span className="text-[11px] font-medium text-[#FF9F0A]/90 tabular-nums">
                  Còn {formatCurrency(remainingAmount)}
                </span>
              </div>
              <p className="text-[11px] text-white/70 mt-0.5 leading-snug">
                Khoản chi này sẽ chạm {percent}% hạn mức {formatCurrency(budget)} của danh mục &ldquo;{categoryName}&rdquo;
              </p>
            </div>
          </div>
        )}

        {status === 'NORMAL' && (
          <div className="p-2.5 px-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5 text-white/60">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#34C759]" />
              <span>Trong ngân sách ({percent}%)</span>
            </div>
            <span className="text-white/40 tabular-nums">
              Còn {formatCurrency(remainingAmount)}
            </span>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
