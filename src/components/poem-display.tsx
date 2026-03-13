import type { Poem } from "@/types";

interface PoemDisplayProps {
  poem: Poem;
  showImage?: boolean;
}

export default function PoemDisplay({
  poem,
  showImage = true,
}: PoemDisplayProps) {
  const lines = poem.poemText.split("\n").filter((l) => l.trim());
  const seasonEmoji: Record<string, string> = {
    春: "🌸",
    夏: "🌻",
    秋: "🍁",
    冬: "❄️",
  };

  return (
    <div className="relative rounded-2xl overflow-hidden bg-stone-50 shadow-sm">
      {showImage && (
        <div className="relative h-64 sm:h-80">
          <img
            src={`data:image/jpeg;base64,${poem.imageData}`}
            alt="詩の元になった写真"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent" />
        </div>
      )}

      <div className="p-6 sm:p-8">
        {/* Poem in vertical writing */}
        <div className="flex justify-center mb-6">
          <div
            className="writing-vertical text-xl sm:text-2xl leading-loose tracking-widest font-serif text-stone-800"
            style={{
              writingMode: "vertical-rl",
              textOrientation: "upright",
              height: `${Math.max(lines.length * 2, 6)}em`,
            }}
          >
            {lines.map((line, i) => (
              <p key={i} className="mx-2">
                {line}
              </p>
            ))}
          </div>
        </div>

        {/* Metadata */}
        <div className="flex items-center justify-center gap-3 text-sm text-stone-400">
          {poem.season && (
            <span>
              {seasonEmoji[poem.season] || "○"} {poem.season}
            </span>
          )}
          {poem.mood && (
            <>
              <span>·</span>
              <span>{poem.mood}</span>
            </>
          )}
          <span>·</span>
          <span>{poem.poemType === "haiku" ? "俳句" : "短歌"}</span>
        </div>
      </div>
    </div>
  );
}
