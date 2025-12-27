import React, { useState } from 'react';
import { Moon, Sun, Languages, Sparkles } from 'lucide-react';
import { ImageUploader } from './components/ImageUploader';
import { LanguageSelector } from './components/LanguageSelector';
import { TextDisplay } from './components/TextDisplay';
import { OCRProgress } from './components/OCRProgress';
import { Alert } from './components/Alert';
import { useOCR } from './hooks/useOCR';
import { useTranslation } from './hooks/useTranslation';
import { useDarkMode } from './hooks/useDarkMode';
import { ocrService } from './services/ocrService';
import { ollamaService } from './services/ollamaService';

function App() {
  const { isDark, toggle: toggleDarkMode } = useDarkMode();
  const { extractText, isProcessing, progress, error: ocrError } = useOCR();
  const { translate, isTranslating, error: translationError } = useTranslation();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('auto');
  const [targetLanguage, setTargetLanguage] = useState('hi');
  const [detectedScript, setDetectedScript] = useState<string>('');
  const [useOllama, setUseOllama] = useState(true);
  const [ollamaAvailable, setOllamaAvailable] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');

  // Check Ollama availability on mount
  React.useEffect(() => {
    const checkOllama = async () => {
      const { available } = await ollamaService.checkAvailability();
      setOllamaAvailable(available);
      if (!available) {
        console.warn('Ollama not available, falling back to Tesseract OCR');
        setUseOllama(false);
      }
    };
    checkOllama();
  }, []);

  const handleImageSelect = async (file: File, preview: string) => {
    setImageFile(file);
    setImagePreview(preview);
    setExtractedText('');
    setTranslatedText('');
    setDetectedScript('');
    setProcessingStatus('');

    try {
      if (useOllama && ollamaAvailable) {
        // Use Ollama vision model for extraction
        setProcessingStatus('Using Ollama vision model for extraction...');
        const result = await ollamaService.extractTextFromImage(file, (status) => {
          setProcessingStatus(status);
        });
        setExtractedText(result.text);
        setProcessingStatus('Text extracted successfully!');

        // Detect language using Ollama
        const detectedLang = await ollamaService.detectLanguage(result.text);
        setSourceLanguage(detectedLang);
        console.log('Detected language:', detectedLang);
      } else {
        // Fallback to Tesseract OCR
        setProcessingStatus('Using Tesseract OCR (Ollama not available)...');
        const result = await extractText(file);
        setExtractedText(result.text);

        if (result.detectedScript) {
          setDetectedScript(result.detectedScript);
          console.log('Detected script:', result.detectedScript);
        }

        const detectedLang = await ocrService.detectLanguage(result.text);
        setSourceLanguage(detectedLang);
        console.log('Detected language:', detectedLang);
      }
    } catch (err) {
      console.error('Text extraction failed:', err);
      setProcessingStatus('Extraction failed. Make sure Ollama is running with llava model installed.');
    }
  };

  const handleTranslate = async () => {
    if (!extractedText) {
      console.log('No extracted text to translate');
      return;
    }

    console.log('Starting translation...', { extractedText, targetLanguage, sourceLanguage, useOllama, ollamaAvailable });

    try {
      if (useOllama && ollamaAvailable) {
        // Use Ollama for translation
        console.log('Using Ollama for translation');
        setProcessingStatus('Translating with Ollama (Qwen2.5)...');
        const result = await ollamaService.translateText(
          extractedText,
          targetLanguage,
          sourceLanguage,
          (status) => {
            console.log('Translation status:', status);
            setProcessingStatus(status);
          }
        );
        console.log('Translation result:', result);
        setTranslatedText(result.translatedText);
        setProcessingStatus('Translation complete!');
        setTimeout(() => setProcessingStatus(''), 3000);
      } else {
        // Fallback to existing translation service
        console.log('Using fallback translation service');
        setProcessingStatus('Translating with MyMemory API...');
        const result = await translate(extractedText, targetLanguage, sourceLanguage);
        console.log('Translation result:', result);
        setTranslatedText(result.translatedText);
        setProcessingStatus('Translation complete!');
        setTimeout(() => setProcessingStatus(''), 3000);
      }
    } catch (err) {
      console.error('Translation failed:', err);
      const errorMsg = err instanceof Error ? err.message : 'Translation failed';
      setProcessingStatus(`❌ Translation error: ${errorMsg}`);
      
      // Try fallback if Ollama fails
      if (useOllama && ollamaAvailable) {
        console.log('Ollama translation failed, trying MyMemory fallback...');
        try {
          const result = await translate(extractedText, targetLanguage, sourceLanguage);
          setTranslatedText(result.translatedText);
          setProcessingStatus('Translation complete (using fallback API)!');
          setTimeout(() => setProcessingStatus(''), 3000);
        } catch (fallbackErr) {
          console.error('Fallback translation also failed:', fallbackErr);
        }
      }
    }
  };

  React.useEffect(() => {
    console.log('useEffect triggered:', { extractedText: !!extractedText, targetLanguage });
    if (extractedText && targetLanguage) {
      console.log('Calling handleTranslate from useEffect');
      handleTranslate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extractedText, targetLanguage, sourceLanguage]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent-100 dark:bg-accent-900 rounded-lg">
                <Languages className="w-8 h-8 text-accent-600 dark:text-accent-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Multi-Language Translator
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Extract text from images and translate instantly
                </p>
              </div>
            </div>

            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDark ? (
                <Sun className="w-6 h-6 text-yellow-500" />
              ) : (
                <Moon className="w-6 h-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Ollama Status Banner */}
        {ollamaAvailable && (
          <div className="mb-6">
            <Alert 
              type="success" 
              message={`✨ Using Ollama Vision AI (Qwen3-VL) for superior text extraction and translation`}
            />
          </div>
        )}
        {!ollamaAvailable && (
          <div className="mb-6">
            <Alert 
              type="warning" 
              message="⚠️ Ollama not detected. Make sure Ollama is running with qwen3-vl model. Using Tesseract OCR as fallback."
            />
          </div>
        )}

        {/* Processing Status */}
        {processingStatus && (
          <div className="mb-6">
            <Alert type="info" message={processingStatus} />
          </div>
        )}

        {/* Error Messages */}
        {(ocrError || translationError) && (
          <div className="mb-6">
            {ocrError && <Alert type="error" message={ocrError} />}
            {translationError && <Alert type="error" message={translationError} />}
          </div>
        )}

        {/* Upload Section */}
        <div className="mb-8">
          <ImageUploader onImageSelect={handleImageSelect} isProcessing={isProcessing} />
        </div>

        {/* Progress Indicator */}
        {isProcessing && progress && (
          <div className="mb-8">
            <OCRProgress status={progress.status} progress={progress.progress} />
          </div>
        )}

        {/* Results Section */}
        {extractedText && (
          <div className="space-y-8 animate-fade-in">
            {/* Script Detection Info */}
            {detectedScript && (
              <div className="card p-4 bg-accent-50 dark:bg-accent-900/20 border-accent-200 dark:border-accent-800">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-accent-600" />
                  <span className="text-sm font-medium text-accent-800 dark:text-accent-200">
                    Detected Script: <span className="font-bold">{detectedScript}</span>
                  </span>
                </div>
              </div>
            )}

            {/* Language Selection */}
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-6 h-6 text-accent-600" />
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                  Translation Settings
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <LanguageSelector
                  value={sourceLanguage}
                  onChange={setSourceLanguage}
                  label="Source Language"
                  showAutoDetect
                />
                <LanguageSelector
                  value={targetLanguage}
                  onChange={setTargetLanguage}
                  label="Target Language"
                />
              </div>

              {isTranslating && (
                <div className="mt-4 flex items-center gap-2 text-accent-600">
                  <div className="w-4 h-4 border-2 border-accent-600 border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm">Translating...</span>
                </div>
              )}
            </div>

            {/* Side-by-side Text Display */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Original Image */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  <span className="w-8 h-8 bg-accent-100 dark:bg-accent-900 rounded-full flex items-center justify-center text-accent-600 text-sm font-bold">
                    1
                  </span>
                  Original Image
                </h3>
                {imagePreview && (
                  <div className="card p-4">
                    <img
                      src={imagePreview}
                      alt="Original"
                      className="w-full h-auto rounded-lg max-h-80 object-contain"
                    />
                  </div>
                )}
              </div>

              {/* Extracted Text */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-8 h-8 bg-accent-100 dark:bg-accent-900 rounded-full flex items-center justify-center text-accent-600 text-sm font-bold">
                    2
                  </span>
                  <TextDisplay
                    title="Extracted Text"
                    text={extractedText}
                    language={sourceLanguage}
                  />
                </div>
              </div>

              {/* Translated Text */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-8 h-8 bg-accent-100 dark:bg-accent-900 rounded-full flex items-center justify-center text-accent-600 text-sm font-bold">
                    3
                  </span>
                  <TextDisplay
                    title="Translated Text"
                    text={translatedText}
                    language={targetLanguage}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!imageFile && !isProcessing && (
          <div className="text-center py-16 animate-fade-in">
            <div className="inline-block p-6 bg-accent-50 dark:bg-accent-900/20 rounded-full mb-4">
              <Languages className="w-16 h-16 text-accent-600 dark:text-accent-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Get Started
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Upload an image containing text to extract and translate it into multiple languages.
              Perfect for documents, signs, and handwritten notes.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 py-6 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Powered by Tesseract.js • Built with React & Vite</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
