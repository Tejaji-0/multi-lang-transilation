import React from 'react';
import { Loader2 } from 'lucide-react';

interface OCRProgressProps {
  status: string;
  progress: number;
}

export function OCRProgress({ status, progress }: OCRProgressProps) {
  return (
    <div className="card p-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Loader2 className="w-6 h-6 text-accent-600 animate-spin" />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {status}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {Math.round(progress * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className="bg-accent-600 h-full transition-all duration-300 ease-out"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
