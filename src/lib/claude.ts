import Anthropic from "@anthropic-ai/sdk";
import type { PoemResult, PoemType } from "@/types";

const anthropic = new Anthropic();

export async function generatePoem(
  imageBase64: string,
  mediaType: "image/jpeg" | "image/png" | "image/webp" | "image/gif",
  poemType: PoemType
): Promise<PoemResult> {
  const poemInstruction =
    poemType === "haiku"
      ? "五・七・五（5-7-5）の十七音からなる俳句"
      : "五・七・五・七・七（5-7-5-7-7）の三十一音からなる短歌";

  const format =
    poemType === "haiku"
      ? "（五七五を改行で区切って三行で）"
      : "（五七五七七を改行で区切って五行で）";

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: mediaType,
              data: imageBase64,
            },
          },
          {
            type: "text",
            text: `あなたは日本の伝統的な歌人です。この写真を観察し、${poemInstruction}を詠んでください。

手順:
1. 写真の風景、被写体、色彩、光、雰囲気を丁寧に観察する
2. 季節感（季語）を見出す
3. 写真から受ける感情や印象を感じ取る
4. 正確な音数（モーラ）で${poemType === "haiku" ? "俳句" : "短歌"}を一首詠む

以下のJSON形式のみで回答してください（他のテキストは不要です）:
{
  "poem": "${format}",
  "season": "（春・夏・秋・冬・無季のいずれか）",
  "mood": "（写真から感じた雰囲気を一言で）"
}`,
          },
        ],
      },
    ],
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text : "";

  // Extract JSON from response (handle potential markdown code blocks)
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to parse poem response");
  }

  return JSON.parse(jsonMatch[0]) as PoemResult;
}
