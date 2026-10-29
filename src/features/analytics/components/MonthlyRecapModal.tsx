import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Transaction, Category } from '../../../types';
import { useMonthlyRecapStats } from '../hooks/useMonthlyRecapStats';
import { useCategoryBudgets } from '../hooks/useCategoryBudgets';
import { CategoryDonutChart } from './CategoryDonutChart';
import { RecapStorySlides } from './RecapStorySlides';
import { RecapPassSlide } from './RecapPassSlide';

interface MonthlyRecapModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
  categories: Category[];
  currentMonthName?: string;
}

export const MonthlyRecapModal: React.FC<MonthlyRecapModalProps> = ({
  isOpen,
  onClose,
  transactions,
  categories,
}) => {
  const [slideIndex, setSlideIndex] = useState(0);

  const stats = useMonthlyRecapStats({ transactions, categories });
  const categoryBudgets = useCategoryBudgets({
    transactions,
    categories,
    monthKey: stats.activeMonthKey,
  });

  // Reset về slide đầu tiên mỗi khi mở Modal
  useEffect(() => {
    if (isOpen) {
      setSlideIndex(0);
    }
  }, [isOpen]);

  // Bắn pháo giấy ở slide cuối
  useEffect(() => {
    if (isOpen && slideIndex === 5) {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 },
      });
    }
  }, [isOpen, slideIndex]);

  if (!isOpen) return null;

  const totalSlides = 6;

  const handleNext = () => {
    if (slideIndex < totalSlides - 1) setSlideIndex((prev) => prev + 1);
    else onClose();
  };

  const handlePrev = () => {
    if (slideIndex > 0) setSlideIndex((prev) => prev - 1);
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-2xl select-none"
        style={{ WebkitBackdropFilter: 'blur(20px)' }}
      >
        {/* Thanh tiến độ Story ở đỉnh (hỗ trợ bấm chọn trực tiếp từng slide) */}
        <div className="absolute top-[calc(env(safe-area-inset-top,0px)+12px)] left-4 right-4 z-50 flex items-center gap-1.5">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSlideIndex(i)}
              className="flex-1 py-2 group cursor-pointer"
              aria-label={`Slide ${i + 1}`}
            >
              <div className="w-full h-1 rounded-full bg-white/20 overflow-hidden">
                <div
                  className={`h-full bg-white transition-all duration-300 ${
                    i <= slideIndex ? 'w-full' : 'w-0'
                  }`}
                />
              </div>
            </button>
          ))}
        </div>

        {/* Nút đóng (X) */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-[calc(env(safe-area-inset-top,0px)+26px)] right-4 z-50 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors active:scale-95 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Vùng chạm điều hướng Trái/Phải toàn màn hình */}
        <div
          onClick={handlePrev}
          className="absolute inset-y-0 left-0 w-1/3 cursor-pointer z-20"
        />
        <div
          onClick={handleNext}
          className="absolute inset-y-0 right-0 w-2/3 cursor-pointer z-20"
        />

        {/* Nội dung từng Slide (pointer-events-none ở khung bao để không che vùng chạm chuyển slide) */}
        <div className="relative z-30 pointer-events-none w-full max-w-sm h-full flex flex-col items-center justify-center px-5 pt-[calc(env(safe-area-inset-top,0px)+55px)] pb-[calc(env(safe-area-inset-bottom,0px)+48px)] text-center">
          {slideIndex <= 3 && (
            <RecapStorySlides
              slideIndex={slideIndex}
              availableMonths={stats.availableMonths}
              activeMonthKey={stats.activeMonthKey}
              onSelectMonthKey={stats.setSelectedMonthKey}
              currentMonthName={stats.currentMonthName}
              previewPhotos={stats.previewPhotos}
              photoCount={stats.photos.length}
              totalSpent={stats.totalSpent}
              biggestExpense={stats.biggestExpense}
              peakWeekday={stats.peakWeekday}
              peakDayNumber={stats.peakDayNumber}
              peakMonthNumber={stats.peakMonthNumber}
              peakPhoto={stats.peakPhoto}
              peakAmount={stats.peakAmount}
              topCategory={stats.topCategory}
              topCatAmount={stats.topCatAmount}
              topCatPercent={stats.topCatPercent}
              topCatPhotos={stats.topCatPhotos}
              formatCurrency={stats.formatCurrency}
              formatDateVi={stats.formatDateVi}
            />
          )}

          {slideIndex === 4 && (
            <motion.div
              key="slide-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', damping: 25 }}
              className="flex flex-col items-center w-full"
            >
              <span className="text-[11px] font-bold text-white/40 tracking-[0.25em] uppercase mb-1">
                PHÂN BỔ & HẠN MỨC
              </span>
              <CategoryDonutChart
                items={categoryBudgets.items}
                totalSpent={categoryBudgets.totalMonthSpent}
              />
            </motion.div>
          )}

          {slideIndex === 5 && (
            <RecapPassSlide
              currentMonthName={stats.currentMonthName}
              totalSpent={stats.totalSpent}
              photoCount={stats.photos.length}
              topCategory={stats.topCategory}
              peakDate={stats.peakDate}
              peakDayNumber={stats.peakDayNumber}
              peakMonthNumber={stats.peakMonthNumber}
              formatCurrency={stats.formatCurrency}
            />
          )}
        </div>

        {/* Nút bấm điều hướng dưới đáy (bấm trực tiếp hoặc chạm màn hình đều hoạt động) */}
        <button
          type="button"
          onClick={handleNext}
          className="absolute bottom-[calc(env(safe-area-inset-bottom,0px)+18px)] z-40 px-4 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.14] border border-white/10 flex items-center gap-1 text-[12px] font-medium text-white/70 hover:text-white active:scale-95 transition-all cursor-pointer"
        >
          <span>{slideIndex === totalSlides - 1 ? 'Hoàn tất' : 'Tiếp tục'}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </AnimatePresence>
  );
};
