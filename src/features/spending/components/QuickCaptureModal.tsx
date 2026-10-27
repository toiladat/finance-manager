import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { Category, Transaction } from '../../../types';
import { compressImageToWebP } from '../../../services/db';
import { useCamera } from '../hooks/useCamera';
import { CameraViewfinder } from './CameraViewfinder';
import { ExpenseFormView } from './ExpenseFormView';

interface QuickCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  initialDate?: string;
  onSaveTransaction: (tx: Omit<Transaction, 'id' | 'timestamp'>) => Promise<void>;
}

export const QuickCaptureModal: React.FC<QuickCaptureModalProps> = ({
  isOpen,
  onClose,
  categories,
  initialDate,
  onSaveTransaction,
}) => {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [rawAmount, setRawAmount] = useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [note, setNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [flipDegree, setFlipDegree] = useState<number>(0);
  const [focusPoint, setFocusPoint] = useState<{ x: number; y: number } | null>(null);

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const {
    videoRef,
    stream,
    cameraError,
    isLoading: isCameraLoading,
    facingMode,
    isFlashing,
    zoomLevel,
    isPinching,
    toggleZoom,
    isPinchingRef,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    startCamera,
    flipCamera,
    capturePhoto,
  } = useCamera({ isOpen, hasPhoto: !!photoPreview });

  if (!isOpen) return null;

  const dateObj = initialDate ? new Date(initialDate) : new Date();
  const dateLabel = dateObj.toLocaleDateString('vi-VN', {
    weekday: 'short',
    day: 'numeric',
    month: 'numeric',
  });

  const handleFileProcess = async (file?: File) => {
    if (!file) return;
    try {
      const compressedBase64 = await compressImageToWebP(file);
      setPhotoPreview(compressedBase64);
    } catch (err) {
      console.error('Lỗi xử lý ảnh:', err);
    }
  };

  const handleResetAndClose = () => {
    setPhotoPreview(null);
    setRawAmount('');
    setSelectedCategoryId(null);
    setNote('');
    onClose();
  };

  const handleShutterClick = () => {
    if (stream) {
      const dataUrl = capturePhoto(zoomLevel);
      if (dataUrl) {
        setPhotoPreview(dataUrl);
      }
    } else {
      cameraInputRef.current?.click();
    }
  };

  const handleFlipCamera = () => {
    setFlipDegree((prev) => prev + 180);
    flipCamera();
  };

  const handleViewfinderTap = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isPinchingRef?.current) return;
    if (!stream && !isCameraLoading) {
      startCamera(facingMode);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setFocusPoint({ x, y });
    setTimeout(() => setFocusPoint(null), 1200);
  };

  const handleSave = async () => {
    const amount = parseInt(rawAmount.replace(/\D/g, '') || '0', 10);
    if (!photoPreview) {
      alert('Vui lòng chụp hoặc tải ảnh khoảnh khắc chi tiêu!');
      return;
    }
    if (amount <= 0) {
      alert('Vui lòng nhập số tiền hợp lệ!');
      return;
    }

    setIsSubmitting(true);
    try {
      const todayStr = initialDate || new Date().toISOString().split('T')[0];
      await onSaveTransaction({
        type: 'EXPENSE',
        amount,
        categoryId: selectedCategoryId,
        date: todayStr,
        note: note.trim() || undefined,
        photoUrl: photoPreview,
        account: 'Tiền mặt',
      });
      handleResetAndClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4">
        {/* Backdrop kính mờ chuẩn iOS */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleResetAndClose}
          className="absolute inset-0 bg-black/30 backdrop-blur-md"
          style={{ WebkitBackdropFilter: 'blur(12px)' }}
        />

        {/* Modal Sheet */}
        <motion.div
          initial={{ scale: 0.96, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 28, stiffness: 350 }}
          className={`relative w-full h-[100dvh] sm:h-auto sm:max-h-[92vh] max-w-md flex flex-col justify-between overflow-hidden z-10 transition-colors ${
            !photoPreview
              ? 'bg-transparent sm:bg-black/20 sm:border sm:border-white/10 sm:rounded-[36px]'
              : 'bg-black/60 sm:bg-[#121216]/90 sm:border sm:border-white/10 sm:rounded-[36px]'
          }`}
        >
          {/* Top Bar Header */}
          <div className="pt-[max(14px,env(safe-area-inset-top,14px))] px-5 pb-3 flex items-center justify-between border-b border-white/[0.08] bg-black/20 backdrop-blur-sm flex-shrink-0">
            <span className="text-[12px] font-semibold text-white/70 tracking-widest uppercase">
              {dateLabel}
            </span>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleResetAndClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Hidden File Inputs */}
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => handleFileProcess(e.target.files?.[0])}
          />
          <input
            ref={galleryInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileProcess(e.target.files?.[0])}
          />

          {!photoPreview ? (
            <CameraViewfinder
              stream={stream}
              videoRef={videoRef}
              isCameraLoading={isCameraLoading}
              cameraError={cameraError}
              facingMode={facingMode}
              isFlashing={isFlashing}
              zoomLevel={zoomLevel}
              isPinching={isPinching}
              flipDegree={flipDegree}
              focusPoint={focusPoint}
              onViewfinderTap={handleViewfinderTap}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onToggleZoom={toggleZoom}
              onShutterClick={handleShutterClick}
              onFlipCamera={handleFlipCamera}
              onOpenAlbum={() => galleryInputRef.current?.click()}
              onRetryCamera={() => startCamera(facingMode)}
              onOpenNativeCamera={() => cameraInputRef.current?.click()}
            />
          ) : (
            <ExpenseFormView
              photoPreview={photoPreview}
              rawAmount={rawAmount}
              selectedCategoryId={selectedCategoryId}
              note={note}
              categories={categories}
              isSubmitting={isSubmitting}
              onRetakePhoto={() => setPhotoPreview(null)}
              onChangeAmount={(val) => setRawAmount(val.replace(/\D/g, ''))}
              onSelectCategory={(id) => setSelectedCategoryId(id)}
              onChangeNote={(val) => setNote(val)}
              onSubmit={handleSave}
            />
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
