import motorsData from "@/data/motors.json";
import type { Motor, MotorRecommendationInput, MotorRecommendationResult } from "@/types";

const motors: Motor[] = motorsData as Motor[];

export function getMotorRecommendations(
  input: MotorRecommendationInput
): MotorRecommendationResult[] {
  const { budget, category, use_case, preferences } = input;

  // Filter motors within budget range (with 20% flexibility)
  const budgetMin = budget * 0.7;
  const budgetMax = budget * 1.2;

  let filtered = motors.filter(
    (m) => m.price_min <= budgetMax && m.price_max >= budgetMin
  );

  // Filter by category if specified
  if (category && category !== "semua") {
    const categoryFiltered = filtered.filter((m) => m.category === category);
    if (categoryFiltered.length >= 3) {
      filtered = categoryFiltered;
    }
  }

  // Score each motor
  const scored = filtered.map((motor) => {
    let score = 0;
    const reasons: string[] = [];

    // Budget match (40%)
    const avgPrice = (motor.price_min + motor.price_max) / 2;
    const budgetDiff = Math.abs(avgPrice - budget) / budget;
    const budgetScore = Math.max(0, 1 - budgetDiff) * 40;
    score += budgetScore;
    if (budgetDiff < 0.1) reasons.push("Harga sangat sesuai dengan budget kamu");
    else if (budgetDiff < 0.2) reasons.push("Harga cukup sesuai budget");

    // Use case match (30%)
    if (use_case.length > 0) {
      const matchingUseCases = motor.use_case.filter((uc) =>
        use_case.some((u) => uc.toLowerCase().includes(u.toLowerCase()))
      );
      const useCaseScore = (matchingUseCases.length / Math.max(use_case.length, 1)) * 30;
      score += useCaseScore;
      if (matchingUseCases.length > 0) {
        reasons.push(`Cocok untuk ${matchingUseCases.join(", ")}`);
      }
    } else {
      score += 15; // neutral score
    }

    // Category match (20%)
    if (category === "semua" || !category) {
      score += 10;
    } else if (motor.category === category) {
      score += 20;
      reasons.push(`Sesuai preferensi jenis ${category}`);
    }

    // Maintenance cost preference (10%)
    if (preferences.includes("irit")) {
      if (motor.maintenance_cost === "rendah") {
        score += 10;
        reasons.push("Biaya perawatan rendah");
      } else if (motor.maintenance_cost === "sedang") {
        score += 5;
      }
    } else {
      score += 5;
    }

    // Bonus for strengths matching preferences
    preferences.forEach((pref) => {
      const matchingStrengths = motor.strength.filter((s) =>
        s.toLowerCase().includes(pref.toLowerCase())
      );
      if (matchingStrengths.length > 0) {
        score += 3;
        reasons.push(matchingStrengths[0]);
      }
    });

    return { motor, score: Math.min(100, Math.round(score)), reasons };
  });

  // Sort by score descending and return top results
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

export function getAllBrands(): string[] {
  return [...new Set(motors.map((m) => m.brand))];
}

export function getAllCategories(): string[] {
  return [...new Set(motors.map((m) => m.category))];
}

export function getMotorsByBrand(brand: string): Motor[] {
  return motors.filter((m) => m.brand === brand);
}
