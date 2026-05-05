"use client";

import { useState } from "react";
import { Image as ImageIcon, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import referencesData from "@/data/references.json";
import type { ReferenceImage } from "@/types";
import NextImage from "next/image";

const references = referencesData as ReferenceImage[];
const allStyles = [...new Set(references.map((r) => r.style))];
const allMotors = [...new Set(references.map((r) => r.motor))];

export default function ReferensiModifikasiPage() {
  const [filterStyle, setFilterStyle] = useState("");
  const [filterMotor, setFilterMotor] = useState("");
  const [selectedRef, setSelectedRef] = useState<ReferenceImage | null>(null);

  const filtered = references.filter((r) => {
    if (filterStyle && r.style !== filterStyle) return false;
    if (filterMotor && r.motor !== filterMotor) return false;
    return true;
  });

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center">
            <ImageIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Referensi Modifikasi</h1>
            <p className="text-sm text-muted-foreground">Galeri inspirasi modifikasi berbagai style</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-3 animate-fade-in">
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-muted-foreground py-1.5"><Filter className="w-3 h-3 inline mr-1" />Style:</span>
          <button onClick={() => setFilterStyle("")} className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${!filterStyle ? "bg-cyan-500/15 border-cyan-500/30 text-cyan-400" : "bg-card border-border text-muted-foreground"}`}>Semua</button>
          {allStyles.map((s) => (
            <button key={s} onClick={() => setFilterStyle(s)} className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all capitalize ${filterStyle === s ? "bg-cyan-500/15 border-cyan-500/30 text-cyan-400" : "bg-card border-border text-muted-foreground"}`}>{s}</button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-muted-foreground py-1.5"><Filter className="w-3 h-3 inline mr-1" />Motor:</span>
          <button onClick={() => setFilterMotor("")} className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${!filterMotor ? "bg-teal-500/15 border-teal-500/30 text-teal-400" : "bg-card border-border text-muted-foreground"}`}>Semua</button>
          {allMotors.map((m) => (
            <button key={m} onClick={() => setFilterMotor(m)} className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${filterMotor === m ? "bg-teal-500/15 border-teal-500/30 text-teal-400" : "bg-card border-border text-muted-foreground"}`}>{m}</button>
          ))}
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
        {filtered.map((ref) => (
          <Card key={ref.id} className="overflow-hidden cursor-pointer group hover:border-cyan-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10" onClick={() => setSelectedRef(ref)}>
            <div className="h-56 relative overflow-hidden bg-gradient-to-br from-slate-700 to-slate-800">
              <img
                src={ref.image_url}
                alt={`${ref.motor} ${ref.style}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-white text-sm font-semibold drop-shadow-lg">{ref.motor}</p>
                <p className="text-white/70 text-xs capitalize drop-shadow">{ref.style} • {ref.color}</p>
              </div>
            </div>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{ref.description}</p>
              <div className="flex flex-wrap gap-1">
                {ref.tags.slice(0, 4).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-[10px]">{tag}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>Tidak ada referensi yang sesuai filter.</p>
        </div>
      )}

      {/* Lightbox Dialog */}
      <Dialog open={!!selectedRef} onOpenChange={() => setSelectedRef(null)}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden">
          <DialogTitle className="sr-only">Detail Referensi Modifikasi</DialogTitle>
          {selectedRef && (
            <div>
              <div className="relative h-80 md:h-96 bg-gradient-to-br from-slate-700 to-slate-800">
                <img
                  src={selectedRef.image_url}
                  alt={`${selectedRef.motor} ${selectedRef.style}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold">{selectedRef.motor}</h3>
                    <p className="text-sm text-muted-foreground capitalize">{selectedRef.style} • {selectedRef.color}</p>
                  </div>
                  <Badge className="bg-cyan-500/15 text-cyan-400 border-cyan-500/20 text-xs capitalize">{selectedRef.style}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{selectedRef.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedRef.tags.map((tag) => <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>)}
                </div>
                <p className="text-xs text-muted-foreground pt-2">Source: {selectedRef.source}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <p className="text-xs text-muted-foreground text-center mt-8">
        ⚠️ Gambar referensi untuk inspirasi. Hasil modifikasi aktual dapat berbeda.
      </p>
    </div>
  );
}
