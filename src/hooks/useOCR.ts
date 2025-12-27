import { useState, useCallback } from 'react';
import { ocrService, OCRProgress, OCRResult } from '../services/ocrService';

interface UseOCRReturn {
  extractText: (file: File, language?: string) => Promise<OCRResult>;
  isProcessing: boolean;
  progress: OCRProgress | null;
  error: string | null;
}

export function useOCR(): UseOCRReturn {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<OCRProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  const extractText = useCallback(async (file: File, language?: string) => {
    setIsProcessing(true);
    setError(null);
    setProgress(null);

    try {
      const result = await ocrService.extractText(
        file,
        language,
        (p) => setProgress(p)
      );
      
      setIsProcessing(false);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to extract text';
      setError(errorMessage);
      setIsProcessing(false);
      throw err;
    }
  }, []);

  return {
    extractText,
    isProcessing,
    progress,
    error,
  };
}
