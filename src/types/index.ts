// Motor types
export interface Motor {
  id: string;
  brand: string;
  model: string;
  category: MotorCategory;
  cc: number;
  price_min: number;
  price_max: number;
  use_case: string[];
  strength: string[];
  weakness: string[];
  maintenance_cost: "rendah" | "sedang" | "tinggi";
  image_url: string;
  year: number;
}

export type MotorCategory = "matic" | "sport" | "bebek" | "touring" | "adventure" | "naked" | "retro";

// Used motor price types
export interface UsedMotorPrice {
  id: string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  engine_capacity: number;
  transmission: "matic" | "manual" | "kopling";
  location: string;
  condition: "mulus" | "bagus" | "cukup" | "perlu perbaikan";
  price: number;
}

// Part types
export interface Part {
  id: string;
  part_category: string;
  part_name: string;
  brand: string;
  compatible_motor: string[];
  style: string[];
  purpose: "tampilan" | "kenyamanan" | "keamanan" | "performa";
  price_min: number;
  price_max: number;
  priority: number;
  description: string;
}

// Modification style types
export interface ModificationStyle {
  id: string;
  style: string;
  description: string;
  color_recommendation: string[];
  main_parts: string[];
  budget_min: number;
  budget_max: number;
}

// Repaint color types
export interface RepaintColor {
  id: string;
  name: string;
  body_color: string;
  body_hex: string;
  wheel_color: string;
  wheel_hex: string;
  style: string;
  character: string;
}

// Reference image types
export interface ReferenceImage {
  id: string;
  image_url: string;
  motor: string;
  style: string;
  color: string;
  tags: string[];
  source: string;
  description: string;
}

// Form input types
export interface MotorRecommendationInput {
  budget: number;
  category: MotorCategory | "semua";
  use_case: string[];
  preferences: string[];
}

export interface PriceCheckInput {
  brand: string;
  model: string;
  year: number;
  mileage: number;
  condition: "mulus" | "bagus" | "cukup" | "perlu perbaikan";
  offered_price: number;
}

export interface ModificationInput {
  motor_type: string;
  budget: number;
  style: string;
  priorities: string[];
}

// Result types
export interface MotorRecommendationResult {
  motor: Motor;
  score: number;
  reasons: string[];
}

export interface PriceCheckResult {
  estimated_price: number;
  price_range: { min: number; max: number };
  status: "murah" | "wajar" | "mahal";
  percentage_diff: number;
  suggestions: string[];
  checklist: string[];
}

export interface ModificationPackage {
  style: ModificationStyle;
  parts: PartRecommendation[];
  total_estimated_cost: number;
  priority_order: string[];
  tips: string[];
}

export interface PartRecommendation {
  part: Part;
  reason: string;
}
