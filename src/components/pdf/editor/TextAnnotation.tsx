"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { X, GripVertical } from "lucide-react";

export interface TextAnnotationData {
  id: string;
  pageIndex: number;
  x: number; // percentage
  y: number; // percentage
  content: string;
  fontSize: number;
  fontColor: string;
}

interface TextAnnotationProps {
  annotation: TextAnnotationData;
  isSelected: boolean;
  containerWidth: number;
  containerHeight: number;
  onSelect: () => void;
  onUpdate: (updates: Partial<TextAnnotationData>) => void;
  onDelete: () => void;
  isSelectTool: boolean;
}

export default function TextAnnotation({
  annotation,
  isSelected,
  containerWidth,
  containerHeight,
  onSelect,
  onUpdate,
  onDelete,
  isSelectTool,
}: TextAnnotationProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(!annotation.content);
  const dragStartRef = useRef({ x: 0, y: 0, annX: 0, annY: 0 });
  const textRef = useRef<HTMLDivElement>(null);

  const left = (annotation.x / 100) * containerWidth;
  const top = (annotation.y / 100) * containerHeight;

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!isSelectTool && !isSelected) return;
      e.preventDefault();
      e.stopPropagation();
      onSelect();
      setIsDragging(true);
      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        annX: annotation.x,
        annY: annotation.y,
      };
    },
    [annotation.x, annotation.y, onSelect, isSelectTool, isSelected]
  );

  useEffect(() => {
    if (!isDragging) return;
    const handleMove = (e: MouseEvent) => {
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      const newX = dragStartRef.current.annX + (dx / containerWidth) * 100;
      const newY = dragStartRef.current.annY + (dy / containerHeight) * 100;
      onUpdate({
        x: Math.max(0, Math.min(95, newX)),
        y: Math.max(0, Math.min(95, newY)),
      });
    };
    const handleUp = () => setIsDragging(false);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [isDragging, containerWidth, containerHeight, onUpdate]);

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsEditing(true);
      onSelect();
      setTimeout(() => textRef.current?.focus(), 0);
    },
    [onSelect]
  );

  const handleBlur = useCallback(() => {
    setIsEditing(false);
    const text = textRef.current?.innerText?.trim() || "";
    if (!text) {
      onDelete();
    } else {
      onUpdate({ content: text });
    }
  }, [onUpdate, onDelete]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsEditing(false);
        textRef.current?.blur();
      }
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        textRef.current?.blur();
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        if (!isEditing && isSelected) {
          onDelete();
        }
      }
    },
    [isEditing, isSelected, onDelete]
  );

  return (
    <div
      className={`absolute group ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
      style={{ left, top, zIndex: isSelected ? 20 : 10 }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
      onKeyDown={handleKeyDown}
      onClick={(e) => { e.stopPropagation(); onSelect(); }}
    >
      <div
        className={`relative px-1 py-0.5 rounded min-w-[20px] ${
          isSelected
            ? "ring-2 ring-blue-500 bg-blue-50/50"
            : "hover:ring-1 hover:ring-blue-300"
        }`}
      >
        {/* Drag handle */}
        {isSelected && !isEditing && (
          <div className="absolute -left-5 top-0 p-0.5 text-blue-400 cursor-grab">
            <GripVertical className="w-3 h-3" />
          </div>
        )}

        {/* Delete button */}
        {isSelected && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="absolute -top-2.5 -right-2.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        )}

        {/* Font size controls */}
        {isSelected && !isEditing && (
          <div className="absolute -bottom-7 left-0 flex items-center gap-1 bg-white rounded-md shadow-md border border-gray-200 px-1 py-0.5">
            <button
              onClick={(e) => { e.stopPropagation(); onUpdate({ fontSize: Math.max(8, annotation.fontSize - 2) }); }}
              className="text-xs text-gray-500 hover:text-gray-900 px-1"
            >
              A-
            </button>
            <span className="text-[10px] text-gray-400">{annotation.fontSize}</span>
            <button
              onClick={(e) => { e.stopPropagation(); onUpdate({ fontSize: Math.min(72, annotation.fontSize + 2) }); }}
              className="text-xs text-gray-500 hover:text-gray-900 px-1"
            >
              A+
            </button>
          </div>
        )}

        {/* Text content */}
        <div
          ref={textRef}
          contentEditable={isEditing}
          suppressContentEditableWarning
          onBlur={handleBlur}
          className="outline-none whitespace-pre-wrap break-words"
          style={{
            fontSize: annotation.fontSize,
            color: annotation.fontColor,
            minWidth: isEditing ? 100 : undefined,
            caretColor: "black",
          }}
        >
          {annotation.content || (isEditing ? "" : "Click to type")}
        </div>
      </div>
    </div>
  );
}
