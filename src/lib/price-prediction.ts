import usedPricesData from "@/data/used-motor-prices.json";
import motorsData from "@/data/motors.json";
import type { UsedMotorPrice, Motor, PriceCheckInput, PriceCheckResult } from "@/types";
import { calculateDepreciation } from "./helpers";

const usedPrices: UsedMotorPrice[] = usedPricesData as UsedMotorPrice[];
const motors: Motor[] = motorsData as Motor[];

export function checkPrice(input: PriceCheckInput): PriceCheckResult {
  const { brand, model, year, mileage, condition, offered_price } = input;

  // Find similar motors in the used prices dataset
  const similarMotors = usedPrices.filter(
    (m) =>
      m.brand.toLowerCase() === brand.toLowerCase() &&
      m.model.toLowerCase() === model.toLowerCase()
  );

  // Find the new price from motors dataset
  const motorData = motors.find(
    (m) =>
      m.brand.toLowerCase() === brand.toLowerCase() &&
      m.model.toLowerCase().includes(model.toLowerCase().split(" ")[0])
  );

  let estimatedPrice: number;
  let priceRange: { min: number; max: number };

  if (similarMotors.length > 0) {
    // Use similar motors for better estimation
    const samePeriod = similarMotors.filter(
      (m) => Math.abs(m.year - year) <= 1
    );
    const referenceMotors = samePeriod.length >= 2 ? samePeriod : similarMotors;

    // Calculate average and adjust
    const avgPrice =
      referenceMotors.reduce((sum, m) => sum + m.price, 0) / referenceMotors.length;

    // Adjust for year difference
    const avgYear =
      referenceMotors.reduce((sum, m) => sum + m.year, 0) / referenceMotors.length;
    const yearDiff = year - avgYear;
    const yearAdjustment = yearDiff * 0.1 * avgPrice;

    // Adjust for condition
    const conditionFactors: Record<string, number> = {
      mulus: 1.05,
      bagus: 1.0,
      cukup: 0.9,
      "perlu perbaikan": 0.75,
    };
    const condFactor = conditionFactors[condition] || 1.0;

    // Adjust for mileage
    const avgMileage =
      referenceMotors.reduce((sum, m) => sum + m.mileage, 0) / referenceMotors.length;
    const mileageDiff = mileage - avgMileage;
    const mileageAdjustment = -(mileageDiff / 10000) * 0.03 * avgPrice;

    estimatedPrice = Math.round(
      (avgPrice + yearAdjustment + mileageAdjustment) * condFactor
    );

    priceRange = {
      min: Math.round(estimatedPrice * 0.9),
      max: Math.round(estimatedPrice * 1.1),
    };
  } else if (motorData) {
    // Use depreciation formula
    const avgNewPrice = (motorData.price_min + motorData.price_max) / 2;
    estimatedPrice = calculateDepreciation(avgNewPrice, year, condition, mileage);
    priceRange = {
      min: Math.round(estimatedPrice * 0.85),
      max: Math.round(estimatedPrice * 1.15),
    };
  } else {
    // Fallback: generic depreciation
    estimatedPrice = Math.round(offered_price * 0.95);
    priceRange = {
      min: Math.round(offered_price * 0.85),
      max: Math.round(offered_price * 1.1),
    };
  }

  // Determine status
  const diff = ((offered_price - estimatedPrice) / estimatedPrice) * 100;
  let status: "murah" | "wajar" | "mahal";
  if (diff < -8) status = "murah";
  else if (diff > 8) status = "mahal";
  else status = "wajar";

  // Generate suggestions
  const suggestions: string[] = [];
  if (status === "mahal") {
    suggestions.push(
      `Harga yang ditawarkan sekitar ${Math.abs(Math.round(diff))}% di atas harga pasaran.`
    );
    suggestions.push("Coba negosiasi ke kisaran " + formatSimple(estimatedPrice));
    suggestions.push("Bandingkan dengan beberapa penjual lain sebelum membeli.");
  } else if (status === "murah") {
    suggestions.push(
      `Harga ini sekitar ${Math.abs(Math.round(diff))}% di bawah harga pasaran. Bisa jadi deal bagus!`
    );
    suggestions.push("Pastikan cek kondisi motor lebih teliti, bisa jadi ada masalah tersembunyi.");
  } else {
    suggestions.push("Harga ini wajar sesuai pasaran.");
    suggestions.push("Masih bisa coba negosiasi sedikit untuk mendapat deal lebih baik.");
  }

  const checklist = [
    "Cek surat-surat lengkap (STNK, BPKB, faktur)",
    "Cek nomor rangka dan mesin sesuai surat",
    "Cek kondisi mesin (suara, asap, tarikan)",
    "Cek kondisi body (cat, dent, gores)",
    "Cek ban dan rantai/belt",
    "Cek lampu dan kelistrikan",
    "Cek shockbreaker dan rem",
    "Test ride minimal 10-15 menit",
    "Cek odometer asli atau sudah dipermak",
    "Tanyakan riwayat service dan perbaikan",
  ];

  return {
    estimated_price: estimatedPrice,
    price_range: priceRange,
    status,
    percentage_diff: Math.round(diff),
    suggestions,
    checklist,
  };
}

function formatSimple(amount: number): string {
  if (amount >= 1000000) {
    return `Rp ${(amount / 1000000).toFixed(1)} juta`;
  }
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

export function getAvailableModels(brand: string): string[] {
  const brandMotors = usedPrices.filter(
    (m) => m.brand.toLowerCase() === brand.toLowerCase()
  );
  return [...new Set(brandMotors.map((m) => m.model))];
}

export function getAvailableBrands(): string[] {
  return [...new Set(usedPrices.map((m) => m.brand))];
}
