import React, { useState } from 'react';
import { ShieldCheck, X, KeyRound, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAyGram } from '../context/AyGramContext';

interface SecretAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecretAdminModal: React.FC<SecretAdminModalProps> = ({ isOpen, onClose }) => {
  const { unlockAdmin } = useAyGram();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = unlockAdmin(password.trim());
    if (success) {
      onClose();
    } else {
      setError('رمز الدخول غير صحيح');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 font-['IBM_Plex_Sans_Arabic']" dir="rtl">
      <div className="bg-[#FCF9F0] rounded-[20px] max-w-sm w-full p-6 shadow-aygram-md border border-[#D4AF37]/50 relative text-[#1A1A1A]">
        
        <button
          onClick={onClose}
          className="absolute top-4 start-4 p-1.5 rounded-[8px] text-[#7A7A7A] hover:text-[#0F3D2E] hover:bg-black/5 transition-colors cursor-pointer"
          title="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center space-y-3 pt-1">
          <div className="w-14 h-14 rounded-full bg-[#0F3D2E] text-[#D4AF37] flex items-center justify-center border-2 border-[#D4AF37] shadow-gold">
            <ShieldCheck className="w-7 h-7" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-[#0F3D2E]">
              رمز التحقق
            </h3>
            <p className="text-xs text-[#7A7A7A] mt-1">
              يرجى إدخال رمز الأمان للمتابعة
            </p>
          </div>

          {error && (
            <div className="w-full p-2.5 rounded-[10px] bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 text-start">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full space-y-3 pt-2 text-start">
            <div>
              <label className="block text-xs font-bold text-[#0F3D2E] mb-1">
                الرمز السري:
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 pe-10 rounded-[12px] bg-white border border-[#EFE9D9] text-xs font-mono text-[#1A1A1A] focus:outline-none focus:border-[#0F3D2E]"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute end-2.5 top-1/2 -translate-y-1/2 text-[#7A7A7A] hover:text-[#0F3D2E] cursor-pointer"
                  title={showPassword ? 'إخفاء' : 'إظهار'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-[12px] bg-[#0F3D2E] text-[#D4AF37] font-bold text-xs hover:bg-[#16503c] transition-colors shadow-aygram flex items-center justify-center gap-2 cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              <span>تأكيد</span>
            </button>
          </form>

          <div className="w-full pt-2 border-t border-[#EFE9D9]">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 px-4 rounded-[12px] bg-white border border-[#EFE9D9] text-[#7A7A7A] font-medium text-xs hover:bg-black/5 transition-colors cursor-pointer"
            >
              إلغاء
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

