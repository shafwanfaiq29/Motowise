export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("id-ID").format(num);
}

export function getStatusColor(status: "murah" | "wajar" | "mahal"): string {
  switch (status) {
    case "murah": return "text-green-500";
    case "wajar": return "text-yellow-500";
    case "mahal": return "text-red-500";
  }
}

export function getStatusBgColor(status: "murah" | "wajar" | "mahal"): string {
  switch (status) {
    case "murah": return "bg-green-500/10 text-green-500 border-green-500/20";
    case "wajar": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    case "mahal": return "bg-red-500/10 text-red-500 border-red-500/20";
  }
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
}

export function calculateDepreciation(
  originalPrice: number,
  year: number,
  condition: string,
  mileage: number
): number {
  const currentYear = new Date().getFullYear();
  const age = currentYear - year;

  // Depreciation per year: ~10-15%
  const yearlyDepreciation = 0.12;
  let depreciatedPrice = originalPrice * Math.pow(1 - yearlyDepreciation, age);

  // Condition factor
  const conditionFactors: Record<string, number> = {
    mulus: 1.0,
    bagus: 0.92,
    cukup: 0.82,
    "perlu perbaikan": 0.65,
  };
  depreciatedPrice *= conditionFactors[condition] || 0.85;

  // Mileage factor: every 10,000km reduces ~3%
  const mileagePenalty = Math.floor(mileage / 10000) * 0.03;
  depreciatedPrice *= Math.max(0.7, 1 - mileagePenalty);

  return Math.round(depreciatedPrice);
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
