import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generatePoem } from "@/lib/claude";
import type { GeneratePoemRequest } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body: GeneratePoemRequest = await request.json();
    const { imageBase64, imageMediaType, poemType } = body;

    if (!imageBase64 || !imageMediaType || !poemType) {
      return NextResponse.json(
        { error: "画像とポエムタイプは必須です" },
        { status: 400 }
      );
    }

    if (poemType !== "haiku" && poemType !== "tanka") {
      return NextResponse.json(
        { error: "poemTypeは haiku または tanka を指定してください" },
        { status: 400 }
      );
    }

    const result = await generatePoem(
      imageBase64,
      imageMediaType as "image/jpeg" | "image/png" | "image/webp" | "image/gif",
      poemType
    );

    const poem = await prisma.poem.create({
      data: {
        poemText: result.poem,
        poemType,
        imageData: imageBase64,
        season: result.season,
        mood: result.mood,
      },
    });

    return NextResponse.json(poem, { status: 201 });
  } catch (error) {
    console.error("Poem generation error:", error);
    return NextResponse.json(
      { error: "詩の生成に失敗しました。もう一度お試しください。" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const [poems, total] = await Promise.all([
      prisma.poem.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.poem.count(),
    ]);

    return NextResponse.json({ poems, total, page });
  } catch (error) {
    console.error("Poem list error:", error);
    return NextResponse.json(
      { error: "詩の取得に失敗しました" },
      { status: 500 }
    );
  }
}
