import { Info, Zap, Code, Database, Brain, Globe, Github } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const techStack = [
  { name: "Next.js", category: "Frontend", icon: Globe },
  { name: "TypeScript", category: "Language", icon: Code },
  { name: "Tailwind CSS", category: "Styling", icon: Code },
  { name: "shadcn/ui", category: "UI Components", icon: Code },
  { name: "Gemini API", category: "AI", icon: Brain },
  { name: "JSON Dataset", category: "Data Storage", icon: Database },
  { name: "Vercel", category: "Deployment", icon: Globe },
];

const features = [
  "Rekomendasi motor sesuai budget dan kebutuhan",
  "Cek harga pasaran motor bekas (murah/wajar/mahal)",
  "Rekomendasi modifikasi dengan paket dan prioritas",
  "Browse part dan brand modifikasi",
  "Preview repaint warna motor (simulasi digital)",
  "Galeri referensi modifikasi berbagai style",
];

export default function AboutPage() {
  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
            <Info className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">About Project</h1>
            <p className="text-sm text-muted-foreground">Tentang MotoWise AI</p>
          </div>
        </div>
      </div>

      <div className="space-y-8 animate-fade-in">
        {/* About */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">MotoWise AI</h2>
                <p className="text-sm text-muted-foreground">Smart Motor Assistant</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              MotoWise AI adalah platform berbasis AI yang dirancang untuk membantu pengguna dalam dunia otomotif motor.
              Mulai dari memilih motor yang tepat sesuai budget, mengecek harga pasaran motor bekas, merencanakan modifikasi,
              hingga preview repaint warna — semua dalam satu aplikasi yang mudah digunakan.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mt-3">
              Project ini dikembangkan sebagai portofolio Data Science yang menggabungkan beberapa kemampuan seperti
              recommendation system, price prediction, image processing, dan web application development.
            </p>
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-4">Fitur Utama</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {features.map((f, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-orange-400 mt-0.5">✓</span>
                  {f}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tech Stack */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-4">Tech Stack</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {techStack.map((tech) => (
                <div key={tech.name} className="p-3 rounded-xl bg-secondary/50 border border-border text-center">
                  <tech.icon className="w-6 h-6 mx-auto mb-2 text-orange-400" />
                  <p className="text-sm font-medium">{tech.name}</p>
                  <p className="text-[10px] text-muted-foreground">{tech.category}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Card className="border-yellow-500/20">
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-3 text-yellow-400">⚠️ Disclaimer</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Hasil prediksi harga hanya estimasi, bukan harga pasti.</li>
              <li>• Hasil repaint preview hanya simulasi digital.</li>
              <li>• Rekomendasi part harus dicek kompatibilitas di bengkel.</li>
              <li>• Data harga dapat berubah sewaktu-waktu.</li>
              <li>• Gambar referensi untuk inspirasi, hasil aktual dapat berbeda.</li>
            </ul>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <p>Made with ❤️ — Data Science Portfolio Project 2026</p>
        </div>
      </div>
    </div>
  );
}
