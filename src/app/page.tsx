import Link from "next/link";
import {
  Bike,
  DollarSign,
  Wrench,
  Package,
  Paintbrush,
  Image,
  ArrowRight,
  Zap,
  Sparkles,
  ArrowLeftRight,
} from "lucide-react";

const features = [
  {
    href: "/rekomendasi-motor",
    icon: Bike,
    title: "Rekomendasi Motor",
    description: "Temukan motor ideal sesuai budget dan kebutuhanmu",
    color: "from-blue-500 to-blue-600",
    shadowColor: "shadow-blue-500/20",
  },
  {
    href: "/cek-harga",
    icon: DollarSign,
    title: "Cek Harga Pasaran",
    description: "Cek apakah harga motor bekas murah, wajar, atau mahal",
    color: "from-green-500 to-emerald-600",
    shadowColor: "shadow-green-500/20",
  },
  {
    href: "/rekomendasi-modifikasi",
    icon: Wrench,
    title: "Rekomendasi Modifikasi",
    description: "Susun paket modifikasi sesuai budget dan style",
    color: "from-purple-500 to-purple-600",
    shadowColor: "shadow-purple-500/20",
  },
  {
    href: "/rekomendasi-part",
    icon: Package,
    title: "Part & Brand",
    description: "Rekomendasi part dan brand terbaik untuk motormu",
    color: "from-amber-500 to-orange-600",
    shadowColor: "shadow-amber-500/20",
  },
  {
    href: "/repaint-preview",
    icon: Paintbrush,
    title: "Repaint Preview",
    description: "Preview warna baru untuk body dan velg motor",
    color: "from-pink-500 to-rose-600",
    shadowColor: "shadow-pink-500/20",
  },
  {
    href: "/referensi-modifikasi",
    icon: Image,
    title: "Referensi Modifikasi",
    description: "Galeri inspirasi modifikasi berbagai style",
    color: "from-cyan-500 to-teal-600",
    shadowColor: "shadow-cyan-500/20",
  },
  {
    href: "/compare",
    icon: ArrowLeftRight,
    title: "Compare Motor",
    description: "Bandingkan dua motor side by side",
    color: "from-indigo-500 to-violet-600",
    shadowColor: "shadow-indigo-500/20",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-16 md:py-24 lg:py-32">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-500/20 bg-orange-500/10 text-orange-400 text-xs font-medium mb-6 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5" />
            Powered by AI
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-fade-in">
            Semua Kebutuhan{" "}
            <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500 bg-clip-text text-transparent animate-gradient">
              Otomotif Motor
            </span>{" "}
            dalam Satu Aplikasi
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in">
            MotoWise AI membantu kamu memilih motor, cek harga pasaran, merencanakan modifikasi,
            dan preview repaint — semua dibantu AI.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in">
            <Link
              href="/rekomendasi-motor"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold text-sm hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Zap className="w-4 h-4" />
              Coba Sekarang
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-border text-sm font-medium hover:bg-accent/10 transition-all"
            >
              Tentang Project
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Fitur Utama</h2>
            <p className="text-muted-foreground">
              Pilih fitur yang kamu butuhkan untuk memulai
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
            {features.map((feature) => (
              <Link
                key={feature.href}
                href={feature.href}
                className={`group relative p-6 rounded-2xl bg-card border border-border hover:border-orange-500/30 transition-all duration-300 hover:shadow-lg ${feature.shadowColor} hover:-translate-y-1`}
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
                <ArrowRight className="absolute top-6 right-6 w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: "40+", label: "Motor Database" },
              { value: "25+", label: "Part & Brand" },
              { value: "8", label: "Style Modifikasi" },
              { value: "20+", label: "Warna Repaint" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="text-center p-5 rounded-xl bg-card border border-border"
              >
                <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
            <span>MotoWise AI</span>
          </div>
          <p>Data Science Portfolio Project — 2026</p>
        </div>
      </footer>
    </div>
  );
}
