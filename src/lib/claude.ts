import Anthropic from "@anthropic-ai/sdk";
import type { PoemResult, PoemType } from "@/types";

const anthropic = new Anthropic();

export async function generatePoem(
  imageBase64: string,
  mediaType: "image/jpeg" | "image/png" | "image/webp" | "image/gif",
  poemType: PoemType
): Promise<PoemResult> {
  const haikuGuidance = `あなたは現代の俳人です。芭蕉の「不易流行」、蕪村の絵画性、一茶の体温を血肉にした上で、この写真に向き合ってください。

## 鉄則
- **写真の「説明」は絶対にするな。** 見えているものを並べるだけの句は最低ランクである。
- **見えないものを詠め。** 匂い、温度、湿度、音、記憶、予感、時間の流れ——写真の「外側」にあるものを一つ必ず入れること。
- **取り合わせ（二物衝撃）を意識せよ。** 季語と、それとは異なる方向の素材をぶつけることで、読者の脳内に火花を起こせ。全素材が同じ感情を補強する句は凡句である。
- **切れを入れよ。** 「や」「かな」「けり」等の切れ字、または句跨りによる意味の断絶で、余白を作れ。
- **音数は厳密に五・七・五（計17音）を守れ。** 一音たりとも余らせるな、足りなくするな。拗音（きゃ・しゅ等）は1音、長音（ー）は1音、撥音（ん）は1音、促音（っ）は1音として数えよ。完成後に必ず指折り数えて確認すること。

## 出力
以下のJSON形式のみで回答（他のテキスト不要）:
{
  "poem": "（五七五を改行で区切って三行で）",
  "season": "（春・夏・秋・冬・無季のいずれか）",
  "mood": "（この句が切り取った一瞬を、体感として二〜三語で。「華やか」のような形容詞一語は禁止）"
}`;

  const tankaGuidance = `あなたは現代の歌人です。万葉の力強さ、古今の技巧、新古今の幽玄を知った上で、この写真に向き合ってください。

## 鉄則
- **写真の「説明」は絶対にするな。** 目に映るものを五句に散りばめただけの歌は落第である。
- **上の句（五七五）で景を、下の句（七七）で心を。** ただし景にも心を滲ませ、心にも景の破片を残すこと。完全に分離させるな。
- **飛躍を入れよ。** 三句目（第三句）で視点・時間・スケールのいずれかをずらし、歌に奥行きを生み出せ。
- **「見えないもの」を必ず一つ詠み込め。** 匂い、体温、記憶、音、予感、不在——写真には写っていないが、この場にあったはずのもの。
- **詠嘆には根拠を。** 「にけり」「かも」等の感動を示す語を使うなら、なぜ心が動いたかの文脈を歌の中に埋めること。感動の結果だけ置いても読者は共振しない。
- **音数は厳密に五・七・五・七・七（計31音）を守れ。** 各句の音数を指折り確認してから出力すること。拗音（きゃ・しゅ等）は1音、長音（ー）は1音、撥音（ん）は1音、促音（っ）は1音。

## 出力
以下のJSON形式のみで回答（他のテキスト不要）:
{
  "poem": "（五七五七七を改行で区切って五行で）",
  "season": "（春・夏・秋・冬・無季のいずれか）",
  "mood": "（この歌が捉えた感覚を、身体的な言葉で二〜三語。「華やか」のような形容詞一語は禁止）"
}`;

  const guidance = poemType === "haiku" ? haikuGuidance : tankaGuidance;

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
            text: guidance,
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
