import type { CategoryBudgetItem } from '../hooks/useCategoryBudgets';

export const formatAmount = (val: number): string =>
  new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(val);

export const formatCompact = (val: number): string => {
  if (val >= 1000000) {
    const millions = val / 1000000;
    return `${Number.isInteger(millions) ? millions : millions.toFixed(1).replace('.', ',')}tr`;
  }
  return val >= 1000 ? `${Math.round(val / 1000)}k` : formatAmount(val);
};

export const getBudgetTone = (item: CategoryBudgetItem, normalColor = '#FFFFFF'): string => {
  if (item.isExceeded100) return '#FF453A';
  if (item.isWarning80) return '#FF9F0A';
  return normalColor;
};
