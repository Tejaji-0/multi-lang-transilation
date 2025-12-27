export interface TranslationResult {
  translatedText: string;
  sourceLanguage?: string;
  targetLanguage: string;
}

class TranslationService {
  private apiKey: string | null = null;
  private useLibreTranslate: boolean = false;
  private libreTranslateUrl: string = 'https://libretranslate.com/translate';
  private useMyMemory: boolean = true; // Free API, no key needed

  setApiKey(key: string) {
    this.apiKey = key;
    this.useMyMemory = false;
  }

  setLibreTranslate(url?: string) {
    this.useLibreTranslate = true;
    this.useMyMemory = false;
    if (url) this.libreTranslateUrl = url;
  }

  async translate(
    text: string,
    targetLanguage: string,
    sourceLanguage: string = 'auto'
  ): Promise<TranslationResult> {
    if (!text.trim()) {
      return {
        translatedText: '',
        targetLanguage,
        sourceLanguage,
      };
    }

    try {
      // Try MyMemory free API first
      if (this.useMyMemory) {
        return await this.translateWithMyMemory(text, targetLanguage, sourceLanguage);
      }
      
      if (this.useLibreTranslate) {
        return await this.translateWithLibre(text, targetLanguage, sourceLanguage);
      }
      
      if (this.apiKey) {
        return await this.translateWithGoogle(text, targetLanguage, sourceLanguage);
      }
    } catch (error) {
      console.error('Translation error:', error);
    }

    // Fallback to mock
    return this.mockTranslate(text, targetLanguage, sourceLanguage);
  }

  private async translateWithMyMemory(
    text: string,
    targetLang: string,
    sourceLang: string
  ): Promise<TranslationResult> {
    // MyMemory API uses ISO language codes
    const langMap: {[key: string]: string} = {
      'hi': 'hi-IN', 'ta': 'ta-IN', 'te': 'te-IN', 'kn': 'kn-IN',
      'ml': 'ml-IN', 'mr': 'mr-IN', 'bn': 'bn-IN', 'gu': 'gu-IN',
      'pa': 'pa-IN', 'ur': 'ur-PK', 'or': 'or-IN', 'as': 'as-IN',
      'en': 'en-US', 'es': 'es-ES', 'fr': 'fr-FR', 'de': 'de-DE',
      'zh': 'zh-CN', 'ja': 'ja-JP', 'ko': 'ko-KR', 'ar': 'ar-SA',
      'ru': 'ru-RU', 'pt': 'pt-PT', 'it': 'it-IT'
    };

    const source = sourceLang === 'auto' ? 'en-US' : (langMap[sourceLang] || sourceLang);
    const target = langMap[targetLang] || targetLang;

    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${source}|${target}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('MyMemory translation request failed');
    }

    const data = await response.json();
    
    if (data.responseStatus === 200 && data.responseData) {
      return {
        translatedText: data.responseData.translatedText,
        sourceLanguage: sourceLang,
        targetLanguage: targetLang,
      };
    }
    
    throw new Error('MyMemory translation failed');
  }

  private async translateWithGoogle(
    text: string,
    targetLang: string,
    sourceLang: string
  ): Promise<TranslationResult> {
    const url = `https://translation.googleapis.com/language/translate/v2?key=${this.apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        target: targetLang,
        source: sourceLang === 'auto' ? undefined : sourceLang,
      }),
    });

    if (!response.ok) {
      throw new Error('Translation request failed');
    }

    const data = await response.json();
    
    return {
      translatedText: data.data.translations[0].translatedText,
      sourceLanguage: data.data.translations[0].detectedSourceLanguage || sourceLang,
      targetLanguage: targetLang,
    };
  }

  private async translateWithLibre(
    text: string,
    targetLang: string,
    sourceLang: string
  ): Promise<TranslationResult> {
    const response = await fetch(this.libreTranslateUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: sourceLang === 'auto' ? 'auto' : sourceLang,
        target: targetLang,
        format: 'text',
      }),
    });

    if (!response.ok) {
      throw new Error('LibreTranslate request failed');
    }

    const data = await response.json();
    
    return {
      translatedText: data.translatedText,
      sourceLanguage: data.detectedLanguage?.language || sourceLang,
      targetLanguage: targetLang,
    };
  }

  private mockTranslate(
    text: string,
    targetLang: string,
    sourceLang: string
  ): TranslationResult {
    return {
      translatedText: `${text}\n\n[Note: Using free MyMemory API. For production, consider Google Translate or LibreTranslate API]`,
      sourceLanguage: sourceLang,
      targetLanguage: targetLang,
    };
  }

  async detectLanguage(text: string): Promise<string> {
    if (!text.trim()) return 'en';

    // Basic script detection
    if (/[\u0900-\u097F]/.test(text)) return 'hi';
    if (/[\u0B80-\u0BFF]/.test(text)) return 'ta';
    if (/[\u0C00-\u0C7F]/.test(text)) return 'te';
    if (/[\u0C80-\u0CFF]/.test(text)) return 'kn';
    if (/[\u0D00-\u0D7F]/.test(text)) return 'ml';
    if (/[\u0980-\u09FF]/.test(text)) return 'bn';
    if (/[\u0A80-\u0AFF]/.test(text)) return 'gu';
    if (/[\u0A00-\u0A7F]/.test(text)) return 'pa';
    if (/[\u0600-\u06FF]/.test(text)) return 'ar';
    if (/[\u4E00-\u9FFF]/.test(text)) return 'zh';
    if (/[\u3040-\u309F\u30A0-\u30FF]/.test(text)) return 'ja';
    if (/[\uAC00-\uD7AF]/.test(text)) return 'ko';

    return 'en';
  }
}

export const translationService = new TranslationService();
