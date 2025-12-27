import { useState, useCallback } from 'react';
import { translationService, TranslationResult } from '../services/translationService';

interface UseTranslationReturn {
  translate: (text: string, targetLang: string, sourceLang?: string) => Promise<TranslationResult>;
  isTranslating: boolean;
  error: string | null;
}

export function useTranslation(): UseTranslationReturn {
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const translate = useCallback(async (
    text: string,
    targetLang: string,
    sourceLang: string = 'auto'
  ) => {
    setIsTranslating(true);
    setError(null);

    try {
      const result = await translationService.translate(text, targetLang, sourceLang);
      setIsTranslating(false);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Translation failed';
      setError(errorMessage);
      setIsTranslating(false);
      throw err;
    }
  }, []);

  return {
    translate,
    isTranslating,
    error,
  };
}
