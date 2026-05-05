"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Paintbrush, Upload, Palette, RotateCcw, Loader2, Eye, EyeOff } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import repaintColors from "@/data/repaint-colors.json";
import type { RepaintColor } from "@/types";

const colors = repaintColors as RepaintColor[];

// Convert hex to HSL
function hexToHSL(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s: number;
  const l = (max + min) / 2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [h * 360, s * 100, l * 100];
}

// Convert HSL to RGB
function hslToRGB(h: number, s: number, l: number): [number, number, number] {
  h /= 360; s /= 100; l /= 100;
  let r: number, g: number, b: number;
  if (s === 0) { r = g = b = l; }
  else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1; if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

// Convert RGB to HSL
function rgbToHSL(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s: number;
  const l = (max + min) / 2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [h * 360, s * 100, l * 100];
}

export default function RepaintPreviewPage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<RepaintColor | null>(null);
  const [previewGenerated, setPreviewGenerated] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);
  const [intensity, setIntensity] = useState(75);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalImageRef = useRef<HTMLImageElement | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setUploadedImage(ev.target?.result as string);
        setPreviewGenerated(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const applyColorToCanvas = useCallback(() => {
    if (!uploadedImage || !selectedColor || !canvasRef.current) return;

    setProcessing(true);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      originalImageRef.current = img;
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext("2d")!;

      // Set canvas size
      const maxW = 800;
      const scale = Math.min(maxW / img.width, 1);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      // Draw original
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Target color HSL
      const [targetH, targetS] = hexToHSL(selectedColor!.body_hex);
      const [wheelH, wheelS] = hexToHSL(selectedColor!.wheel_hex);

      const blendFactor = intensity / 100;

      // Process each pixel
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        if (a < 50) continue; // Skip transparent

        const [h, s, l] = rgbToHSL(r, g, b);

        // Skip very dark pixels (shadows, black) and very bright (white, highlights)
        if (l < 8 || l > 95) continue;
        // Skip very low saturation (grey/metallic) with low lightness
        if (s < 5 && l < 30) continue;

        // Determine which color to apply based on pixel brightness
        // Darker areas (potential wheels) get wheel color, body areas get body color
        let newH: number, newS: number;
        if (l < 25) {
          // Dark areas - subtle wheel color influence
          newH = wheelH;
          newS = Math.min(wheelS, s + 10);
        } else {
          // Body areas - apply body color
          newH = targetH;
          newS = targetS * 0.7 + s * 0.3;
        }

        // Blend based on intensity
        const finalH = h + (newH - h) * blendFactor;
        const finalS = s + (newS - s) * blendFactor * 0.8;

        const [nr, ng, nb] = hslToRGB(finalH, finalS, l);
        data[i] = nr;
        data[i + 1] = ng;
        data[i + 2] = nb;
      }

      ctx.putImageData(imageData, 0, 0);
      setProcessing(false);
      setPreviewGenerated(true);
    };
    img.src = uploadedImage;
  }, [uploadedImage, selectedColor, intensity]);

  const handleGenerate = () => {
    applyColorToCanvas();
  };

  const handleReset = () => {
    setUploadedImage(null);
    setSelectedColor(null);
    setPreviewGenerated(false);
    setShowOriginal(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  // Re-apply when intensity changes
  useEffect(() => {
    if (previewGenerated && uploadedImage && selectedColor) {
      applyColorToCanvas();
    }
  }, [intensity]);

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
            <Paintbrush className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Repaint Preview</h1>
            <p className="text-sm text-muted-foreground">Preview warna baru untuk motor kamu dengan manipulasi warna pixel-by-pixel</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Upload & Color Selection */}
        <div className="space-y-6 animate-fade-in">
          {/* Upload */}
          <Card>
            <CardContent className="p-6">
              <Label className="mb-3 block font-semibold">1. Upload Foto Motor</Label>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="motor-upload" />
              <label htmlFor="motor-upload"
                className="flex flex-col items-center justify-center w-full h-48 rounded-xl border-2 border-dashed border-border hover:border-pink-500/30 cursor-pointer transition-all bg-card hover:bg-pink-500/5">
                {uploadedImage ? (
                  <img src={uploadedImage} alt="Uploaded motor" className="w-full h-full object-contain rounded-xl" />
                ) : (
                  <>
                    <Upload className="w-10 h-10 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Klik atau drag foto motor</p>
                    <p className="text-xs text-muted-foreground mt-1">JPG, PNG (Max 5MB)</p>
                  </>
                )}
              </label>
              {uploadedImage && (
                <p className="text-xs text-green-400 mt-2">✓ Foto berhasil diupload</p>
              )}
            </CardContent>
          </Card>

          {/* Color Selection */}
          <Card>
            <CardContent className="p-6">
              <Label className="mb-3 block font-semibold">2. Pilih Kombinasi Warna</Label>
              <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-2">
                {colors.map((color) => (
                  <button key={color.id} onClick={() => { setSelectedColor(color); setPreviewGenerated(false); }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedColor?.id === color.id ? "border-pink-500 bg-pink-500/10 shadow-md shadow-pink-500/10" : "border-border hover:border-pink-500/30"
                    }`}>
                    <div className="flex gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full border-2 border-white/20 shadow-inner" style={{ backgroundColor: color.body_hex }} title={`Body: ${color.body_color}`} />
                      <div className="w-8 h-8 rounded-full border-2 border-white/20 shadow-inner" style={{ backgroundColor: color.wheel_hex }} title={`Velg: ${color.wheel_color}`} />
                    </div>
                    <p className="text-xs font-medium truncate">{color.name}</p>
                    <p className="text-[10px] text-muted-foreground capitalize">{color.style}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Intensity Slider */}
          <Card>
            <CardContent className="p-6">
              <Label className="mb-3 block font-semibold">3. Intensitas Warna: {intensity}%</Label>
              <input
                type="range"
                min="20"
                max="100"
                value={intensity}
                onChange={(e) => setIntensity(parseInt(e.target.value))}
                className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-pink-500"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                <span>Subtle</span>
                <span>Natural</span>
                <span>Vivid</span>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button onClick={handleGenerate} disabled={!uploadedImage || !selectedColor || processing}
              className="flex-1 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700">
              {processing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Palette className="w-4 h-4 mr-2" />}
              {processing ? "Memproses..." : "Generate Preview"}
            </Button>
            <Button variant="outline" onClick={handleReset}><RotateCcw className="w-4 h-4" /></Button>
          </div>
        </div>

        {/* Right: Preview Result */}
        <div className="space-y-6 animate-fade-in">
          <Card className="min-h-[400px]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <Label className="font-semibold">Preview Hasil</Label>
                {previewGenerated && (
                  <Button variant="ghost" size="sm" onClick={() => setShowOriginal(!showOriginal)} className="text-xs gap-1.5 h-8">
                    {showOriginal ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    {showOriginal ? "Lihat Repaint" : "Lihat Original"}
                  </Button>
                )}
              </div>

              {!previewGenerated && !processing ? (
                <div className="flex flex-col items-center justify-center h-80 text-muted-foreground">
                  <Paintbrush className="w-16 h-16 mb-4 opacity-20" />
                  <p className="text-sm">Upload foto dan pilih warna untuk melihat preview</p>
                  <p className="text-xs mt-2 text-center max-w-xs">Tips: Gunakan foto motor dengan latar terang untuk hasil terbaik</p>
                </div>
              ) : processing ? (
                <div className="flex flex-col items-center justify-center h-80 text-muted-foreground">
                  <Loader2 className="w-8 h-8 animate-spin text-pink-500 mb-4" />
                  <p className="text-sm">Memproses perubahan warna pixel-by-pixel...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Canvas-based preview */}
                  <div className="relative rounded-xl overflow-hidden bg-slate-900">
                    {/* Show original or repainted */}
                    {showOriginal && uploadedImage ? (
                      <img src={uploadedImage} alt="Original motor" className="w-full h-auto object-contain" />
                    ) : (
                      <canvas ref={canvasRef} className="w-full h-auto" />
                    )}
                    {/* Label */}
                    <div className="absolute top-3 left-3">
                      <Badge className={`text-xs ${showOriginal ? "bg-slate-800/80" : "bg-pink-500/80"}`}>
                        {showOriginal ? "Original" : "Repainted"}
                      </Badge>
                    </div>
                  </div>

                  {selectedColor && (
                    <div className="p-4 rounded-xl bg-card border border-border">
                      <h4 className="font-semibold text-sm mb-2">{selectedColor.name}</h4>
                      <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full shadow-lg" style={{ backgroundColor: selectedColor.body_hex }} />
                          <div>
                            <p className="font-medium text-foreground">Body</p>
                            <p>{selectedColor.body_color}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full shadow-lg" style={{ backgroundColor: selectedColor.wheel_hex }} />
                          <div>
                            <p className="font-medium text-foreground">Velg</p>
                            <p>{selectedColor.wheel_color}</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Badge variant="secondary" className="text-[10px] capitalize">{selectedColor.style}</Badge>
                        <Badge variant="secondary" className="text-[10px] capitalize">{selectedColor.character}</Badge>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <p className="text-xs text-muted-foreground text-center">
            ⚠️ Disclaimer: Hasil preview adalah simulasi digital menggunakan manipulasi pixel HSL. Warna aktual cat dapat berbeda tergantung pencahayaan, bahan, dan teknik pengecatan.
          </p>
        </div>
      </div>
    </div>
  );
}
