import partsData from "@/data/parts.json";
import stylesData from "@/data/styles.json";
import type { Part, ModificationStyle, ModificationInput, ModificationPackage, PartRecommendation } from "@/types";

const parts: Part[] = partsData as Part[];
const styles: ModificationStyle[] = stylesData as ModificationStyle[];

export function getModificationPackage(input: ModificationInput): ModificationPackage {
  const { motor_type, budget, style: styleInput, priorities } = input;

  // Find matching style
  const selectedStyle = styles.find(
    (s) => s.style.toLowerCase() === styleInput.toLowerCase()
  ) || styles[0];

  // Filter compatible parts
  let compatibleParts = parts.filter((p) => {
    const motorMatch = p.compatible_motor.some((cm) =>
      cm.toLowerCase().includes(motor_type.toLowerCase()) ||
      motor_type.toLowerCase().includes(cm.toLowerCase().split(" ").slice(1).join(" "))
    );
    const styleMatch = p.style.some(
      (s) => s.toLowerCase() === styleInput.toLowerCase()
    );
    return motorMatch || styleMatch;
  });

  // If not enough compatible parts, include style-matched parts
  if (compatibleParts.length < 5) {
    const styleOnly = parts.filter((p) =>
      p.style.some((s) => s.toLowerCase() === styleInput.toLowerCase())
    );
    compatibleParts = [...new Map(
      [...compatibleParts, ...styleOnly].map((p) => [p.id, p])
    ).values()];
  }

  // Sort by priority (lower = higher priority)
  if (priorities.length > 0) {
    compatibleParts.sort((a, b) => {
      const aMatch = priorities.includes(a.purpose) ? -10 : 0;
      const bMatch = priorities.includes(b.purpose) ? -10 : 0;
      return (a.priority + aMatch) - (b.priority + bMatch);
    });
  } else {
    compatibleParts.sort((a, b) => a.priority - b.priority);
  }

  // Select parts within budget
  const selectedParts: PartRecommendation[] = [];
  let totalCost = 0;

  for (const part of compatibleParts) {
    const avgCost = (part.price_min + part.price_max) / 2;
    if (totalCost + avgCost <= budget) {
      selectedParts.push({
        part,
        reason: getPartReason(part, priorities),
      });
      totalCost += avgCost;
    }
  }

  // Generate priority order
  const priorityOrder = selectedParts.map(
    (sp, i) => `${i + 1}. ${sp.part.part_category} - ${sp.part.part_name}`
  );

  // Generate tips
  const tips = generateModifTips(styleInput, selectedParts);

  return {
    style: selectedStyle,
    parts: selectedParts,
    total_estimated_cost: totalCost,
    priority_order: priorityOrder,
    tips,
  };
}

function getPartReason(part: Part, priorities: string[]): string {
  if (priorities.includes(part.purpose)) {
    return `Sesuai prioritas ${part.purpose} kamu — ${part.description}`;
  }
  return part.description;
}

function generateModifTips(style: string, parts: PartRecommendation[]): string[] {
  const tips: string[] = [
    "Pasang part dari prioritas tertinggi dulu supaya budget lebih terukur.",
    "Selalu cek kompatibilitas part dengan motor kamu di bengkel sebelum membeli.",
    "Simpan part original sebagai backup jika ingin kembali ke standar.",
  ];

  if (style === "touring") {
    tips.push("Untuk touring, utamakan kenyamanan dan keamanan di atas tampilan.");
  } else if (style === "racing look") {
    tips.push("Untuk racing look, pastikan part legal di jalan raya.");
  } else if (style === "cafe racer") {
    tips.push("Cafe racer butuh presisi pemasangan. Gunakan bengkel yang berpengalaman.");
  }

  return tips;
}

export function getAllStyles(): ModificationStyle[] {
  return styles;
}

export function getPartsByCategory(category: string): Part[] {
  return parts.filter((p) => p.part_category === category);
}

export function getAllPartCategories(): string[] {
  return [...new Set(parts.map((p) => p.part_category))];
}

export function filterParts(filters: {
  category?: string;
  style?: string;
  maxBudget?: number;
}): Part[] {
  let filtered = [...parts];

  if (filters.category) {
    filtered = filtered.filter((p) => p.part_category === filters.category);
  }
  if (filters.style) {
    filtered = filtered.filter((p) =>
      p.style.some((s) => s.toLowerCase() === filters.style!.toLowerCase())
    );
  }
  if (filters.maxBudget) {
    filtered = filtered.filter((p) => p.price_min <= filters.maxBudget!);
  }

  return filtered.sort((a, b) => a.priority - b.priority);
}
