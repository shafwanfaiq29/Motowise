import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const SYSTEM_PROMPT = `Kamu adalah MotoWise AI, asisten pintar untuk dunia otomotif motor Indonesia.
Gaya bahasa: santai, informatif, dan mudah dipahami. Pakai bahasa Indonesia sehari-hari.
Jangan terlalu formal, tapi tetap profesional. Boleh pakai emoji sesekali.
Jawab singkat, padat, dan langsung ke poin. Maksimal 3-4 paragraf.`;

export async function generateMotorRecommendationInsight(
  motorName: string,
  motorData: {
    brand: string;
    model: string;
    cc: number;
    category: string;
    price_min: number;
    price_max: number;
    strength: string[];
    weakness: string[];
    use_case: string[];
    maintenance_cost: string;
  },
  userBudget: number,
  userNeeds: string[]
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `${SYSTEM_PROMPT}

User sedang mencari motor dengan budget Rp ${userBudget.toLocaleString("id-ID")} untuk kebutuhan: ${userNeeds.join(", ") || "harian"}.

Berikan insight singkat tentang ${motorData.brand} ${motorData.model} (${motorData.cc}cc, ${motorData.category}):
- Harga: Rp ${motorData.price_min.toLocaleString("id-ID")} - Rp ${motorData.price_max.toLocaleString("id-ID")}
- Kelebihan: ${motorData.strength.join(", ")}
- Kekurangan: ${motorData.weakness.join(", ")}
- Cocok untuk: ${motorData.use_case.join(", ")}
- Biaya perawatan: ${motorData.maintenance_cost}

Berikan alasan kenapa motor ini cocok (atau kurang cocok) untuk user ini dalam 2-3 kalimat singkat. Jangan ulangi data di atas, berikan insight yang lebih personal.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API error:", error);
    return "";
  }
}

export async function generatePriceNegotiationTips(
  brand: string,
  model: string,
  year: number,
  condition: string,
  estimatedPrice: number,
  offeredPrice: number,
  status: "murah" | "wajar" | "mahal"
): Promise<string> {
  try {
    const genModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `${SYSTEM_PROMPT}

User ingin membeli ${brand} ${model} tahun ${year}, kondisi "${condition}".
- Harga ditawarkan penjual: Rp ${offeredPrice.toLocaleString("id-ID")}
- Estimasi harga pasaran: Rp ${estimatedPrice.toLocaleString("id-ID")}
- Status harga: ${status.toUpperCase()}

Berikan tips negosiasi singkat dan praktis (3-4 poin) untuk user ini. Jika harga murah, ingatkan untuk cek lebih teliti. Jika mahal, beri strategi negosiasi. Gunakan format poin-poin.`;

    const result = await genModel.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini API error:", error);
    return "";
  }
}

export async function generateModificationTips(
  motor: string,
  style: string,
  budget: number,
  parts: string[]
): Promise<string> {
  try {
    const genModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `${SYSTEM_PROMPT}

User ingin modifikasi ${motor} dengan style "${style}" dan budget Rp ${budget.toLocaleString("id-ID")}.
Part yang direkomendasikan: ${parts.join(", ")}.

Berikan tips modifikasi singkat dan praktis (3-4 poin) khusus untuk kombinasi motor dan style ini. Fokus pada tips yang berguna dan tidak umum. Format poin-poin.`;

    const result = await genModel.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini API error:", error);
    return "";
  }
}

export async function generateRepaintSuggestion(
  bodyColor: string,
  wheelColor: string,
  style: string
): Promise<string> {
  try {
    const genModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `${SYSTEM_PROMPT}

User memilih kombinasi warna repaint:
- Body: ${bodyColor}
- Velg: ${wheelColor}
- Style: ${style}

Berikan pendapat singkat (2-3 kalimat) tentang kombinasi warna ini: apakah cocok, kesan yang ditimbulkan, dan tips perawatan warna. Santai dan positif.`;

    const result = await genModel.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini API error:", error);
    return "";
  }
}
