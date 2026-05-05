"use client";

import { useState } from "react";
import { Bike, Search, Star, ThumbsUp, ThumbsDown, Loader2, Sparkles, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatRupiah } from "@/lib/helpers";
import type { MotorRecommendationResult } from "@/types";
import Link from "next/link";

const categories = [
  { value: "semua", label: "Semua Jenis" },
  { value: "matic", label: "Matic" },
  { value: "sport", label: "Sport" },
  { value: "bebek", label: "Bebek" },
  { value: "naked", label: "Naked" },
  { value: "touring", label: "Touring" },
  { value: "adventure", label: "Adventure" },
  { value: "retro", label: "Retro" },
];

const useCases = ["harian", "irit", "kota", "touring", "sporty", "performa", "gaya", "offroad", "premium"];
const preferences = ["irit", "desain modern", "fitur lengkap", "mesin bertenaga", "ringan", "bagasi luas"];

export default function RekomendasiMotorPage() {
  const [budget, setBudget] = useState("");
  const [category, setCategory] = useState("semua");
  const [selectedUseCases, setSelectedUseCases] = useState<string[]>([]);
  const [selectedPrefs, setSelectedPrefs] = useState<string[]>([]);
  const [results, setResults] = useState<MotorRecommendationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const toggleItem = (arr: string[], item: string, setter: (v: string[]) => void) => {
    setter(arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!budget) return;

    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch("/api/rekomendasi-motor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          budget: parseInt(budget),
          category,
          use_case: selectedUseCases,
          preferences: selectedPrefs,
        }),
      });
      const data = await res.json();
      setResults(data.results || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <Bike className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Rekomendasi Motor</h1>
            <p className="text-sm text-muted-foreground">Temukan motor ideal sesuai budget dan kebutuhanmu</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <Card className="mb-8 animate-fade-in">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="budget">Budget (Rupiah) *</Label>
                <Input
                  id="budget"
                  type="number"
                  placeholder="Contoh: 25000000"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  required
                  className="text-base"
                />
                {budget && (
                  <p className="text-xs text-muted-foreground">{formatRupiah(parseInt(budget))}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Jenis Motor</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Kebutuhan (pilih yang sesuai)</Label>
              <div className="flex flex-wrap gap-2">
                {useCases.map((uc) => (
                  <button
                    key={uc}
                    type="button"
                    onClick={() => toggleItem(selectedUseCases, uc, setSelectedUseCases)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      selectedUseCases.includes(uc)
                        ? "bg-blue-500/15 border-blue-500/30 text-blue-400"
                        : "bg-card border-border text-muted-foreground hover:border-blue-500/20"
                    }`}
                  >
                    {uc}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Preferensi (opsional)</Label>
              <div className="flex flex-wrap gap-2">
                {preferences.map((pref) => (
                  <button
                    key={pref}
                    type="button"
                    onClick={() => toggleItem(selectedPrefs, pref, setSelectedPrefs)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      selectedPrefs.includes(pref)
                        ? "bg-orange-500/15 border-orange-500/30 text-orange-400"
                        : "bg-card border-border text-muted-foreground hover:border-orange-500/20"
                    }`}
                  >
                    {pref}
                  </button>
                ))}
              </div>
            </div>

            <Button type="submit" disabled={loading || !budget} className="w-full md:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Search className="w-4 h-4 mr-2" />}
              Cari Rekomendasi
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Results */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      )}

      {!loading && searched && results.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          <Bike className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>Tidak ada motor yang sesuai. Coba ubah budget atau kategori.</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="space-y-5 stagger-children">
          <h2 className="text-xl font-semibold">
            Top {results.length} Rekomendasi untuk {formatRupiah(parseInt(budget))}
          </h2>
          {results.map((result, index) => (
            <Card key={result.motor.id} className="overflow-hidden hover:border-blue-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Motor image placeholder */}
                  <div className="w-full md:w-48 h-36 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center flex-shrink-0">
                    <Bike className="w-16 h-16 text-slate-500" />
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="secondary" className="text-xs">#{index + 1}</Badge>
                          <Badge className="bg-blue-500/15 text-blue-400 border-blue-500/20 text-xs">{result.motor.category}</Badge>
                        </div>
                        <h3 className="text-xl font-bold">{result.motor.brand} {result.motor.model}</h3>
                        <p className="text-sm text-muted-foreground">{result.motor.cc}cc • Perawatan {result.motor.maintenance_cost}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="flex items-center gap-1 text-orange-400">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-lg font-bold">{result.score}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground">Skor Kecocokan</p>
                      </div>
                    </div>

                    <p className="text-sm font-semibold text-orange-400">
                      {formatRupiah(result.motor.price_min)} — {formatRupiah(result.motor.price_max)}
                    </p>

                    {result.reasons.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {result.reasons.slice(0, 4).map((reason, i) => (
                          <span key={i} className="text-[11px] px-2 py-0.5 rounded-md bg-green-500/10 text-green-400 border border-green-500/15">
                            {reason}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-green-400 mb-1">
                          <ThumbsUp className="w-3 h-3" /> Kelebihan
                        </div>
                        <ul className="text-xs text-muted-foreground space-y-0.5">
                          {result.motor.strength.slice(0, 3).map((s, i) => (
                            <li key={i}>• {s}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-red-400 mb-1">
                          <ThumbsDown className="w-3 h-3" /> Kekurangan
                        </div>
                        <ul className="text-xs text-muted-foreground space-y-0.5">
                          {result.motor.weakness.map((w, i) => (
                            <li key={i}>• {w}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* AI Insight */}
                    {(result as MotorRecommendationResult & { ai_insight?: string }).ai_insight && (
                      <div className="mt-3 p-3 rounded-lg bg-gradient-to-r from-purple-500/5 to-blue-500/5 border border-purple-500/15">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-purple-400 mb-1.5">
                          <Sparkles className="w-3 h-3" /> Insight AI
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {(result as MotorRecommendationResult & { ai_insight?: string }).ai_insight}
                        </p>
                      </div>
                    )}

                    {/* CTA to check price */}
                    <div className="pt-2">
                      <Link
                        href={`/cek-harga`}
                        className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        Cek harga bekasnya <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <p className="text-xs text-muted-foreground text-center pt-4">
            ⚠️ Disclaimer: Harga bersifat estimasi dan dapat berbeda tergantung dealer dan wilayah.
          </p>
        </div>
      )}
    </div>
  );
}
