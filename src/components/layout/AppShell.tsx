"use client";

import React from "react";
import { TopHeader } from "./TopHeader";
import { SecondaryNavbar } from "./SecondaryNavbar";
import { ContextSidebar } from "./ContextSidebar";
import { Footer } from "./Footer";
import { ToastContainer } from "@/components/ui/ToastContainer";
import { CommandPalette } from "@/components/features/CommandPalette";
import { AiAssistantDrawer } from "@/components/features/AiAssistantDrawer";
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";

interface AppShellProps {
  children: React.ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
  hideSidebar?: boolean;
}

export const AppShell: React.FC<AppShellProps> = ({ children, breadcrumbs, hideSidebar }) => {
  const pathname = usePathname();
  const { orgContext, toggleOperatingMode } = useApp();
  const shouldHideSidebar = hideSidebar !== undefined ? hideSidebar : pathname === "/dashboard";



  // Generate dynamic breadcrumbs if none provided
  const getBreadcrumbs = () => {
    if (breadcrumbs) return breadcrumbs;
    if (pathname === "/dashboard") {
      return [{ label: "Beranda", href: "/dashboard" }, { label: "Portal Saya" }, { label: "Dashboard" }];
    }
    if (pathname === "/invoices") {
      return [{ label: "Beranda", href: "/dashboard" }, { label: "E Faktur", href: "/invoices" }, { label: "Dashboard" }];
    }
    if (pathname === "/invoices/outgoing") {
      return [{ label: "Beranda", href: "/dashboard" }, { label: "E Faktur", href: "/invoices" }, { label: "Pajak Keluaran" }];
    }
    if (pathname === "/invoices/incoming") {
      return [{ label: "Beranda", href: "/dashboard" }, { label: "E Faktur", href: "/invoices" }, { label: "Pajak Masukan" }];
    }
    if (pathname === "/spt") {
      return [{ label: "Beranda", href: "/dashboard" }, { label: "SPT", href: "/spt" }, { label: "Konsep SPT" }];
    }
    if (pathname === "/bupot") {
      return [{ label: "Beranda", href: "/dashboard" }, { label: "e-Bupot", href: "/bupot" }, { label: "Bukti Potong" }];
    }
    if (pathname === "/payments") {
      return [{ label: "Beranda", href: "/dashboard" }, { label: "Pembayaran", href: "/payments" }, { label: "Tagihan & NTPN" }];
    }
    if (pathname === "/ledger") {
      return [{ label: "Beranda", href: "/dashboard" }, { label: "Buku Besar", href: "/ledger" }, { label: "Jurnal Transaksi" }];
    }
    if (pathname === "/layanan") {
      return [{ label: "Beranda", href: "/dashboard" }, { label: "Layanan WP", href: "/layanan" }, { label: "Katalog Layanan" }];
    }
    if (pathname === "/portal/profile") {
      return [{ label: "Beranda", href: "/dashboard" }, { label: "Portal Saya", href: "/dashboard" }, { label: "Profil Satuan Pendidikan" }];
    }
    if (pathname === "/portal/accounts") {
      return [{ label: "Beranda", href: "/dashboard" }, { label: "Portal Saya", href: "/dashboard" }, { label: "Data Rekening & NPWP" }];
    }
    if (pathname === "/portal/calendar") {
      return [{ label: "Beranda", href: "/dashboard" }, { label: "Portal Saya", href: "/dashboard" }, { label: "Kalender Pajak Sekolah" }];
    }
    if (pathname === "/portal/activities") {
      return [{ label: "Beranda", href: "/dashboard" }, { label: "Portal Saya", href: "/dashboard" }, { label: "Riwayat Aktivitas" }];
    }
    if (pathname === "/management/users") {
      return [{ label: "Beranda", href: "/dashboard" }, { label: "Manajemen", href: "/management/users" }, { label: "Pengguna & Hak Akses" }];
    }
    if (pathname === "/management/tax-rules") {
      return [{ label: "Beranda", href: "/dashboard" }, { label: "Manajemen", href: "/management/users" }, { label: "Aturan & Tarif Pajak" }];
    }
    if (pathname === "/management/vendors") {
      return [{ label: "Beranda", href: "/dashboard" }, { label: "Manajemen", href: "/management/users" }, { label: "Master Vendor BOS" }];
    }
    if (pathname === "/management/audit-logs") {
      return [{ label: "Beranda", href: "/dashboard" }, { label: "Manajemen", href: "/management/users" }, { label: "Audit Trail Forensik" }];
    }
    if (pathname.startsWith("/management")) {
      return [{ label: "Beranda", href: "/dashboard" }, { label: "Manajemen", href: "/management/users" }, { label: "Konfigurasi" }];
    }
    return [{ label: "Beranda", href: "/dashboard" }, { label: "Dashboard" }];
  };

  const crumbs = getBreadcrumbs();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B0F19] text-slate-800 dark:text-slate-100 transition-colors">
      {/* Top Header */}
      <TopHeader />

      {/* Secondary Main Navigation */}
      <SecondaryNavbar />

      {/* Main Content Body */}
      <div className="flex-1 max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Breadcrumb (Matching Reference: Beranda > E Faktur > Dashboard) */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-5" aria-label="Breadcrumb">
          <Link href="/dashboard" className="flex items-center gap-1 hover:text-indigo-600 transition-colors">
            <Home className="w-3.5 h-3.5" />
            <span className="sr-only">Beranda</span>
          </Link>
          {crumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700" />
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-indigo-600 transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {crumb.label}
                </span>
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Persistent Active Organization & Unit Context Banner (Point 3 & 28) */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2 mb-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-xs shadow-2xs">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-100">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{orgContext.organizationName}</span>
            </div>
            <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
            <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
              <span className="text-slate-400 dark:text-slate-500">Unit:</span>
              <span className="font-semibold text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-100 dark:border-indigo-900/50">
                {orgContext.unitName}
              </span>
            </div>
            <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
            <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
              <span className="text-slate-400 dark:text-slate-500">Masa Pajak:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {orgContext.periodLabel}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {orgContext.operatingMode === "PRACTICUM_SANDBOX" ? (
              <button
                onClick={toggleOperatingMode}
                title="Klik untuk kembali ke Mode Operasional Nyata"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider bg-amber-500 hover:bg-amber-600 text-white shadow-xs transition-colors"
              >
                <span>PRACTICUM MODE (SANDBOX)</span>
              </button>
            ) : (
              <button
                onClick={toggleOperatingMode}
                title="Klik untuk beralih ke Mode Praktikum Siswa"
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
              >
                <span>LIVE INTERNAL</span>
              </button>
            )}
          </div>
        </div>

        {/* Content Layout: Left Sidebar + Main View (or Full Width on Dashboard) */}
        {shouldHideSidebar ? (
          <main className="w-full min-w-0">
            <React.Suspense fallback={<div className="animate-pulse bg-slate-100 dark:bg-slate-800 rounded-xl h-96" />}>
              {children}
            </React.Suspense>
          </main>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            <React.Suspense fallback={<aside className="w-64 lg:w-72 shrink-0 animate-pulse bg-slate-100 dark:bg-slate-800 rounded-xl h-96" />}>
              <ContextSidebar />
            </React.Suspense>
            <main className="flex-1 min-w-0">
              <React.Suspense fallback={<div className="animate-pulse bg-slate-100 dark:bg-slate-800 rounded-xl h-96" />}>
                {children}
              </React.Suspense>
            </main>
          </div>
        )}

      </div>

      {/* Enterprise Footer */}
      <Footer />

      {/* Interactive Global Elements */}
      <ToastContainer />
      <CommandPalette />
      <AiAssistantDrawer />
    </div>
  );
};
