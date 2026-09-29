"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  LayoutDashboard,
  FileText,
  FileCheck2,
  CreditCard,
  Calculator,
  BookOpen,
  ClipboardList,
  FolderOpen,
  Activity,
  BarChart3,
  Shield,
  Lock,
  Users,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  ArrowUpRight,
  CheckCircle2,
  Database,
  Eye,
  Download,
} from "lucide-react";
import { TaxCalculationService } from "@/lib/tax-engine";
import { formatRupiah } from "@/lib/utils";
import { TaxType } from "@/types";

/* ──────────────────────────────────────────────
   Intersection Observer hook for fade-in
   ────────────────────────────────────────────── */
function useInView(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.15, ...options }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [options]);
  return { ref, inView };
}

function FadeIn({ children, className = "", delay = 0 }: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ──────────────────────────────────────────────
   Main Landing Page
   ────────────────────────────────────────────── */
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ── Tax Simulator ── */
  const [calcTaxType, setCalcTaxType] = useState<TaxType>("PPN");
  const [calcGross, setCalcGross] = useState<number>(28000000);
  const [calcHasNpwp, setCalcHasNpwp] = useState<boolean>(true);

  const liveCalc = TaxCalculationService.calculate({
    taxType: calcTaxType,
    grossAmount: calcGross || 0,
    hasNpwp: calcHasNpwp,
    isGovernmentTreasury: true,
  });

  /* ── FAQ ── */
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const faqs = [
    {
      q: "Apa itu NatraTax?",
      a: "NatraTax adalah sistem administrasi pajak dan keuangan sekolah yang mengelola transaksi, dokumen, pembayaran, dan pelaporan dalam satu platform terpadu.",
    },
    {
      q: "Siapa yang dapat menggunakan NatraTax?",
      a: "NatraTax dirancang untuk bendahara, kepala sekolah, admin pajak, verifikator, operator, dan auditor di lingkungan satuan pendidikan.",
    },
    {
      q: "Apakah NatraTax mengikuti regulasi perpajakan terbaru?",
      a: "Ya. NatraTax menerapkan aturan PMK 59/PMK.03/2022, skema TER PPh 21, dan threshold PPh 22 BOS sesuai ketentuan DJP.",
    },
    {
      q: "Bagaimana keamanan data di NatraTax?",
      a: "NatraTax menggunakan autentikasi aman, RBAC multi-peran, audit trail menyeluruh, dan enkripsi data untuk menjaga kerahasiaan informasi sekolah.",
    },
  ];

  const navLinks = [
    { label: "Produk", href: "#produk" },
    { label: "Fitur", href: "#fitur" },
    { label: "Cara Kerja", href: "#cara-kerja" },
    { label: "Keamanan", href: "#keamanan" },
    { label: "FAQ", href: "#faq" },
  ];

  const features = [
    { icon: LayoutDashboard, title: "Dashboard", desc: "Monitor seluruh aktivitas dalam satu tampilan." },
    { icon: ClipboardList, title: "Transaksi", desc: "Kelola transaksi secara terstruktur." },
    { icon: FileText, title: "e-Faktur", desc: "Kelola pajak keluaran dan masukan." },
    { icon: FileCheck2, title: "e-Bupot", desc: "Kelola bukti potong dan dokumen." },
    { icon: BarChart3, title: "SPT", desc: "Pantau proses dan status SPT." },
    { icon: CreditCard, title: "Pembayaran", desc: "Pantau pembayaran dan jatuh tempo." },
    { icon: BookOpen, title: "Buku Besar", desc: "Pantau jurnal dan rekonsiliasi." },
    { icon: Download, title: "Laporan", desc: "Buat laporan dengan cepat." },
    { icon: FolderOpen, title: "Dokumen", desc: "Simpan dokumen dengan terorganisir." },
    { icon: Activity, title: "Audit Trail", desc: "Lacak seluruh aktivitas pengguna." },
  ];

  const workflowSteps = [
    { label: "Transaksi", icon: ClipboardList },
    { label: "Verifikasi", icon: CheckCircle2 },
    { label: "Pajak", icon: Calculator },
    { label: "Dokumen", icon: FileText },
    { label: "Pembayaran", icon: CreditCard },
    { label: "Laporan", icon: BarChart3 },
  ];

  const securityItems = [
    { icon: Users, title: "RBAC", desc: "Hak akses berbasis peran." },
    { icon: Activity, title: "Audit Trail", desc: "Riwayat lengkap aktivitas." },
    { icon: Lock, title: "Autentikasi Aman", desc: "Login terproteksi." },
    { icon: Eye, title: "Akses Dokumen", desc: "Kontrol visibilitas data." },
    { icon: Database, title: "Backup", desc: "Perlindungan data berkala." },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased selection:bg-indigo-100 selection:text-indigo-900">

      {/* ═══════════════════════════════════════════
          01. NAVBAR
          ═══════════════════════════════════════════ */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-sm"
            : "bg-white border-b border-transparent"
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <div className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-slate-200 bg-white flex items-center justify-center shrink-0">
                <Image
                  src="/images/logo-smk.png"
                  alt="NatraTax"
                  width={32}
                  height={32}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>
              <span className="font-bold text-lg tracking-tight text-brand-950">
                Natra<span className="text-amber-500">Tax</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="px-3.5 py-2 text-[13px] font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  {l.label}
                </a>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/login"
                className="text-[13px] font-medium text-slate-600 hover:text-slate-900 px-3.5 py-2 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Masuk
              </Link>
              <Link
                href="/login"
                className="text-[13px] font-semibold text-white bg-brand-950 hover:bg-brand-900 px-4 py-2 rounded-lg transition-colors shadow-sm"
              >
                Buka NatraTax
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-600"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white">
            <div className="px-5 py-4 space-y-1">
              {navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  {l.label}
                </a>
              ))}
              <div className="pt-3 mt-3 border-t border-slate-100 space-y-2">
                <Link
                  href="/login"
                  className="block w-full text-center px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  href="/login"
                  className="block w-full text-center px-4 py-2.5 text-sm font-semibold text-white bg-brand-950 hover:bg-brand-900 rounded-lg transition-colors shadow-sm"
                >
                  Buka NatraTax
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ═══════════════════════════════════════════
          02. HERO
          ═══════════════════════════════════════════ */}
      <section className="pt-16 sm:pt-20 pb-8 sm:pb-12">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <p className="text-[13px] font-semibold text-brand-600 tracking-wide uppercase mb-4">
              NatraTax &middot; School Tax Administration
            </p>
          </FadeIn>
          <FadeIn delay={80}>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold tracking-tight text-slate-900 leading-[1.15] max-w-3xl mx-auto">
              Administrasi Pajak Sekolah,{" "}
              <span className="text-brand-700">Lebih Tertata.</span>
            </h1>
          </FadeIn>
          <FadeIn delay={160}>
            <p className="mt-5 text-base sm:text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
              Kelola transaksi, dokumen, pembayaran, dan pelaporan dalam satu sistem.
            </p>
          </FadeIn>
          <FadeIn delay={240}>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-brand-950 hover:bg-brand-900 rounded-xl transition-colors shadow-sm"
              >
                Buka NatraTax
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#fitur"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Lihat Fitur
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          03. HERO PRODUCT PREVIEW
          ═══════════════════════════════════════════ */}
      <section className="pb-16 sm:pb-24" id="produk">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="rounded-2xl border border-slate-200/80 shadow-hero-window bg-white overflow-hidden">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border-b border-slate-200/80">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
                </div>
                <div className="flex-1 ml-3">
                  <div className="max-w-sm mx-auto bg-white border border-slate-200 rounded-md px-3 py-1 text-[11px] text-slate-400 text-center truncate">
                    natratax.vercel.app/dashboard
                  </div>
                </div>
              </div>
              {/* App mockup */}
              <div className="flex min-h-[420px] sm:min-h-[520px] lg:min-h-[560px]">
                {/* Sidebar */}
                <div className="hidden md:flex flex-col w-56 lg:w-60 bg-brand-950 text-white/90 p-4 shrink-0">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
                      <Image
                        src="/images/logo-smk.png"
                        alt="Logo"
                        width={28}
                        height={28}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="text-sm font-bold tracking-tight">
                      Natra<span className="text-amber-400">Tax</span>
                    </span>
                  </div>
                  {[
                    { icon: LayoutDashboard, label: "Dashboard", active: true },
                    { icon: ClipboardList, label: "Transaksi", active: false },
                    { icon: FileText, label: "e-Faktur", active: false },
                    { icon: FileCheck2, label: "e-Bupot", active: false },
                    { icon: BarChart3, label: "SPT", active: false },
                    { icon: CreditCard, label: "Pembayaran", active: false },
                    { icon: BookOpen, label: "Buku Besar", active: false },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium mb-0.5 ${
                        item.active
                          ? "bg-white/10 text-white"
                          : "text-white/50 hover:text-white/70"
                      }`}
                    >
                      <item.icon className="w-4 h-4 shrink-0" />
                      {item.label}
                    </div>
                  ))}
                </div>

                {/* Main content area */}
                <div className="flex-1 bg-slate-50/60 p-4 sm:p-6 overflow-hidden">
                  {/* Top bar */}
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wide">September 2026</p>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900">Dashboard</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="hidden sm:inline text-[11px] px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                        Tertib / Nihil
                      </span>
                    </div>
                  </div>

                  {/* Metric cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
                    {[
                      { label: "Total Pajak", value: "Rp 0", sub: "Keluaran & Masukan", color: "text-brand-700" },
                      { label: "Total Transaksi", value: "0", sub: "Tercatat", color: "text-slate-900" },
                      { label: "Pembayaran", value: "Rp 0", sub: "NTPN Tervalidasi", color: "text-emerald-700" },
                      { label: "SPT", value: "0", sub: "Draft / Disetujui", color: "text-amber-700" },
                    ].map((card) => (
                      <div key={card.label} className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-subtle">
                        <p className="text-[11px] text-slate-400 font-medium">{card.label}</p>
                        <p className={`text-lg sm:text-xl font-bold mt-1 ${card.color}`}>{card.value}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{card.sub}</p>
                      </div>
                    ))}
                  </div>

                  {/* Chart placeholder + Recent */}
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
                    <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200/80 p-4 shadow-subtle">
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-xs font-semibold text-slate-700">Komposisi Objek Pajak</p>
                        <span className="text-[10px] text-slate-400">September 2026</span>
                      </div>
                      {/* Simple bar chart mockup */}
                      <div className="flex items-end gap-2.5 h-24 sm:h-32">
                        {[40, 65, 30, 80, 55, 45, 70, 35, 60, 50, 75, 42].map((h, i) => (
                          <div
                            key={i}
                            className="flex-1 bg-brand-100 rounded-t-sm hover:bg-brand-200 transition-colors"
                            style={{ height: `${h}%` }}
                          />
                        ))}
                      </div>
                      <div className="flex justify-between mt-2">
                        <span className="text-[9px] text-slate-300">Jan</span>
                        <span className="text-[9px] text-slate-300">Dec</span>
                      </div>
                    </div>

                    <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 p-4 shadow-subtle">
                      <p className="text-xs font-semibold text-slate-700 mb-3">Transaksi Terbaru</p>
                      <div className="space-y-2.5">
                        {[
                          { name: "Belanja ATK BOS", type: "PPh 22", amt: "Rp 3.200.000" },
                          { name: "Honor GTT Semester", type: "PPh 21", amt: "Rp 8.500.000" },
                          { name: "Sewa Lab Komputer", type: "PPh 4(2)", amt: "Rp 15.000.000" },
                        ].map((tx) => (
                          <div key={tx.name} className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0">
                            <div>
                              <p className="text-[12px] font-medium text-slate-700">{tx.name}</p>
                              <p className="text-[10px] text-slate-400">{tx.type}</p>
                            </div>
                            <span className="text-[11px] font-semibold text-slate-600">{tx.amt}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          04. FEATURES
          ═══════════════════════════════════════════ */}
      <section className="py-20 sm:py-24 bg-slate-50/70" id="fitur">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-14">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                Semua Fitur dalam Satu Sistem.
              </h2>
            </div>
          </FadeIn>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {features.map((f, i) => (
              <FadeIn key={f.title} delay={i * 50}>
                <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-subtle hover:shadow-card transition-shadow group">
                  <div className="w-9 h-9 rounded-lg bg-brand-50 flex items-center justify-center mb-3 group-hover:bg-brand-100 transition-colors">
                    <f.icon className="w-4.5 h-4.5 text-brand-600" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-1">{f.title}</h3>
                  <p className="text-[12px] text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          05. PRODUCT SHOWCASE
          ═══════════════════════════════════════════ */}
      <section className="py-20 sm:py-24">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-14">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                Dirancang untuk Pekerjaan Nyata.
              </h2>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                num: "01",
                title: "Dashboard",
                desc: "Pantau ringkasan pajak, transaksi, dan status pembayaran.",
                cards: [
                  { label: "Total Pajak Keluaran", val: "Rp 0", accent: "text-brand-700" },
                  { label: "Pajak Dipotong", val: "0 Bukti Potong", accent: "text-slate-700" },
                  { label: "Jatuh Tempo", val: "Tertib / Nihil", accent: "text-emerald-700" },
                ],
              },
              {
                num: "02",
                title: "Transaksi & Dokumen",
                desc: "Kelola faktur, bukti potong, dan dokumen pendukung.",
                cards: [
                  { label: "Faktur Masukan", val: "e-Faktur BOS", accent: "text-brand-700" },
                  { label: "Bukti Potong", val: "PPh 21, 22, 23", accent: "text-slate-700" },
                  { label: "Dokumen", val: "Terorganisir", accent: "text-emerald-700" },
                ],
              },
              {
                num: "03",
                title: "SPT & Laporan",
                desc: "Susun SPT masa dan buat laporan rekonsiliasi.",
                cards: [
                  { label: "SPT Unifikasi", val: "Draft & Final", accent: "text-brand-700" },
                  { label: "Rekonsiliasi", val: "Buku Besar Kas", accent: "text-slate-700" },
                  { label: "Laporan", val: "Unduh & Cetak", accent: "text-emerald-700" },
                ],
              },
            ].map((item, i) => (
              <FadeIn key={item.num} delay={i * 100}>
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle overflow-hidden hover:shadow-card transition-shadow h-full flex flex-col">
                  <div className="p-6 pb-4">
                    <span className="text-[11px] font-bold text-brand-500 tracking-wide">{item.num}</span>
                    <h3 className="text-base font-bold text-slate-900 mt-1">{item.title}</h3>
                    <p className="text-[13px] text-slate-500 mt-1">{item.desc}</p>
                  </div>
                  <div className="px-6 pb-6 space-y-2 flex-1">
                    {item.cards.map((c) => (
                      <div
                        key={c.label}
                        className="flex items-center justify-between py-2.5 px-3.5 bg-slate-50 rounded-lg border border-slate-100"
                      >
                        <span className="text-[12px] text-slate-500">{c.label}</span>
                        <span className={`text-[12px] font-semibold ${c.accent}`}>{c.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          06. WORKFLOW
          ═══════════════════════════════════════════ */}
      <section className="py-20 sm:py-24 bg-slate-50/70" id="cara-kerja">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-14">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                Alur Sederhana.
              </h2>
            </div>
          </FadeIn>

          {/* Desktop: horizontal */}
          <FadeIn>
            <div className="hidden sm:flex items-center justify-center gap-0">
              {workflowSteps.map((step, i) => (
                <React.Fragment key={step.label}>
                  <div className="flex flex-col items-center gap-2.5 px-4 sm:px-6">
                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 shadow-subtle flex items-center justify-center">
                      <step.icon className="w-5 h-5 text-brand-600" />
                    </div>
                    <span className="text-[12px] font-semibold text-slate-700">{step.label}</span>
                  </div>
                  {i < workflowSteps.length - 1 && (
                    <ChevronRight className="w-4 h-4 text-slate-300 shrink-0 -mx-1" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </FadeIn>

          {/* Mobile: vertical */}
          <FadeIn>
            <div className="sm:hidden space-y-0">
              {workflowSteps.map((step, i) => (
                <div key={step.label} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 shadow-subtle flex items-center justify-center shrink-0">
                      <step.icon className="w-4 h-4 text-brand-600" />
                    </div>
                    {i < workflowSteps.length - 1 && (
                      <div className="w-px h-6 bg-slate-200 my-1" />
                    )}
                  </div>
                  <span className="text-sm font-semibold text-slate-700 pt-2.5">{step.label}</span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          07. SECURITY
          ═══════════════════════════════════════════ */}
      <section className="py-20 sm:py-24" id="keamanan">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-14">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                Akses Terukur. Data Terjaga.
              </h2>
            </div>
          </FadeIn>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {securityItems.map((s, i) => (
              <FadeIn key={s.title} delay={i * 60}>
                <div className="text-center p-5">
                  <div className="w-11 h-11 rounded-xl bg-brand-50 flex items-center justify-center mx-auto mb-3">
                    <s.icon className="w-5 h-5 text-brand-600" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-0.5">{s.title}</h3>
                  <p className="text-[12px] text-slate-500">{s.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          08. TAX SIMULATOR
          ═══════════════════════════════════════════ */}
      <section className="py-20 sm:py-24 bg-slate-50/70" id="simulasi">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                Simulasi Pajak
              </h2>
            </div>
          </FadeIn>

          <FadeIn delay={100}>
            <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200/80 shadow-subtle p-6 sm:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {/* Nilai Transaksi */}
                <div>
                  <label className="text-[12px] font-semibold text-slate-600 block mb-1.5">
                    Nilai Transaksi
                  </label>
                  <input
                    type="number"
                    value={calcGross}
                    onChange={(e) => setCalcGross(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all"
                    placeholder="0"
                  />
                </div>

                {/* Jenis Pajak */}
                <div>
                  <label className="text-[12px] font-semibold text-slate-600 block mb-1.5">
                    Jenis Pajak
                  </label>
                  <select
                    value={calcTaxType}
                    onChange={(e) => setCalcTaxType(e.target.value as TaxType)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all appearance-none cursor-pointer"
                  >
                    <option value="PPN">PPN 11%</option>
                    <option value="PPH21">PPh 21</option>
                    <option value="PPH22">PPh 22 BOS</option>
                    <option value="PPH23">PPh 23</option>
                    <option value="PPH4_2">PPh Final 4(2)</option>
                  </select>
                </div>

                {/* NPWP */}
                <div>
                  <label className="text-[12px] font-semibold text-slate-600 block mb-1.5">
                    Status NPWP
                  </label>
                  <select
                    value={calcHasNpwp ? "yes" : "no"}
                    onChange={(e) => setCalcHasNpwp(e.target.value === "yes")}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all appearance-none cursor-pointer"
                  >
                    <option value="yes">Memiliki NPWP</option>
                    <option value="no">Tanpa NPWP</option>
                  </select>
                </div>
              </div>

              {/* Results */}
              <div className="bg-slate-50 rounded-xl border border-slate-100 p-4 sm:p-5">
                {liveCalc.isExempt ? (
                  <div className="text-center py-2">
                    <p className="text-sm font-semibold text-emerald-700">Dikecualikan</p>
                    <p className="text-[12px] text-slate-500 mt-1">{liveCalc.exemptionReason}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-[11px] text-slate-400 font-medium">Dasar Pengenaan</p>
                      <p className="text-sm sm:text-base font-bold text-slate-900 mt-1">
                        {formatRupiah(liveCalc.taxBase)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400 font-medium">Estimasi Pajak</p>
                      <p className="text-sm sm:text-base font-bold text-brand-700 mt-1">
                        {formatRupiah(liveCalc.taxAmount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400 font-medium">Total</p>
                      <p className="text-sm sm:text-base font-bold text-slate-900 mt-1">
                        {formatRupiah(liveCalc.netAmount)}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <p className="text-[11px] text-slate-400 text-center mt-4">
                Simulasi untuk keperluan informasi. Bukan pengganti konsultasi perpajakan resmi.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          09. FAQ
          ═══════════════════════════════════════════ */}
      <section className="py-20 sm:py-24" id="faq">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-14">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                Pertanyaan Umum
              </h2>
            </div>
          </FadeIn>

          <div className="max-w-2xl mx-auto space-y-2">
            {faqs.map((faq, i) => (
              <FadeIn key={i} delay={i * 60}>
                <div className="border border-slate-200/80 rounded-xl overflow-hidden bg-white">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50/50 transition-colors"
                  >
                    <span className="text-sm font-semibold text-slate-900 pr-4">{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                        openFaq === i ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-4 -mt-1">
                      <p className="text-[13px] text-slate-500 leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          10. FINAL CTA
          ═══════════════════════════════════════════ */}
      <section className="py-20 sm:py-24 bg-brand-950">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-snug max-w-lg mx-auto">
              Kelola Administrasi Pajak dengan Lebih Tertata.
            </h2>
          </FadeIn>
          <FadeIn delay={100}>
            <div className="mt-8">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold text-brand-950 bg-white hover:bg-slate-100 rounded-xl transition-colors shadow-sm"
              >
                Buka NatraTax
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          11. FOOTER
          ═══════════════════════════════════════════ */}
      <footer className="py-12 border-t border-slate-100 bg-white">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-8">
            {/* Brand */}
            <div className="text-center sm:text-left">
              <div className="flex items-center gap-2.5 justify-center sm:justify-start">
                <div className="w-7 h-7 rounded-full overflow-hidden ring-1 ring-slate-200 bg-white flex items-center justify-center shrink-0">
                  <Image
                    src="/images/logo-smk.png"
                    alt="NatraTax"
                    width={28}
                    height={28}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="font-bold text-base tracking-tight text-slate-900">
                  Natra<span className="text-amber-500">Tax</span>
                </span>
              </div>
              <p className="text-[12px] text-slate-400 mt-2 max-w-xs">
                School Tax & Financial Administration System
              </p>
            </div>

            {/* Links */}
            <div className="flex items-center gap-6 text-[13px] font-medium text-slate-500">
              <a href="#produk" className="hover:text-slate-900 transition-colors">Produk</a>
              <a href="#fitur" className="hover:text-slate-900 transition-colors">Fitur</a>
              <a href="#keamanan" className="hover:text-slate-900 transition-colors">Keamanan</a>
              <a href="#faq" className="hover:text-slate-900 transition-colors">FAQ</a>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
            <p>© 2026 NatraTax</p>
            <p className="font-medium">SMK Bina Putra Jakarta</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
