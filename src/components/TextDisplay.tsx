import React from 'react';
import { Copy, Download, Volume2, VolumeX, Check } from 'lucide-react';
import { useSpeech } from '../hooks/useSpeech';

interface TextDisplayProps {
  title: string;
  text: string;
  language?: string;
  showActions?: boolean;
  icon?: React.ReactNode;
}

export function TextDisplay({ title, text, language, showActions = true, icon }: TextDisplayProps) {
  const [copied, setCopied] = React.useState(false);
  const { speak, isSpeaking, stop, isSupported } = useSpeech();

  const handleCopy = async () => {
    if (!text) return;
    
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    if (!text) return;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSpeak = () => {
    if (isSpeaking) {
      stop();
    } else {
      speak(text, language);
    }
  };

  return (
    <div className="space-y-3 animate-slide-up">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {title}
          </h3>
        </div>

        {showActions && text && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
              title="Copy to clipboard"
            >
              {copied ? (
                <Check className="w-5 h-5 text-green-600" />
              ) : (
                <Copy className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-accent-600" />
              )}
            </button>

            {isSupported && (
              <button
                onClick={handleSpeak}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                title={isSpeaking ? 'Stop speaking' : 'Read aloud'}
              >
                {isSpeaking ? (
                  <VolumeX className="w-5 h-5 text-accent-600" />
                ) : (
                  <Volume2 className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-accent-600" />
                )}
              </button>
            )}

            <button
              onClick={handleDownload}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
              title="Download as text file"
            >
              <Download className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-accent-600" />
            </button>
          </div>
        )}
      </div>

      <div className="card p-4 min-h-[200px] max-h-[400px] overflow-y-auto custom-scrollbar">
        {text ? (
          <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
            {text}
          </p>
        ) : (
          <p className="text-gray-400 dark:text-gray-500 italic text-center py-8">
            No text available
          </p>
        )}
      </div>
    </div>
  );
}
