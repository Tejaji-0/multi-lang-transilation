import React, { useState, useMemo } from 'react';
import { Search, Check, ChevronDown } from 'lucide-react';
import { LANGUAGES } from '../services/languages';

interface LanguageSelectorProps {
  value: string;
  onChange: (languageCode: string) => void;
  label: string;
  placeholder?: string;
  showAutoDetect?: boolean;
}

export function LanguageSelector({
  value,
  onChange,
  label,
  placeholder = 'Select language',
  showAutoDetect = false,
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLanguages = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return LANGUAGES.filter(
      (lang) =>
        lang.name.toLowerCase().includes(query) ||
        lang.nativeName.toLowerCase().includes(query) ||
        lang.code.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const selectedLanguage = LANGUAGES.find((lang) => lang.code === value);

  const handleSelect = (code: string) => {
    onChange(code);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="input flex items-center justify-between hover:border-accent-500 transition-colors"
      >
        <span className={selectedLanguage ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400'}>
          {value === 'auto' && showAutoDetect
            ? 'Auto-detect'
            : selectedLanguage
            ? `${selectedLanguage.name} (${selectedLanguage.nativeName})`
            : placeholder}
        </span>
        <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          <div className="absolute z-20 mt-2 w-full card max-h-96 overflow-hidden animate-scale-in">
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search languages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input pl-10 text-sm"
                  autoFocus
                />
              </div>
            </div>

            <div className="overflow-y-auto max-h-72 custom-scrollbar">
              {showAutoDetect && (
                <button
                  onClick={() => handleSelect('auto')}
                  className={`
                    w-full px-4 py-3 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors
                    ${value === 'auto' ? 'bg-accent-50 dark:bg-accent-900/20' : ''}
                  `}
                >
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    Auto-detect
                  </span>
                  {value === 'auto' && <Check className="w-5 h-5 text-accent-600" />}
                </button>
              )}

              {filteredLanguages.length === 0 ? (
                <div className="px-4 py-8 text-center text-gray-500">
                  No languages found
                </div>
              ) : (
                filteredLanguages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleSelect(lang.code)}
                    className={`
                      w-full px-4 py-3 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left
                      ${value === lang.code ? 'bg-accent-50 dark:bg-accent-900/20' : ''}
                    `}
                  >
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {lang.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {lang.nativeName}
                      </div>
                    </div>
                    {value === lang.code && <Check className="w-5 h-5 text-accent-600" />}
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e0;
          border-radius: 4px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4a5568;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a0aec0;
        }
      `}</style>
    </div>
  );
}
