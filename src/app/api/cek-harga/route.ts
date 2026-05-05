import { NextRequest, NextResponse } from "next/server";
import { checkPrice } from "@/lib/price-prediction";
import { generatePriceNegotiationTips } from "@/lib/ai-client";
import type { PriceCheckInput } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body: PriceCheckInput = await request.json();

    if (!body.brand || !body.model || !body.year || !body.offered_price) {
      return NextResponse.json(
        { error: "Semua field wajib diisi" },
        { status: 400 }
      );
    }

    const result = checkPrice(body);

    // Try AI-enhanced tips
    let ai_tips = "";
    if (process.env.GEMINI_API_KEY) {
      try {
        ai_tips = await generatePriceNegotiationTips(
          body.brand,
          body.model,
          body.year,
          body.condition,
          result.estimated_price,
          body.offered_price,
          result.status
        );
      } catch {
        // Silently fail
      }
    }

    return NextResponse.json({ result: { ...result, ai_tips } });
  } catch (error) {
    console.error("Price check error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat memproses cek harga" },
      { status: 500 }
    );
  }
}
