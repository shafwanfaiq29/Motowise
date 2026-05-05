# MotoWise AI — Smart Motor Assistant

> Platform AI untuk semua kebutuhan otomotif motor Indonesia. Dari rekomendasi motor, cek harga pasaran, modifikasi, hingga repaint preview — semua dalam satu aplikasi.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?logo=tailwind-css)
![Gemini AI](https://img.shields.io/badge/Gemini_AI-2.0-4285F4?logo=google)

## Fitur

| # | Fitur | Deskripsi |
|---|-------|-----------|
| 1 | **Rekomendasi Motor** | AI scoring algorithm — temukan motor ideal sesuai budget dan kebutuhan |
| 2 | **Cek Harga Pasaran** | Estimasi harga motor bekas + status murah/wajar/mahal |
| 3 | **Compare Motor** | Bandingkan dua motor side-by-side (spesifikasi, kelebihan, kekurangan) |
| 4 | **Rekomendasi Modifikasi** | Paket modifikasi otomatis sesuai budget, style dan prioritas |
| 5 | **Part & Brand** | Browse 25+ part modifikasi dengan filter kategori dan style |
| 6 | **Repaint Preview** | Upload foto + pilih warna lalu preview simulasi color overlay |
| 7 | **Referensi Modifikasi** | Galeri inspirasi modifikasi berbagai style |

### AI Enhancement (Gemini API)
- **Motor Insight** — Penjelasan personal kenapa motor cocok untuk kamu
- **Negotiation Tips** — Tips tawar-menawar berdasarkan harga pasaran
- **Modification Tips** — Saran modifikasi khusus per motor dan style
- **Repaint Suggestion** — Pendapat AI tentang kombinasi warna

## Quick Start

### Prerequisites
- Node.js 18+
- npm atau yarn

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/motowise-ai.git
cd motowise-ai/app

# Install dependencies
npm install

# Setup environment (opsional - untuk fitur AI)
cp .env.example .env.local
# Edit .env.local dan tambahkan GEMINI_API_KEY

# Run development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

### Environment Variables

| Variable | Required | Deskripsi |
|----------|----------|-----------|
| `GEMINI_API_KEY` | Opsional | API key dari Google AI Studio. Tanpa key, semua fitur tetap berjalan tanpa AI enhancement. |

## Tech Stack

| Technology | Usage |
|------------|-------|
| **Next.js 16** | App Router, API Routes, Server Components |
| **TypeScript** | Type safety dan developer experience |
| **Tailwind CSS 4** | Utility-first CSS framework |
| **shadcn/ui** | Accessible, customizable UI components |
| **Gemini 2.0 Flash** | AI-powered insights dan suggestions |
| **Lucide Icons** | Beautiful, consistent iconography |

## Dataset

| Dataset | Jumlah | Deskripsi |
|---------|--------|-----------|
| Motor | 40 | Motor populer Indonesia (Honda, Yamaha, Suzuki, Kawasaki) |
| Harga Bekas | 50 | Data harga motor bekas berbagai tahun dan kondisi |
| Part Modifikasi | 25 | Part aftermarket populer |
| Style Modifikasi | 8 | Simple Elegan, Sporty, Touring, Thailook, dll |
| Warna Repaint | 20 | Kombinasi body + velg color |
| Referensi | 12 | Galeri inspirasi modifikasi |

## Project Structure

```
app/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── api/                    # API Routes
│   │   ├── rekomendasi-motor/      # Motor recommendation page
│   │   ├── cek-harga/              # Price check page
│   │   ├── compare/                # Motor comparison page
│   │   ├── rekomendasi-modifikasi/ # Modification package page
│   │   ├── rekomendasi-part/       # Parts browsing page
│   │   ├── repaint-preview/        # Repaint preview page
│   │   ├── referensi-modifikasi/   # Reference gallery page
│   │   └── about/                  # About page
│   ├── components/
│   │   ├── layout/                 # Sidebar, MobileNav
│   │   └── ui/                     # shadcn/ui components
│   ├── data/                       # JSON datasets
│   ├── lib/                        # Business logic
│   │   ├── recommendation.ts       # Motor scoring algorithm
│   │   ├── price-prediction.ts     # Price estimation logic
│   │   ├── modification.ts         # Modification package builder
│   │   ├── ai-client.ts            # Gemini AI integration
│   │   └── helpers.ts              # Utility functions
│   └── types/                      # TypeScript interfaces
```

## Design System

- **Theme**: Dark Navy (#0a0e1a) + Orange (#f97316) accent
- **Components**: shadcn/ui with custom CSS variables
- **Animations**: Fade-in, stagger, gradient, glassmorphism
- **Typography**: Inter (Google Fonts)
- **Responsive**: Mobile-first with sidebar to drawer navigation

## Disclaimer

- Hasil prediksi harga hanya estimasi, bukan harga pasti
- Hasil repaint preview hanya simulasi digital
- Rekomendasi part harus dicek kompatibilitas di bengkel
- Data harga dapat berubah sewaktu-waktu
- Gambar referensi untuk inspirasi, hasil aktual dapat berbeda

## License

MIT License — Data Science Portfolio Project 2026

