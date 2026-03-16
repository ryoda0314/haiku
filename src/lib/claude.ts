import Anthropic from "@anthropic-ai/sdk";
import type { PoemResult, PoemType } from "@/types";

const anthropic = new Anthropic();

const MORA_RULES = `
## モーラ（音数）の数え方ルール
- 通常の仮名：1文字＝1音（あ＝1、か＝1、さ＝1…）
- 撥音「ん」：1音
- 促音「っ」：1音
- 長音「ー」：1音
- 拗音（きゃ・しゅ・ちょ等）：仮名2文字で**1音**
- 拗長音（きゅう等）：きゅ＝1音＋う＝1音＝計2音
- 二重母音（おう・えい等）：それぞれ独立した1音ずつ（例：「とう」＝と+う＝2音）
- 漢字は必ず読み仮名に展開してから数えること`;

const haikuGuidance = `あなたは現代の俳人です。芭蕉の「不易流行」、蕪村の絵画性、一茶の体温を血肉にした上で、この写真に向き合ってください。

## 詩の鉄則
- **写真の「説明」は絶対にするな。** 見えているものを並べるだけの句は最低ランクである。
- **見えないものを詠め。** 匂い、温度、湿度、音、記憶、予感、時間の流れ——写真の「外側」にあるものを一つ必ず入れること。
- **取り合わせ（二物衝撃）を意識せよ。** 季語と、それとは異なる方向の素材をぶつけることで、読者の脳内に火花を起こせ。全素材が同じ感情を補強する句は凡句である。
- **切れを入れよ。** 「や」「かな」「けり」等の切れ字、または句跨りによる意味の断絶で、余白を作れ。
${MORA_RULES}

## 作業手順（必ずこの順番で思考すること）

**Step 1：下書き**
写真から受けた印象で俳句の下書きを作れ。

**Step 2：音数検証**
下書きの各句を平仮名に完全展開し、一音ずつ区切って数えよ。
例：「古池や」→「ふ・る・い・け・や」→ 5音 ✅
例：「蛙飛び込む」→「か・わ・ず・と・び・こ・む」→ 7音 ✅

**Step 3：修正**
5・7・5でない句があれば、意味を保ちながら言い換えて修正せよ。修正後にもう一度音数を数えて確認。5・7・5になるまで繰り返すこと。

**Step 4：最終出力**
以下のJSON形式のみで最終回答（思考過程は出力に含めてよい。JSONは回答の末尾に置くこと）:
{
  "poem": "（五七五を改行で区切って三行で。漢字仮名交じりの最終形）",
  "season": "（春・夏・秋・冬・無季のいずれか）",
  "mood": "（この句が切り取った一瞬を、体感として二〜三語で。「華やか」のような形容詞一語は禁止）",
  "mora_check": ["（初句の読み：ひらがなを・で区切り＝N音）", "（二句の読み＝N音）", "（三句の読み＝N音）"]
}`;

const tankaGuidance = `あなたは現代の歌人です。万葉の力強さ、古今の技巧、新古今の幽玄を知った上で、この写真に向き合ってください。

## 詩の鉄則
- **写真の「説明」は絶対にするな。** 目に映るものを五句に散りばめただけの歌は落第である。
- **上の句（五七五）で景を、下の句（七七）で心を。** ただし景にも心を滲ませ、心にも景の破片を残すこと。完全に分離させるな。
- **飛躍を入れよ。** 三句目（第三句）で視点・時間・スケールのいずれかをずらし、歌に奥行きを生み出せ。
- **「見えないもの」を必ず一つ詠み込め。** 匂い、体温、記憶、音、予感、不在——写真には写っていないが、この場にあったはずのもの。
- **詠嘆には根拠を。** 「にけり」「かも」等の感動を示す語を使うなら、なぜ心が動いたかの文脈を歌の中に埋めること。感動の結果だけ置いても読者は共振しない。
${MORA_RULES}

## 作業手順（必ずこの順番で思考すること）

**Step 1：下書き**
写真から受けた印象で短歌の下書きを作れ。

**Step 2：音数検証**
下書きの各句を平仮名に完全展開し、一音ずつ区切って数えよ。
例：「花の色は」→「は・な・の・い・ろ・は」→ 6音 ❌（五音にすべき）
例：「うつりにけりな」→「う・つ・り・に・け・り・な」→ 7音 ✅

**Step 3：修正**
5・7・5・7・7でない句があれば、意味を保ちながら言い換えて修正せよ。修正後にもう一度音数を数えて確認。正しい音数になるまで繰り返すこと。

**Step 4：最終出力**
以下のJSON形式のみで最終回答（思考過程は出力に含めてよい。JSONは回答の末尾に置くこと）:
{
  "poem": "（五七五七七を改行で区切って五行で。漢字仮名交じりの最終形）",
  "season": "（春・夏・秋・冬・無季のいずれか）",
  "mood": "（この歌が捉えた感覚を、身体的な言葉で二〜三語。「華やか」のような形容詞一語は禁止）",
  "mora_check": ["（初句の読み＝N音）", "（二句＝N音）", "（三句＝N音）", "（四句＝N音）", "（結句＝N音）"]
}`;

export async function generatePoem(
  imageBase64: string,
  mediaType: "image/jpeg" | "image/png" | "image/webp" | "image/gif",
  poemType: PoemType
): Promise<PoemResult> {
  const guidance = poemType === "haiku" ? haikuGuidance : tankaGuidance;

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    thinking: {
      type: "enabled",
      budget_tokens: 3000,
    },
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

  // Extract text from response (may include thinking blocks)
  const textBlock = message.content.find((block) => block.type === "text");
  const text = textBlock && textBlock.type === "text" ? textBlock.text : "";

  // Extract the last JSON object from response
  const jsonMatches = [...text.matchAll(/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g)];
  const lastJson = jsonMatches[jsonMatches.length - 1];
  if (!lastJson) {
    throw new Error("Failed to parse poem response");
  }

  const parsed = JSON.parse(lastJson[0]);
  return {
    poem: parsed.poem,
    season: parsed.season,
    mood: parsed.mood,
  };
}
