"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Bike,
  DollarSign,
  Wrench,
  Package,
  Paintbrush,
  Image,
  Info,
  ChevronLeft,
  ChevronRight,
  Zap,
  ArrowLeftRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

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

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col h-screen sticky top-0 bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 p-5 border-b border-sidebar-border">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0">
          <Zap className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="animate-fade-in">
            <h1 className="font-bold text-base tracking-tight">MotoWise AI</h1>
            <p className="text-[11px] text-sidebar-foreground/50">Smart Motor Assistant</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md shadow-orange-500/20"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "w-[18px] h-[18px] flex-shrink-0 transition-transform duration-200",
                  !isActive && "group-hover:scale-110"
                )}
              />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="p-3 border-t border-sidebar-border text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors flex items-center justify-center"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </aside>
  );
}
