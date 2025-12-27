import { createWorker } from 'tesseract.js';

export interface OCRProgress {
  status: string;
  progress: number;
}

export interface OCRResult {
  text: string;
  confidence: number;
  detectedScript?: string;
}

interface ScriptLanguageMap {
  [key: string]: string;
}

class OCRService {
  private worker: any | null = null;
  private osdWorker: any | null = null;
  
  // Script to language mapping
  private readonly SCRIPT_LANG_MAP: ScriptLanguageMap = {
    'Devanagari': 'hin+mar+san',
    'Tamil': 'tam',
    'Telugu': 'tel',
    'Kannada': 'kan',
    'Malayalam': 'mal',
    'Bengali': 'ben',
    'Gujarati': 'guj',
    'Gurmukhi': 'pan',
    'Arabic': 'ara+urd',
    'Oriya': 'ori',
    'Latin': 'eng+spa+fra+deu+ita+por',
    'Han': 'chi_sim+chi_tra',
    'Hiragana': 'jpn',
    'Hangul': 'kor',
    'Cyrillic': 'rus',
  };

  // Preprocess image for better OCR accuracy
  private preprocessImage(imageFile: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      img.onload = () => {
        // Set canvas size (upscale if needed for better OCR)
        const scale = Math.max(1, 2000 / Math.max(img.width, img.height));
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        // Draw image with better quality
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Step 1: Convert to grayscale
        for (let i = 0; i < data.length; i += 4) {
          const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
          data[i] = data[i + 1] = data[i + 2] = gray;
        }

        // Step 2: Apply sharpening filter for better edge detection (signs/numbers)
        const width = canvas.width;
        const height = canvas.height;
        const sharpenKernel = [0, -1, 0, -1, 5, -1, 0, -1, 0];
        const tempData = new Uint8ClampedArray(data);

        for (let y = 1; y < height - 1; y++) {
          for (let x = 1; x < width - 1; x++) {
            let sum = 0;
            for (let ky = -1; ky <= 1; ky++) {
              for (let kx = -1; kx <= 1; kx++) {
                const idx = ((y + ky) * width + (x + kx)) * 4;
                const kernelIdx = (ky + 1) * 3 + (kx + 1);
                sum += tempData[idx] * sharpenKernel[kernelIdx];
              }
            }
            const idx = (y * width + x) * 4;
            const sharpened = Math.max(0, Math.min(255, sum));
            data[idx] = data[idx + 1] = data[idx + 2] = sharpened;
          }
        }

        // Step 3: Adaptive contrast enhancement
        const contrast = 1.8; // Higher for signs/numbers
        const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
        for (let i = 0; i < data.length; i += 4) {
          const enhanced = factor * (data[i] - 128) + 128;
          const final = Math.max(0, Math.min(255, enhanced));
          data[i] = data[i + 1] = data[i + 2] = final;
        }

        ctx.putImageData(imageData, 0, 0);

        // Convert to blob
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(URL.createObjectURL(blob));
          } else {
            reject(new Error('Failed to create blob'));
          }
        }, 'image/png', 1.0);
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(imageFile);
    });
  }

  // Detect script using OSD (Orientation and Script Detection)
  private async detectScript(imageUrl: string, onProgress?: (progress: OCRProgress) => void): Promise<string> {
    try {
      if (!this.osdWorker) {
        this.osdWorker = await createWorker('osd', 1, {
          logger: (m) => {
            if (onProgress) {
              onProgress({
                status: 'Detecting script...',
                progress: m.progress || 0,
              });
            }
          },
        });
      }

      const result = await this.osdWorker.detect(imageUrl);
      return result.script || 'Latin';
    } catch (error) {
      console.warn('Script detection failed, defaulting to Latin:', error);
      return 'Latin';
    }
  }

  async initialize(languages: string, onProgress?: (progress: OCRProgress) => void): Promise<void> {
    if (this.worker) {
      await this.worker.terminate();
    }

    this.worker = await createWorker(languages, 1, {
      logger: (m) => {
        if (onProgress) {
          onProgress({
            status: m.status,
            progress: m.progress || 0,
          });
        }
      },
    });
  }

  async extractText(
    imageFile: File,
    language?: string,
    onProgress?: (progress: OCRProgress) => void
  ): Promise<OCRResult> {
    try {
      // Step 1: Preprocess image
      onProgress?.({ status: 'Preprocessing image...', progress: 0.1 });
      const preprocessedImageUrl = await this.preprocessImage(imageFile);

      // Step 2: Detect script (if no language specified)
      let detectedScript = 'Latin';
      let languagesToUse = language;

      if (!language) {
        onProgress?.({ status: 'Detecting script...', progress: 0.2 });
        detectedScript = await this.detectScript(preprocessedImageUrl, onProgress);
        languagesToUse = this.SCRIPT_LANG_MAP[detectedScript] || 'eng';
        console.log(`Detected script: ${detectedScript}, using languages: ${languagesToUse}`);
      }

      // Step 3: Initialize worker with detected languages
      onProgress?.({ status: 'Loading language models...', progress: 0.3 });
      await this.initialize(languagesToUse || 'eng', onProgress);

      if (!this.worker) {
        throw new Error('OCR worker not initialized');
      }

      // Configure Tesseract for better line and layout preservation
      await this.worker.setParameters({
        tessedit_pageseg_mode: '6', // Assume uniform block of text (preserves lines)
        tessedit_char_whitelist: '', // Allow all characters including signs & numbers
        preserve_interword_spaces: '1', // Preserve spacing
      });

      // Step 4: Perform OCR
      onProgress?.({ status: 'Extracting text...', progress: 0.5 });
      const { data } = await this.worker.recognize(preprocessedImageUrl);

      // Cleanup
      URL.revokeObjectURL(preprocessedImageUrl);

      return {
        text: data.text.trim(),
        confidence: data.confidence,
        detectedScript,
      };
    } catch (error) {
      console.error('OCR Error:', error);
      throw new Error('Failed to extract text from image');
    }
  }

  async detectLanguage(text: string): Promise<string> {
    if (!text.trim()) return 'en';

    // Comprehensive script detection for all major languages
    // Indian Languages
    if (/[\u0900-\u097F]/.test(text)) return 'hi'; // Devanagari (Hindi, Marathi, Sanskrit)
    if (/[\u0B80-\u0BFF]/.test(text)) return 'ta'; // Tamil
    if (/[\u0C00-\u0C7F]/.test(text)) return 'te'; // Telugu
    if (/[\u0C80-\u0CFF]/.test(text)) return 'kn'; // Kannada
    if (/[\u0D00-\u0D7F]/.test(text)) return 'ml'; // Malayalam
    if (/[\u0A80-\u0AFF]/.test(text)) return 'gu'; // Gujarati
    if (/[\u0980-\u09FF]/.test(text)) return 'bn'; // Bengali
    if (/[\u0A00-\u0A7F]/.test(text)) return 'pa'; // Punjabi
    if (/[\u0B00-\u0B7F]/.test(text)) return 'or'; // Odia
    if (/[\u0600-\u06FF]/.test(text)) return 'ar'; // Arabic/Urdu
    
    // Asian Languages
    if (/[\u4E00-\u9FFF]/.test(text)) return 'zh'; // Chinese
    if (/[\u3040-\u309F\u30A0-\u30FF]/.test(text)) return 'ja'; // Japanese
    if (/[\uAC00-\uD7AF]/.test(text)) return 'ko'; // Korean
    if (/[\u0E00-\u0E7F]/.test(text)) return 'th'; // Thai
    
    // European Languages (basic heuristics)
    if (/[\u0400-\u04FF]/.test(text)) return 'ru'; // Cyrillic (Russian)
    if (/[áéíóúñ¿¡]/i.test(text)) return 'es'; // Spanish
    if (/[àâçéèêëîïôûùüÿœæ]/i.test(text)) return 'fr'; // French
    if (/[äöüß]/i.test(text)) return 'de'; // German
    if (/[àèéìíîòóùú]/i.test(text)) return 'it'; // Italian
    if (/[ãõçâêôáéíóú]/i.test(text)) return 'pt'; // Portuguese
    
    return 'en'; // Default to English
  }

  async terminate(): Promise<void> {
    if (this.worker) {
      await this.worker.terminate();
      this.worker = null;
    }
    if (this.osdWorker) {
      await this.osdWorker.terminate();
      this.osdWorker = null;
    }
  }
}

export const ocrService = new OCRService();
