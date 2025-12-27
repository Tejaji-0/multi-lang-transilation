export interface Language {
  code: string;
  name: string;
  nativeName: string;
  region?: string;
}

export const LANGUAGES: Language[] = [
  // Indian Languages
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', region: 'India' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', region: 'India' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', region: 'India' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', region: 'India' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', region: 'India' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', region: 'India' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', region: 'India' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', region: 'India' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', region: 'India' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', region: 'India' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', region: 'India' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', region: 'India' },
  { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्', region: 'India' },
  
  // Global Languages
  { code: 'en', name: 'English', nativeName: 'English', region: 'Global' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', region: 'Global' },
  { code: 'fr', name: 'French', nativeName: 'Français', region: 'Global' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', region: 'Europe' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', region: 'Asia' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', region: 'Asia' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', region: 'Asia' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', region: 'Middle East' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', region: 'Global' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', region: 'Global' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', region: 'Europe' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', region: 'Europe' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', region: 'Middle East' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', region: 'Europe' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', region: 'Asia' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', region: 'Asia' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', region: 'Asia' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', region: 'Asia' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', region: 'Africa' },
];

export const getLanguageByCode = (code: string): Language | undefined => {
  return LANGUAGES.find(lang => lang.code === code);
};

export const getLanguagesByRegion = (region: string): Language[] => {
  return LANGUAGES.filter(lang => lang.region === region);
};

export const searchLanguages = (query: string): Language[] => {
  const lowerQuery = query.toLowerCase();
  return LANGUAGES.filter(lang =>
    lang.name.toLowerCase().includes(lowerQuery) ||
    lang.nativeName.toLowerCase().includes(lowerQuery) ||
    lang.code.toLowerCase().includes(lowerQuery)
  );
};

export const OCR_LANGUAGES = [
  'eng', 'hin', 'tam', 'tel', 'kan', 'mal', 'mar', 'ben', 'guj', 'pan', 'ori', 'asm',
  'spa', 'fra', 'deu', 'chi_sim', 'jpn', 'kor', 'ara', 'rus', 'por', 'ita'
];
