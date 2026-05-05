"use client";

import { useState } from "react";
import { Wrench, Search, Loader2, Package, ArrowDown, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatRupiah } from "@/lib/helpers";
import type { ModificationPackage } from "@/types";

interface ExtendedModPackage extends ModificationPackage {
  ai_tips?: string;
}

const motorOptions = [
  "Honda Beat","Honda Vario 125","Honda Vario 160","Honda PCX 160","Honda Scoopy",
  "Honda CBR 150R","Honda CB150R Streetfire","Honda CRF150L","Honda ADV 160",
  "Yamaha NMAX 155","Yamaha Aerox 155","Yamaha Mio M3","Yamaha R15 V4","Yamaha MT-15",
  "Yamaha XSR 155","Yamaha WR 155R","Suzuki GSX-R150","Kawasaki Ninja 250","Kawasaki KLX 150","Kawasaki W175",
];
const styles = ["simple elegan","sporty harian","touring","thailook","racing look","clean daily","cafe racer","supermoto"];
const priorities = ["tampilan","kenyamanan","keamanan","performa"];

export default function RekomendasiModifikasiPage() {
  const [motor, setMotor] = useState("");
  const [budget, setBudget] = useState("");
  const [style, setStyle] = useState("");
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const [result, setResult] = useState<ExtendedModPackage | null>(null);
  const [loading, setLoading] = useState(false);

  const togglePriority = (p: string) => {
    setSelectedPriorities((prev) => prev.includes(p) ? prev.filter((i) => i !== p) : [...prev, p]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/rekomendasi-modifikasi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ motor_type: motor, budget: parseInt(budget), style, priorities: selectedPriorities }),
      });
      const data = await res.json();
      setResult(data.result || null);
    } catch { setResult(null); }
    finally { setLoading(false); }
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
            <Wrench className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Rekomendasi Modifikasi</h1>
            <p className="text-sm text-muted-foreground">Susun paket modifikasi sesuai budget dan style</p>
          </div>
        </div>
      </div>

      <Card className="mb-8 animate-fade-in">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Motor *</Label>
                <Select value={motor} onValueChange={setMotor}>
                  <SelectTrigger><SelectValue placeholder="Pilih motor" /></SelectTrigger>
                  <SelectContent>{motorOptions.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="modif-budget">Budget Modifikasi (Rp) *</Label>
                <Input id="modif-budget" type="number" placeholder="3000000" value={budget} onChange={(e) => setBudget(e.target.value)} required />
                {budget && <p className="text-xs text-muted-foreground">{formatRupiah(parseInt(budget))}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Style Modifikasi *</Label>
              <div className="flex flex-wrap gap-2">
                {styles.map((s) => (
                  <button key={s} type="button" onClick={() => setStyle(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all capitalize ${
                      style === s ? "bg-purple-500/15 border-purple-500/30 text-purple-400" : "bg-card border-border text-muted-foreground hover:border-purple-500/20"
                    }`}>{s}</button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Prioritas</Label>
              <div className="flex flex-wrap gap-2">
                {priorities.map((p) => (
                  <button key={p} type="button" onClick={() => togglePriority(p)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all capitalize ${
                      selectedPriorities.includes(p) ? "bg-orange-500/15 border-orange-500/30 text-orange-400" : "bg-card border-border text-muted-foreground hover:border-orange-500/20"
                    }`}>{p}</button>
                ))}
              </div>
            </div>
            <Button type="submit" disabled={loading || !motor || !budget || !style} className="w-full md:w-auto bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700">
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Search className="w-4 h-4 mr-2" />}
              Cari Paket Modifikasi
            </Button>
          </form>
        </CardContent>
      </Card>

      {loading && <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-purple-500" /></div>}

      {!loading && result && (
        <div className="space-y-6 animate-fade-in">
          <Card className="border-purple-500/20">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Badge className="bg-purple-500/15 text-purple-400 border-purple-500/20 mb-2 capitalize">{result.style.style}</Badge>
                  <h3 className="text-lg font-bold">{result.style.description}</h3>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Estimasi Total</p>
                  <p className="text-xl font-bold text-orange-400">{formatRupiah(result.total_estimated_cost)}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {result.style.color_recommendation.map((c, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">{c}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <h3 className="text-lg font-semibold flex items-center gap-2"><Package className="w-5 h-5" /> Daftar Part ({result.parts.length})</h3>
          <div className="space-y-3 stagger-children">
            {result.parts.map((pr, index) => (
              <Card key={pr.part.id} className="hover:border-purple-500/20 transition-all">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0 text-purple-400 font-bold text-sm">{index + 1}</div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-semibold text-sm">{pr.part.part_name}</h4>
                          <p className="text-xs text-muted-foreground">{pr.part.brand} • {pr.part.part_category}</p>
                        </div>
                        <p className="text-sm font-semibold text-orange-400 flex-shrink-0">
                          {formatRupiah(pr.part.price_min)} - {formatRupiah(pr.part.price_max)}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1.5">{pr.reason}</p>
                      <Badge variant="secondary" className="text-[10px] mt-2 capitalize">{pr.part.purpose}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {result.tips.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3">💡 Tips Modifikasi</h3>
                <ul className="space-y-1.5">
                  {result.tips.map((t, i) => <li key={i} className="text-sm text-muted-foreground">• {t}</li>)}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* AI Tips */}
          {result.ai_tips && (
            <Card className="border-purple-500/20">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" /> Tips AI untuk {motor}
                </h3>
                <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {result.ai_tips}
                </div>
              </CardContent>
            </Card>
          )}

          <p className="text-xs text-muted-foreground text-center">
            ⚠️ Disclaimer: Harga estimasi. Selalu cek kompatibilitas di bengkel sebelum membeli.
          </p>
        </div>
      )}
    </div>
  );
}
