import { useState, useMemo } from 'react';
import { useFinanceData } from './hooks/useFinanceData';
import { Header } from './features/dashboard';
import { CalendarGrid } from './features/calendar';
import {
  DayAlbumModal,
  QuickCaptureModal,
} from './features/spending';
import { MonthlyRecapModal } from './features/analytics';
import { SettingsModal } from './features/settings';
import { BottomTabBar } from './components/BottomTabBar';
import type { TabType } from './components/BottomTabBar';
import type { DaySpendingGroup } from './types';

export function App() {
  const finance = useFinanceData();

  // Modal UI state
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [isQuickCaptureOpen, setIsQuickCaptureOpen] = useState(false);
  const [quickCaptureDate, setQuickCaptureDate] = useState<string | undefined>();
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isMonthlyRecapOpen, setIsMonthlyRecapOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Tự động đồng bộ các khoản chi tiêu của ngày đang chọn (khi xóa/thêm sẽ cập nhật tức thì)
  const selectedDayTransactions = useMemo(() => {
    if (!selectedDate) return [];
    return finance.transactions.filter((t) => t.date === selectedDate);
  }, [finance.transactions, selectedDate]);

  const selectedDayGroup = useMemo<DaySpendingGroup | null>(() => {
    if (!selectedDate || selectedDayTransactions.length === 0) return null;
    const dateObj = new Date(selectedDate);
    const dayNumber = dateObj.getDate();
    const totalExpense = selectedDayTransactions
      .filter((t) => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalIncome = selectedDayTransactions
      .filter((t) => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0);
    const photos = selectedDayTransactions
      .map((t) => t.photoUrl)
      .filter((p): p is string => Boolean(p));

    return {
      date: selectedDate,
      dayNumber,
      weekdayIndex: (dateObj.getDay() + 6) % 7,
      totalExpense,
      totalIncome,
      transactions: selectedDayTransactions,
      photos,
    };
  }, [selectedDate, selectedDayTransactions]);

  const handleSelectTab = (tab: TabType) => {
    setCurrentTab(tab);
    if (tab === 'stats') {
      setIsMonthlyRecapOpen(true);
    }
  };

  if (finance.isLoading) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center text-ios-gray-1">
        <span className="text-[14px]">Đang tải dữ liệu...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas text-white max-w-md mx-auto relative flex flex-col pb-16 selection:bg-ios-blue">
      {/* 1. Fixed Header (Cố định ở trên, chìm dần mềm mại không có vệt cắt) */}
      <div className="sticky top-0 z-30 pointer-events-none">
        {/* Vùng Header tương tác */}
        <div className="pointer-events-auto bg-canvas">
          <Header
            userName={finance.userProfile.name}
            avatarUrl={finance.userProfile.avatarUrl}
            todayExpense={finance.todayExpense}
            totalExpenseCount={finance.totalExpenseCount}
            categories={finance.categories}
            selectedCategoryId={finance.selectedCategoryId}
            onSelectCategory={finance.setSelectedCategoryId}
            onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
          />
        </div>
        {/* Lớp gradient chuyển tiếp 56px giúp các ô lịch chìm dần tự nhiên, xóa bỏ hoàn toàn cảm giác ngăn cách */}
        <div
          className="w-full h-14 pointer-events-none"
          style={{
            background:
              'linear-gradient(to bottom, #0E0E11 0%, rgba(14, 14, 17, 0.85) 30%, rgba(14, 14, 17, 0.4) 65%, transparent 100%)',
          }}
        />
      </div>

      {/* 2. Main Calendar Photo Matrix (Continuous Multi-Month Feed) */}
      <main className="flex-1 mt-2">
        <CalendarGrid
          monthsData={finance.monthsData}
          onSelectDay={(dayGroup) => setSelectedDate(dayGroup.date)}
          onSelectEmptyDay={(dateStr) => {
            setQuickCaptureDate(dateStr);
            setIsQuickCaptureOpen(true);
          }}
        />
      </main>

      {/* 3. Floating Bottom Navigation (Chỉ còn Trang chủ & Thống kê) & FAB (+) */}
      <BottomTabBar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        onOpenQuickAdd={() => {
          setQuickCaptureDate(undefined);
          setIsQuickCaptureOpen(true);
        }}
      />

      {/* 4. Modals */}
      <DayAlbumModal
        isOpen={!!selectedDayGroup}
        onClose={() => setSelectedDate(null)}
        dayGroup={selectedDayGroup}
        categories={finance.categories}
        onDeleteTransaction={finance.handleDeleteTransaction}
        onAddMorePhoto={(date) => {
          setSelectedDate(null);
          setQuickCaptureDate(date);
          setIsQuickCaptureOpen(true);
        }}
      />

      <QuickCaptureModal
        isOpen={isQuickCaptureOpen}
        onClose={() => setIsQuickCaptureOpen(false)}
        categories={finance.categories}
        initialDate={quickCaptureDate}
        onSaveTransaction={finance.handleSaveTransaction}
      />

      <MonthlyRecapModal
        isOpen={isMonthlyRecapOpen}
        onClose={() => {
          setIsMonthlyRecapOpen(false);
          setCurrentTab('home');
        }}
        transactions={finance.transactions}
        categories={finance.categories}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        categories={finance.categories}
        onAddCategory={finance.handleAddCategory}
        onDeleteCategory={finance.handleDeleteCategory}
        onExportData={finance.handleExportData}
        onImportData={finance.handleImportData}
        onResetSampleData={finance.handleResetSampleData}
        userProfile={finance.userProfile}
        onUpdateProfile={finance.handleUpdateProfile}
      />
    </div>
  );
}

export default App;
