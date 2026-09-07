export interface CountryOption {
  code: string;
  name: string;
  nationality: string;
  flag: string;
}

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
}

export interface CurrencyOption {
  code: string;
  name: string;
  symbol: string;
}

// All major world countries & nationalities in Arabic
export const WORLD_COUNTRIES: CountryOption[] = [
  { code: 'SA', name: 'المملكة العربية السعودية', nationality: 'سعودي', flag: '🇸🇦' },
  { code: 'AE', name: 'الإمارات العربية المتحدة', nationality: 'إماراتي', flag: '🇦🇪' },
  { code: 'QA', name: 'قطر', nationality: 'قطري', flag: '🇶🇦' },
  { code: 'KW', name: 'الكويت', nationality: 'كويتي', flag: '🇰🇼' },
  { code: 'BH', name: 'البحرين', nationality: 'بحريني', flag: '🇧🇭' },
  { code: 'OM', name: 'سلطنة عُمان', nationality: 'عُماني', flag: '🇴🇲' },
  { code: 'EG', name: 'مصر', nationality: 'مصري', flag: '🇪🇬' },
  { code: 'JO', name: 'الأردن', nationality: 'أردني', flag: '🇯🇴' },
  { code: 'PS', name: 'فلسطين', nationality: 'فلسطيني', flag: '🇵🇸' },
  { code: 'IQ', name: 'العراق', nationality: 'عراقي', flag: '🇮🇶' },
  { code: 'SY', name: 'سوريا', nationality: 'سوري', flag: '🇸🇾' },
  { code: 'LB', name: 'لبنان', nationality: 'لبناني', flag: '🇱🇧' },
  { code: 'YE', name: 'اليمن', nationality: 'يمني', flag: '🇾🇪' },
  { code: 'SD', name: 'السودان', nationality: 'سوداني', flag: '🇸🇩' },
  { code: 'MA', name: 'المغرب', nationality: 'مغربي', flag: '🇲🇦' },
  { code: 'DZ', name: 'الجزائر', nationality: 'جزائري', flag: '🇩🇿' },
  { code: 'TN', name: 'تونس', nationality: 'تونسي', flag: '🇹🇳' },
  { code: 'LY', name: 'ليبيا', nationality: 'ليبي', flag: '🇱🇾' },
  { code: 'MR', name: 'موريتانيا', nationality: 'موريتاني', flag: '🇲🇷' },
  { code: 'SO', name: 'الصومال', nationality: 'صومالي', flag: '🇸🇴' },
  { code: 'DJ', name: 'جيبوتي', nationality: 'جيبوتي', flag: '🇩🇯' },
  { code: 'KM', name: 'جزر القمر', nationality: 'قمري', flag: '🇰🇲' },
  { code: 'TR', name: 'تركيا', nationality: 'تركي', flag: '🇹🇷' },
  { code: 'MY', name: 'ماليزيا', nationality: 'ماليزي', flag: '🇲🇾' },
  { code: 'ID', name: 'إندونيسيا', nationality: 'إندونيسي', flag: '🇮🇩' },
  { code: 'PK', name: 'باكستان', nationality: 'باكستاني', flag: '🇵🇰' },
  { code: 'BD', name: 'بنغلاديش', nationality: 'بنغالي', flag: '🇧🇩' },
  { code: 'IN', name: 'الهند', nationality: 'هندي', flag: '🇮🇳' },
  { code: 'AF', name: 'أفغانستان', nationality: 'أفغاني', flag: '🇦🇫' },
  { code: 'IR', name: 'إيران', nationality: 'إيراني', flag: '🇮🇷' },
  { code: 'US', name: 'الولايات المتحدة الأمريكية', nationality: 'أمريكي', flag: '🇺🇸' },
  { code: 'GB', name: 'المملكة المتحدة (بريطانيا)', nationality: 'بريطاني', flag: '🇬🇧' },
  { code: 'CA', name: 'كندا', nationality: 'كندي', flag: '🇨🇦' },
  { code: 'AU', name: 'أستراليا', nationality: 'أسترالي', flag: '🇦🇺' },
  { code: 'FR', name: 'فرنسا', nationality: 'فرنسي', flag: '🇫🇷' },
  { code: 'DE', name: 'ألمانيا', nationality: 'ألماني', flag: '🇩🇪' },
  { code: 'ES', name: 'إسبانيا', nationality: 'إسباني', flag: '🇪🇸' },
  { code: 'IT', name: 'إيطاليا', nationality: 'إيطالي', flag: '🇮🇹' },
  { code: 'NL', name: 'هولندا', nationality: 'هولندي', flag: '🇳🇱' },
  { code: 'SE', name: 'السويد', nationality: 'سويدي', flag: '🇸🇪' },
  { code: 'NO', name: 'النرويج', nationality: 'نرويجي', flag: '🇳🇴' },
  { code: 'CH', name: 'سويسرا', nationality: 'سويسري', flag: '🇨🇭' },
  { code: 'BE', name: 'بلجيكا', nationality: 'بلجيكي', flag: '🇧🇪' },
  { code: 'AT', name: 'النمسا', nationality: 'نمساوي', flag: '🇦🇹' },
  { code: 'RU', name: 'روسيا', nationality: 'روسي', flag: '🇷🇺' },
  { code: 'CN', name: 'الصين', nationality: 'صيني', flag: '🇨🇳' },
  { code: 'JP', name: 'اليابان', nationality: 'ياباني', flag: '🇯🇵' },
  { code: 'KR', name: 'كوريا الجنوبية', nationality: 'كوري', flag: '🇰🇷' },
  { code: 'BR', name: 'البرازيل', nationality: 'برازيلي', flag: '🇧🇷' },
  { code: 'AR', name: 'الأرجنتين', nationality: 'أرجنتيني', flag: '🇦🇷' },
  { code: 'ZA', name: 'جنوب أفريقيا', nationality: 'جنوب أفريقي', flag: '🇿🇦' },
  { code: 'NG', name: 'نيجيريا', nationality: 'نيجيري', flag: '🇳🇬' },
  { code: 'SN', name: 'السنغال', nationality: 'سنغالي', flag: '🇸🇳' },
  { code: 'GH', name: 'غانا', nationality: 'غاني', flag: '🇬🇭' },
  { code: 'KE', name: 'كينيا', nationality: 'كيني', flag: '🇰🇪' },
  { code: 'TZ', name: 'تنزانيا', nationality: 'تنزاني', flag: '🇹🇿' },
  { code: 'ET', name: 'إثيوبيا', nationality: 'إثيوبي', flag: '🇪🇹' },
  { code: 'UZ', name: 'أوزبكستان', nationality: 'أوزبكي', flag: '🇺🇿' },
  { code: 'KZ', name: 'كازاخستان', nationality: 'كازاخستاني', flag: '🇰🇿' },
  { code: 'AZ', name: 'أذربيجان', nationality: 'أذري', flag: '🇦🇿' },
  { code: 'BA', name: 'البوسنة والهرسك', nationality: 'بوسني', flag: '🇧🇦' },
  { code: 'AL', name: 'ألبانيا', nationality: 'ألباني', flag: '🇦🇱' },
  { code: 'XK', name: 'كوسوفو', nationality: 'كوسوفي', flag: '🇽🇰' },
  { code: 'GR', name: 'اليونان', nationality: 'يوناني', flag: '🇬🇷' },
  { code: 'PT', name: 'البرتغال', nationality: 'برتغالي', flag: '🇵🇹' },
  { code: 'PL', name: 'بولندا', nationality: 'بولندي', flag: '🇵🇱' },
  { code: 'MX', name: 'المكسيك', nationality: 'مكسيكي', flag: '🇲🇽' },
  { code: 'CL', name: 'تشيلي', nationality: 'تشيلي', flag: '🇨🇱' },
  { code: 'CO', name: 'كولومبيا', nationality: 'كولومبي', flag: '🇨🇴' },
  { code: 'TH', name: 'تايلاند', nationality: 'تايلاندي', flag: '🇹🇭' },
  { code: 'PH', name: 'الفلبين', nationality: 'فلبيني', flag: '🇵🇭' },
  { code: 'VN', name: 'فيتنام', nationality: 'فيتنامي', flag: '🇻🇳' },
  { code: 'SG', name: 'سنغافورة', nationality: 'سنغافوري', flag: '🇸🇬' },
  { code: 'NZ', name: 'نيوزيلندا', nationality: 'نيوزيلندي', flag: '🇳🇿' },
  { code: 'IE', name: 'أيرلندا', nationality: 'أيرلندي', flag: '🇮🇪' },
  { code: 'DK', name: 'الدنمارك', nationality: 'دنماركي', flag: '🇩🇰' },
  { code: 'FI', name: 'فنلندا', nationality: 'فنلندي', flag: '🇫🇮' }
];

// All world languages
export const WORLD_LANGUAGES: LanguageOption[] = [
  { code: 'ar', name: 'العربية', nativeName: 'العربية' },
  { code: 'en', name: 'الإنجليزية', nativeName: 'English' },
  { code: 'fr', name: 'الفرنسية', nativeName: 'Français' },
  { code: 'es', name: 'الإسبانية', nativeName: 'Español' },
  { code: 'tr', name: 'التركية', nativeName: 'Türkçe' },
  { code: 'ur', name: 'الأوردو', nativeName: 'اردو' },
  { code: 'id', name: 'الإندونيسية', nativeName: 'Bahasa Indonesia' },
  { code: 'ms', name: 'الماليزية', nativeName: 'Bahasa Melayu' },
  { code: 'de', name: 'الألمانية', nativeName: 'Deutsch' },
  { code: 'ru', name: 'الروسية', nativeName: 'Русский' },
  { code: 'fa', name: 'الفارسية', nativeName: 'فارسی' },
  { code: 'zh', name: 'الصينية', nativeName: '中文' },
  { code: 'hi', name: 'الهندية', nativeName: 'हिन्दी' },
  { code: 'bn', name: 'البنغالية', nativeName: 'বাংলা' },
  { code: 'pt', name: 'البرتغالية', nativeName: 'Português' },
  { code: 'it', name: 'الإيطالية', nativeName: 'Italiano' },
  { code: 'ja', name: 'اليابانية', nativeName: '日本語' },
  { code: 'ko', name: 'الكورية', nativeName: '한국어' },
  { code: 'sw', name: 'السواحيلية', nativeName: 'Kiswahili' },
  { code: 'ha', name: 'الهوسا', nativeName: 'Hausa' },
  { code: 'uz', name: 'الأوزبكية', nativeName: 'Oʻzbek' },
  { code: 'bs', name: 'البوسنية', nativeName: 'Bosanski' },
  { code: 'sq', name: 'الألبانية', nativeName: 'Shqip' },
  { code: 'nl', name: 'الهولندية', nativeName: 'Nederlands' },
  { code: 'sv', name: 'السويدية', nativeName: 'Svenska' }
];

// All world currencies
export const WORLD_CURRENCIES: CurrencyOption[] = [
  { code: 'SAR', name: 'ريال سعودي', symbol: 'ر.س' },
  { code: 'AED', name: 'درهم إماراتي', symbol: 'د.إ' },
  { code: 'QAR', name: 'ريال قطري', symbol: 'ر.ق' },
  { code: 'KWD', name: 'دينار كويتي', symbol: 'د.ك' },
  { code: 'BHD', name: 'دينار بحريني', symbol: 'د.ب' },
  { code: 'OMR', name: 'ريال عُماني', symbol: 'ر.ع' },
  { code: 'USD', name: 'دولار أمريكي', symbol: '$' },
  { code: 'EUR', name: 'يورو أوروبي', symbol: '€' },
  { code: 'GBP', name: 'جنيه إسترليني', symbol: '£' },
  { code: 'EGP', name: 'جنيه مصري', symbol: 'ج.م' },
  { code: 'JOD', name: 'دينار أردني', symbol: 'د.أ' },
  { code: 'IQD', name: 'دينار عراقي', symbol: 'د.ع' },
  { code: 'MAD', name: 'درهم مغربي', symbol: 'د.م.' },
  { code: 'DZD', name: 'دينار جزائري', symbol: 'د.ج' },
  { code: 'TND', name: 'دينار تونسي', symbol: 'د.ت' },
  { code: 'LYD', name: 'دينار ليبي', symbol: 'د.ل' },
  { code: 'SDG', name: 'جنيه سوداني', symbol: 'ج.س' },
  { code: 'YER', name: 'ريال يمني', symbol: 'ر.ي' },
  { code: 'TRY', name: 'ليرة تركية', symbol: '₺' },
  { code: 'MYR', name: 'رينغيت ماليزي', symbol: 'RM' },
  { code: 'IDR', name: 'روبية إندونيسية', symbol: 'Rp' },
  { code: 'PKR', name: 'روبية باكستانية', symbol: '₨' },
  { code: 'INR', name: 'روبية هندية', symbol: '₹' },
  { code: 'JPY', name: 'ين ياباني', symbol: '¥' },
  { code: 'CNY', name: 'يوان صيني', symbol: '¥' },
  { code: 'CAD', name: 'دولار كندي', symbol: 'C$' },
  { code: 'AUD', name: 'دولار أسترالي', symbol: 'A$' },
  { code: 'CHF', name: 'فرنك سويسري', symbol: 'CHF' },
  { code: 'RUB', name: 'روبل روسي', symbol: '₽' },
  { code: 'ZAR', name: 'راند جنوب أفريقي', symbol: 'R' }
];
