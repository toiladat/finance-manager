export type TransactionType = 'EXPENSE' | 'INCOME';

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  icon: string; // Lucide icon name or emoji
  color: string; // Hex color
  isDefault?: boolean;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  categoryId?: string | null;
  date: string; // YYYY-MM-DD
  timestamp: string; // ISO string
  note?: string;
  photoUrl?: string; // WebP data URL or compressed blob URL
  account?: string; // 'Tech' | 'Wallet' | 'Momo' | 'Tất cả'
}

export interface DaySpendingGroup {
  date: string; // YYYY-MM-DD
  dayNumber: number;
  weekdayIndex: number; // 0 for Mon ... 6 for Sun
  totalExpense: number;
  totalIncome: number;
  transactions: Transaction[];
  photos: string[];
  topCategory?: Category;
}

export interface MonthlyBudget {
  month: string; // YYYY-MM
  totalBudget: number;
  spentSoFar: number;
  remainingDays: number;
}

export interface MonthSpendingData {
  year: number;
  month: number; // 0-indexed (0 = Jan ... 9 = Oct)
  monthKey: string; // "YYYY-MM"
  label: string; // "Tháng 10, 2026"
  totalExpense: number;
  totalPhotos: number;
  startOffset: number; // 0 for Mon ... 6 for Sun
  totalDays: number;
  daysData: Map<number, DaySpendingGroup>;
}

export interface UserProfile {
  name: string;
  avatarUrl: string;
}
