import { useMemo, useState } from 'react';
import type { Transaction, Category } from '../../../types';

interface UseMonthlyRecapStatsProps {
  transactions: Transaction[];
  categories: Category[];
}

export function useMonthlyRecapStats({
  transactions,
  categories,
}: UseMonthlyRecapStatsProps) {
  // Tìm tất cả các tháng có phát sinh chi tiêu (sắp xếp từ mới nhất về cũ nhất)
  const availableMonths = useMemo(() => {
    const monthSet = new Set<string>();
    transactions.forEach((tx) => {
      const parts = tx.date.split('-');
      if (parts.length >= 2) {
        monthSet.add(`${parts[0]}-${parts[1]}`);
      }
    });

    if (monthSet.size === 0) {
      const now = new Date();
      monthSet.add(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`);
    }

    return Array.from(monthSet)
      .sort((a, b) => b.localeCompare(a))
      .map((key) => {
        const [y, m] = key.split('-').map(Number);
        return {
          key,
          label: `Tháng ${m}`,
          fullLabel: `Tháng ${m}, ${y}`,
        };
      });
  }, [transactions]);

  const [selectedMonthKey, setSelectedMonthKey] = useState<string>(() => {
    return availableMonths[0]?.key || '';
  });

  const activeMonthKey = selectedMonthKey || availableMonths[0]?.key || '';

  // Lọc giao dịch chuẩn xác cho tháng đang chọn
  const monthTransactions = useMemo(() => {
    return transactions.filter((t) => t.date.startsWith(activeMonthKey));
  }, [transactions, activeMonthKey]);

  // Chi tiêu
  const expenses = useMemo(() => {
    return monthTransactions.filter((t) => t.type === 'EXPENSE');
  }, [monthTransactions]);

  const photos = useMemo(() => {
    return expenses.filter((t) => !!t.photoUrl);
  }, [expenses]);

  const totalSpent = useMemo(() => {
    return expenses.reduce((sum, t) => sum + t.amount, 0);
  }, [expenses]);

  // 1. Khoản chi đơn lẻ lớn nhất
  const biggestExpense = useMemo(() => {
    if (expenses.length === 0) return undefined;
    return [...expenses].sort((a, b) => b.amount - a.amount)[0];
  }, [expenses]);

  // 2. Ngày tiêu nhiều tiền nhất
  const { peakDate, peakAmount, peakPhoto } = useMemo(() => {
    const map = new Map<string, { total: number; photo?: string }>();
    expenses.forEach((t) => {
      const cur = map.get(t.date) || { total: 0 };
      map.set(t.date, {
        total: cur.total + t.amount,
        photo: cur.photo || t.photoUrl,
      });
    });

    let pDate = '';
    let pAmount = 0;
    let pPhoto: string | undefined;

    map.forEach((val, date) => {
      if (val.total > pAmount) {
        pAmount = val.total;
        pDate = date;
        pPhoto = val.photo;
      }
    });

    return { peakDate: pDate, peakAmount: pAmount, peakPhoto: pPhoto };
  }, [expenses]);

  // 3. Danh mục chiếm nhiều tiền nhất
  const { topCategory, topCatAmount, topCatPercent, topCatPhotos } = useMemo(() => {
    const catMap = new Map<string, number>();
    expenses.forEach((t) => {
      const k = t.categoryId || 'unknown';
      catMap.set(k, (catMap.get(k) || 0) + t.amount);
    });

    let topId = '';
    let maxAmt = 0;
    catMap.forEach((amt, id) => {
      if (amt > maxAmt) {
        maxAmt = amt;
        topId = id;
      }
    });

    const catObj = categories.find((c) => c.id === topId) || {
      id: 'unknown',
      name: 'Chưa phân loại',
      color: '#0A84FF',
      type: 'EXPENSE' as const,
      icon: 'Tag',
      isDefault: false,
    };

    const percent = totalSpent > 0 ? Math.round((maxAmt / totalSpent) * 100) : 0;

    const catPhotos = expenses
      .filter((t) => (t.categoryId || 'unknown') === topId && !!t.photoUrl)
      .map((t) => t.photoUrl as string)
      .slice(0, 3);

    return {
      topCategory: catObj,
      topCatAmount: maxAmt,
      topCatPercent: percent,
      topCatPhotos: catPhotos,
    };
  }, [expenses, categories, totalSpent]);

  // Tách ngày giờ an toàn chống lệch timezone
  const { peakWeekday, peakDayNumber, peakMonthNumber } = useMemo(() => {
    if (!peakDate) {
      return { peakWeekday: '', peakDayNumber: 1, peakMonthNumber: 1 };
    }
    const [y, m, d] = peakDate.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    return {
      peakWeekday: dateObj.toLocaleDateString('vi-VN', { weekday: 'short' }),
      peakDayNumber: d,
      peakMonthNumber: m,
    };
  }, [peakDate]);

  const previewPhotos = useMemo(() => {
    return photos.map((t) => t.photoUrl).filter(Boolean) as string[];
  }, [photos]);

  const activeMonthInfo = availableMonths.find((m) => m.key === activeMonthKey);
  const currentMonthName = activeMonthInfo ? activeMonthInfo.fullLabel : 'Tháng này';

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + ' ₫';
  };

  const formatDateVi = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  return {
    availableMonths,
    activeMonthKey,
    setSelectedMonthKey,
    currentMonthName,
    expenses,
    photos,
    totalSpent,
    biggestExpense,
    peakDate,
    peakAmount,
    peakPhoto,
    peakWeekday,
    peakDayNumber,
    peakMonthNumber,
    topCategory,
    topCatAmount,
    topCatPercent,
    topCatPhotos,
    previewPhotos,
    formatCurrency,
    formatDateVi,
  };
}
