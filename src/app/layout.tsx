import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MotoWise AI — Smart Motor Assistant",
  description:
    "Platform AI untuk rekomendasi motor, cek harga pasaran, modifikasi, dan repaint preview. Semua kebutuhan otomotif motor dalam satu aplikasi.",
  keywords: [
    "rekomendasi motor",
    "harga motor bekas",
    "modifikasi motor",
    "repaint motor",
    "MotoWise AI",
  ],
  openGraph: {
    title: "MotoWise AI — Smart Motor Assistant",
    description:
      "Platform AI untuk semua kebutuhan otomotif motor kamu.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col md:flex-row bg-background text-foreground">
        <TooltipProvider>
          <Sidebar />
          <div className="flex-1 flex flex-col min-h-screen">
            <MobileNav />
            <main className="flex-1">{children}</main>
          </div>
        </TooltipProvider>
      </body>
    </html>
  );
}
