import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelect: (file: File, preview: string) => void;
  isProcessing?: boolean;
}

export function ImageUploader({ onImageSelect, isProcessing }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
      onImageSelect(file, result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const clearImage = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Upload Image
      </h2>

      {!preview ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`
            card cursor-pointer p-12 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]
            ${isDragging ? 'border-accent-500 bg-accent-50 dark:bg-accent-900/20 scale-[1.02]' : ''}
            ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <div className="flex flex-col items-center gap-4 text-center">
            <div className={`
              p-6 rounded-full transition-colors duration-300
              ${isDragging ? 'bg-accent-100 dark:bg-accent-800' : 'bg-gray-100 dark:bg-gray-700'}
            `}>
              <Upload className={`w-12 h-12 ${isDragging ? 'text-accent-600' : 'text-gray-400'}`} />
            </div>
            
            <div>
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                {isDragging ? 'Drop image here' : 'Drag & drop an image'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                or click to browse
              </p>
            </div>
            
            <div className="text-xs text-gray-400 dark:text-gray-500">
              Supports: JPG, PNG, WEBP, GIF
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            disabled={isProcessing}
            className="hidden"
          />
        </div>
      ) : (
        <div className="card p-4 relative group animate-scale-in">
          <button
            onClick={clearImage}
            disabled={isProcessing}
            aria-label="Remove image"
            className="absolute top-6 right-6 p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all duration-200 opacity-0 group-hover:opacity-100 z-10 disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
          
          <img
            src={preview}
            alt="Uploaded preview"
            className="w-full h-auto rounded-lg max-h-96 object-contain"
          />
          
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <ImageIcon className="w-4 h-4" />
            <span>Image loaded successfully</span>
          </div>
        </div>
      )}
    </div>
  );
}
