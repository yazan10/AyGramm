import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw, Check, Sparkles } from 'lucide-react';

interface CircularImageCropModalProps {
  isOpen: boolean;
  imageSrc: string;
  onCrop: (croppedDataUrl: string) => void;
  onClose: () => void;
}

export const CircularImageCropModal: React.FC<CircularImageCropModalProps> = ({
  isOpen,
  imageSrc,
  onCrop,
  onClose,
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const posStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [imgLoaded, setImgLoaded] = useState<boolean>(false);

  // Reset controls when new image is loaded
  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setPosition({ x: 0, y: 0 });
      setImgLoaded(false);
    }
  }, [isOpen, imageSrc]);

  // Pointer drag handling for pan
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    posStartRef.current = { ...position };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setPosition({
      x: posStartRef.current.x + dx,
      y: posStartRef.current.y + dy,
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch {
      // ignore
    }
  };

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.002;
    setZoom((prev) => Math.min(Math.max(0.6, prev + delta), 3.5));
  };

  // Perform canvas crop
  const handleConfirmCrop = useCallback(() => {
    const img = imgRef.current;
    if (!img) return;

    const cropSize = 512;
    const canvas = document.createElement('canvas');
    canvas.width = cropSize;
    canvas.height = cropSize;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Smooth image rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Circular clipping path
    ctx.beginPath();
    ctx.arc(cropSize / 2, cropSize / 2, cropSize / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    // The display aperture is 280px
    const apertureDisplaySize = 280;
    const scaleRatio = cropSize / apertureDisplaySize;

    // Calculate natural image dimensions when scaled to fit container
    const naturalWidth = img.naturalWidth || 500;
    const naturalHeight = img.naturalHeight || 500;

    // Compute base display size of image (contain inside aperture)
    const baseScale = Math.max(apertureDisplaySize / naturalWidth, apertureDisplaySize / naturalHeight);
    const displayedWidth = naturalWidth * baseScale * zoom;
    const displayedHeight = naturalHeight * baseScale * zoom;

    // Position offset scaled
    const centerX = cropSize / 2 + position.x * scaleRatio;
    const centerY = cropSize / 2 + position.y * scaleRatio;

    const drawX = centerX - (displayedWidth * scaleRatio) / 2;
    const drawY = centerY - (displayedHeight * scaleRatio) / 2;
    const drawW = displayedWidth * scaleRatio;
    const drawH = displayedHeight * scaleRatio;

    ctx.drawImage(img, drawX, drawY, drawW, drawH);

    const croppedResult = canvas.toDataURL('image/jpeg', 0.92);
    onCrop(croppedResult);
    onClose();
  }, [position, zoom, onCrop, onClose]);

  if (!isOpen || !imageSrc) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/90 backdrop-blur-md p-4 text-white select-none font-['IBM_Plex_Sans_Arabic']"
      dir="rtl"
      onWheel={handleWheel}
    >
      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#0F3D2E] text-[#D4AF37] flex items-center justify-center border border-[#D4AF37]/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">قص الصورة الشخصية</h3>
              <p className="text-[11px] text-stone-400">حرك وكبّر الصورة داخل الدائرة كما في انستغرام</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-800 text-stone-400 hover:text-white transition-colors cursor-pointer"
            title="إلغاء"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewport Area */}
        <div
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="relative w-full h-[320px] sm:h-[360px] bg-black flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing touch-none"
        >
          {/* Underlying movable image */}
          <img
            ref={imgRef}
            src={imageSrc}
            alt="معاينة الصورة"
            onLoad={() => setImgLoaded(true)}
            draggable={false}
            className="max-w-none pointer-events-none transition-transform duration-75 ease-out"
            style={{
              width: '280px',
              height: 'auto',
              minHeight: '280px',
              objectFit: 'cover',
              transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
              transformOrigin: 'center center',
            }}
          />

          {/* Instagram-style Circular Aperture Overlay */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {/* Dark Mask with Circular Hole via SVG */}
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <mask id="crop-circle-mask">
                  <rect width="100%" height="100%" fill="white" />
                  <circle cx="50%" cy="50%" r="140" fill="black" />
                </mask>
              </defs>
              <rect
                width="100%"
                height="100%"
                fill="rgba(0, 0, 0, 0.72)"
                mask="url(#crop-circle-mask)"
              />
            </svg>

            {/* Circular Border Ring and 3x3 Grid Guidelines */}
            <div className="absolute w-[280px] h-[280px] rounded-full border-2 border-[#D4AF37] shadow-[0_0_0_1px_rgba(255,255,255,0.2)] pointer-events-none overflow-hidden">
              {/* Guidelines */}
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-25">
                <div className="border-r border-b border-white" />
                <div className="border-r border-b border-white" />
                <div className="border-b border-white" />
                <div className="border-r border-b border-white" />
                <div className="border-r border-b border-white" />
                <div className="border-b border-white" />
                <div className="border-r border-white" />
                <div className="border-r border-white" />
                <div />
              </div>
            </div>
          </div>

          {/* Hint Overlay */}
          {!isDragging && (
            <div className="absolute bottom-3 start-1/2 -translate-x-1/2 bg-black/60 px-3 py-1 rounded-full text-[10px] text-stone-300 pointer-events-none backdrop-blur-xs">
              اسحب للتحريك • استخدم العجلة أو المؤشر للتكبير
            </div>
          )}
        </div>

        {/* Controls Bar */}
        <div className="p-4 bg-stone-900 border-t border-stone-800 space-y-4">
          {/* Zoom Slider */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setZoom((prev) => Math.max(0.6, prev - 0.2))}
              className="p-1.5 text-stone-400 hover:text-white transition-colors cursor-pointer"
              title="تصغير"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <input
              type="range"
              min="0.6"
              max="3"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="flex-1 accent-[#D4AF37] h-1.5 bg-stone-800 rounded-lg cursor-pointer"
            />
            <button
              type="button"
              onClick={() => setZoom((prev) => Math.min(3.5, prev + 0.2))}
              className="p-1.5 text-stone-400 hover:text-white transition-colors cursor-pointer"
              title="تكبير"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                setZoom(1);
                setPosition({ x: 0, y: 0 });
              }}
              className="p-1.5 text-stone-400 hover:text-white transition-colors cursor-pointer"
              title="إعادة ضبط"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold text-xs transition-colors cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="button"
              onClick={handleConfirmCrop}
              disabled={!imgLoaded}
              className="px-6 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#E5C358] text-[#0F3D2E] font-black text-xs transition-all flex items-center gap-2 cursor-pointer shadow-md active:scale-95 disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>قص وتعيين الصورة</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
