import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Sparkles, FileCode } from 'lucide-react';

interface FileDropzoneProps {
  onFileLoaded: (content: string, fileName: string) => void;
  onLoadDemo: () => void;
  isLoading: boolean;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({
  onFileLoaded,
  onLoadDemo,
  isLoading
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    setErrorMessage(null);
    if (!file.name.endsWith('.txt') && !file.name.endsWith('.csv')) {
      setErrorMessage('Please upload a .txt or .csv PhonePe transaction statement file.');
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) {
        onFileLoaded(text, file.name);
      } else {
        setErrorMessage('File appears to be empty.');
      }
    };
    reader.onerror = () => {
      setErrorMessage('Failed to read file.');
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`relative group cursor-pointer rounded-2xl border-2 border-dashed p-6 transition-all duration-300 flex flex-col items-center justify-center text-center ${
          isDragging
            ? 'border-phonepe-400 bg-phonepe-950/40 scale-[1.01] shadow-2xl shadow-phonepe-950/60'
            : 'border-slate-700/80 bg-slate-900/40 hover:border-phonepe-500/50 hover:bg-slate-900/80'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          accept=".txt,.csv"
          className="hidden"
        />

        {/* Upload Icon Container */}
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110 duration-300 ${
          isDragging
            ? 'bg-phonepe-600 text-white shadow-lg shadow-phonepe-600/50'
            : 'bg-slate-800 text-phonepe-400 border border-slate-700 group-hover:bg-phonepe-950 group-hover:text-phonepe-300'
        }`}>
          <UploadCloud className="w-7 h-7" />
        </div>

        {/* Text Guidelines */}
        <h3 className="text-base font-semibold text-white mb-1">
          {fileName ? (
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" /> Loaded: {fileName}
            </span>
          ) : (
            'Drag & drop transaction.txt or click to browse'
          )}
        </h3>
        
        <p className="text-xs text-slate-400 max-w-md mb-3">
          Supports PhonePe statement formats <code className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">YYYY-MM-DD, Merchant, Amount</code> or CSV files.
        </p>

        {/* Action Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="px-3.5 py-1.5 rounded-lg bg-phonepe-700 hover:bg-phonepe-600 text-white text-xs font-semibold shadow transition-all active:scale-95"
          >
            Select Statement File
          </button>
          
          <button
            type="button"
            onClick={onLoadDemo}
            disabled={isLoading}
            className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Try with Sample Statement
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mt-3 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
};
