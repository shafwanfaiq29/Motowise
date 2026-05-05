"use client";

import { useState } from "react";
import { ArrowLeftRight, Bike, Plus, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatRupiah } from "@/lib/helpers";
import motorsData from "@/data/motors.json";
import type { Motor } from "@/types";

const motors = motorsData as Motor[];

export default function CompareMotorPage() {
  const [motor1Id, setMotor1Id] = useState("");
  const [motor2Id, setMotor2Id] = useState("");

  const motor1 = motors.find((m) => m.id === motor1Id);
  const motor2 = motors.find((m) => m.id === motor2Id);

  const compareField = (label: string, val1: string | number, val2: string | number, higherIsBetter = true) => {
    const v1 = typeof val1 === "number" ? val1 : 0;
    const v2 = typeof val2 === "number" ? val2 : 0;
    const winner1 = higherIsBetter ? v1 > v2 : v1 < v2;
    const winner2 = higherIsBetter ? v2 > v1 : v2 < v1;

    return (
      <div className="grid grid-cols-3 gap-4 py-3 border-b border-border/50 items-center">
        <div className={`text-sm text-right ${winner1 ? "text-green-400 font-semibold" : "text-muted-foreground"}`}>
          {typeof val1 === "number" && val1 > 100000 ? formatRupiah(val1) : val1}
        </div>
        <div className="text-xs text-center text-muted-foreground font-medium">{label}</div>
        <div className={`text-sm ${winner2 ? "text-green-400 font-semibold" : "text-muted-foreground"}`}>
          {typeof val2 === "number" && val2 > 100000 ? formatRupiah(val2) : val2}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <ArrowLeftRight className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Compare Motor</h1>
            <p className="text-sm text-muted-foreground">Bandingkan dua motor side by side</p>
          </div>
        </div>
      </div>

      {/* Motor Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 animate-fade-in">
        <Card className={motor1 ? "border-blue-500/30" : ""}>
          <CardContent className="p-5">
            <h3 className="text-sm font-medium mb-3 text-blue-400">Motor 1</h3>
            <Select value={motor1Id} onValueChange={setMotor1Id}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih motor pertama">
                  {motor1 ? `${motor1.brand} ${motor1.model} (${motor1.cc}cc)` : "Pilih motor pertama"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {motors.map((m) => (
                  <SelectItem key={m.id} value={m.id} disabled={m.id === motor2Id}>
                    {m.brand} {m.model} ({m.cc}cc)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {motor1 && (
              <div className="mt-4 space-y-2">
                <div className="h-32 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                  <Bike className="w-12 h-12 text-slate-500" />
                </div>
                <h4 className="font-bold text-lg">{motor1.brand} {motor1.model}</h4>
                <Badge className="bg-blue-500/15 text-blue-400 border-blue-500/20 text-xs">{motor1.category}</Badge>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className={motor2 ? "border-orange-500/30" : ""}>
          <CardContent className="p-5">
            <h3 className="text-sm font-medium mb-3 text-orange-400">Motor 2</h3>
            <Select value={motor2Id} onValueChange={setMotor2Id}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih motor kedua">
                  {motor2 ? `${motor2.brand} ${motor2.model} (${motor2.cc}cc)` : "Pilih motor kedua"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {motors.map((m) => (
                  <SelectItem key={m.id} value={m.id} disabled={m.id === motor1Id}>
                    {m.brand} {m.model} ({m.cc}cc)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {motor2 && (
              <div className="mt-4 space-y-2">
                <div className="h-32 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                  <Bike className="w-12 h-12 text-slate-500" />
                </div>
                <h4 className="font-bold text-lg">{motor2.brand} {motor2.model}</h4>
                <Badge className="bg-orange-500/15 text-orange-400 border-orange-500/20 text-xs">{motor2.category}</Badge>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Comparison Table */}
      {motor1 && motor2 && (
        <Card className="animate-fade-in">
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-4 text-center">
              {motor1.brand} {motor1.model} vs {motor2.brand} {motor2.model}
            </h3>

            {/* Headers */}
            <div className="grid grid-cols-3 gap-4 pb-3 border-b-2 border-border mb-1">
              <div className="text-sm font-semibold text-right text-blue-400">{motor1.brand} {motor1.model}</div>
              <div className="text-xs text-center text-muted-foreground">SPESIFIKASI</div>
              <div className="text-sm font-semibold text-orange-400">{motor2.brand} {motor2.model}</div>
            </div>

            {compareField("CC", motor1.cc, motor2.cc)}
            {compareField("Harga Min", motor1.price_min, motor2.price_min, false)}
            {compareField("Harga Max", motor1.price_max, motor2.price_max, false)}
            {compareField("Kategori", motor1.category, motor2.category)}
            {compareField("Perawatan", motor1.maintenance_cost, motor2.maintenance_cost)}

            {/* Strengths */}
            <div className="grid grid-cols-3 gap-4 py-4 border-b border-border/50">
              <div className="text-right">
                <div className="space-y-1">
                  {motor1.strength.map((s, i) => (
                    <p key={i} className="text-xs text-green-400">✓ {s}</p>
                  ))}
                </div>
              </div>
              <div className="text-xs text-center text-muted-foreground font-medium pt-1">Kelebihan</div>
              <div>
                <div className="space-y-1">
                  {motor2.strength.map((s, i) => (
                    <p key={i} className="text-xs text-green-400">✓ {s}</p>
                  ))}
                </div>
              </div>
            </div>

            {/* Weaknesses */}
            <div className="grid grid-cols-3 gap-4 py-4 border-b border-border/50">
              <div className="text-right">
                <div className="space-y-1">
                  {motor1.weakness.map((w, i) => (
                    <p key={i} className="text-xs text-red-400">✗ {w}</p>
                  ))}
                </div>
              </div>
              <div className="text-xs text-center text-muted-foreground font-medium pt-1">Kekurangan</div>
              <div>
                <div className="space-y-1">
                  {motor2.weakness.map((w, i) => (
                    <p key={i} className="text-xs text-red-400">✗ {w}</p>
                  ))}
                </div>
              </div>
            </div>

            {/* Use Cases */}
            <div className="grid grid-cols-3 gap-4 py-4">
              <div className="text-right">
                <div className="flex flex-wrap gap-1 justify-end">
                  {motor1.use_case.map((uc) => (
                    <Badge key={uc} variant="secondary" className="text-[10px]">{uc}</Badge>
                  ))}
                </div>
              </div>
              <div className="text-xs text-center text-muted-foreground font-medium pt-1">Cocok Untuk</div>
              <div>
                <div className="flex flex-wrap gap-1">
                  {motor2.use_case.map((uc) => (
                    <Badge key={uc} variant="secondary" className="text-[10px]">{uc}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {(!motor1 || !motor2) && (
        <div className="text-center py-16 text-muted-foreground animate-fade-in">
          <ArrowLeftRight className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p>Pilih dua motor di atas untuk mulai membandingkan</p>
        </div>
      )}
    </div>
  );
}
