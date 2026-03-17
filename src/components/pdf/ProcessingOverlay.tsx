"use client";

interface ProcessingOverlayProps {
  message?: string;
}

export default function ProcessingOverlay({
  message = "Processing your file...",
}: ProcessingOverlayProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-4">
      {/* Spinner */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-blue-100 rounded-full" />
        <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>

      {/* Message */}
      <p className="text-gray-700 font-medium">{message}</p>
      <p className="text-xs text-gray-400">
        Please don&apos;t close this page.
      </p>
    </div>
  );
}
