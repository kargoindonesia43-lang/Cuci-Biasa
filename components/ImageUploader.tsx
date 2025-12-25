import React, { useRef, useState } from 'react';
import { UploadIcon } from './Icons';

interface ImageUploaderProps {
  label: string;
  subLabel: string;
  onImageSelect: (base64: string, preview: string) => void;
  selectedImage: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ label, subLabel, onImageSelect, selectedImage }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) processFile(file);
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      onImageSelect(base64, result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-baseline">
        <span className="text-sm font-semibold text-slate-300 uppercase tracking-wider">{label}</span>
        <span className="text-xs text-slate-500">{subLabel}</span>
      </div>
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 overflow-hidden
          ${isDragging 
            ? 'border-indigo-400 bg-indigo-500/10' 
            : 'border-slate-600 hover:border-slate-500 hover:bg-slate-800/50 bg-slate-800/20'}
        `}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        
        {selectedImage ? (
          <img 
            src={selectedImage} 
            alt="Preview" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <div className="scale-75 opacity-70"><UploadIcon /></div>
            <p className="mt-2 text-xs font-medium text-center px-4">Upload or Drop</p>
          </div>
        )}
        
        {selectedImage && (
          <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
             <p className="text-white text-xs font-medium">Change Frame</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
