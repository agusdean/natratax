"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ShieldCheck, 
  ArrowRight, 
  FileText, 
  FileCheck2, 
  CreditCard, 
  Calculator, 
  CheckCircle2, 
  AlertTriangle, 
  Building2, 
  Download, 
  Check, 
  Lock, 
  Users, 
  Menu, 
  X,
  ChevronDown,
  History,
  FileSpreadsheet,
  Clock,
  Receipt,
  BadgeCheck,
  GraduationCap,
  Sparkles,
  Award,
  ChevronRight,
  TrendingUp,
  FileCheck
} from "lucide-react";
import { TaxCalculationService } from "@/lib/tax-engine";
import { formatRupiah } from "@/lib/utils";
import { TaxType } from "@/types";

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Product Showcase active tab
  const [activeShowcase, setActiveShowcase] = useState<"dashboard" | "transaksi" | "spt" | "laporan">("dashboard");

  // Interactive Tax Rule Simulator
  const [calcTaxType, setCalcTaxType] = useState<TaxType>("PPN");
  const [calcGross, setCalcGross] = useState<number>(28000000);
  const [calcHasNpwp, setCalcHasNpwp] = useState<boolean>(true);

  const setPreset = (type: TaxType, gross: number, hasNpwp: boolean) => {
    setCalcTaxType(type);
    setCalcGross(gross);
    setCalcHasNpwp(hasNpwp);
  };

  const liveCalculation = TaxCalculationService.calculate({
    taxType: calcTaxType,
    grossAmount: calcGross || 0,
    hasNpwp: calcHasNpwp,
    isGovernmentTreasury: true,
  });

  // Unified Role & Workflow active role
  const [activeRole, setActiveRole] = useState<"bendahara" | "kepsek" | "admin" | "verifikator" | "operator" | "auditor">("bendahara");

  // FAQ Accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0D1B] via-[#14122B] to-[#0A0D1A] text-slate-100 antialiased selection:bg-purple-600 selection:text-white relative overflow-x-hidden">

      {/* Ambient background glows - mirroring login left-panel aesthetic */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none -z-0" />
      <div className="fixed top-1/3 right-10 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[130px] pointer-events-none -z-0" />
      <div className="fixed bottom-10 left-10 w-[550px] h-[550px] bg-amber-500/5 rounded-full blur-[150px] pointer-events-none -z-0" />

      {/* ============================================================
          01. STICKY TOPBAR & NAVBAR (Clean Glassmorphism)
      ============================================================ */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#0B0D1B]/85 backdrop-blur-xl border-b border-purple-500/20 shadow-2xl py-3"
            : "bg-transparent border-b border-white/10 py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            
            {/* School Brand Identity */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-full bg-white p-1 shadow-lg shadow-purple-900/40 ring-2 ring-amber-400 group-hover:scale-105 transition-transform shrink-0 overflow-hidden flex items-center justify-center">
                <Image
                  src="/images/logo-smk.png"
                  alt="Logo SMK Bina Putra Jakarta"
                  width={44}
                  height={44}
                  className="w-full h-full object-contain rounded-full"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xl tracking-tight text-white">
                    Natra<span className="text-amber-400">Tax</span>
                  </span>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/30">
                    SMK BINA PUTRA
                  </span>
                </div>
                <span className="text-[11px] font-medium text-purple-200/70">
                  Sistem Tata Kelola Pajak & BOS Sekolah
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold text-slate-300">
              <a href="#fitur" className="hover:text-amber-400 transition-colors py-1">
                Fitur Kunci BOS
              </a>
              <a href="#kalkulator" className="hover:text-amber-400 transition-colors py-1 flex items-center gap-1.5">
                <span>Simulator Pajak</span>
                <span className="px-1.5 py-0.2 rounded-full bg-amber-400/20 text-amber-300 text-[9px] font-bold border border-amber-400/30">
                  Interaktif
                </span>
              </a>
              <a href="#pengalaman" className="hover:text-amber-400 transition-colors py-1">
                Alur & Pengalaman
              </a>
              <a href="#alur-peran" className="hover:text-amber-400 transition-colors py-1">
                Wewenang (RBAC)
              </a>
              <a href="#keamanan" className="hover:text-amber-400 transition-colors py-1">
                Kepatuhan BPK
              </a>
              <a href="#faq" className="hover:text-amber-400 transition-colors py-1">
                FAQ
              </a>
            </nav>

            {/* Desktop Right CTA */}
            <div className="hidden sm:flex items-center gap-3">
              <Link
                href="/login"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-purple-600 text-white text-xs font-bold shadow-lg shadow-purple-900/40 border border-white/20 hover:border-white/40 transition-all flex items-center gap-2 group"
              >
                <span>Buka Portal NatraTax</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-300 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Buka Menu"
              className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-purple-500/20 bg-[#0B0D1B]/95 backdrop-blur-xl px-5 pt-4 pb-6 space-y-3 text-sm font-semibold shadow-2xl animate-in fade-in">
            <a
              href="#fitur"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-200 hover:text-amber-400 border-b border-white/10"
            >
              Fitur Kunci BOS
            </a>
            <a
              href="#kalkulator"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-200 hover:text-amber-400 border-b border-white/10 flex items-center justify-between"
            >
              <span>Simulator Pajak Sekolah</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold border border-amber-400/30">
                Interaktif
              </span>
            </a>
            <a
              href="#pengalaman"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-200 hover:text-amber-400 border-b border-white/10"
            >
              Alur & Pengalaman
            </a>
            <a
              href="#alur-peran"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-200 hover:text-amber-400 border-b border-white/10"
            >
              Wewenang (RBAC)
            </a>
            <a
              href="#keamanan"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-200 hover:text-amber-400 border-b border-white/10"
            >
              Kepatuhan & Audit BPK
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-200 hover:text-amber-400 border-b border-white/10"
            >
              FAQ
            </a>
            <div className="pt-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-lg flex items-center justify-center gap-2"
              >
                <span>Buka Portal NatraTax</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </Link>
            </div>
          </div>
        )}
      </header>


      {/* ============================================================
          02. GRAND INSTITUTIONAL TRUST HERO BANNER (Big CTA & Proof)
      ============================================================ */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Official School Emblem Avatar (HD Circular Presentation) */}
          <div className="flex justify-center mb-6">
            <div className="relative group">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-400 via-purple-600 to-indigo-600 rounded-full blur-md opacity-75 group-hover:opacity-100 transition duration-500" />
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white p-2 shadow-2xl ring-4 ring-white/20 flex items-center justify-center overflow-hidden">
                <Image
                  src="/images/logo-smk.png"
                  alt="Logo Resmi SMK Bina Putra Jakarta"
                  width={112}
                  height={112}
                  className="w-full h-full object-contain rounded-full transform group-hover:scale-105 transition-transform"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Institutional Authority Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-900/60 to-indigo-900/60 border border-purple-500/30 text-purple-200 text-xs font-semibold mb-6 shadow-lg shadow-purple-950/50 backdrop-blur-md">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span className="text-amber-400 font-bold tracking-wide uppercase">PORTAL RESMI:</span>
            <span>Standar Administrasi Perpajakan & BOS Satuan Pendidikan SMK</span>
          </div>

          {/* Grand Main Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white max-w-5xl mx-auto leading-[1.15]">
            Sistem Informasi & Akuntabilitas{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200">
              Pajak Sekolah Terpadu.
            </span>
          </h1>

          {/* Subtitle with High-Trust Institutional Copy */}
          <p className="mt-6 text-base sm:text-lg md:text-xl text-purple-100/80 max-w-3xl mx-auto leading-relaxed font-normal">
            Platform perpajakan instansi sekolah yang dirancang presisi sesuai regulasi <strong>PMK 59/PMK.03/2022</strong>. Mengotomasikan pemotongan <strong>PPh 22 belanja BOS & SIPLah</strong>, bukti potong <strong>PPh 21 honor guru & penguji UKK</strong>, pemantauan <strong>e-Billing NTPN kas negara</strong>, hingga buku pembantu pajak SPJ yang siap diaudit BPK & Inspektorat.
          </p>

          {/* Core Regulatory Badges */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5 max-w-4xl mx-auto text-xs font-medium text-purple-200">
            <span className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md shadow-inner flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-amber-400" />
              <span>WAPU Instansi Pemerintah (PMK 59/2022)</span>
            </span>
            <span className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md shadow-inner flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-amber-400" />
              <span>Ambang Batas BOS Bebas PPh 22 (≤ Rp 2 Jt)</span>
            </span>
            <span className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md shadow-inner flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-amber-400" />
              <span>PPh 21 Skema TER 2024 & Asesor LSP</span>
            </span>
            <span className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md shadow-inner flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-amber-400" />
              <span>Validasi NTPN Kas Negara & SPJ BOS</span>
            </span>
          </div>

          {/* Big CTA Buttons */}
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-500 text-slate-950 text-sm font-black shadow-xl shadow-amber-500/20 hover:shadow-amber-500/30 transition-all flex items-center justify-center gap-2.5 group"
            >
              <span>Buka Sistem NatraTax (Login Administrator)</span>
              <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href="#kalkulator"
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-sm font-bold shadow-lg backdrop-blur-md transition-all flex items-center justify-center gap-2"
            >
              <Calculator className="w-4 h-4 text-amber-300" />
              <span>Uji Simulator Pajak Sekolah</span>
            </a>
          </div>

          {/* Target Institutional Authority Note */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-purple-200/60 font-mono">
            <Building2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Implementasi Resmi: SMK BINA PUTRA JAKARTA • NPWP: 99.886.600.0-010.609</span>
          </div>
        </div>


        {/* ============================================================
            03. LIVE SYSTEM WINDOW PREVIEW (Authentic School Tax Interface)
        ============================================================ */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 md:mt-16 relative z-10">
          <div className="rounded-3xl p-1.5 sm:p-3 bg-gradient-to-b from-purple-500/20 via-white/10 to-indigo-500/10 border border-white/20 shadow-2xl backdrop-blur-xl">
            <div className="rounded-2xl bg-[#0F1225] border border-white/10 overflow-hidden shadow-2xl">
              
              {/* Window Topbar */}
              <div className="bg-[#151934] px-4 py-3 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="ml-2 flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/40 border border-white/10 text-[11px] font-mono text-purple-200">
                    <Lock className="w-3 h-3 text-emerald-400" />
                    <span className="font-semibold text-white">natratax.binaputra.sch.id</span>
                    <span className="text-slate-400">/portal-keuangan</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold text-[11px] border border-emerald-500/30 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Sistem Pajak Sekolah Aktif
                  </span>
                  <span className="text-[11px] font-medium text-purple-200/70 hidden sm:inline">
                    Tahun Anggaran 2026 / Kas BOS
                  </span>
                </div>
              </div>

              {/* Window Header */}
              <div className="px-6 py-4 border-b border-white/10 bg-[#12152E] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-700 text-white flex items-center justify-center font-black text-sm shadow-md border border-white/20">
                    BP
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white leading-tight">
                      SMK BINA PUTRA JAKARTA
                    </h2>
                    <p className="text-xs text-purple-300/80 font-mono">
                      NPWP Instansi: 99.886.600.0-010.609 • Status WAPU Aktif
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="px-3.5 py-1.5 rounded-xl bg-amber-400 text-purple-950 font-bold text-xs hover:bg-amber-300 transition-colors shadow-md"
                  >
                    Buka Dashboard Nyata
                  </Link>
                </div>
              </div>

              {/* Window Content: Real School Sample Metrics */}
              <div className="p-6 space-y-6">
                
                {/* 3 KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
                    <span className="text-xs text-purple-200 font-medium">Realisasi Belanja Kas BOS</span>
                    <div className="text-xl sm:text-2xl font-black text-white mt-1">Rp 142.500.000</div>
                    <div className="text-[11px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      100% Tercatat dalam SPJ
                    </div>
                  </div>

                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
                    <span className="text-xs text-purple-200 font-medium">Pajak Dipungut / Disetor NTPN</span>
                    <div className="text-xl sm:text-2xl font-black text-amber-400 mt-1">Rp 17.820.000</div>
                    <div className="text-[11px] text-amber-300 font-semibold mt-1">
                      PPN 11%, PPh 21, 22, & 23
                    </div>
                  </div>

                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
                    <span className="text-xs text-purple-200 font-medium">Kepatuhan SPT Masa Unifikasi</span>
                    <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-1">Tertib & Nihil Denda</div>
                    <div className="text-[11px] text-purple-300 font-medium mt-1">
                      Siap Dokumen Pemeriksaan
                    </div>
                  </div>

                </div>

                {/* Real-World Transaction Table Preview */}
                <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden backdrop-blur-md">
                  <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white">Contoh Transaksi Riil Sekolah dalam Sistem</h4>
                      <p className="text-[11px] text-purple-300">Pencatatan belanja BOS, honor guru, dan pemotongan otomatis</p>
                    </div>
                    <span className="text-xs text-amber-400 font-bold">
                      Format PMK 59/2022
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-white/5 text-purple-200 font-semibold border-b border-white/10">
                        <tr>
                          <th className="py-2.5 px-4">No. Transaksi</th>
                          <th className="py-2.5 px-4">Uraian Belanja Sekolah</th>
                          <th className="py-2.5 px-4">Rekanan / Penerima</th>
                          <th className="py-2.5 px-4 text-right">Nilai Bruto</th>
                          <th className="py-2.5 px-4">Jenis Pajak</th>
                          <th className="py-2.5 px-4 text-right">Pajak Terutang</th>
                          <th className="py-2.5 px-4 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 font-medium text-slate-200">
                        <tr className="hover:bg-white/5 transition-colors">
                          <td className="py-3 px-4 font-mono text-[11px] text-purple-300">TRX-BOS-001</td>
                          <td className="py-3 px-4 font-bold text-white">Pengadaan 12 Komputer Lab TKJ (SIPLah)</td>
                          <td className="py-3 px-4 text-slate-300">CV Media Sarana Edukasi</td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-white">Rp 28.000.000</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-bold text-[10px] border border-purple-500/30">
                              PPN 11% + PPh 22
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-amber-400">Rp 3.500.000</td>
                          <td className="py-3 px-4 text-center">
                            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              Faktur Valid
                            </span>
                          </td>
                        </tr>
                        <tr className="hover:bg-white/5 transition-colors">
                          <td className="py-3 px-4 font-mono text-[11px] text-purple-300">TRX-BOS-002</td>
                          <td className="py-3 px-4 font-bold text-white">Honorarium Asesor Uji Kompetensi Keahlian (UKK)</td>
                          <td className="py-3 px-4 text-slate-300">Dr. Hendra Gunawan (LSP Kejuruan)</td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-white">Rp 4.500.000</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 font-bold text-[10px] border border-blue-500/30">
                              PPh 21 TER Non-Pegawai
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-amber-400">Rp 225.000</td>
                          <td className="py-3 px-4 text-center">
                            <span className="inline-flex items-center gap-1 text-[11px] text-indigo-400 font-semibold">
                              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                              e-Bupot Terbit
                            </span>
                          </td>
                        </tr>
                        <tr className="hover:bg-white/5 transition-colors">
                          <td className="py-3 px-4 font-mono text-[11px] text-purple-300">TRX-BOS-003</td>
                          <td className="py-3 px-4 font-bold text-white">Pemeliharaan Fiber Optic & Jaringan Lab RPL</td>
                          <td className="py-3 px-4 text-slate-300">PT Cipta Solusi Mandiri</td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-white">Rp 6.800.000</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold text-[10px] border border-amber-500/30">
                              PPh 23 Jasa Teknik
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-amber-400">Rp 136.000</td>
                          <td className="py-3 px-4 text-center">
                            <span className="inline-flex items-center gap-1 text-[11px] text-amber-300 font-semibold">
                              <Clock className="w-3.5 h-3.5 text-amber-400" />
                              NTPN Tervalidasi
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>

      </section>


      {/* ============================================================
          04. METRIC STRIP (School Proof Numbers)
      ============================================================ */}
      <section className="py-8 bg-white/5 border-y border-white/10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-black text-amber-400 tracking-tight">100%</div>
              <p className="text-xs font-bold text-white">Regulasi PMK 59/2022</p>
              <p className="text-[11px] text-purple-200/70">WAPU Bendahara Sekolah Otomatis</p>
            </div>

            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">≤ Rp 2 Juta</div>
              <p className="text-xs font-bold text-white">Bebas PPh 22 Belanja BOS</p>
              <p className="text-[11px] text-purple-200/70">Deteksi Ambang Batas Akurat</p>
            </div>

            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-black text-purple-300 tracking-tight">TER 2024</div>
              <p className="text-xs font-bold text-white">PPh 21 Guru & Asesor UKK</p>
              <p className="text-[11px] text-purple-200/70">e-Bupot BP-21 Terstandar</p>
            </div>

            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">Valid NTPN</div>
              <p className="text-xs font-bold text-white">Setoran Kas Negara</p>
              <p className="text-[11px] text-purple-200/70">Siap Audit BPK & Inspektorat</p>
            </div>

          </div>
        </div>
      </section>


      {/* ============================================================
          05. FITUR KUNCI SEKOLAH (Bento Showcase in Soft Violet Style)
      ============================================================ */}
      <section className="py-20 relative" id="fitur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
              Kebutuhan Nyata Sekolah
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mt-3 tracking-tight">
              Fitur yang Dirancang Khusus untuk Sekolah.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-purple-200/80 leading-relaxed">
              Bukan software akuntansi umum yang kaku. NatraTax dibangun untuk menjawab langsung tantangan riil bendahara sekolah, SPJ BOS, honor guru GTT, dan pengadaan SIPLah.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Bento Card 1: Belanja BOS & SIPLah (Large 7 Cols) */}
            <div className="lg:col-span-7 rounded-3xl bg-white/[0.04] hover:bg-white/[0.06] p-7 border border-white/10 hover:border-purple-500/30 shadow-xl backdrop-blur-md flex flex-col justify-between transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-amber-300 flex items-center justify-center border border-purple-500/30">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-amber-300 bg-amber-400/15 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                    Otomasi Regulasi WAPU
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  Pengelolaan Pajak Belanja BOS & Pengadaan SIPLah
                </h3>
                <p className="text-xs sm:text-sm text-purple-200/80 mt-2 leading-relaxed">
                  Secara otomatis memisahkan transaksi pengadaan sarana/prasarana laboratorium dan buku. Sistem mendeteksi otomatis batas pemungutan <strong>PPh 22 (1.5%)</strong> saat belanja di atas Rp 2.000.000 dan memverifikasi faktur PPN 11% rekanan PKP.
                </p>

                {/* Micro Simulation Box inside Card */}
                <div className="mt-5 p-4 rounded-2xl bg-black/30 border border-white/10 text-xs space-y-2">
                  <div className="flex justify-between font-medium text-purple-200">
                    <span>Kasus: Pengadaan 12 Laptop Lab TKJ (SIPLah)</span>
                    <span className="font-bold text-white">Rp 28.000.000 (Bruto)</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-[11px]">
                    <div>
                      <span className="text-purple-300/70">PPN 11%:</span>
                      <p className="font-bold text-purple-300">Rp 3.080.000</p>
                    </div>
                    <div>
                      <span className="text-purple-300/70">PPh 22 (WAPU):</span>
                      <p className="font-bold text-amber-400">Rp 420.000</p>
                    </div>
                    <div>
                      <span className="text-purple-300/70">Transfer Rekanan:</span>
                      <p className="font-bold text-emerald-400">Rp 24.500.000</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-white/10 flex items-center gap-2 text-xs font-medium text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>Terintegrasi langsung dengan format Buku Pembantu Pajak SPJ BOS</span>
              </div>
            </div>

            {/* Bento Card 2: PPh 21 Guru & Asesor UKK (5 Cols) */}
            <div className="lg:col-span-5 rounded-3xl bg-white/[0.04] hover:bg-white/[0.06] p-7 border border-white/10 hover:border-purple-500/30 shadow-xl backdrop-blur-md flex flex-col justify-between transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center border border-indigo-500/30">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-indigo-300 bg-indigo-400/15 px-2.5 py-0.5 rounded-full border border-indigo-400/30">
                    TER 2024 & GTT
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  PPh 21 Honor Guru & Asesor UKK
                </h3>
                <p className="text-xs sm:text-sm text-purple-200/80 mt-2 leading-relaxed">
                  Hitung pajak honorarium Guru Tidak Tetap (GTT), narasumber kurikulum merdeka, dan penguji Uji Kompetensi Keahlian (UKK) LSP tanpa kebingungan rumus manual.
                </p>

                <div className="mt-4 space-y-2">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                    <span className="text-purple-200">Penguji Eksternal LSP (Non-Pegawai)</span>
                    <span className="font-bold text-amber-400">Tarif Efektif 2.5%</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                    <span className="text-purple-200">Honor Bulanan GTT & Ekstrakurikuler</span>
                    <span className="font-bold text-emerald-400">Skema TER Terpadu</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-white/10 flex items-center gap-2 text-xs font-medium text-purple-200">
                <BadgeCheck className="w-4 h-4 shrink-0 text-amber-400" />
                <span>Bukti Potong BP-21 terbit otomatis berpenomoran sah</span>
              </div>
            </div>

            {/* Bento Card 3: e-Bupot Unifikasi (4 Cols) */}
            <div className="lg:col-span-4 rounded-3xl bg-white/[0.04] hover:bg-white/[0.06] p-7 border border-white/10 hover:border-purple-500/30 shadow-xl backdrop-blur-md flex flex-col justify-between transition-all">
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center mb-4 border border-indigo-500/30">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  e-Bupot & e-Faktur Instansi
                </h3>
                <p className="text-xs text-purple-200/80 mt-2 leading-relaxed">
                  Penerbitan bukti pemotongan unifikasi (BP-21 & BPPU 22/23) dengan validasi otomatis format NPWP 16-digit & NIK rekanan/instruktur.
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-white/10 text-xs font-medium text-amber-300 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-amber-400" />
                <span>Format siap ekspor ke SPT Unifikasi</span>
              </div>
            </div>

            {/* Bento Card 4: Billing Kas Negara & NTPN (4 Cols) */}
            <div className="lg:col-span-4 rounded-3xl bg-white/[0.04] hover:bg-white/[0.06] p-7 border border-white/10 hover:border-purple-500/30 shadow-xl backdrop-blur-md flex flex-col justify-between transition-all">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center mb-4 border border-amber-500/30">
                  <CreditCard className="w-5 h-5" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Billing Kas Negara & Bukti NTPN
                </h3>
                <p className="text-xs text-purple-200/80 mt-2 leading-relaxed">
                  Pantau masa aktif kode billing setoran pajak sekolah ke kas negara dan validasi Nomor Transaksi Penerimaan Negara (NTPN) dari bank persepsi.
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-white/10 text-xs font-medium text-amber-300 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-amber-400" />
                <span>Cegah denda keterlambatan penyetoran</span>
              </div>
            </div>

            {/* Bento Card 5: Konsep SPT & Buku Pembantu (4 Cols) */}
            <div className="lg:col-span-4 rounded-3xl bg-white/[0.04] hover:bg-white/[0.06] p-7 border border-white/10 hover:border-purple-500/30 shadow-xl backdrop-blur-md flex flex-col justify-between transition-all">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center mb-4 border border-emerald-500/30">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Konsep SPT Masa & SPJ BOS
                </h3>
                <p className="text-xs text-purple-200/80 mt-2 leading-relaxed">
                  Kompilasi otomatis dokumen belanja menjadi konsep SPT Masa Unifikasi bulanan serta pencetakan Buku Pembantu Pajak format dinas.
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-white/10 text-xs font-medium text-emerald-400 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Otorisasi berjenjang Kepala Sekolah</span>
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* ============================================================
          06. SIMULATOR PAJAK INTERAKTIF (Centerpiece Feature)
      ============================================================ */}
      <section className="py-20 bg-gradient-to-b from-transparent via-[#101229] to-transparent border-y border-white/10 relative" id="kalkulator">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
              Tax Rule Engine Simulator
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mt-3 tracking-tight">
              Uji Coba Perhitungan Pajak Sekolah Seketika.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-purple-200/80 leading-relaxed">
              Pilih contoh skenario riil belanja sekolah atau masukkan nilai transaksi Anda sendiri untuk melihat kalkulasi pajak terutang dan sisa transfer bersih ke rekanan.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Input Controller & Presets */}
            <div className="lg:col-span-6 rounded-3xl bg-white/[0.04] p-6 sm:p-7 border border-white/10 shadow-2xl backdrop-blur-md space-y-5">
              
              {/* Skenario Cepat */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-purple-200 block mb-2">
                  Pilih Contoh Kasus Transaksi Sekolah
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPreset("PPN", 28000000, true)}
                    className={`p-3 rounded-2xl text-left border transition-all ${
                      calcTaxType === "PPN" && calcGross === 28000000
                        ? "bg-purple-600/30 border-amber-400 shadow-md text-white"
                        : "bg-white/5 border-white/10 text-purple-200 hover:bg-white/10"
                    }`}
                  >
                    <p className="font-bold text-xs">Belanja Lab TKJ</p>
                    <p className="text-[10px] text-purple-300/70">SIPLah Rp 28 Juta</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPreset("PPH21", 4500000, true)}
                    className={`p-3 rounded-2xl text-left border transition-all ${
                      calcTaxType === "PPH21" && calcGross === 4500000
                        ? "bg-purple-600/30 border-amber-400 shadow-md text-white"
                        : "bg-white/5 border-white/10 text-purple-200 hover:bg-white/10"
                    }`}
                  >
                    <p className="font-bold text-xs">Honor Penguji UKK</p>
                    <p className="text-[10px] text-purple-300/70">Asesor Rp 4.5 Juta</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPreset("PPH23", 3500000, true)}
                    className={`p-3 rounded-2xl text-left border transition-all ${
                      calcTaxType === "PPH23" && calcGross === 3500000
                        ? "bg-purple-600/30 border-amber-400 shadow-md text-white"
                        : "bg-white/5 border-white/10 text-purple-200 hover:bg-white/10"
                    }`}
                  >
                    <p className="font-bold text-xs">Perbaikan Server</p>
                    <p className="text-[10px] text-purple-300/70">Jasa Rp 3.5 Juta</p>
                  </button>
                </div>
              </div>

              {/* Tax Type Buttons */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-purple-200 block mb-2">
                  Atau Pilih Jenis Pajak Manual
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: "PPN", label: "PPN (11%)", desc: "Barang / Jasa" },
                    { id: "PPH21", label: "PPh 21", desc: "Honor Guru / UKK" },
                    { id: "PPH22", label: "PPh 22 (1.5%)", desc: "BOS > Rp 2 Jt" },
                    { id: "PPH23", label: "PPh 23 (2%)", desc: "Jasa Teknik / Lab" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setCalcTaxType(t.id as TaxType)}
                      className={`p-2.5 rounded-xl text-left border transition-all ${
                        calcTaxType === t.id
                          ? "bg-amber-400 text-purple-950 font-black border-amber-300 shadow-lg"
                          : "bg-white/5 text-purple-200 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      <p className="text-xs font-bold leading-tight">{t.label}</p>
                      <p className={`text-[10px] mt-0.5 ${calcTaxType === t.id ? "text-purple-900" : "text-purple-300/60"}`}>
                        {t.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Gross Amount Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-white">
                    Nilai Bruto Transaksi (Rp)
                  </label>
                  <span className="text-[11px] font-mono font-bold text-amber-400">
                    {formatRupiah(calcGross)}
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-purple-300">Rp</span>
                  <input
                    type="number"
                    value={calcGross}
                    onChange={(e) => setCalcGross(Number(e.target.value))}
                    step={500000}
                    className="w-full pl-10 pr-4 py-2.5 text-sm font-bold text-white rounded-xl bg-black/40 border border-white/20 focus:outline-hidden focus:ring-2 focus:ring-amber-400 shadow-inner"
                  />
                </div>
              </div>

              {/* NPWP Status Checkbox */}
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="calcNpwp"
                  checked={calcHasNpwp}
                  onChange={(e) => setCalcHasNpwp(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded text-amber-400 focus:ring-amber-400 border-white/30 bg-black/40"
                />
                <label htmlFor="calcNpwp" className="text-xs text-purple-200 cursor-pointer select-none">
                  <span className="font-bold text-white block">Rekanan / Penerima memiliki NPWP / NIK Aktif</span>
                  <span className="text-purple-300/70 text-[11px]">
                    Jika tidak dicentang, tarif pemotongan dikenakan penyesuaian non-NPWP (surplus 20% s/d 100%).
                  </span>
                </label>
              </div>

            </div>

            {/* Right: Real-Time Calculation Output Receipt */}
            <div className="lg:col-span-6 rounded-3xl bg-white/[0.05] p-6 sm:p-7 border border-white/15 shadow-2xl backdrop-blur-xl space-y-5">
              
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs border border-emerald-500/30">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Rincian Perhitungan Pajak</h4>
                    <p className="text-[11px] text-purple-300">Kalkulasi Otomatis Tax Rule Engine PMK 59</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-amber-400/20 text-amber-300 font-mono text-[11px] font-bold border border-amber-400/30">
                  {liveCalculation.ruleCode}
                </span>
              </div>

              {/* Breakdown Rows */}
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-white/5 text-purple-200">
                  <span>Nilai Transaksi (Bruto):</span>
                  <span className="font-bold text-white">{formatRupiah(liveCalculation.grossAmount)}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-white/5 text-purple-200">
                  <span>Dasar Pengenaan Pajak (DPP):</span>
                  <span className="font-bold text-white">{formatRupiah(liveCalculation.taxBase)}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-white/5 text-purple-200">
                  <span>Tarif Pajak Efektif:</span>
                  <span className="font-bold text-amber-400">{liveCalculation.effectiveRate}%</span>
                </div>

                <div className="flex justify-between py-1 border-b border-white/5 text-purple-200">
                  <span>Pajak Dipotong / Dipungut:</span>
                  <span className="font-bold text-rose-400 text-sm">{formatRupiah(liveCalculation.taxAmount)}</span>
                </div>

                {liveCalculation.isExempt && (
                  <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300 text-[11px] font-medium border border-emerald-500/30">
                    {liveCalculation.exemptionReason}
                  </div>
                )}

                {/* Final Net Amount */}
                <div className="pt-3 border-t border-white/15 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">Sisa Bersih Dibayarkan ke Rekanan:</span>
                    <span className="text-[10px] text-purple-300/70">Jumlah dana yang keluar dari rekening kas BOS sekolah</span>
                  </div>
                  <div className="text-lg font-black text-emerald-400">
                    {formatRupiah(liveCalculation.netAmount)}
                  </div>
                </div>
              </div>

              {/* Regulatory Reference Box */}
              <div className="p-4 rounded-2xl bg-amber-400/10 border border-amber-400/25 text-[11px] text-amber-200 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-300">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Dasar Ketentuan Regulasi Resmi:</span>
                </div>
                <p className="leading-relaxed pl-5 text-amber-200/90">
                  {liveCalculation.legalNote}
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>


      {/* ============================================================
          07. PENGALAMAN SISTEM (Interactive Showcase Tabs)
      ============================================================ */}
      <section className="py-20 relative" id="pengalaman">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
              Antarmuka Asli
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mt-3 tracking-tight">
              Pengalaman Bekerja yang Terstruktur.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-purple-200/80 leading-relaxed">
              Jelajahi bagaimana modul-modul NatraTax menghubungkan pencatatan belanja kas sekolah langsung ke buku pembantu pajak dan draft SPT.
            </p>
          </div>

          {/* Connected Tabs */}
          <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
            {[
              { id: "dashboard", label: "1. Dashboard Eksekutif" },
              { id: "transaksi", label: "2. Transaksi & Klasifikasi" },
              { id: "spt", label: "3. Konsep SPT Unifikasi" },
              { id: "laporan", label: "4. SPJ & Buku Pembantu" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveShowcase(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeShowcase === tab.id
                    ? "bg-amber-400 text-purple-950 font-black shadow-lg"
                    : "bg-white/5 text-purple-200 hover:bg-white/10 border border-white/10"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Interactive Showcase Frame */}
          <div className="rounded-3xl border border-white/15 bg-white/[0.04] p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
            
            {activeShowcase === "dashboard" && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-2 mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-white">Dashboard Eksekutif Sekolah</h3>
                    <p className="text-xs text-purple-300">Monitoring real-time kondisi kepatuhan pajak seluruh mata anggaran sekolah.</p>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-300 bg-emerald-500/20 px-2.5 py-1 rounded-lg border border-emerald-500/30 self-start">
                    Sinkronisasi Otomatis Kas
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-black/30 p-4 rounded-2xl border border-white/10">
                    <span className="text-[11px] text-purple-300 font-medium">Buku Kas Pengeluaran BOS</span>
                    <div className="text-lg font-bold text-white mt-1">Rp 142.500.000</div>
                    <div className="text-[11px] text-purple-300/70 mt-1">Masa Anggaran 2026/Ganjil</div>
                  </div>
                  <div className="bg-black/30 p-4 rounded-2xl border border-white/10">
                    <span className="text-[11px] text-purple-300 font-medium">Setoran NTPN Terverifikasi</span>
                    <div className="text-lg font-bold text-emerald-400 mt-1">Rp 38.220.000</div>
                    <div className="text-[11px] text-emerald-300 mt-1">100% Sesuai Billing Bank</div>
                  </div>
                  <div className="bg-black/30 p-4 rounded-2xl border border-white/10">
                    <span className="text-[11px] text-purple-300 font-medium">Kewajiban Menunggu Pembayaran</span>
                    <div className="text-lg font-bold text-amber-400 mt-1">Rp 10.500.000</div>
                    <div className="text-[11px] text-amber-300 mt-1">3 Kode Billing Aktif</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-white/10 bg-black/20">
                  <h4 className="text-xs font-bold text-white mb-2">Timeline Kepatuhan & Jatuh Tempo</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-purple-200 font-medium">Penyetoran PPN Belanja Modal SIPLah Termin II</span>
                      <span className="font-bold text-amber-400">Jatuh Tempo: 10 Okt 2026</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-purple-200 font-medium">Pelaporan SPT Masa Unifikasi September 2026</span>
                      <span className="font-bold text-emerald-400">Konsep Siap Diverifikasi Kepsek</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeShowcase === "transaksi" && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-2 mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-white">Modul Transaksi & Klasifikasi Pajak</h3>
                    <p className="text-xs text-purple-300">Klasifikasi otomatis jenis belanja, nomor faktur rekanan, dan pemotongan.</p>
                  </div>
                  <span className="text-[11px] font-bold text-amber-300 bg-amber-400/20 px-2.5 py-1 rounded-lg border border-amber-400/30 self-start">
                    Tax Rule Applied
                  </span>
                </div>

                <div className="p-4 rounded-2xl border border-white/10 bg-black/20 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-purple-300/70 font-medium">Nomor Faktur / Referensi</span>
                      <p className="font-bold text-white font-mono mt-0.5">INV/SIPLah/2026/0942</p>
                    </div>
                    <div>
                      <span className="text-purple-300/70 font-medium">Mata Anggaran</span>
                      <p className="font-bold text-white mt-0.5">BOS Reguler — Sarpras TKJ</p>
                    </div>
                    <div>
                      <span className="text-purple-300/70 font-medium">Validasi Rekanan NPWP</span>
                      <p className="font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        Valid & Terdaftar PKP
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 bg-black/40 rounded-xl border border-white/10 text-xs">
                    <span className="text-purple-200 font-medium">Hasil Otomatisasi Perhitungan:</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                      <div>
                        <span className="text-[10px] text-purple-300/70">DPP (Dasar Pengenaan)</span>
                        <p className="font-bold text-white">Rp 28.000.000</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-purple-300/70">PPN 11%</span>
                        <p className="font-bold text-purple-300">Rp 3.080.000</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-purple-300/70">PPh 22 (1.5%)</span>
                        <p className="font-bold text-amber-400">Rp 420.000</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-purple-300/70">Total Net Dibayarkan</span>
                        <p className="font-bold text-emerald-400">Rp 24.500.000</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeShowcase === "spt" && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-2 mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-white">Konsep SPT Masa Unifikasi</h3>
                    <p className="text-xs text-purple-300">Penyusunan berkas pelaporan internal sebelum disahkan Kepala Sekolah.</p>
                  </div>
                  <span className="text-[11px] font-bold text-amber-300 bg-amber-400/20 px-2.5 py-1 rounded-lg border border-amber-400/30 self-start">
                    Status: Draft Siap Otorisasi
                  </span>
                </div>

                <div className="p-4 rounded-2xl border border-white/10 bg-black/20 space-y-4">
                  <div className="flex items-center justify-between text-xs pb-3 border-b border-white/10">
                    <div>
                      <span className="font-bold text-white">SPT Masa PPh Unifikasi & PPN Instansi Pemerintah</span>
                      <p className="text-[11px] text-purple-300">Masa Pajak: September 2026 • Tahun Pajak: 2026</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-md bg-white/10 text-purple-200 font-mono text-[11px] font-bold">
                      Form Induk v2.0
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-black/30 border border-white/10">
                      <span className="text-purple-300 font-medium">Bukti Potong e-Bupot</span>
                      <div className="text-base font-bold text-white mt-1">18 Dokumen</div>
                      <span className="text-[10px] text-purple-300/70">Honor Guru & Asesor UKK</span>
                    </div>
                    <div className="p-3 rounded-xl bg-black/30 border border-white/10">
                      <span className="text-purple-300 font-medium">Faktur Pajak PPN Masukan</span>
                      <div className="text-base font-bold text-white mt-1">8 Faktur Masukan</div>
                      <span className="text-[10px] text-purple-300/70">Belanja Modal SIPLah</span>
                    </div>
                    <div className="p-3 rounded-xl bg-black/30 border border-white/10">
                      <span className="text-purple-300 font-medium">Total Pajak Terutang</span>
                      <div className="text-base font-bold text-amber-400 mt-1">Rp 48.720.000</div>
                      <span className="text-[10px] text-emerald-400">Siap Cetak Formulir Konsep</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeShowcase === "laporan" && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-2 mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-white">SPJ BOS & Buku Pembantu Pajak</h3>
                    <p className="text-xs text-purple-300">Format cetak resmi untuk pertanggungjawaban dana BOS ke Dinas Pendidikan.</p>
                  </div>
                  <span className="text-[11px] font-bold text-purple-200 bg-white/10 px-2.5 py-1 rounded-lg border border-white/15 self-start">
                    Export Ready: PDF & Excel
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl border border-white/10 bg-black/30 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">Buku Pembantu Pajak BOS Triwulan III</p>
                      <p className="text-[11px] text-purple-300 mt-0.5">Sesuai Format Juknis Pengelolaan Dana BOS</p>
                    </div>
                    <span className="px-3 py-1.5 rounded-xl bg-amber-400 text-purple-950 font-bold flex items-center gap-1.5 shadow-md cursor-pointer">
                      <Download className="w-3.5 h-3.5" /> PDF
                    </span>
                  </div>
                  <div className="p-4 rounded-2xl border border-white/10 bg-black/30 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">Rekapitulasi Bukti Potong Guru & Asesor</p>
                      <p className="text-[11px] text-purple-300 mt-0.5">Lampiran Rincian Potongan PPh 21</p>
                    </div>
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-500 text-white font-bold flex items-center gap-1.5 shadow-md cursor-pointer">
                      <Download className="w-3.5 h-3.5" /> Excel
                    </span>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      </section>


      {/* ============================================================
          08. ALUR KERJA & HAK AKSES TERINTEGRASI (Unified Workflow)
      ============================================================ */}
      <section className="py-20 relative" id="alur-peran">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
              Tata Kelola Transparan
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mt-3 tracking-tight">
              Alur Kerja & Pembagian Wewenang Sekolah.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-purple-200/80 leading-relaxed">
              Setiap anggota tim keuangan sekolah memiliki wewenang yang tegas, mencegah kelalaian dan memastikan akuntabilitas saat pemeriksaan BOS.
            </p>
          </div>

          {/* 5-Stage Pipeline Bar */}
          <div className="mb-10 grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { num: "01", name: "Input Belanja", desc: "Kuitansi & SPK Pengadaan" },
              { num: "02", name: "Verifikasi Berkas", desc: "Pengecekan NPWP Rekanan" },
              { num: "03", name: "Hitung & Dokumen", desc: "e-Faktur & e-Bupot Terbit" },
              { num: "04", name: "Billing & NTPN", desc: "Setoran Kas Negara" },
              { num: "05", name: "Otorisasi & Lapor", desc: "Persetujuan Kepala Sekolah" },
            ].map((step, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 text-left backdrop-blur-md">
                <span className="font-mono text-xs font-bold text-amber-400">{step.num}</span>
                <p className="text-xs font-bold text-white mt-1">{step.name}</p>
                <p className="text-[11px] text-purple-300 mt-0.5">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* Role Switcher Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6">
            {[
              { id: "bendahara", label: "Bendahara Sekolah" },
              { id: "kepsek", label: "Kepala Sekolah" },
              { id: "admin", label: "Admin Pajak" },
              { id: "verifikator", label: "Verifikator SPI" },
              { id: "operator", label: "Operator BOS" },
              { id: "auditor", label: "Auditor Yayasan" },
            ].map((r) => (
              <button
                key={r.id}
                onClick={() => setActiveRole(r.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  activeRole === r.id
                    ? "bg-amber-400 text-purple-950 font-black border-amber-300 shadow-md"
                    : "bg-white/5 text-purple-200 border-white/10 hover:bg-white/10"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Active Role Card */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white/[0.04] border border-white/15 shadow-2xl backdrop-blur-xl">
            {activeRole === "bendahara" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <h3 className="text-sm font-bold text-white">Peran: Bendahara Sekolah (Akses Utama)</h3>
                  <span className="text-xs text-amber-300 font-bold bg-amber-400/20 px-2.5 py-0.5 rounded-md border border-amber-400/30">
                    Wewenang: Eksekusi Kas & Setoran Pajak
                  </span>
                </div>
                <p className="text-xs text-purple-200/80 leading-relaxed">
                  Mengelola transaksi pengeluaran kas belanja BOS, memvalidasi bukti potong, menerbitkan kode billing pajak ke bank persepsi, dan merekonsiliasi bukti transaksi dengan kas sekolah.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-medium text-white">
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-black/30 border border-white/10">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Input & Edit Belanja BOS</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-black/30 border border-white/10">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Rekam Kode Billing & NTPN</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-black/30 border border-white/10">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Cetak SPJ Buku Pembantu Pajak</span>
                  </div>
                </div>
              </div>
            )}

            {activeRole === "kepsek" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <h3 className="text-sm font-bold text-white">Peran: Kepala Sekolah</h3>
                  <span className="text-xs text-indigo-300 font-bold bg-indigo-500/20 px-2.5 py-0.5 rounded-md border border-indigo-500/30">
                    Wewenang: Otorisasi Akhir & Pengesahan
                  </span>
                </div>
                <p className="text-xs text-purple-200/80 leading-relaxed">
                  Memantau dasbor eksekutif seluruh anggaran dan kepatuhan pajak sekolah. Berwenang memberikan persetujuan (approval) akhir atas draf konsep SPT Masa Unifikasi sebelum dilaporkan.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-medium text-white">
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-black/30 border border-white/10">
                    <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>Akses Dasbor Eksekutif</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-black/30 border border-white/10">
                    <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>Otorisasi Akhir SPT Unifikasi</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-black/30 border border-white/10">
                    <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>Pratinjau SPJ Laporan BOS</span>
                  </div>
                </div>
              </div>
            )}

            {activeRole === "admin" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <h3 className="text-sm font-bold text-white">Peran: Admin Pajak Sekolah</h3>
                  <span className="text-xs text-purple-300 font-bold bg-purple-500/20 px-2.5 py-0.5 rounded-md border border-purple-500/30">
                    Wewenang: Spesialisasi e-Faktur & e-Bupot
                  </span>
                </div>
                <p className="text-xs text-purple-200/80 leading-relaxed">
                  Mengelola arsip faktur masukan rekanan, menerbitkan bukti potong honor guru/asesor UKK, dan mengompilasi konsep formulir SPT Masa bulanan.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-medium text-white">
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-black/30 border border-white/10">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Penerbitan Bukti Potong BP-21</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-black/30 border border-white/10">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Validasi NPWP 16-Digit Rekanan</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-black/30 border border-white/10">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Penyusunan Form Induk SPT</span>
                  </div>
                </div>
              </div>
            )}

            {activeRole === "verifikator" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <h3 className="text-sm font-bold text-white">Peran: Verifikator SPI (Satuan Pengawas Internal)</h3>
                  <span className="text-xs text-blue-300 font-bold bg-blue-500/20 px-2.5 py-0.5 rounded-md border border-blue-500/30">
                    Wewenang: Review Kepatuhan Belanja
                  </span>
                </div>
                <p className="text-xs text-purple-200/80 leading-relaxed">
                  Memeriksa kelengkapan berkas fisik dan digital kuitansi, Surat Perintah Kerja (SPK), dan validasi ambang batas sebelum disetujui untuk dibayarkan.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-medium text-white">
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-black/30 border border-white/10">
                    <Check className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Pengecekan Kesesuaian SPK & Kuitansi</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-black/30 border border-white/10">
                    <Check className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Pemberian Catatan Review Berkas</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-black/30 border border-white/10">
                    <Check className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Verifikasi Ambang Batas WAPU</span>
                  </div>
                </div>
              </div>
            )}

            {activeRole === "operator" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <h3 className="text-sm font-bold text-white">Peran: Operator Data BOS</h3>
                  <span className="text-xs text-slate-300 font-bold bg-white/10 px-2.5 py-0.5 rounded-md border border-white/15">
                    Wewenang: Digitalisasi & Input Data
                  </span>
                </div>
                <p className="text-xs text-purple-200/80 leading-relaxed">
                  Membantu proses entri data kuitansi harian belanja sekolah dan mengunggah scan lampiran bukti transaksi ke arsip dokumen digital.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-medium text-white">
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-black/30 border border-white/10">
                    <Check className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Input Rincian Kuitansi Belanja</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-black/30 border border-white/10">
                    <Check className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Unggah Berkas Scan Bukti Fisik</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-black/30 border border-white/10">
                    <Check className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Pencarian Cepat Arsip Faktur</span>
                  </div>
                </div>
              </div>
            )}

            {activeRole === "auditor" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <h3 className="text-sm font-bold text-white">Peran: Auditor Eksternal / Yayasan</h3>
                  <span className="text-xs text-amber-300 font-bold bg-amber-500/20 px-2.5 py-0.5 rounded-md border border-amber-500/30">
                    Wewenang: Read-Only Audit Access
                  </span>
                </div>
                <p className="text-xs text-purple-200/80 leading-relaxed">
                  Hak akses penelusuran read-only terhadap seluruh riwayat mutasi kas, jejak audit (audit log), dan rekonsiliasi tanpa risiko perubahan data secara sepihak.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-medium text-white">
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-black/30 border border-white/10">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Pemeriksaan Jejak Audit Tak Terhapus</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-black/30 border border-white/10">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Unduh Rekapitulasi SPJ Pajak BOS</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-black/30 border border-white/10">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Proteksi Bebas Manipulasi Data</span>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </section>


      {/* ============================================================
          09. KEAMANAN, AUDIT & KEPATUHAN (Trust Pillars)
      ============================================================ */}
      <section className="py-20 relative" id="keamanan">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
              Integritas & Akuntabilitas
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mt-3 tracking-tight">
              Keamanan Data & Kepatuhan Pemeriksaan BPK.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-purple-200/80 leading-relaxed">
              Membangun tata kelola keuangan sekolah yang transparan, terproteksi, dan selaras dengan prinsip pemeriksaan hukum instansi pemerintah.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-3xl bg-white/[0.04] border border-white/10 shadow-xl backdrop-blur-md">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center mb-4 border border-purple-500/30">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Pemisahan Hak Akses (RBAC)</h3>
              <p className="text-xs text-purple-200/80 mt-2 leading-relaxed">
                Pembagian wewenang yang tegas antara staf tata usaha pengentri data, bendahara pengelola kas, verifikator kepatuhan, dan kepala sekolah sebagai pengesah.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white/[0.04] border border-white/10 shadow-xl backdrop-blur-md">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center mb-4 border border-indigo-500/30">
                <History className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Audit Trail Tak Terhapus</h3>
              <p className="text-xs text-purple-200/80 mt-2 leading-relaxed">
                Setiap perubahan transaksi, persetujuan SPT, dan rekam billing tersimpan dalam log audit kronologis yang tidak dapat dimanipulasi.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white/[0.04] border border-white/10 shadow-xl backdrop-blur-md">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center mb-4 border border-amber-500/30">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Kepatuhan Mandiri Sekolah</h3>
              <p className="text-xs text-purple-200/80 mt-2 leading-relaxed">
                NatraTax beroperasi sebagai sistem administrasi internal sekolah tanpa scraper tidak resmi, memastikan data aman dan siap diverifikasi bendahara.
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* ============================================================
          10. TANYA JAWAB (FAQ)
      ============================================================ */}
      <section className="py-20 bg-gradient-to-b from-transparent via-[#0F1227] to-transparent border-y border-white/10" id="faq">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
              Pertanyaan Umum
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mt-3 tracking-tight">
              Pertanyaan yang Sering Diajukan
            </h2>
            <p className="mt-3 text-sm text-purple-200/80">
              Penjelasan mengenai operasional, fungsi, dan batasan penggunaan platform NatraTax di lingkungan sekolah.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "Apa fungsi utama platform NatraTax di sekolah?",
                a: "NatraTax adalah sistem administrasi internal sekolah untuk merapikan seluruh tata kelola transaksi belanja BOS/SIPLah, perhitungan otomatis PPN 11% & PPh 22, bukti potong PPh 21 honor guru/UKK, pencatatan kode billing NTPN, serta penyusunan konsep SPT Masa Unifikasi bulanan."
              },
              {
                q: "Apakah NatraTax menggantikan portal resmi DJP / Coretax?",
                a: "Tidak. NatraTax merupakan platform administrasi dan rekonsiliasi internal sekolah. Pelaporan resmi dan pembayaran kas negara tetap mengikuti kanal resmi pemerintah. NatraTax memastikan seluruh data sekolah rapi, akurat, dan lengkap sebelum diajukan ke saluran resmi."
              },
              {
                q: "Bagaimana cara kerja perhitungan PPh 22 belanja BOS?",
                a: "Sistem menerapkan Tax Rule Engine otomatis. Untuk belanja barang bersumber dana BOS/pemerintah di bawah Rp 2.000.000, pemungutan PPh 22 dibebaskan. Untuk nilai belanja di atas Rp 2.000.000 (tidak termasuk PPN), PPh 22 dipungut sebesar 1.5%."
              },
              {
                q: "Bagaimana dengan perhitungan PPh 21 guru dan penguji UKK?",
                a: "NatraTax mengakomodasi ketentuan Tarif Efektif Rata-Rata (TER) serta skema bukan pegawai berkesinambungan/tidak (5% x 50% DPP = 2.5% efektif) bagi narasumber eksternal dan asesor Uji Kompetensi Keahlian (UKK) kejuruan."
              },
              {
                q: "Apakah laporan SPJ format buku pembantu pajak dapat dicetak?",
                a: "Ya. Data transaksi dan potongan pajak dapat langsung diekspor menjadi format Buku Pembantu Pajak SPJ BOS resmi yang siap disertakan dalam laporan pertanggungjawaban ke Dinas Pendidikan atau Inspektorat."
              },
              {
                q: "Siapa saja yang memiliki hak akses di dalam sistem?",
                a: "Sistem memiliki 6 peran (RBAC): Kepala Sekolah (otorisasi akhir), Bendahara Sekolah (pengelola kas & billing), Admin Pajak (e-Faktur & e-Bupot), Verifikator SPI (pemeriksa kepatuhan), Operator (entry kuitansi), dan Auditor Yayasan (akses baca-saja)."
              }
            ].map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-white/10 bg-white/[0.04] overflow-hidden transition-all shadow-md backdrop-blur-md"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-5 py-4 text-left font-bold text-sm text-white flex items-center justify-between gap-4 hover:bg-white/5 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-amber-400 shrink-0 transition-transform duration-200 ${
                      openFaq === idx ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-purple-200/90 leading-relaxed border-t border-white/5 bg-black/20">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* ============================================================
          11. FINAL GRAND TRUST CTA BANNER (High-Converting & Authoritative)
      ============================================================ */}
      <section className="py-20 relative overflow-hidden bg-gradient-to-r from-indigo-950 via-purple-900 to-indigo-950 border-t border-purple-500/30">
        
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/40 border border-white/15 text-amber-300 text-xs font-semibold mb-6 backdrop-blur-md">
            <Building2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Satuan Pendidikan Resmi: SMK BINA PUTRA JAKARTA</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
            Wujudkan Administrasi Pajak Sekolah yang Lebih Tertata & Terpercaya.
          </h2>

          <p className="mt-4 text-base sm:text-lg text-purple-100/90 max-w-2xl mx-auto leading-relaxed">
            Satukan pencatatan belanja kas BOS, penerbitan bukti potong guru & rekanan, pemantauan billing NTPN, dan pelaporan SPJ dalam satu portal terpadu.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="w-full sm:w-auto px-9 py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-purple-950 text-sm font-black shadow-xl shadow-amber-500/20 hover:shadow-amber-500/30 transition-all flex items-center justify-center gap-2.5"
            >
              <span>Masuk ke Sistem NatraTax</span>
              <ArrowRight className="w-4 h-4 text-purple-950" />
            </Link>

            <a
              href="#kalkulator"
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white/10 border border-white/20 hover:bg-white/15 text-white text-sm font-bold backdrop-blur-md transition-all flex items-center justify-center gap-2"
            >
              <span>Coba Simulasi Pajak</span>
            </a>
          </div>

          <p className="mt-6 text-xs text-purple-300/60 font-mono">
            Sistem Administrasi Pajak & Rekonsiliasi Finansial Internal Satuan Pendidikan • v1.2 Clean
          </p>

        </div>
      </section>


      {/* ============================================================
          12. FOOTER (Clean, Institutional, Informative)
      ============================================================ */}
      <footer className="bg-[#070914] text-slate-400 text-xs border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
            
            {/* Brand Descriptor */}
            <div className="col-span-2 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-white p-0.5 shadow-md ring-2 ring-amber-400 shrink-0 overflow-hidden flex items-center justify-center">
                  <Image
                    src="/images/logo-smk.png"
                    alt="Logo SMK Bina Putra Jakarta"
                    width={36}
                    height={36}
                    className="w-full h-full object-contain rounded-full"
                  />
                </div>
                <span className="font-extrabold text-lg text-white tracking-tight">
                  Natra<span className="text-amber-400">Tax</span>
                </span>
              </div>
              <p className="text-purple-200/70 max-w-sm leading-relaxed text-xs">
                Sistem Informasi Administrasi Perpajakan & Rekonsiliasi Finansial Satuan Pendidikan SMK BINA PUTRA JAKARTA.
              </p>
              <div className="text-[11px] text-purple-300/50">
                Dikelola oleh: Laboratorium Akuntansi Keuangan & Perpajakan SMK Bina Putra
              </div>
            </div>

            {/* Col 1 */}
            <div className="space-y-3">
              <h4 className="text-white font-bold uppercase tracking-wider text-[11px]">Modul Sistem</h4>
              <ul className="space-y-2 text-purple-200/80">
                <li><Link href="/dashboard" className="hover:text-amber-400 transition-colors">Portal Utama</Link></li>
                <li><Link href="/invoices" className="hover:text-amber-400 transition-colors">Transaksi & e-Faktur</Link></li>
                <li><Link href="/bupot" className="hover:text-amber-400 transition-colors">e-Bupot Guru & UKK</Link></li>
                <li><Link href="/spt" className="hover:text-amber-400 transition-colors">Konsep SPT Unifikasi</Link></li>
                <li><Link href="/ledger" className="hover:text-amber-400 transition-colors">Buku Besar Kas</Link></li>
              </ul>
            </div>

            {/* Col 2 */}
            <div className="space-y-3">
              <h4 className="text-white font-bold uppercase tracking-wider text-[11px]">Fitur Kunci</h4>
              <ul className="space-y-2 text-purple-200/80">
                <li><a href="#fitur" className="hover:text-amber-400 transition-colors">Pajak Belanja BOS</a></li>
                <li><a href="#fitur" className="hover:text-amber-400 transition-colors">PPh 21 Guru & GTT</a></li>
                <li><a href="#kalkulator" className="hover:text-amber-400 transition-colors">Tax Rule Simulator</a></li>
                <li><a href="#alur-peran" className="hover:text-amber-400 transition-colors">Otorisasi Kepsek</a></li>
              </ul>
            </div>

            {/* Col 3 */}
            <div className="space-y-3">
              <h4 className="text-white font-bold uppercase tracking-wider text-[11px]">Kepatuhan</h4>
              <ul className="space-y-2 text-purple-200/80">
                <li><a href="#keamanan" className="hover:text-amber-400 transition-colors">Jejak Audit Trail</a></li>
                <li><a href="#keamanan" className="hover:text-amber-400 transition-colors">Hak Akses RBAC</a></li>
                <li><a href="#faq" className="hover:text-amber-400 transition-colors">Pertanyaan Umum (FAQ)</a></li>
              </ul>
            </div>

          </div>

          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-purple-300/60">
            <p>© 2026 NatraTax • SMK BINA PUTRA JAKARTA. Seluruh hak cipta dilindungi.</p>
            <p className="font-medium text-amber-300/80">
              Sistem Administrasi Internal Sekolah — Standar Kepatuhan PMK 59/PMK.03/2022
            </p>
          </div>

        </div>
      </footer>

    </div>
  );
}
