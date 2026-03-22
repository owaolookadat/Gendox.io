"use client";

import { useRef, useState, useCallback } from "react";
import { Upload, FileText, Image } from "lucide-react";
import { formatFileSize, isValidFileType } from "@/lib/pdf/pdf-utils";

interface PdfUploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  accept: string[]; // e.g. [".pdf"] or [".jpg", ".jpeg", ".png"]
  multiple?: boolean;
  maxFiles?: number;
  maxSizeMB?: number;
  label?: string; // e.g. "Select PDF file" or "Select images"
  sublabel?: string; // e.g. "or drag & drop PDF files here"
  icon?: "pdf" | "image";
}

export default function PdfUploadZone({
  onFilesSelected,
  accept,
  multiple = false,
  maxFiles = 20,
  maxSizeMB = 100,
  label = "Select PDF file",
  sublabel = "or drag & drop files here",
  icon = "pdf",
}: PdfUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateAndSet = useCallback(
    (fileList: FileList | File[]) => {
      const files = Array.from(fileList);
      setError(null);

      // Validate file types
      const invalidFiles = files.filter((f) => !isValidFileType(f, accept));
      if (invalidFiles.length > 0) {
        setError(
          `Invalid file type: ${invalidFiles[0].name}. Accepted: ${accept.join(", ")}`
        );
        return;
      }

      // Validate count
      if (!multiple && files.length > 1) {
        setError("Please select only one file.");
        return;
      }
      if (files.length > maxFiles) {
        setError(`Maximum ${maxFiles} files allowed.`);
        return;
      }

      // Validate size
      const maxBytes = maxSizeMB * 1024 * 1024;
      const oversized = files.find((f) => f.size > maxBytes);
      if (oversized) {
        setError(
          `File "${oversized.name}" (${formatFileSize(oversized.size)}) exceeds the ${maxSizeMB}MB limit.`
        );
        return;
      }

      onFilesSelected(files);
    },
    [accept, multiple, maxFiles, maxSizeMB, onFilesSelected]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (e.dataTransfer.files.length > 0) {
        validateAndSet(e.dataTransfer.files);
      }
    },
    [validateAndSet]
  );

  const handleClick = () => inputRef.current?.click();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSet(e.target.files);
      // Reset input so same file can be re-selected
      e.target.value = "";
    }
  };

  const IconComponent = icon === "image" ? Image : FileText;

  return (
    <div className="w-full">
      <div
        role="button"
        aria-label={label}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`
          relative flex flex-col items-center justify-center w-full min-h-[280px]
          border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200
          ${
            isDragging
              ? "border-blue-500 bg-blue-50 scale-[1.01]"
              : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50/50"
          }
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept.join(",")}
          multiple={multiple}
          onChange={handleChange}
          className="hidden"
          aria-label="Upload file"
        />

        <div
          className={`p-4 rounded-2xl mb-4 transition-colors ${isDragging ? "bg-blue-100" : "bg-white"}`}
        >
          {isDragging ? (
            <Upload className="w-10 h-10 text-blue-500" />
          ) : (
            <IconComponent className="w-10 h-10 text-blue-500" />
          )}
        </div>

        <button
          type="button"
          className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-sm mb-3"
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
        >
          {label}
        </button>

        <p className="text-sm text-gray-500">{sublabel}</p>

        <p className="text-xs text-gray-400 mt-2">
          Max {maxSizeMB}MB{multiple ? ` · Up to ${maxFiles} files` : ""}
        </p>
      </div>

      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}
