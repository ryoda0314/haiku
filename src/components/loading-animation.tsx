"use client";

export default function LoadingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-6">
      <div className="relative w-20 h-20">
        {/* Ink drop animation */}
        <div className="absolute inset-0 rounded-full bg-stone-800 animate-ping opacity-20" />
        <div className="absolute inset-2 rounded-full bg-stone-700 animate-ping opacity-30 animation-delay-200" />
        <div className="absolute inset-4 rounded-full bg-stone-600 animate-pulse" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl">墨</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-stone-600 text-lg font-serif">詠んでいます...</p>
        <p className="text-stone-400 text-sm mt-1">
          写真から詩を紡いでいます
        </p>
      </div>
    </div>
  );
}
