import { NextRequest, NextResponse } from "next/server";
import { generatePoem } from "@/lib/claude";
import { getDb } from "@/lib/db";
import type { GeneratePoemRequest } from "@/types";

// Vercel serverless function timeout (requires Pro plan for >10s)
export const maxDuration = 60;

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

    // Try to save to DB, but don't fail if DB is unavailable (e.g. Vercel)
    let poemId: string | null = null;
    try {
      const db = getDb();
      if (db) {
        const poem = await db.poem.create({
          data: {
            poemText: result.poem,
            poemType,
            imageData: imageBase64,
            season: result.season,
            mood: result.mood,
          },
        });
        poemId = poem.id;
      }
    } catch (dbError) {
      console.warn("DB save skipped:", dbError);
    }

    return NextResponse.json(
      {
        id: poemId,
        poemText: result.poem,
        poemType,
        imageData: imageBase64,
        season: result.season,
        mood: result.mood,
        createdAt: new Date().toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Poem generation error:", error);
    const message =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `詩の生成に失敗しました: ${message}` },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    if (!db) {
      return NextResponse.json({ poems: [], total: 0, page: 1 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const [poems, total] = await Promise.all([
      db.poem.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      db.poem.count(),
    ]);

    return NextResponse.json({ poems, total, page });
  } catch (error) {
    console.error("Poem list error:", error);
    return NextResponse.json({ poems: [], total: 0, page: 1 });
  }
}
