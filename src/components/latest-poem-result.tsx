"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PoemDisplay from "@/components/poem-display";
import Link from "next/link";
import type { Poem } from "@/types";

export default function LatestPoemResult() {
  const router = useRouter();
  const [poem, setPoem] = useState<Poem | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("latest_poem");
    if (!stored) {
      router.replace("/");
      return;
    }
    const data = JSON.parse(stored);
    setPoem({
      id: "latest",
      poemText: data.poemText,
      poemType: data.poemType,
      imageData: data.imageData,
      season: data.season ?? null,
      mood: data.mood ?? null,
      createdAt: data.createdAt ?? new Date().toISOString(),
    });
  }, [router]);

  if (!poem) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper">
        <p className="text-stone-400">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper">
      <div className="max-w-lg mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <Link href="/" className="text-3xl font-serif text-stone-800">
            詠
          </Link>
        </header>

        <PoemDisplay poem={poem} />

        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/"
            className="w-full py-3 rounded-2xl bg-stone-800 text-stone-50 text-center font-serif hover:bg-stone-700 transition-colors"
          >
            もう一首詠む
          </Link>
        </div>

        <p className="text-center text-stone-400 text-xs mt-6">
          {new Date(poem.createdAt).toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
          に詠まれた歌
        </p>
      </div>
    </div>
  );
}
