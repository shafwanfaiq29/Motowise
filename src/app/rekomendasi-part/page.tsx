"use client";

import { useState, useEffect } from "react";
import { Package, Search, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { formatRupiah } from "@/lib/helpers";
import type { Part } from "@/types";

export default function RekomendasiPartPage() {
  const [parts, setParts] = useState<Part[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchParts();
  }, [selectedCategory]);

  const fetchParts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory) params.set("category", selectedCategory);
      const res = await fetch(`/api/rekomendasi-part?${params}`);
      const data = await res.json();
      setParts(data.parts || []);
      if (data.categories) setCategories(data.categories);
    } catch { setParts([]); }
    finally { setLoading(false); }
  };

  const filteredParts = parts.filter((p) =>
    p.part_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.part_category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const purposeColors: Record<string, string> = {
    tampilan: "bg-pink-500/10 text-pink-400 border-pink-500/20",
    kenyamanan: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    keamanan: "bg-green-500/10 text-green-400 border-green-500/20",
    performa: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
            <Package className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Part & Brand</h1>
            <p className="text-sm text-muted-foreground">Browse rekomendasi part modifikasi dan brand terbaik</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4 animate-fade-in">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Cari part atau brand..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setSelectedCategory("")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${!selectedCategory ? "bg-orange-500/15 border-orange-500/30 text-orange-400" : "bg-card border-border text-muted-foreground hover:border-orange-500/20"}`}>
            <Filter className="w-3 h-3 inline mr-1" />Semua
          </button>
          {categories.map((cat) => (
            <button key={cat} onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all capitalize ${selectedCategory === cat ? "bg-orange-500/15 border-orange-500/30 text-orange-400" : "bg-card border-border text-muted-foreground hover:border-orange-500/20"}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Parts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
        {filteredParts.map((part) => (
          <Card key={part.id} className="hover:border-orange-500/20 transition-all duration-300 hover:shadow-md">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <Badge variant="secondary" className="text-[10px] capitalize">{part.part_category}</Badge>
                <Badge className={`text-[10px] capitalize ${purposeColors[part.purpose] || ""}`}>{part.purpose}</Badge>
              </div>
              <h3 className="font-semibold text-sm mb-1">{part.part_name}</h3>
              <p className="text-xs text-muted-foreground mb-3">{part.brand}</p>
              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{part.description}</p>
              <p className="text-sm font-semibold text-orange-400 mb-3">
                {formatRupiah(part.price_min)} — {formatRupiah(part.price_max)}
              </p>
              <div className="flex flex-wrap gap-1">
                {part.style.slice(0, 3).map((s) => (
                  <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground capitalize">{s}</span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredParts.length === 0 && !loading && (
        <div className="text-center py-20 text-muted-foreground">
          <Package className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>Tidak ada part yang ditemukan.</p>
        </div>
      )}

      <p className="text-xs text-muted-foreground text-center mt-8">
        ⚠️ Disclaimer: Harga estimasi. Selalu cek kompatibilitas part dengan motor kamu di bengkel.
      </p>
    </div>
  );
}
