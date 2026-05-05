import { NextRequest, NextResponse } from "next/server";
import referencesData from "@/data/references.json";
import type { ReferenceImage } from "@/types";

const references = referencesData as ReferenceImage[];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const style = searchParams.get("style") || undefined;
    const motor = searchParams.get("motor") || undefined;

    let filtered = references;
    if (style) filtered = filtered.filter((r) => r.style === style);
    if (motor) filtered = filtered.filter((r) => r.motor === motor);

    const allStyles = [...new Set(references.map((r) => r.style))];
    const allMotors = [...new Set(references.map((r) => r.motor))];

    return NextResponse.json({ references: filtered, styles: allStyles, motors: allMotors });
  } catch (error) {
    console.error("Reference error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
