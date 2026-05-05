"use client";

import { useState } from "react";
import { DollarSign, Search, CheckCircle, AlertTriangle, XCircle, Loader2, ClipboardCheck, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatRupiah } from "@/lib/helpers";
import type { PriceCheckResult } from "@/types";

interface ExtendedPriceCheckResult extends PriceCheckResult {
  ai_tips?: string;
}

const brands = ["Honda", "Yamaha", "Suzuki", "Kawasaki"];
const conditions = [
  { value: "mulus", label: "Mulus (seperti baru)" },
  { value: "bagus", label: "Bagus (terawat)" },
  { value: "cukup", label: "Cukup (ada minus kecil)" },
  { value: "perlu perbaikan", label: "Perlu Perbaikan" },
];

export default function CekHargaPage() {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [mileage, setMileage] = useState("");
  const [condition, setCondition] = useState("");
  const [offeredPrice, setOfferedPrice] = useState("");
  const [result, setResult] = useState<ExtendedPriceCheckResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch("/api/cek-harga", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brand, model, year: parseInt(year), mileage: parseInt(mileage),
          condition, offered_price: parseInt(offeredPrice),
        }),
      });
      const data = await res.json();
      setResult(data.result || null);
    } catch { setResult(null); }
    finally { setLoading(false); }
  };

  const statusConfig = {
    murah: { icon: CheckCircle, color: "text-green-400", bg: "bg-green-500/10 border-green-500/20", label: "MURAH" },
    wajar: { icon: AlertTriangle, color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20", label: "WAJAR" },
    mahal: { icon: XCircle, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20", label: "MAHAL" },
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Cek Harga Pasaran</h1>
            <p className="text-sm text-muted-foreground">Cek apakah harga motor bekas murah, wajar, atau mahal</p>
          </div>
        </div>
      </div>

      <Card className="mb-8 animate-fade-in">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Brand *</Label>
                <Select value={brand} onValueChange={setBrand}>
                  <SelectTrigger><SelectValue placeholder="Pilih brand" /></SelectTrigger>
                  <SelectContent>{brands.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Model *</Label>
                <Input id="model" placeholder="Contoh: Beat, NMAX 155" value={model} onChange={(e) => setModel(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Tahun *</Label>
                <Input id="year" type="number" placeholder="2020" value={year} onChange={(e) => setYear(e.target.value)} required min="2010" max="2026" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mileage">Kilometer *</Label>
                <Input id="mileage" type="number" placeholder="25000" value={mileage} onChange={(e) => setMileage(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Kondisi *</Label>
                <Select value={condition} onValueChange={setCondition}>
                  <SelectTrigger><SelectValue placeholder="Pilih kondisi" /></SelectTrigger>
                  <SelectContent>{conditions.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Harga Ditawarkan (Rp) *</Label>
                <Input id="price" type="number" placeholder="15000000" value={offeredPrice} onChange={(e) => setOfferedPrice(e.target.value)} required />
                {offeredPrice && <p className="text-xs text-muted-foreground">{formatRupiah(parseInt(offeredPrice))}</p>}
              </div>
            </div>
            <Button type="submit" disabled={loading || !brand || !model || !year || !condition || !offeredPrice} className="w-full md:w-auto bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Search className="w-4 h-4 mr-2" />}
              Cek Harga
            </Button>
          </form>
        </CardContent>
      </Card>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-green-500" />
        </div>
      )}

      {!loading && result && (
        <div className="space-y-6 animate-fade-in">
          {/* Status Card */}
          <Card className={`border-2 ${statusConfig[result.status].bg}`}>
            <CardContent className="p-6 text-center">
              {(() => { const Icon = statusConfig[result.status].icon; return <Icon className={`w-16 h-16 mx-auto mb-4 ${statusConfig[result.status].color}`} />; })()}
              <Badge className={`text-lg px-4 py-1 mb-3 ${statusConfig[result.status].bg} ${statusConfig[result.status].color}`}>
                {statusConfig[result.status].label}
              </Badge>
              <p className="text-2xl font-bold mb-1">Estimasi Pasaran: {formatRupiah(result.estimated_price)}</p>
              <p className="text-sm text-muted-foreground">
                Range: {formatRupiah(result.price_range.min)} — {formatRupiah(result.price_range.max)}
              </p>
              <p className="text-sm mt-2">
                Harga ditawarkan {result.percentage_diff > 0 ? `${result.percentage_diff}% di atas` : `${Math.abs(result.percentage_diff)}% di bawah`} estimasi pasaran
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Saran */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-yellow-400" /> Saran</h3>
                <ul className="space-y-2">
                  {result.suggestions.map((s, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex gap-2"><span className="text-yellow-400 flex-shrink-0">•</span>{s}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            {/* Checklist */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2"><ClipboardCheck className="w-4 h-4 text-blue-400" /> Checklist Pengecekan</h3>
                <ul className="space-y-1.5">
                  {result.checklist.map((c, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex gap-2"><CheckCircle className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />{c}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* AI Tips */}
          {result.ai_tips && (
            <Card className="border-purple-500/20">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" /> Tips dari AI
                </h3>
                <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {result.ai_tips}
                </div>
              </CardContent>
            </Card>
          )}

          <p className="text-xs text-muted-foreground text-center">
            ⚠️ Disclaimer: Estimasi harga hanya perkiraan berdasarkan data yang tersedia. Harga aktual dapat berbeda.
          </p>
        </div>
      )}
    </div>
  );
}
