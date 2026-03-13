import Link from "next/link";
import type { Poem } from "@/types";

interface PoemCardProps {
  poem: Poem;
}

export default function PoemCard({ poem }: PoemCardProps) {
  const firstLine = poem.poemText.split("\n")[0];
  const date = new Date(poem.createdAt).toLocaleDateString("ja-JP", {
    month: "short",
    day: "numeric",
  });

  const seasonEmoji: Record<string, string> = {
    春: "🌸",
    夏: "🌻",
    秋: "🍁",
    冬: "❄️",
  };

  return (
    <Link href={`/result/${poem.id}`}>
      <div className="group rounded-xl overflow-hidden bg-stone-50 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
        <div className="relative h-32">
          <img
            src={`data:image/jpeg;base64,${poem.imageData}`}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/50 to-transparent" />
          <div className="absolute bottom-2 left-3 right-3">
            <p className="text-white text-sm font-serif truncate">{firstLine}</p>
          </div>
        </div>
        <div className="px-3 py-2 flex items-center justify-between text-xs text-stone-400">
          <span>
            {poem.season && (seasonEmoji[poem.season] || "")}{" "}
            {poem.poemType === "haiku" ? "俳句" : "短歌"}
          </span>
          <span>{date}</span>
        </div>
      </div>
    </Link>
  );
}
