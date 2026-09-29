"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { useApp } from "@/context/AppContext";
import { 
  GraduationCap, 
  FileText, 
  AlertTriangle, 
  ArrowRight, 
  BookOpen, 
  Headphones, 
  Plus, 
  Calendar, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Eye, 
  Send,
  Building2,
  ChevronDown,
  Layers
} from "lucide-react";
import { formatRupiah, formatDateIndo } from "@/lib/utils";
import { CreateTransactionModal } from "@/components/features/CreateTransactionModal";
import { CreateSptModal } from "@/components/features/CreateSptModal";

export default function DashboardPage() {
  const { 
    currentUser, 
    transactions, 
    invoices, 
    bupotList, 
    sptList, 
    payments, 
    selectedPeriod, 
    setSelectedPeriod, 
    approveTransaction, 
    showToast,
    setIsAiAssistantOpen 
  } = useApp();

  const [isCreateTxOpen, setIsCreateTxOpen] = useState(false);
  const [isCreateSptOpen, setIsCreateSptOpen] = useState(false);
  const [showAdminSummary, setShowAdminSummary] = useState(false);

  // Financial Computations
  const totalKeluaran = invoices
    .filter((i) => i.type === "KELUARAN")
    .reduce((sum, i) => sum + i.ppnAmount, 0);

  const totalMasukan = invoices
    .filter((i) => i.type === "MASUKAN")
    .reduce((sum, i) => sum + i.ppnAmount, 0);

  const totalBupotDipotong = bupotList.reduce((sum, b) => sum + b.taxWithheld, 0);

  const totalPembayaranSelesai = payments
    .filter((p) => p.status === "PAID" || p.status === "VERIFIED")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalTransaksiBruto = transactions.reduce((sum, t) => sum + t.grossAmount, 0);
  const pendingApprovals = transactions.filter((t) => t.status === "UNDER_REVIEW");

  return (
    <AppShell hideSidebar={true}>
      <div className="space-y-6">
        
        {/* ========================================================= */}
        {/* SECTION 1: HERO SHOWCASE (IDENTICAL TO PRAKTAX REFERENCE) */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Left Column: Greeting & Intro */}
          <div className="lg:col-span-4 space-y-3">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Selamat datang, <span className="font-bold text-slate-900 dark:text-white">{currentUser.name}</span>.
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1e1b4b] dark:text-purple-300 tracking-tight leading-tight">
              NatraTax untuk Praktikum Perpajakan Praktis dan Modern
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Dengan tampilan baru yang selaras dengan transformasi Coretax DJP. NatraTax membantu proses pembelajaran dan simulasi administrasi perpajakan secara lebih modern, terstruktur, dan mendekati pengalaman penggunaan sistem Coretax.
            </p>
          </div>

          {/* Right Column: Large Showcase Card */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm relative overflow-hidden bg-gradient-to-br from-white via-indigo-50/20 to-purple-50/30 dark:from-slate-900 dark:to-indigo-950/20">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              {/* Showcase Left: Headlines, Note, Device Mockup */}
              <div className="md:col-span-7 space-y-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-[#1e1b4b] dark:text-purple-300 tracking-tight uppercase leading-none">
                    PENYEGARAN TAMPILAN NATRATAX
                  </h2>
                  <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 mt-2 leading-snug">
                    NatraTax menghadirkan pengalaman pembelajaran perpajakan yang lebih <strong>modern, intuitif,</strong> dan <strong>selaras</strong> dengan perkembangan <strong>ekosistem perpajakan digital.</strong>
                  </p>
                </div>

                {/* Amber Note Callout */}
                <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border-l-4 border-amber-500 text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  Penyegaran tampilan merupakan bagian dari <strong className="text-amber-800 dark:text-amber-300 font-bold">pengembangan berkelanjutan NatraTax</strong> untuk mendukung pembelajaran perpajakan yang lebih modern.
                </div>

                {/* Device Mockup Display */}
                <div className="relative pt-2">
                  <div className="w-full max-w-sm mx-auto sm:mx-0 drop-shadow-xl hover:scale-[1.02] transition-transform duration-300">
                    <Image
                      src="/images/dashboard-devices.png"
                      alt="NatraTax CoreTax Interface Mockup"
                      width={520}
                      height={290}
                      className="w-full h-auto object-contain rounded-lg"
                      priority
                    />
                  </div>
                </div>
              </div>

              {/* Showcase Right: 3 Amber Bullet Points */}
              <div className="md:col-span-5 space-y-4 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 md:pl-6">
                
                {/* Bullet 1: Platform Pembelajaran */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#f59e0b] text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug">
                    NatraTax dikembangkan sebagai platform <strong>pembelajaran dan simulasi perpajakan</strong> yang membantu mahasiswa dan siswa SMK memahami proses administrasi perpajakan secara praktis.
                  </p>
                </div>

                {/* Bullet 2: Data Fiktif */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#f59e0b] text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                    <FileText className="w-4 h-4" />
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug">
                    Seluruh data, identitas, dan transaksi yang tersedia dalam sistem merupakan <strong>data contoh fiktif</strong> yang digunakan khusus untuk kebutuhan edukasi, pelatihan, dan demonstrasi.
                  </p>
                </div>

                {/* Bullet 3: Tidak Terhubung DJP */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#f59e0b] text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug">
                    Platform ini <strong>tidak terhubung</strong> dengan sistem Direktorat Jenderal Pajak (DJP) dan tidak dapat digunakan untuk pelaporan, pembayaran, maupun penyampaian kewajiban perpajakan secara resmi.
                  </p>
                </div>

              </div>

            </div>
          </div>

        </div>

        {/* ========================================================= */}
        {/* SECTION 2: 3 ACTION CARDS (TUGAS, PANDUAN, HELPDESK)      */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          
          {/* Card 1: Tugas Praktikum */}
          <Link
            href="/practicum"
            className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-2xs hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-700 transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                  Tugas Praktikum
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                  Menu tugas praktikum untuk mengelola dan menyelesaikan tugas-tugas perpajakan.
                </p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 group-hover:text-emerald-600 group-hover:border-emerald-300 group-hover:translate-x-0.5 transition-all shrink-0 ml-2">
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Card 2: Panduan Pengguna */}
          <Link
            href="/layanan/e-learning"
            className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-2xs hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors">
                  Panduan Pengguna
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                  Pelajari cara menggunakan fitur-fitur NatraTax melalui panduan penggunaan, tutorial, dan informasi yang tersedia.
                </p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:border-indigo-300 group-hover:translate-x-0.5 transition-all shrink-0 ml-2">
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Card 3: Helpdesk Service */}
          <Link
            href="/layanan/buat-pengaduan"
            className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-2xs hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                  Helpdesk Service
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                  Butuh bantuan? Hubungi tim support untuk mendapatkan pendampingan terkait kendala teknis maupun penggunaan NatraTax.
                </p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 group-hover:text-blue-600 group-hover:border-blue-300 group-hover:translate-x-0.5 transition-all shrink-0 ml-2">
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

        </div>

        {/* ========================================================= */}
        {/* SECTION 3: OPERATIONAL SUMMARY & QUICK ACTIONS TOGGLE     */}
        {/* ========================================================= */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-5">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </span>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Penatausahaan Keuangan & Rekonsiliasi Kas Sekolah
                </h3>
                <p className="text-xs text-slate-500">
                  Ringkasan status transaksi belanja BOS, e-Faktur, e-Bupot, dan penyetoran kas negara.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCreateTxOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#381750] hover:bg-[#4a1f6a] text-white text-xs font-bold transition-all shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Buat Transaksi</span>
              </button>
              <button
                onClick={() => setIsCreateSptOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors"
              >
                <span>+ Konsep SPT</span>
              </button>
              <button
                onClick={() => setIsAiAssistantOpen(true)}
                className="p-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-purple-950 font-bold transition-colors"
                title="Buka Asisten Pajak AI"
              >
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 6 Metric Financial Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Pajak Keluaran</span>
              <div className="font-extrabold text-sm text-slate-900 dark:text-white mt-1 truncate">
                {formatRupiah(totalKeluaran)}
              </div>
              <span className="text-[10px] text-slate-400">e-Faktur Terbit</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Pajak Masukan</span>
              <div className="font-extrabold text-sm text-slate-900 dark:text-white mt-1 truncate">
                {formatRupiah(totalMasukan)}
              </div>
              <span className="text-[10px] text-slate-400">Dapat Dikreditkan</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Bupot Dipotong</span>
              <div className="font-extrabold text-sm text-indigo-600 dark:text-indigo-400 mt-1 truncate">
                {formatRupiah(totalBupotDipotong)}
              </div>
              <span className="text-[10px] text-slate-400">{bupotList.length} Bukti Potong</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Setor Kas Negara</span>
              <div className="font-extrabold text-sm text-emerald-600 dark:text-emerald-400 mt-1 truncate">
                {formatRupiah(totalPembayaranSelesai)}
              </div>
              <span className="text-[10px] text-emerald-600 font-bold">NTPN Tervalidasi</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Transaksi Bruto</span>
              <div className="font-extrabold text-sm text-slate-900 dark:text-white mt-1 truncate">
                {formatRupiah(totalTransaksiBruto)}
              </div>
              <span className="text-[10px] text-slate-400">{transactions.length} Transaksi</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Pending Review</span>
              <div className="font-extrabold text-sm text-amber-600 dark:text-amber-400 mt-1">
                {pendingApprovals.length} Dokumen
              </div>
              <span className="text-[10px] text-amber-600 font-bold">Menunggu Approval</span>
            </div>
          </div>

          {/* Pending Approval List (if any) */}
          {pendingApprovals.length > 0 && (
            <div className="pt-2">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                Antrean Otorisasi Keuangan
              </h4>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                {pendingApprovals.slice(0, 3).map((trx) => (
                  <div key={trx.id} className="p-3 bg-white dark:bg-slate-900 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{trx.trxNumber}</span>
                      <span className="text-slate-400 mx-2">•</span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">{trx.description}</span>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Rekanan: {trx.vendorName} • Bruto: {formatRupiah(trx.grossAmount)}
                      </div>
                    </div>
                    <button
                      onClick={() => approveTransaction(trx.id)}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors shadow-xs"
                    >
                      Setujui
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Global Modals */}
      <CreateTransactionModal
        isOpen={isCreateTxOpen}
        onClose={() => setIsCreateTxOpen(false)}
      />
      <CreateSptModal
        isOpen={isCreateSptOpen}
        onClose={() => setIsCreateSptOpen(false)}
      />

    </AppShell>
  );
}
