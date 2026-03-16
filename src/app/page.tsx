"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CameraCapture from "@/components/camera-capture";
import PhotoUpload from "@/components/photo-upload";
import PoemTypeSelector from "@/components/poem-type-selector";
import LoadingAnimation from "@/components/loading-animation";
import { compressImage } from "@/lib/image-utils";
import type { PoemType } from "@/types";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const [poemType, setPoemType] = useState<PoemType>("haiku");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelected = (file: File) => {
    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError(null);
  };

  const handleGenerate = async () => {
    if (!selectedImage) return;

    setIsGenerating(true);
    setError(null);

    try {
      const { base64, mediaType } = await compressImage(selectedImage);

      const response = await fetch("/api/poems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: base64,
          imageMediaType: mediaType,
          poemType,
        }),
      });

      if (!response.ok) {
        throw new Error("生成に失敗しました");
      }

      const poem = await response.json();
      if (poem.id) {
        router.push(`/result/${poem.id}`);
      } else {
        // DB unavailable (Vercel) — store in sessionStorage and show inline
        sessionStorage.setItem("latest_poem", JSON.stringify(poem));
        router.push("/result/latest");
      }
    } catch {
      setError("詩の生成に失敗しました。もう一度お試しください。");
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setError(null);
  };

  if (isGenerating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper">
        <LoadingAnimation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper">
      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-10">
          <h1 className="text-5xl font-serif text-stone-800 mb-2">詠</h1>
          <p className="text-stone-400 text-sm">写真から詩を詠む</p>
        </header>

        <div className="space-y-6">
          {/* Poem Type Selector */}
          <PoemTypeSelector value={poemType} onChange={setPoemType} />

          {/* Image Selection */}
          {!selectedImage ? (
            <div className="space-y-4">
              <CameraCapture onCapture={handleImageSelected} />
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-stone-200" />
                <span className="text-stone-400 text-xs">または</span>
                <div className="flex-1 h-px bg-stone-200" />
              </div>
              <PhotoUpload onSelect={handleImageSelected} />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Preview */}
              <div className="relative rounded-2xl overflow-hidden">
                <img
                  src={previewUrl!}
                  alt="選択した写真"
                  className="w-full max-h-80 object-cover rounded-2xl"
                />
                <button
                  onClick={handleReset}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-stone-800/70 text-white flex items-center justify-center text-sm hover:bg-stone-800/90"
                >
                  ✕
                </button>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                className="w-full py-4 rounded-2xl bg-stone-800 text-stone-50 text-lg font-serif hover:bg-stone-700 transition-colors shadow-sm"
              >
                詠む
              </button>
            </div>
          )}

          {/* Error */}
          {error && (
            <p className="text-center text-red-600 text-sm">{error}</p>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center">
          <Link
            href="/history"
            className="text-stone-400 text-sm hover:text-stone-600 transition-colors"
          >
            歌の記録を見る →
          </Link>
        </footer>
      </div>
    </div>
  );
}
