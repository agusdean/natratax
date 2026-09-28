"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useApp } from "@/context/AppContext";
import { 
  Building2, 
  Calendar, 
  Plus, 
  FileText, 
  FileCheck2, 
  Files, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Check, 
  Eye, 
  Send 
} from "lucide-react";
import { formatRupiah, formatDateIndo } from "@/lib/utils";
import { CreateTransactionModal } from "@/components/features/CreateTransactionModal";
import { CreateSptModal } from "@/components/features/CreateSptModal";
import Link from "next/link";

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

  // Computations for 6 Summary Cards (Prompt Section 9)
  const totalKeluaran = invoices
    .filter((i) => i.type === "KELUARAN")
    .reduce((sum, i) => sum + i.ppnAmount, 0);

  const totalMasukan = invoices
    .filter((i) => i.type === "MASUKAN")
    .reduce((sum, i) => sum + i.ppnAmount, 0);

  const totalBupotDipotong = bupotList.reduce((sum, b) => sum + b.taxWithheld, 0);

  const totalPembayaranSelesai = payments
    .filter((p) => p.status === "PAID")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalTransaksiBruto = transactions.reduce((sum, t) => sum + t.grossAmount, 0);

  const dokumenDraftCount = transactions.filter((t) => t.status === "DRAFT").length;
  const pendingApprovals = transactions.filter((t) => t.status === "UNDER_REVIEW");

  return (
    <AppShell
      breadcrumbs={[
        { label: "Home", href: "/dashboard" },
        { label: "Dashboard" }
      ]}
    >
      <div className="space-y-6">
        
        {/* Welcome Greeting & Period Filter Bar */}
        <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-950 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-white/20 uppercase tracking-wide text-amber-300">
                Tahun Anggaran 2026
              </span>
              <span className="text-xs text-purple-200">
                • Dana BOS & SPP Terpadu
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              Selamat Datang, {currentUser.name}
            </h1>
            <p className="text-xs text-purple-200 mt-1 max-w-xl">
              Platform Administrasi Pajak & Rekonsiliasi Keuangan Sekolah Terpadu untuk <strong>{currentUser.schoolName}</strong>.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center gap-3">
            {/* Period Selector */}
            <div className="flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden shadow-xs">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="bg-transparent pl-3 pr-2 py-2 text-xs font-bold text-white outline-none cursor-pointer"
              >
                <option value="September-2026" className="text-slate-900">September-2026</option>
                <option value="Agustus-2026" className="text-slate-900">Agustus-2026</option>
                <option value="Juli-2026" className="text-slate-900">Juli-2026</option>
              </select>
              <div className="bg-amber-500 text-purple-950 p-2.5 flex items-center justify-center font-bold">
                <Calendar className="w-4 h-4" />
              </div>
            </div>

            {/* AI Assistant Quick Trigger */}
            <button
              onClick={() => setIsAiAssistantOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-purple-950 font-black text-xs shadow-md transition-all"
            >
              <Sparkles className="w-4 h-4 text-purple-900" />
              <span>Analisis AI</span>
            </button>
          </div>
        </div>

        {/* Quick Actions Row (Prompt Section 9) */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          <button
            onClick={() => setIsCreateTxOpen(true)}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white dark:bg-slate-900 hover:bg-indigo-50/60 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-2xs hover:shadow-xs transition-all group"
          >
            <Plus className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
            <span>Tambah Transaksi</span>
          </button>

          <Link
            href="/invoices"
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white dark:bg-slate-900 hover:bg-purple-50/60 dark:hover:bg-purple-950/40 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-2xs hover:shadow-xs transition-all group"
          >
            <FileText className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
            <span>Buat Invoice</span>
          </Link>

          <Link
            href="/bupot"
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white dark:bg-slate-900 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-2xs hover:shadow-xs transition-all group"
          >
            <FileCheck2 className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
            <span>Buat Bukti Potong</span>
          </Link>

          <button
            onClick={() => setIsCreateSptOpen(true)}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white dark:bg-slate-900 hover:bg-amber-50/60 dark:hover:bg-amber-950/40 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-2xs hover:shadow-xs transition-all group"
          >
            <Files className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
            <span>Buat Konsep SPT</span>
          </button>

          <Link
            href="/payments"
            className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-white dark:bg-slate-900 hover:bg-blue-50/60 dark:hover:bg-blue-950/40 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-2xs hover:shadow-xs transition-all group"
          >
            <CreditCard className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
            <span>Input Pembayaran</span>
          </Link>
        </div>

        {/* 6 Summary Cards (Prompt Section 9) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* 1. Total Pajak Keluaran */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400">1. Total Pajak Keluaran</p>
                <h3 className="mt-2 text-xl font-black text-slate-900 dark:text-white font-mono">
                  {formatRupiah(totalKeluaran)}
                </h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 flex items-center justify-center">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex justify-between">
              <span>{selectedPeriod}</span>
              <span className="text-indigo-600 font-semibold">Faktur Penjualan SMK</span>
            </div>
          </div>

          {/* 2. Total Pajak Masukan */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400">2. Total Pajak Masukan</p>
                <h3 className="mt-2 text-xl font-black text-slate-900 dark:text-white font-mono">
                  {formatRupiah(totalMasukan)}
                </h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/80 text-purple-600 flex items-center justify-center">
                <ArrowDownLeft className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex justify-between">
              <span>{selectedPeriod}</span>
              <span className="text-purple-600 font-semibold">Pengadaan Rekanan BOS</span>
            </div>
          </div>

          {/* 3. Total Pajak Dipotong (e-Bupot) */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400">3. Total Pajak Dipotong</p>
                <h3 className="mt-2 text-xl font-black text-slate-900 dark:text-white font-mono">
                  {formatRupiah(totalBupotDipotong)}
                </h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 flex items-center justify-center">
                <FileCheck2 className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex justify-between">
              <span>PPh 21, 22, 23, 4(2)</span>
              <span className="text-emerald-600 font-semibold">{bupotList.length} Bukti Potong</span>
            </div>
          </div>

          {/* 4. Total Pembayaran (Disetor ke Kas Negara) */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400">4. Total Setoran Pajak</p>
                <h3 className="mt-2 text-xl font-black text-slate-900 dark:text-white font-mono">
                  {formatRupiah(totalPembayaranSelesai)}
                </h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex justify-between">
              <span>Tervalidasi NTPN</span>
              <span className="text-blue-600 font-semibold">Kas Bank BOS</span>
            </div>
          </div>

          {/* 5. Total Transaksi Bruto Sekolah */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400">5. Total Transaksi Keuangan</p>
                <h3 className="mt-2 text-xl font-black text-slate-900 dark:text-white font-mono">
                  {formatRupiah(totalTransaksiBruto)}
                </h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex justify-between">
              <span>{transactions.length} Transaksi Tercatat</span>
              <span className="text-amber-600 font-semibold">Belanja & Honor</span>
            </div>
          </div>

          {/* 6. Dokumen Belum Lengkap / Draft */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400">6. Dokumen Belum Lengkap</p>
                <h3 className="mt-2 text-xl font-black text-red-600 dark:text-red-400 font-mono">
                  {dokumenDraftCount} Berkas
                </h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/80 text-red-600 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex justify-between">
              <span>Memerlukan Unggahan</span>
              <span className="text-red-500 font-semibold">Tindak Lanjut</span>
            </div>
          </div>

        </div>

        {/* Charts & Status Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Tax Overview Visual Chart Card (7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-sm text-slate-800 dark:text-white">
                  Komposisi Objek Pajak Sekolah (September 2026)
                </h3>
                <p className="text-[11px] text-slate-400">
                  Proporsi PPN Belanja BOS vs Pemotongan PPh 21, 22, 23, & Final
                </p>
              </div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                Total: {formatRupiah(totalMasukan + totalBupotDipotong)}
              </span>
            </div>

            {/* Visual Bar Breakdown */}
            {totalMasukan + totalBupotDipotong > 0 ? (
              <div className="space-y-4 my-2">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">PPN Masukan (Pengadaan Lab & Buku)</span>
                    <span className="font-mono font-bold text-purple-700 dark:text-purple-400">{formatRupiah(totalMasukan)}</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                    <div 
                      className="bg-purple-600 h-full rounded-full transition-all" 
                      style={{ width: `${Math.min(100, Math.round((totalMasukan / (totalMasukan + totalBupotDipotong || 1)) * 100))}%` }} 
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">PPh Dipotong & Dipungut Sekolah</span>
                    <span className="font-mono font-bold text-indigo-700 dark:text-indigo-400">{formatRupiah(totalBupotDipotong)}</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                    <div 
                      className="bg-indigo-600 h-full rounded-full transition-all" 
                      style={{ width: `${Math.min(100, Math.round((totalBupotDipotong / (totalMasukan + totalBupotDipotong || 1)) * 100))}%` }} 
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="my-6 p-6 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-1">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Belum Ada Akumulasi Objek Pajak</p>
                <p className="text-[11px] text-slate-400">Data pajak bersih. Komposisi objek pajak akan terbentuk otomatis saat transaksi belanja BOS atau bukti potong direkam.</p>
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
              <span>Sesuai PMK 59/PMK.03/2022 Tata Cara Pemungutan Pajak Instansi Pemerintah</span>
              <Link href="/ledger" className="text-indigo-600 font-bold hover:underline">
                Buku Besar Pajak →
              </Link>
            </div>
          </div>

          {/* Critical Deadlines & Approvals (5 cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-500" />
                  Jatuh Tempo Pajak Terdekat
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  {payments.filter(p => p.status === "PENDING").length > 0 ? "Wajib Disetor" : "Tertib / Nihil"}
                </span>
              </div>

              {payments.filter(p => p.status === "PENDING").length > 0 ? (
                <div className="space-y-3">
                  {payments.filter(p => p.status === "PENDING").slice(0, 2).map(pay => (
                    <div key={pay.id} className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 flex items-start justify-between">
                      <div>
                        <p className="font-bold text-xs text-amber-900 dark:text-amber-200">{pay.taxType}</p>
                        <p className="text-[11px] text-amber-700/80 dark:text-amber-400 mt-0.5">
                          Jatuh Tempo: <strong>{formatDateIndo(pay.dueDate)}</strong>
                        </p>
                      </div>
                      <span className="text-xs font-mono font-bold text-amber-900 dark:text-amber-200">
                        {formatRupiah(pay.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 text-center space-y-1">
                  <div className="flex items-center justify-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Tidak Ada Tagihan Jatuh Tempo</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Seluruh setoran pajak sekolah telah berstatus lunas / belum ada billing terbit.</p>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Link
                href="/payments"
                className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Lihat Jadwal Penyetoran</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>

        {/* Transactions Table & Pending Approvals */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-800 dark:text-white">
                Transaksi Keuangan Terbaru (Pengadaan & Honorarium)
              </h3>
              <p className="text-[11px] text-slate-400">
                Pencatatan mutasi belanja sekolah dan kalkulasi pajak terintegrasi
              </p>
            </div>
            <button
              onClick={() => setIsCreateTxOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">No. Transaksi</th>
                  <th className="py-3 px-4">Tanggal</th>
                  <th className="py-3 px-4">Rekanan / Penerima</th>
                  <th className="py-3 px-4">Uraian Transaksi</th>
                  <th className="py-3 px-4 text-right">Nilai Bruto</th>
                  <th className="py-3 px-4 text-center">Pajak</th>
                  <th className="py-3 px-4 text-right">Pajak Terutang</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Aksi Persetujuan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                          <FileText className="w-6 h-6" />
                        </div>
                        <p className="font-bold text-sm text-slate-700 dark:text-slate-300">Belum Ada Transaksi Tercatat</p>
                        <p className="text-xs text-slate-400 max-w-sm">Basis data transaksi bersih. Rekam pengadaan sarpras BOS atau honorarium baru melalui tombol di bawah.</p>
                        <button
                          onClick={() => setIsCreateTxOpen(true)}
                          className="mt-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Rekam Transaksi Baru</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  transactions.map((trx) => (
                    <tr key={trx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-mono font-bold text-indigo-700 dark:text-indigo-400">
                        {trx.trxNumber}
                      </td>
                      <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                        {formatDateIndo(trx.date)}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                        {trx.vendorName}
                      </td>
                      <td className="py-3 px-4 max-w-xs truncate" title={trx.description}>
                        {trx.description}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold">
                        {formatRupiah(trx.grossAmount)}
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-[10px]">
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {trx.taxType} ({trx.taxRate}%)
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-black text-amber-600 dark:text-amber-400">
                        {formatRupiah(trx.taxAmount)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          trx.status === "APPROVED"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : trx.status === "UNDER_REVIEW"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                            : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        }`}>
                          {trx.status === "APPROVED" ? "Disetujui" : trx.status === "UNDER_REVIEW" ? "Menunggu Verifikasi" : "Konsep"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {trx.status === "UNDER_REVIEW" ? (
                          <button
                            onClick={() => approveTransaction(trx.id)}
                            className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] shadow-xs"
                          >
                            Setujui
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400">Selesai</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Modals */}
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
