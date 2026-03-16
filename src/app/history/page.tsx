import { getDb } from "@/lib/db";
import PoemCard from "@/components/poem-card";
import Link from "next/link";
import type { Poem } from "@/types";

export default async function HistoryPage() {
  let poems: Poem[] = [];

  try {
    const db = getDb();
    if (db) {
      const poemsData = await db.poem.findMany({
        orderBy: { createdAt: "desc" },
        take: 50,
      });
      poems = poemsData.map((p) => ({
        ...p,
        poemType: p.poemType as Poem["poemType"],
        createdAt: p.createdAt.toISOString(),
      }));
    }
  } catch {
    // DB unavailable
  }

  return (
    <div className="min-h-screen bg-paper">
      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <Link href="/" className="text-3xl font-serif text-stone-800">
            詠
          </Link>
          <h2 className="text-stone-500 text-sm">歌の記録</h2>
        </header>

        {poems.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-stone-400 text-lg font-serif mb-4">
              まだ歌がありません
            </p>
            <Link
              href="/"
              className="inline-block py-3 px-8 rounded-2xl bg-stone-800 text-stone-50 font-serif hover:bg-stone-700 transition-colors"
            >
              最初の一首を詠む
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {poems.map((poem) => (
              <PoemCard key={poem.id} poem={poem} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
