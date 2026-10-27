import { useState, useEffect, useMemo } from 'react';
import {
  getAllTransactions,
  getAllCategories,
  addTransaction,
  deleteTransaction,
  saveCategory,
  deleteCategoryAndUnbind,
  exportAllData,
  importAllData,
  clearAllData,
} from '../services/db';
import { INITIAL_CATEGORIES } from '../services/sampleData';
import type { Transaction, Category, DaySpendingGroup, MonthSpendingData, UserProfile } from '../types';

export function useFinanceData() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // User profile
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('locket_user_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.name && parsed.name !== 'Lâm Lơ') {
          return parsed;
        }
      } catch {
        // fallback
      }
    }
    return {
      name: 'Bạn',
      avatarUrl: '',
    };
  });

  const handleUpdateProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem('locket_user_profile', JSON.stringify(profile));
  };

  // View preferences
  const [currentMonth] = useState<Date>(new Date());
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('ALL');
  const [isPrivacyMode, setIsPrivacyMode] = useState<boolean>(false);

  // 1. Initial Load from IndexedDB - Chuẩn bị môi trường Clean 100% cho Production
  const loadData = async () => {
    try {
      const storedTxs = await getAllTransactions();
      const storedCats = await getAllCategories();

      if (storedCats.length === 0) {
        for (const cat of INITIAL_CATEGORIES) {
          await saveCategory(cat);
        }
        setCategories(INITIAL_CATEGORIES);
      } else {
        setCategories(storedCats);
      }

      // Tự động dọn sạch dữ liệu demo/fake đã tạo trong giai đoạn dev để người dùng có app mới tinh 100%
      const isCleaned = localStorage.getItem('locket_prod_clean_v4');
      if (!isCleaned) {
        // Lọc bỏ toàn bộ giao dịch mẫu (có ID dạng tx-1, tx-2, tx-sep-, tx-aug-...)
        const isSampleTx = (id: string) => {
          return (
            id.startsWith('tx-sep-') ||
            id.startsWith('tx-aug-') ||
            id.startsWith('tx-demo') ||
            /^tx-\d{1,2}[a-z]?$/.test(id)
          );
        };

        const realUserTxs: Transaction[] = [];
        for (const tx of storedTxs) {
          if (isSampleTx(tx.id)) {
            await deleteTransaction(tx.id);
          } else {
            realUserTxs.push(tx);
          }
        }

        const savedProfileStr = localStorage.getItem('locket_user_profile');
        if (savedProfileStr && savedProfileStr.includes('Lâm Lơ')) {
          localStorage.removeItem('locket_user_profile');
          setUserProfile({ name: 'Bạn', avatarUrl: '' });
        }

        localStorage.setItem('locket_prod_clean_v4', 'true');
        setTransactions(realUserTxs);
      } else {
        setTransactions(storedTxs);
      }
    } catch (e) {
      console.error('Lỗi nạp dữ liệu Local:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 2. Computed Metrics (Lọc theo Danh mục chi tiêu được chọn)
  const filteredTransactions = useMemo(() => {
    if (selectedCategoryId === 'ALL') return transactions;
    return transactions.filter((t) => t.categoryId === selectedCategoryId);
  }, [transactions, selectedCategoryId]);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;

  // Toàn bộ giao dịch tháng hiện tại (độc lập với bộ lọc danh mục trên trang chủ)
  const currentMonthTransactions = useMemo(() => {
    return transactions.filter((t) => t.date.startsWith(monthPrefix));
  }, [transactions, monthPrefix]);

  const totalExpense = useMemo(() => {
    return currentMonthTransactions
      .filter((t) => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [currentMonthTransactions]);

  const photoCount = useMemo(() => {
    return currentMonthTransactions.filter((t) => !!t.photoUrl).length;
  }, [currentMonthTransactions]);

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const todayExpense = useMemo(() => {
    return transactions
      .filter((t) => t.date === todayStr && t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions, todayStr]);

  // Tổng số khoản chi tiêu đã ghi
  const totalExpenseCount = useMemo(() => {
    return transactions.filter((t) => t.type === 'EXPENSE').length;
  }, [transactions]);

  // 3. Multi-Month Continuous Feed Computation
  const monthsData = useMemo<MonthSpendingData[]>(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonthNum = now.getMonth();
    const currentKey = `${currentYear}-${String(currentMonthNum + 1).padStart(2, '0')}`;

    const monthKeysSet = new Set<string>();
    monthKeysSet.add(currentKey);

    filteredTransactions.forEach((tx) => {
      const parts = tx.date.split('-');
      if (parts.length >= 2) {
        monthKeysSet.add(`${parts[0]}-${parts[1]}`);
      }
    });

    // Sắp xếp theo thứ tự thời gian tăng dần: Tháng cũ ở trên, tháng mới ở dưới
    // Người dùng cuộn lên trên để xem quá khứ, cuộn xuống dưới về hiện tại
    const sortedKeys = Array.from(monthKeysSet).sort((a, b) => a.localeCompare(b));

    return sortedKeys.map((key) => {
      const [yStr, mStr] = key.split('-');
      const y = parseInt(yStr, 10);
      const m = parseInt(mStr, 10) - 1; // 0-indexed

      const mPrefix = `${y}-${String(m + 1).padStart(2, '0')}`;
      const monthTxs = filteredTransactions.filter((t) => t.date.startsWith(mPrefix));

      const firstDay = new Date(y, m, 1).getDay();
      const startOffset = (firstDay + 6) % 7;
      const totalDays = new Date(y, m + 1, 0).getDate();

      const daysMap = new Map<number, DaySpendingGroup>();
      let monthTotal = 0;
      let monthPhotos = 0;

      monthTxs.forEach((tx) => {
        const dayNum = parseInt(tx.date.split('-')[2], 10);
        if (!daysMap.has(dayNum)) {
          const d = new Date(y, m, dayNum);
          daysMap.set(dayNum, {
            date: tx.date,
            dayNumber: dayNum,
            weekdayIndex: (d.getDay() + 6) % 7,
            totalExpense: 0,
            totalIncome: 0,
            transactions: [],
            photos: [],
          });
        }

        const group = daysMap.get(dayNum)!;
        group.transactions.push(tx);
        if (tx.type === 'EXPENSE') {
          group.totalExpense += tx.amount;
          monthTotal += tx.amount;
          if (tx.photoUrl) {
            group.photos.push(tx.photoUrl);
            monthPhotos += 1;
          }
        }
        if (tx.categoryId) {
          group.topCategory = categories.find((c) => c.id === tx.categoryId);
        }
      });

      return {
        year: y,
        month: m,
        monthKey: key,
        label: `Tháng ${m + 1}, ${y}`,
        totalExpense: monthTotal,
        totalPhotos: monthPhotos,
        startOffset,
        totalDays,
        daysData: daysMap,
      };
    });
  }, [filteredTransactions, categories]);

  // Days grouped for current month (compatibility)
  const daysData = useMemo(() => {
    return monthsData[0]?.daysData || new Map<number, DaySpendingGroup>();
  }, [monthsData]);

  // 3. Actions
  const handleSaveTransaction = async (txData: Omit<Transaction, 'id' | 'timestamp'>): Promise<void> => {
    const newTx: Transaction = {
      ...txData,
      id: 'tx-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      timestamp: new Date().toISOString(),
    };
    await addTransaction(newTx);
    setTransactions((prev) => [newTx, ...prev]);
  };

  const handleDeleteTransaction = async (id: string) => {
    await deleteTransaction(id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const handleAddCategory = async (catData: Omit<Category, 'id'>) => {
    const newCat: Category = {
      ...catData,
      id: 'cat-' + Date.now(),
    };
    await saveCategory(newCat);
    setCategories((prev) => [...prev, newCat]);
  };

  const handleUpdateCategory = async (updatedCat: Category) => {
    await saveCategory(updatedCat);
    setCategories((prev) => prev.map((c) => (c.id === updatedCat.id ? updatedCat : c)));
  };

  const handleDeleteCategory = async (id: string) => {
    await deleteCategoryAndUnbind(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
    const freshTxs = await getAllTransactions();
    setTransactions(freshTxs);
  };

  const handleExportData = async () => {
    const jsonStr = await exportAllData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LocketFinance_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const content = event.target?.result as string;
        const success = await importAllData(content);
        if (success) {
          alert('Khôi phục dữ liệu thành công!');
          await loadData();
        } else {
          alert('File sao lưu không hợp lệ.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleResetSampleData = async () => {
    await clearAllData();
    for (const cat of INITIAL_CATEGORIES) {
      await saveCategory(cat);
    }
    setCategories(INITIAL_CATEGORIES);
    setTransactions([]);
    localStorage.removeItem('locket_user_profile');
    setUserProfile({ name: 'Bạn', avatarUrl: '' });
    localStorage.setItem('locket_prod_clean_v4', 'true');
  };

  return {
    isLoading,
    transactions,
    categories,
    currentMonth,
    selectedCategoryId,
    setSelectedCategoryId,
    isPrivacyMode,
    togglePrivacyMode: () => setIsPrivacyMode((prev) => !prev),
    currentMonthTransactions,
    totalExpense,
    photoCount,
    todayExpense,
    totalExpenseCount,
    daysData,
    monthsData,
    handleSaveTransaction,
    handleDeleteTransaction,
    handleAddCategory,
    handleUpdateCategory,
    handleDeleteCategory,
    handleExportData,
    handleImportData,
    handleResetSampleData,
    userProfile,
    handleUpdateProfile,
  };
}
