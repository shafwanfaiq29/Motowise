"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Home,
  Bike,
  DollarSign,
  Wrench,
  Package,
  Paintbrush,
  Image,
  Info,
  Menu,
  X,
  Zap,
  ArrowLeftRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/rekomendasi-motor", label: "Rekomendasi Motor", icon: Bike },
  { href: "/cek-harga", label: "Cek Harga Pasaran", icon: DollarSign },
  { href: "/compare", label: "Compare Motor", icon: ArrowLeftRight },
  { href: "/rekomendasi-modifikasi", label: "Rekomendasi Modifikasi", icon: Wrench },
  { href: "/rekomendasi-part", label: "Part & Brand", icon: Package },
  { href: "/repaint-preview", label: "Repaint Preview", icon: Paintbrush },
  { href: "/referensi-modifikasi", label: "Referensi Modifikasi", icon: Image },
  { href: "/about", label: "About Project", icon: Info },
];

export default function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-sidebar text-sidebar-foreground border-b border-sidebar-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-sm">MotoWise AI</span>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button className="p-2 rounded-lg hover:bg-sidebar-accent transition-colors">
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-[280px] bg-sidebar text-sidebar-foreground border-sidebar-border p-0"
          >
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <div className="flex items-center gap-3 p-5 border-b border-sidebar-border">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-base">MotoWise AI</h2>
                <p className="text-[11px] text-sidebar-foreground/50">Smart Motor Assistant</p>
              </div>
            </div>
            <nav className="py-4 px-3 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <item.icon className="w-[18px] h-[18px]" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
