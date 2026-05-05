import { NextRequest, NextResponse } from "next/server";
import { getModificationPackage } from "@/lib/modification";
import { generateModificationTips } from "@/lib/ai-client";
import type { ModificationInput } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body: ModificationInput = await request.json();

    if (!body.motor_type || !body.budget || !body.style) {
      return NextResponse.json(
        { error: "Motor, budget, dan style wajib diisi" },
        { status: 400 }
      );
    }

    const result = getModificationPackage(body);

    // Try AI-enhanced tips
    let ai_tips = "";
    if (process.env.GEMINI_API_KEY) {
      try {
        const partNames = result.parts.map((p) => p.part.part_name);
        ai_tips = await generateModificationTips(
          body.motor_type,
          body.style,
          body.budget,
          partNames
        );
      } catch {
        // Silently fail
      }
    }

    return NextResponse.json({ result: { ...result, ai_tips } });
  } catch (error) {
    console.error("Modification error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat memproses rekomendasi modifikasi" },
      { status: 500 }
    );
  }
}
