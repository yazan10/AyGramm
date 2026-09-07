import React, { useRef, useState } from 'react';
import { Camera, Loader2, AlertCircle, Trash2, Crop } from 'lucide-react';
import { CircularImageCropModal } from './CircularImageCropModal';

interface ProfileImageUploaderProps {
  value: string;
  onChange: (dataUrl: string) => void;
  size?: number;
  ring?: boolean;
}

const MAX_SOURCE_SIZE = 12 * 1024 * 1024; // 12MB before compression

const readFileAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('تعذر قراءة الملف'));
    reader.readAsDataURL(file);
  });

export const ProfileImageUploader: React.FC<ProfileImageUploaderProps> = ({
  value,
  onChange,
  size = 88,
  ring = true,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [cropSrc, setCropSrc] = useState<string>('');
  const [isCropOpen, setIsCropOpen] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setError('');
    if (!file.type.startsWith('image/')) {
      setError('يرجى اختيار ملف صورة صالح (JPG، PNG، GIF...)');
      return;
    }
    if (file.size > MAX_SOURCE_SIZE) {
      setError('حجم الصورة كبير جداً (الحد الأقصى 12 ميجابايت)');
      return;
    }

    setUploading(true);
    try {
      const raw = await readFileAsDataUrl(file);
      // Open Instagram-style circular crop modal!
      setCropSrc(raw);
      setIsCropOpen(true);
    } catch {
      setError('تعذر قراءة الصورة، حاول مرة أخرى');
    } finally {
      setUploading(false);
    }
  };

  const handleCropComplete = (croppedDataUrl: string) => {
    onChange(croppedDataUrl);
    setIsCropOpen(false);
    setCropSrc('');
  };

  const handleRemove = () => onChange('');

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        {ring && (
          <div className="absolute inset-0 rounded-full p-[2px] bg-gradient-to-tr from-[#D4AF37] via-[#0F3D2E] to-[#D4AF37]">
            <img
              src={value}
              alt="صورة الملف الشخصي"
              className="w-full h-full rounded-full object-cover bg-white avatar-round"
            />
          </div>
        )}

        {/* Camera overlay button */}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="absolute bottom-0 end-0 w-8 h-8 rounded-full bg-[#0F3D2E] text-[#D4AF37] flex items-center justify-center shadow-lg border-2 border-white hover:bg-[#155A44] transition-colors cursor-pointer disabled:opacity-50"
          title="رفع وقص صورة من الجهاز"
        >
          {uploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Camera className="w-4 h-4" />
          )}
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="text-[11px] font-bold text-[#0F3D2E] hover:underline disabled:opacity-50 cursor-pointer flex items-center gap-1"
      >
        <Crop className="w-3 h-3 text-[#D4AF37]" />
        <span>{uploading ? 'جارٍ قراءة الصورة...' : 'تغيير وقص صورة الملف الشخصي'}</span>
      </button>

      {value && (
        <button
          type="button"
          onClick={handleRemove}
          className="text-[11px] font-bold text-red-600 hover:underline cursor-pointer flex items-center gap-1"
        >
          <Trash2 className="w-3 h-3" />
          إزالة الصورة الحالية
        </button>
      )}

      {error && (
        <span className="flex items-center gap-1 text-[11px] font-bold text-red-600">
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </span>
      )}

      {/* Instagram-style circular cropper modal */}
      <CircularImageCropModal
        isOpen={isCropOpen}
        imageSrc={cropSrc}
        onCrop={handleCropComplete}
        onClose={() => {
          setIsCropOpen(false);
          setCropSrc('');
        }}
      />
    </div>
  );
};