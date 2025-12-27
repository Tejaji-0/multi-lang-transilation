export interface OllamaVisionResult {
  text: string;
  confidence: number;
}

export interface OllamaTranslationResult {
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
}

class OllamaService {
  private baseUrl: string = 'http://localhost:11434';
  private visionModel: string = 'qwen3-vl:235b-cloud'; // Qwen3 vision model
  private textModel: string = 'gpt-oss:120b-cloud'; // GPT-OSS text model

  // Convert image file to base64
  private async imageToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        // Remove data:image/...;base64, prefix
        const base64Data = base64.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Check if Ollama is running and models are available
  async checkAvailability(): Promise<{ available: boolean; models: string[] }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`, {
        method: 'GET',
      });
      
      if (!response.ok) {
        return { available: false, models: [] };
      }

      const data = await response.json();
      const models = data.models?.map((m: any) => m.name) || [];
      
      return { available: true, models };
    } catch (error) {
      console.warn('Ollama not available:', error);
      return { available: false, models: [] };
    }
  }

  // Extract text from image using Ollama vision model
  async extractTextFromImage(
    imageFile: File,
    onProgress?: (status: string) => void
  ): Promise<OllamaVisionResult> {
    try {
      onProgress?.('Converting image to base64...');
      const base64Image = await this.imageToBase64(imageFile);

      onProgress?.('Sending to Ollama vision model...');
      
      const prompt = `Extract ALL text from this image exactly as it appears. Include:
- Every word, number, symbol, and punctuation mark
- Preserve the exact line breaks and formatting
- Keep the original case (uppercase/lowercase)
- Include any signs like @, #, $, %, &, *, +, =, etc.
- Extract text in any language present

Return ONLY the extracted text, nothing else. Do not add any explanations or commentary.`;

      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.visionModel,
          prompt: prompt,
          images: [base64Image],
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }

      const data = await response.json();
      const extractedText = data.response.trim();

      onProgress?.('Text extraction complete!');

      return {
        text: extractedText,
        confidence: 0.95, // Ollama vision models are highly accurate
      };
    } catch (error) {
      console.error('Ollama vision extraction error:', error);
      throw new Error('Failed to extract text using Ollama vision model. Make sure Ollama is running with llava model installed.');
    }
  }

  // Translate text using Ollama
  async translateText(
    text: string,
    targetLanguage: string,
    sourceLanguage: string = 'auto',
    onProgress?: (status: string) => void
  ): Promise<OllamaTranslationResult> {
    try {
      const languageNames: { [key: string]: string } = {
        hi: 'Hindi', ta: 'Tamil', te: 'Telugu', kn: 'Kannada',
        ml: 'Malayalam', mr: 'Marathi', bn: 'Bengali', gu: 'Gujarati',
        pa: 'Punjabi', ur: 'Urdu', or: 'Odia', as: 'Assamese',
        en: 'English', es: 'Spanish', fr: 'French', de: 'German',
        zh: 'Chinese', ja: 'Japanese', ko: 'Korean', ar: 'Arabic',
        ru: 'Russian', pt: 'Portuguese', it: 'Italian',
      };

      const targetLangName = languageNames[targetLanguage] || targetLanguage;
      const sourceLangName = sourceLanguage === 'auto' 
        ? 'the source language' 
        : (languageNames[sourceLanguage] || sourceLanguage);

      onProgress?.(`Translating to ${targetLangName}...`);

      const prompt = `Translate the following text from ${sourceLangName} to ${targetLangName}.

Important instructions:
- Provide ONLY the translation, no explanations
- Preserve all formatting, line breaks, and punctuation
- Keep numbers, symbols, and special characters as they are
- Maintain the original tone and meaning
- Do not add any commentary or notes

Text to translate:
${text}

Translation:`;

      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.textModel,
          prompt: prompt,
          stream: false,
          options: {
            temperature: 0.3, // Lower temperature for more accurate translation
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }

      const data = await response.json();
      const translatedText = data.response.trim();

      onProgress?.('Translation complete!');

      return {
        translatedText,
        sourceLanguage: sourceLanguage === 'auto' ? 'en' : sourceLanguage,
        targetLanguage,
      };
    } catch (error) {
      console.error('Ollama translation error:', error);
      throw new Error('Failed to translate text using Ollama. Make sure Ollama is running with llama model installed.');
    }
  }

  // Detect language of text
  async detectLanguage(text: string): Promise<string> {
    try {
      const prompt = `What language is this text written in? Reply with ONLY the ISO 639-1 language code (e.g., 'en' for English, 'hi' for Hindi, 'es' for Spanish, etc.). Do not include any other text.

Text: ${text.substring(0, 200)}`;

      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.textModel,
          prompt: prompt,
          stream: false,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const langCode = data.response.trim().toLowerCase().substring(0, 2);
        return langCode;
      }
    } catch (error) {
      console.warn('Ollama language detection failed:', error);
    }

    // Fallback to regex-based detection
    if (/[\u0900-\u097F]/.test(text)) return 'hi';
    if (/[\u0B80-\u0BFF]/.test(text)) return 'ta';
    if (/[\u0C00-\u0C7F]/.test(text)) return 'te';
    if (/[\u0C80-\u0CFF]/.test(text)) return 'kn';
    if (/[\u0D00-\u0D7F]/.test(text)) return 'ml';
    if (/[\u4E00-\u9FFF]/.test(text)) return 'zh';
    if (/[\u3040-\u309F\u30A0-\u30FF]/.test(text)) return 'ja';
    if (/[\uAC00-\uD7AF]/.test(text)) return 'ko';
    if (/[\u0600-\u06FF]/.test(text)) return 'ar';
    if (/[\u0400-\u04FF]/.test(text)) return 'ru';
    
    return 'en';
  }

  setModels(visionModel?: string, textModel?: string) {
    if (visionModel) this.visionModel = visionModel;
    if (textModel) this.textModel = textModel;
  }

  setBaseUrl(url: string) {
    this.baseUrl = url;
  }
}

export const ollamaService = new OllamaService();
