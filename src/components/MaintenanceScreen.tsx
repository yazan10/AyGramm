import React, { useState } from 'react';
import { Wrench, ShieldAlert, KeyRound, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { AyGramLogo } from './AyGramLogo';
import { useAyGram } from '../context/AyGramContext';

export const MaintenanceScreen: React.FC = () => {
  const { settings, unlockAdmin } = useAyGram();
  const [showAdminBypass, setShowAdminBypass] = useState(false);
  const [secretInput, setSecretInput] = useState('');
  const [bypassError, setBypassError] = useState('');

  const handleBypass = (e: React.FormEvent) => {
    e.preventDefault();
    setBypassError('');
    const success = unlockAdmin(secretInput.trim());
    if (!success) {
      setBypassError('الرمز السري غير صحيح');
    }
  };

  return (
    <div className="min-h-screen bg-[#FCF9F0] text-[#1A1A1A] flex flex-col items-center justify-center p-4 font-['IBM_Plex_Sans_Arabic']" dir="rtl">
      <div className="max-w-md w-full bg-white rounded-[24px] border border-[#EFE9D9] p-6 sm:p-8 shadow-aygram-md text-center">
        
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <AyGramLogo onSecretTrigger={() => setShowAdminBypass(true)} size="lg" />
        </div>

        {/* Maintenance Icon */}
        <div className="w-16 h-16 rounded-[20px] bg-[#D4AF37]/15 text-[#0F3D2E] flex items-center justify-center mx-auto mb-4 border border-[#D4AF37]/30">
          <Wrench className="w-8 h-8 text-[#D4AF37]" />
        </div>

        <h1 className="text-2xl font-bold text-[#0F3D2E] mb-2">
          الموقع في وضع الصيانة والتطوير
        </h1>

        <p className="text-xs sm:text-sm text-[#555555] leading-relaxed mb-6">
          {settings.maintenanceMessage ||
            'نقوم حالياً بأعمال صيانة وتحديثات مجدولة لتحسين تجربتكم المباركة في منصة AyGram. سنعاود العمل قريباً بإذن الله.'}
        </p>

        <div className="bg-[#FCF9F0] p-3 rounded-[14px] border border-[#EFE9D9] text-xs text-[#7A7A7A] mb-6 flex items-center justify-center gap-2">
          <ShieldAlert className="w-4 h-4 text-[#D4AF37]" />
          <span>بياناتكم ومنشوراتكم محفوظة بأمان تام</span>
        </div>

        {/* Admin Bypass Toggle */}
        {!showAdminBypass ? (
          <button
            onClick={() => setShowAdminBypass(true)}
            className="text-xs font-bold text-[#7A7A7A] hover:text-[#0F3D2E] transition-colors flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>تسجيل دخول المشرف لتجاوز الصيانة</span>
          </button>
        ) : (
          <form onSubmit={handleBypass} className="mt-4 pt-4 border-t border-[#EFE9D9] space-y-3">
            <div className="text-xs font-bold text-[#0F3D2E] mb-1">
              أدخل باسورد الأدمن لتجاوز وضع الصيانة
            </div>
            {bypassError && (
              <div className="text-xs text-red-600 font-bold bg-red-50 p-2 rounded-[10px]">
                {bypassError}
              </div>
            )}
            <input
              type="password"
              value={secretInput}
              onChange={(e) => setSecretInput(e.target.value)}
              placeholder="••••••••"
              className="w-full py-2 px-3 rounded-[12px] bg-[#FCF9F0] border border-[#EFE9D9] text-xs focus:outline-none focus:border-[#0F3D2E] text-center font-mono"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 py-2 rounded-[12px] bg-[#0F3D2E] text-white font-bold text-xs hover:bg-[#155A44] transition-colors cursor-pointer"
              >
                تأكيد الدخول
              </button>
              <button
                type="button"
                onClick={() => setShowAdminBypass(false)}
                className="px-3 py-2 rounded-[12px] bg-gray-100 text-[#7A7A7A] text-xs hover:bg-gray-200 cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
