// ضغط الصور في الخلفية قبل رفعها للمنصة (يقلل الحجم والمساحة كثيراً)

export interface CompressOptions {
  maxDimension?: number;
  quality?: number;
  maxFileSizeMB?: number;
}

const DEFAULT_OPTIONS: Required<CompressOptions> = {
  maxDimension: 1024,
  quality: 0.82,
  maxFileSizeMB: 8,
};

const readFileAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
    reader.onerror = () => reject(new Error('تعذر قراءة الملف'));
    reader.readAsDataURL(file);
  });

export const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('تعذر تحميل الصورة'));
    img.src = src;
  });

export const compressImageSource = async (dataUrl: string, options?: CompressOptions): Promise<string> => {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  try {
    const img = await loadImage(dataUrl);
    let { width, height } = img;
    const ratio = Math.min(opts.maxDimension / width, opts.maxDimension / height, 1);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return dataUrl;
    ctx.drawImage(img, 0, 0, width, height);
    return canvas.toDataURL('image/jpeg', opts.quality);
  } catch {
    return dataUrl;
  }
};

export const compressImageFile = async (file: File, options?: CompressOptions): Promise<string> => {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  if (file.size > opts.maxFileSizeMB * 1024 * 1024) {
    throw new Error(`حجم الصورة كبير جداً (الحد ${opts.maxFileSizeMB} م.ب). يرجى اختيار صورة أصغر.`);
  }
  const dataUrl = await readFileAsDataUrl(file);
  return compressImageSource(dataUrl, options);
};