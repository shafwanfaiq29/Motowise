import { NextRequest, NextResponse } from "next/server";
import { getMotorRecommendations } from "@/lib/recommendation";
import { generateMotorRecommendationInsight } from "@/lib/ai-client";
import type { MotorRecommendationInput } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body: MotorRecommendationInput = await request.json();

    if (!body.budget || body.budget <= 0) {
      return NextResponse.json(
        { error: "Budget harus lebih dari 0" },
        { status: 400 }
      );
    }

    const results = getMotorRecommendations(body);

    // Try to enhance top 3 with AI insights (non-blocking)
    const hasApiKey = !!process.env.GEMINI_API_KEY;
    
    if (hasApiKey) {
      const aiPromises = results.slice(0, 3).map(async (result) => {
        try {
          const insight = await generateMotorRecommendationInsight(
            `${result.motor.brand} ${result.motor.model}`,
            result.motor,
            body.budget,
            body.use_case
          );
          return { ...result, ai_insight: insight };
        } catch {
          return result;
        }
      });

      const enhanced = await Promise.allSettled(aiPromises);
      const enhancedResults = enhanced.map((r, i) =>
        r.status === "fulfilled" ? r.value : results[i]
      );

      // Merge enhanced with remaining results
      const finalResults = [
        ...enhancedResults,
        ...results.slice(3),
      ];

      return NextResponse.json({ results: finalResults });
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Recommendation error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat memproses rekomendasi" },
      { status: 500 }
    );
  }
}
