import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PoemDisplay from "@/components/poem-display";
import Link from "next/link";
import type { Poem } from "@/types";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ResultPage({ params }: Props) {
  const { id } = await params;

  const poemData = await prisma.poem.findUnique({
    where: { id },
  });

  if (!poemData) {
    notFound();
  }

  const poem: Poem = {
    ...poemData,
    poemType: poemData.poemType as Poem["poemType"],
    createdAt: poemData.createdAt.toISOString(),
  };

  return (
    <div className="min-h-screen bg-paper">
      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <Link href="/" className="text-3xl font-serif text-stone-800">
            詠
          </Link>
        </header>

        {/* Poem Display */}
        <PoemDisplay poem={poem} />

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/"
            className="w-full py-3 rounded-2xl bg-stone-800 text-stone-50 text-center font-serif hover:bg-stone-700 transition-colors"
          >
            もう一首詠む
          </Link>
          <Link
            href="/history"
            className="w-full py-3 rounded-2xl border border-stone-300 text-stone-600 text-center text-sm hover:bg-stone-50 transition-colors"
          >
            歌の記録を見る
          </Link>
        </div>

        {/* Date */}
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
