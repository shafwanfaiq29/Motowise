import { NextRequest, NextResponse } from "next/server";
import { filterParts, getAllPartCategories } from "@/lib/modification";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || undefined;
    const style = searchParams.get("style") || undefined;
    const maxBudget = searchParams.get("maxBudget")
      ? parseInt(searchParams.get("maxBudget")!)
      : undefined;

    const parts = filterParts({ category, style, maxBudget });
    const categories = getAllPartCategories();

    return NextResponse.json({ parts, categories });
  } catch (error) {
    console.error("Parts error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan" },
      { status: 500 }
    );
  }
}
