"use client";

import { useCallback, useState } from "react";
import { UploadCloud, X, FileText } from "lucide-react";
import clsx from "clsx";

interface FileUploadProps {
  value: File | null;
  onChange: (file: File | null) => void;
}

export default function FileUpload({ value, onChange }: FileUploadProps) {
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) onChange(file);
    },
    [onChange]
  );

  return (
    <div className="w-full">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={clsx(
          "border-[1.75px] border-dashed rounded-[24px] p-8 pb-10 text-center transition-all bg-white relative flex flex-col items-center justify-center min-h-[202px]",
          dragging ? "border-brand-orange bg-orange-50/20" : "border-gray-300 hover:border-gray-400"
        )}
      >
        {value ? (
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <FileText size={18} className="text-gray-600" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-brand-dark">{value.name}</p>
              <p className="text-xs text-gray-400">{(value.size / 1024).toFixed(1)} KB</p>
            </div>
            <button
              type="button"
              onClick={() => onChange(null)}
              className="ml-2 w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 hover:bg-red-100 hover:text-red-500 transition-colors text-gray-500"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <>
            <UploadCloud size={24} className="text-gray-800 mb-4" strokeWidth={1.5} />
            <p className="text-sm font-medium text-gray-800 mb-1">
              Choose a file or drag &amp; drop it here
            </p>
            <p className="text-[12px] text-gray-400 mb-5">JPEG, PNG, upto 10MB</p>
            <label className="inline-flex cursor-pointer mt-auto">
              <span className="text-[13px] font-medium bg-[#f5f5f5] text-gray-700 px-6 py-2 rounded-full hover:bg-gray-200 transition-all">
                Browse Files
              </span>
              <input
                type="file"
                accept=".pdf,.txt,.png,.jpg,.jpeg"
                className="sr-only"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) onChange(f); }}
              />
            </label>
          </>
        )}
      </div>
      <p className="text-center text-[13px] text-gray-400 mt-4">
        Upload images of your preferred document/image
      </p>
    </div>
  );
}
