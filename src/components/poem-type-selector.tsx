"use client";

import type { PoemType } from "@/types";

interface PoemTypeSelectorProps {
  value: PoemType;
  onChange: (type: PoemType) => void;
}

export default function PoemTypeSelector({
  value,
  onChange,
}: PoemTypeSelectorProps) {
  return (
    <div className="flex rounded-full bg-stone-100 p-1">
      <button
        onClick={() => onChange("haiku")}
        className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all ${
          value === "haiku"
            ? "bg-stone-800 text-stone-50 shadow-sm"
            : "text-stone-500 hover:text-stone-700"
        }`}
      >
        俳句 <span className="text-xs opacity-70">五七五</span>
      </button>
      <button
        onClick={() => onChange("tanka")}
        className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all ${
          value === "tanka"
            ? "bg-stone-800 text-stone-50 shadow-sm"
            : "text-stone-500 hover:text-stone-700"
        }`}
      >
        短歌 <span className="text-xs opacity-70">五七五七七</span>
      </button>
    </div>
  );
}
