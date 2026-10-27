import React from 'react';
import { motion } from 'framer-motion';
import { Images } from 'lucide-react';

interface CameraViewfinderProps {
  stream: MediaStream | null;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isCameraLoading: boolean;
  cameraError: string | null;
  facingMode: 'environment' | 'user';
  isFlashing: boolean;
  zoomLevel: number;
  isPinching: boolean;
  flipDegree: number;
  focusPoint: { x: number; y: number } | null;
  onViewfinderTap: (e: React.MouseEvent<HTMLDivElement>) => void;
  onTouchStart: (e: React.TouchEvent<HTMLDivElement>) => void;
  onTouchMove: (e: React.TouchEvent<HTMLDivElement>) => void;
  onTouchEnd: () => void;
  onToggleZoom: () => void;
  onShutterClick: () => void;
  onFlipCamera: () => void;
  onOpenAlbum: () => void;
  onRetryCamera: () => void;
  onOpenNativeCamera: () => void;
}

export const CameraViewfinder: React.FC<CameraViewfinderProps> = ({
  stream,
  videoRef,
  isCameraLoading,
  cameraError,
  facingMode,
  isFlashing,
  zoomLevel,
  isPinching,
  flipDegree,
  focusPoint,
  onViewfinderTap,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onToggleZoom,
  onShutterClick,
  onFlipCamera,
  onOpenAlbum,
  onRetryCamera,
  onOpenNativeCamera,
}) => {
  return (
    <div className="flex-1 flex flex-col justify-between px-5 py-4 select-none">
      {/* Khung ngắm Viewfinder Squircle */}
      <div className="flex-1 flex items-center justify-center py-2">
        <div
          onClick={onViewfinderTap}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          className="relative w-full max-w-[340px] aspect-[4/5] rounded-[32px] bg-black border border-white/15 flex items-center justify-center transition-all shadow-2xl overflow-hidden cursor-crosshair touch-none"
        >
          {/* Live Camera Video Stream với Zoom & Lật selfie */}
          {stream ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{
                transform:
                  facingMode === 'user'
                    ? `scale(-${zoomLevel}, ${zoomLevel})`
                    : `scale(${zoomLevel})`,
              }}
              className={`w-full h-full object-cover origin-center ${
                isPinching
                  ? 'transition-none will-change-transform'
                  : 'transition-transform duration-200 ease-out'
              }`}
            />
          ) : isCameraLoading ? (
            <div className="flex flex-col items-center gap-2.5 text-white/60">
              <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
              <span className="text-[13px] font-medium">Đang mở máy ảnh...</span>
            </div>
          ) : cameraError ? (
            <div className="p-6 text-center flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-3 text-white/80">
                <Images className="w-6 h-6 stroke-[1.8]" />
              </div>
              <span className="text-[13px] text-white/70 max-w-[260px] leading-relaxed block mb-4">
                {cameraError}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onRetryCamera}
                  className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-[12px] font-semibold transition-colors"
                >
                  Thử lại
                </button>
                <button
                  type="button"
                  onClick={onOpenNativeCamera}
                  className="px-3.5 py-1.5 rounded-full bg-ios-blue text-white text-[12px] font-semibold transition-colors shadow-md"
                >
                  Mở Camera máy
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={onRetryCamera}
              className="flex flex-col items-center justify-center cursor-pointer p-6"
            >
              <div className="w-16 h-16 rounded-full bg-white/[0.05] border border-white/20 flex items-center justify-center text-white/50 mb-3 hover:scale-105 hover:text-white transition-all">
                <Images className="w-7 h-7 stroke-[1.8]" />
              </div>
              <span className="text-[13px] text-white/60">Bấm để bật máy ảnh</span>
            </div>
          )}

          {/* 4 góc ngắm Reticle chuẩn Leica / Apple */}
          <div className="absolute top-4 left-4 w-5 h-5 border-t-2 border-l-2 border-white/40 rounded-tl pointer-events-none" />
          <div className="absolute top-4 right-4 w-5 h-5 border-t-2 border-r-2 border-white/40 rounded-tr pointer-events-none" />
          <div className="absolute bottom-4 left-4 w-5 h-5 border-b-2 border-l-2 border-white/40 rounded-bl pointer-events-none" />
          <div className="absolute bottom-4 right-4 w-5 h-5 border-b-2 border-r-2 border-white/40 rounded-br pointer-events-none" />

          {/* Apple Yellow Autofocus Reticle */}
          {focusPoint && (
            <motion.div
              initial={{ scale: 1.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 450, damping: 25 }}
              style={{ left: focusPoint.x - 28, top: focusPoint.y - 28 }}
              className="absolute w-14 h-14 border-2 border-[#FFD60A] rounded-xl pointer-events-none z-20 shadow-[0_0_12px_rgba(255,214,10,0.5)]"
            >
              <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-[#FFD60A]/40" />
              <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-[#FFD60A]/40" />
            </motion.div>
          )}

          {/* Nút Zoom 1x / 2x chuẩn Locket & Apple Camera */}
          {!cameraError && (
            <motion.button
              type="button"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileTap={{ scale: 0.88 }}
              onClick={(e) => {
                e.stopPropagation();
                onToggleZoom();
              }}
              className="absolute bottom-3.5 left-1/2 -translate-x-1/2 z-20 h-8 min-w-[36px] px-2.5 rounded-full bg-black/55 hover:bg-black/65 active:bg-black/75 backdrop-blur-md border border-white/20 text-white shadow-lg flex items-center justify-center gap-0.5 select-none transition-transform cursor-pointer"
              title="Chuyển đổi góc chụp 1x / 2x"
            >
              <span
                className={`text-[12px] font-bold tracking-tight ${
                  zoomLevel > 1 ? 'text-[#FFD60A]' : 'text-white'
                }`}
              >
                {zoomLevel === 1 || zoomLevel === 2
                  ? `${zoomLevel}×`
                  : `${zoomLevel.toFixed(1)}×`}
              </span>
            </motion.button>
          )}

          {/* Shutter Flash Animation */}
          {isFlashing && (
            <div className="absolute inset-0 bg-white pointer-events-none z-30 transition-opacity" />
          )}
        </div>
      </div>

      {/* Bottom Control Dock: Album | Shutter cơ học | Lật Camera */}
      <div className="w-full flex items-center justify-between px-8 pt-2 pb-[max(18px,env(safe-area-inset-bottom,18px))] flex-shrink-0">
        {/* Nút Album ảnh */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.9 }}
          onClick={onOpenAlbum}
          className="w-12 h-12 rounded-2xl bg-white/[0.12] hover:bg-white/[0.18] active:bg-white/[0.25] backdrop-blur-2xl border border-white/20 shadow-xl flex items-center justify-center text-white transition-all cursor-pointer"
          title="Mở album ảnh"
        >
          <Images className="w-5 h-5 stroke-[2] text-white/95" />
        </motion.button>

        {/* Nút Shutter cơ học chuẩn Leica / Apple */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.92 }}
          onClick={onShutterClick}
          className="relative w-[78px] h-[78px] rounded-full flex items-center justify-center cursor-pointer select-none group"
          title="Chụp ảnh ngay"
        >
          <div className="absolute inset-0 rounded-full border-[3.5px] border-white/90 shadow-[0_0_24px_rgba(255,255,255,0.22)] transition-all group-active:border-white group-active:scale-95" />
          <motion.div
            whileTap={{ scale: 0.86 }}
            transition={{ type: 'spring', stiffness: 500, damping: 28 }}
            className="w-[64px] h-[64px] rounded-full bg-gradient-to-b from-white via-[#FAFAFA] to-[#EDEDF0] shadow-[0_6px_16px_rgba(0,0,0,0.35),inset_0_2px_4px_rgba(255,255,255,1),inset_0_-2px_4px_rgba(0,0,0,0.08)] flex items-center justify-center"
          >
            <div className="w-3 h-3 rounded-full bg-[#E5E5EA] border border-black/[0.04] group-active:scale-125 transition-transform" />
          </motion.div>
        </motion.button>

        {/* Nút Lật Camera Trước/Sau */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.9 }}
          onClick={onFlipCamera}
          className="w-12 h-12 rounded-2xl bg-white/[0.12] hover:bg-white/[0.18] active:bg-white/[0.25] backdrop-blur-2xl border border-white/25 shadow-xl flex items-center justify-center text-white transition-all cursor-pointer"
          title="Đổi camera trước/sau"
        >
          <motion.div
            animate={{ rotate: flipDegree }}
            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
          >
            <svg
              className="w-5 h-5 text-white/95"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
              <path d="M16 21h5v-5" />
            </svg>
          </motion.div>
        </motion.button>
      </div>
    </div>
  );
};
