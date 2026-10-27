import { useState, useRef, useEffect, useCallback } from 'react';

interface UseCameraProps {
  isOpen: boolean;
  hasPhoto: boolean;
}

export function useCamera({ isOpen, hasPhoto }: UseCameraProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isFlashing, setIsFlashing] = useState<boolean>(false);

  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const pinchStartDistRef = useRef<number | null>(null);
  const initialZoomRef = useRef<number>(1);
  const isPinchingRef = useRef<boolean>(false);
  const [isPinching, setIsPinching] = useState<boolean>(false);
  const rafIdRef = useRef<number | null>(null);

  const changeZoom = useCallback((newZoom: number) => {
    const clamped = Math.round(Math.min(Math.max(newZoom, 1), 3) * 10) / 10;
    setZoomLevel(clamped);
  }, []);

  const toggleZoom = useCallback(() => {
    setZoomLevel((prev) => (prev > 1.4 ? 1 : 2));
  }, []);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 2) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        pinchStartDistRef.current = dist;
        initialZoomRef.current = zoomLevel;
        isPinchingRef.current = true;
        setIsPinching(true);
      }
    },
    [zoomLevel]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 2 && pinchStartDistRef.current !== null) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const factor = dist / pinchStartDistRef.current;
        const targetZoom = initialZoomRef.current * factor;
        const clamped = Math.round(Math.min(Math.max(targetZoom, 1), 3) * 10) / 10;

        if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = requestAnimationFrame(() => {
          setZoomLevel(clamped);
        });
      }
    },
    []
  );

  const handleTouchEnd = useCallback(() => {
    pinchStartDistRef.current = null;
    setIsPinching(false);
    setTimeout(() => {
      isPinchingRef.current = false;
    }, 200);
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setStream(null);
    setZoomLevel(1);
    isPinchingRef.current = false;
    pinchStartDistRef.current = null;
  }, []);

  const startCamera = useCallback(
    async (mode: 'environment' | 'user' = facingMode) => {
      setIsLoading(true);
      setCameraError(null);

      // Dừng camera cũ nếu đang chạy
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }

      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Trình duyệt không hỗ trợ Camera trực tiếp hoặc cần kết nối HTTPS');
        }

        const constraints: MediaStreamConstraints = {
          video: {
            facingMode: { ideal: mode },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        };

        const newStream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = newStream;
        setStream(newStream);

        if (videoRef.current) {
          videoRef.current.srcObject = newStream;
          videoRef.current.play().catch(() => {});
        }
      } catch (err: unknown) {
        console.warn('Lỗi bật camera:', err);
        let msg = 'Không thể mở Camera.';
        const error = err as { name?: string };
        if (error?.name === 'NotAllowedError' || error?.name === 'PermissionDeniedError') {
          msg = 'Chưa được cấp quyền Camera. Hãy bấm "Cho phép" trong trình duyệt.';
        } else if (error?.name === 'NotFoundError' || error?.name === 'DevicesNotFoundError') {
          msg = 'Không tìm thấy thiết bị Camera.';
        } else if (!window.isSecureContext) {
          msg = 'Camera yêu cầu kết nối bảo mật HTTPS. Vui lòng mở bằng link https://';
        }
        setCameraError(msg);
      } finally {
        setIsLoading(false);
      }
    },
    [facingMode]
  );

  // Gắn stream vào video element khi videoRef sẵn sàng & chống tự pause trên Safari
  useEffect(() => {
    const video = videoRef.current;
    if (video && stream) {
      video.srcObject = stream;
      video.play().catch(() => {});

      const handlePause = () => {
        if (streamRef.current && video.paused) {
          video.play().catch(() => {});
        }
      };
      video.addEventListener('pause', handlePause);
      return () => {
        video.removeEventListener('pause', handlePause);
      };
    }
  }, [stream]);

  // Quản lý vòng đời camera theo trạng thái mở Modal
  useEffect(() => {
    if (isOpen && !hasPhoto) {
      startCamera(facingMode);
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, hasPhoto, startCamera, stopCamera, facingMode]);

  // Đổi giữa camera sau và camera trước
  const flipCamera = useCallback(() => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    startCamera(nextMode);
  }, [facingMode, startCamera]);

  // Chụp khung hình từ Video stream (hỗ trợ Zoom chuẩn xác)
  const capturePhoto = useCallback(
    (customZoom?: number): string | null => {
      if (!videoRef.current) return null;
      const video = videoRef.current;
      if (!video.videoWidth || !video.videoHeight) return null;

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      const currentZoom = Math.max(1, customZoom ?? zoomLevel);

      // Lật ảnh đối xứng nếu dùng camera selfie phía trước
      if (facingMode === 'user') {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }

      // Cắt vùng zoom ở giữa khung hình
      const sourceWidth = video.videoWidth / currentZoom;
      const sourceHeight = video.videoHeight / currentZoom;
      const sourceX = (video.videoWidth - sourceWidth) / 2;
      const sourceY = (video.videoHeight - sourceHeight) / 2;

      ctx.drawImage(
        video,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        0,
        0,
        canvas.width,
        canvas.height
      );

      const dataUrl = canvas.toDataURL('image/jpeg', 0.88);

      // Hiệu ứng chớp sáng Shutter Flash
      setIsFlashing(true);
      setTimeout(() => setIsFlashing(false), 120);

      // Dừng stream camera sau khi chụp
      stopCamera();

      return dataUrl;
    },
    [facingMode, stopCamera, zoomLevel]
  );

  return {
    videoRef,
    stream,
    cameraError,
    isLoading,
    facingMode,
    isFlashing,
    zoomLevel,
    isPinching,
    changeZoom,
    toggleZoom,
    isPinchingRef,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    startCamera,
    stopCamera,
    flipCamera,
    capturePhoto,
  };
}

