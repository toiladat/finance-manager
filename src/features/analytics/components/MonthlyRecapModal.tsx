import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Sparkles, ArrowUpRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Transaction, Category } from '../../../types';
import { useMonthlyRecapStats } from '../hooks/useMonthlyRecapStats';

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

  const {
    availableMonths,
    activeMonthKey,
    setSelectedMonthKey,
    currentMonthName,
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
  } = useMonthlyRecapStats({ transactions, categories });

  // Trigger confetti on final slide
  useEffect(() => {
    if (isOpen && slideIndex === 4) {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 },
      });
    }
  }, [isOpen, slideIndex]);

  if (!isOpen) return null;

  const totalSlides = 5;

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
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-2xl select-none"
        style={{ WebkitBackdropFilter: 'blur(16px)' }}
      >
        {/* Progress Bars on Top */}
        <div className="absolute top-[calc(env(safe-area-inset-top,0px)+12px)] left-4 right-4 z-50 flex items-center gap-1.5">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <div
              key={i}
              className="flex-1 h-1 rounded-full bg-white/20 overflow-hidden"
            >
              <div
                className={`h-full bg-white transition-all duration-300 ${
                  i < slideIndex ? 'w-full' : i === slideIndex ? 'w-full' : 'w-0'
                }`}
              />
            </div>
          ))}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-[calc(env(safe-area-inset-top,0px)+22px)] right-4 z-50 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Slide Content Area */}
        <div className="relative w-full max-w-sm h-full flex flex-col items-center justify-center px-5 pt-[calc(env(safe-area-inset-top,0px)+55px)] pb-[calc(env(safe-area-inset-bottom,0px)+30px)] text-center">
          {/* =========================================================
              SLIDE 0: TỔNG QUAN - PHOTO STACK FAN-OUT CHUẨN LOCKET
              ========================================================= */}
          {slideIndex === 0 && (
            <motion.div
              key="slide-0"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', damping: 26 }}
              className="flex flex-col items-center w-full"
            >
              {/* Apple Segmented Month Selector */}
              {availableMonths.length > 1 && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 p-1 rounded-full bg-white/[0.08] backdrop-blur-md border border-white/10 mb-3 z-30"
                >
                  {availableMonths.map((m) => (
                    <button
                      key={m.key}
                      onClick={() => setSelectedMonthKey(m.key)}
                      className={`px-3 py-1 rounded-full text-[12px] font-bold transition-all ${
                        m.key === activeMonthKey
                          ? 'bg-white text-black shadow-md'
                          : 'text-white/60 hover:text-white'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              )}

              <span className="text-[11px] font-bold text-white/40 tracking-[0.25em] uppercase mb-3">
                NHẬT KÝ ẢNH • {currentMonthName}
              </span>

              {/* Stack 3 ảnh xoay chéo kiểu Polaroid thực tế */}
              <div className="relative w-56 h-56 my-4 flex items-center justify-center">
                {previewPhotos.length >= 2 && (
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: -8, x: -16, y: 8 }}
                    className="absolute w-44 h-44 rounded-2xl overflow-hidden border-2 border-white/20 shadow-xl bg-card"
                  >
                    <img src={previewPhotos[1]} alt="Memo 2" className="w-full h-full object-cover" />
                  </motion.div>
                )}
                {previewPhotos.length >= 3 && (
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 7, x: 18, y: -6 }}
                    className="absolute w-44 h-44 rounded-2xl overflow-hidden border-2 border-white/20 shadow-xl bg-card"
                  >
                    <img src={previewPhotos[2]} alt="Memo 3" className="w-full h-full object-cover" />
                  </motion.div>
                )}
                <motion.div
                  className="relative z-10 w-48 h-48 rounded-[24px] overflow-hidden border-2 border-white/40 shadow-2xl bg-black"
                >
                  {previewPhotos[0] ? (
                    <img
                      src={previewPhotos[0]}
                      alt="Memo Cover"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-white/40 text-[12px] p-4">
                      <span>Chưa có ảnh</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-3 inset-x-3 text-center">
                    <span className="text-[12px] font-semibold text-white drop-shadow-md">
                      {photos.length} khoảnh khắc
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* Con số tổng kết lớn mang phong cách tạp chí */}
              <div className="mt-4 text-center">
                <span className="text-[34px] font-black text-white tracking-tight tabular-nums block leading-tight">
                  {formatCurrency(totalSpent)}
                </span>
                <span className="text-[13px] text-white/50 block mt-1">
                  Tổng thiệt hại đã chi trong tháng này
                </span>
              </div>
            </motion.div>
          )}

          {/* =========================================================
              SLIDE 1: KHOẢN CHI LỚN NHẤT - CÚ CHỐT POLAROID CÓ PRICE TAG
              ========================================================= */}
          {slideIndex === 1 && (
            <motion.div
              key="slide-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25 }}
              className="flex flex-col items-center w-full"
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ios-red/15 border border-ios-red/30 text-ios-red text-[11px] font-bold tracking-wider uppercase mb-3">
                <span>Khoản chi nặng đô nhất</span>
              </div>

              {biggestExpense ? (
                <div className="relative w-full max-w-[290px] aspect-[4/5] rounded-[28px] overflow-hidden border border-white/20 shadow-2xl bg-black rotate-[-1.5deg]">
                  {biggestExpense.photoUrl ? (
                    <img
                      src={biggestExpense.photoUrl}
                      alt={biggestExpense.note || 'Chi tiêu'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#181820] flex items-center justify-center text-white/40">
                      Không có ảnh
                    </div>
                  )}

                  {/* Gradient vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-between p-4 text-left">
                    {/* Floating Price Tag Sticker */}
                    <div className="self-end">
                      <div className="px-3 py-1.5 rounded-full bg-white text-black text-[13px] font-black tracking-tight shadow-xl flex items-center gap-1">
                        <ArrowUpRight className="w-3.5 h-3.5 stroke-[3]" />
                        <span>{formatCurrency(biggestExpense.amount)}</span>
                      </div>
                    </div>

                    {/* Bottom caption */}
                    <div>
                      <span className="text-[15px] font-bold text-white block drop-shadow-md">
                        {biggestExpense.note || 'Khoản chi không tên'}
                      </span>
                      <span className="text-[12px] text-white/60 mt-0.5 block">
                        Ngày {formatDateVi(biggestExpense.date)}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <span className="text-white/40 text-[14px]">Chưa có chi tiêu</span>
              )}
            </motion.div>
          )}

          {/* =========================================================
              SLIDE 2: NGÀY TIÊU NHIỀU NHẤT - TEAR-OFF CALENDAR TÁCH BẠCH
              ========================================================= */}
          {slideIndex === 2 && (
            <motion.div
              key="slide-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center w-full"
            >
              <span className="text-[11px] font-bold text-white/40 tracking-[0.25em] uppercase mb-3">
                NGÀY VUI QUÁ ĐÀ
              </span>

              {/* Tờ lịch bóc Apple Tear-off */}
              <div className="w-24 h-28 rounded-2xl bg-white text-black flex flex-col items-center overflow-hidden shadow-2xl my-2">
                <div className="w-full bg-[#FF3B30] py-1 text-center text-[11px] font-black text-white uppercase tracking-wider">
                  {peakWeekday}
                </div>
                <div className="flex-1 flex flex-col items-center justify-center">
                  <span className="text-[38px] font-black leading-none text-black">
                    {peakDayNumber}
                  </span>
                  <span className="text-[10px] font-bold text-gray-500 uppercase mt-0.5">
                    Tháng {peakMonthNumber}
                  </span>
                </div>
              </div>

              {/* Ảnh chụp ngày hôm đó (nếu có) */}
              {peakPhoto && (
                <div className="w-20 h-20 rounded-2xl overflow-hidden border border-white/20 shadow-md my-2">
                  <img src={peakPhoto} alt="Peak day" className="w-full h-full object-cover" />
                </div>
              )}

              {/* Số tiền chi trong ngày */}
              <div className="mt-3 text-center">
                <span className="text-[12px] text-white/50 block">Ví tiền làm việc hết công suất với</span>
                <span className="text-[34px] font-black text-[#FF453A] tabular-nums tracking-tight block my-0.5">
                  {formatCurrency(peakAmount)}
                </span>
                <span className="text-[12px] text-white/40 block">đã tiêu riêng trong ngày này</span>
              </div>
            </motion.div>
          )}

          {/* =========================================================
              SLIDE 3: ĐAM MÊ CỦA THÁNG - VIBRANT BRANDED CATEGORY
              ========================================================= */}
          {slideIndex === 3 && (
            <motion.div
              key="slide-3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center w-full"
            >
              <span className="text-[11px] font-bold text-white/40 tracking-[0.25em] uppercase mb-2">
                ĐAM MÊ CỦA THÁNG
              </span>

              {/* Tên danh mục phát sáng theo màu */}
              <div className="my-3 text-center">
                <span
                  className="text-[34px] font-black tracking-tight block drop-shadow-lg"
                  style={{ color: topCategory.color }}
                >
                  {topCategory.name}
                </span>
                <span className="text-[26px] font-black text-white tabular-nums tracking-tight block mt-1">
                  {formatCurrency(topCatAmount)}
                </span>
              </div>

              {/* Thước đo phần trăm ngân sách */}
              <div className="w-full max-w-[260px] p-3 rounded-2xl bg-white/[0.06] border border-white/10 backdrop-blur-md text-center my-2">
                <div className="flex items-center justify-between text-[12px] font-semibold mb-1.5">
                  <span className="text-white/60">Tỷ trọng ngân sách</span>
                  <span className="text-white font-bold">{topCatPercent}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${topCatPercent}%`,
                      backgroundColor: topCategory.color,
                    }}
                  />
                </div>
              </div>

              {/* Dải ảnh nhỏ minh họa danh mục này */}
              {topCatPhotos.length > 0 && (
                <div className="flex items-center gap-2 mt-3">
                  {topCatPhotos.map((url, idx) => (
                    <div
                      key={idx}
                      className="w-14 h-14 rounded-xl overflow-hidden border border-white/20 shadow-md"
                    >
                      <img src={url} alt="Cat photo" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* =========================================================
              SLIDE 4: TẤM VÉ TỔNG KẾT (LOCKET PASS / VINTAGE RECEIPT)
              ========================================================= */}
          {slideIndex === 4 && (
            <motion.div
              key="slide-4"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="flex flex-col items-center w-full"
            >
              {/* Thẻ vé Locket Pass bo viền răng cưa nhẹ */}
              <div className="relative w-full max-w-[310px] rounded-[28px] bg-white/[0.08] backdrop-blur-2xl border border-white/15 p-5 text-left shadow-2xl">
                {/* Header vé */}
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-1.5 text-ios-blue text-[12px] font-black tracking-wider uppercase">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>LOCKET RECAP</span>
                  </div>
                  <span className="text-[12px] font-semibold text-white/50">{currentMonthName}</span>
                </div>

                {/* Các dòng thống kê dạng biên lai gọn gàng */}
                <div className="py-3 space-y-2.5 text-[13px]">
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Tổng chi tiêu</span>
                    <span className="font-extrabold text-white text-[15px]">{formatCurrency(totalSpent)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Khoảnh khắc đã ghi</span>
                    <span className="font-semibold text-white">{photos.length} ảnh</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Đam mê lớn nhất</span>
                    <span className="font-semibold" style={{ color: topCategory.color }}>{topCategory.name}</span>
                  </div>
                  {peakDate && (
                    <div className="flex justify-between items-center">
                      <span className="text-white/60">Ngày bội chi nhất</span>
                      <span className="font-semibold text-white/90">Ngày {peakDayNumber}/{peakMonthNumber}</span>
                    </div>
                  )}
                </div>

                {/* Đường phân cách đứt đoạn */}
                <div className="border-t border-dashed border-white/20 pt-3 text-center">
                  <span className="text-[11px] font-medium text-white/50 block">
                    ✨ Cảm ơn vì một tháng chi tiêu đáng nhớ!
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Tap areas for navigation */}
        <div
          onClick={handlePrev}
          className="absolute inset-y-0 left-0 w-1/3 cursor-pointer z-20"
        />
        <div
          onClick={handleNext}
          className="absolute inset-y-0 right-0 w-2/3 cursor-pointer z-20"
        />

        {/* Bottom Next indicator */}
        <div className="absolute bottom-[calc(env(safe-area-inset-bottom,0px)+18px)] left-0 right-0 flex items-center justify-center gap-1.5 z-30 pointer-events-none">
          <span className="text-[12px] font-medium text-white/50">
            {slideIndex === totalSlides - 1 ? 'Chạm để hoàn tất' : 'Chạm để tiếp tục'}
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-white/50" />
        </div>
      </div>
    </AnimatePresence>
  );
};
