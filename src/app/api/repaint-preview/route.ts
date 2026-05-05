import { NextRequest, NextResponse } from "next/server";
import { generateRepaintSuggestion } from "@/lib/ai-client";
import repaintColors from "@/data/repaint-colors.json";
import type { RepaintColor } from "@/types";

const colors = repaintColors as RepaintColor[];

export async function GET() {
  return NextResponse.json({ colors });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { color_id } = body;

    const color = colors.find((c) => c.id === color_id);
    if (!color) {
      return NextResponse.json({ error: "Warna tidak ditemukan" }, { status: 404 });
    }

    let ai_suggestion = "";
    if (process.env.GEMINI_API_KEY) {
      try {
        ai_suggestion = await generateRepaintSuggestion(
          color.body_color,
          color.wheel_color,
          color.style
        );
      } catch {
        // Silently fail
      }
    }

    return NextResponse.json({ color, ai_suggestion });
  } catch (error) {
    console.error("Repaint error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
