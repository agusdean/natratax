"use client";

import React, { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useApp } from "@/context/AppContext";
import { 
  FileText, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Calendar, 
  Plus, 
  Download, 
  Search, 
  CheckCircle2, 
  Eye, 
  Printer 
} from "lucide-react";
import { formatRupiah, formatDateIndo } from "@/lib/utils";
import { CreateTransactionModal } from "@/components/features/CreateTransactionModal";
import { ExportModal } from "@/components/features/ExportModal";
import { InvoiceDetailModal } from "@/components/features/InvoiceDetailModal";
import { Invoice } from "@/types";

export default function InvoicesDashboardPage() {
  const { 
    invoices, 
    selectedPeriod, 
    setSelectedPeriod, 
    isCompactMode, 
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<"ALL" | "MASUKAN" | "KELUARAN" | "DRAFT" | "RETUR">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateTxModalOpen, setIsCreateTxModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Check URL hash or query params
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes("draft")) setActiveTab("DRAFT");
      if (hash.includes("retur")) setActiveTab("RETUR");
    }
  }, []);

  // Computations for Summary Cards (Matching Screenshot 1)
  const totalKeluaran = invoices
    .filter((inv) => inv.type === "KELUARAN")
    .reduce((sum, inv) => sum + inv.ppnAmount, 0);

  const totalMasukan = invoices
    .filter((inv) => inv.type === "MASUKAN")
    .reduce((sum, inv) => sum + inv.ppnAmount, 0);

  const totalRetur = invoices.filter((inv) => inv.status === "RETUR").length;
  const countKeluaran = invoices.filter((inv) => inv.type === "KELUARAN").length;
  const countMasukan = invoices.filter((inv) => inv.type === "MASUKAN").length;

  // Filtered invoices
  const filteredInvoices = invoices.filter((inv) => {
    let matchesTab = true;
    if (activeTab === "MASUKAN") matchesTab = inv.type === "MASUKAN";
    else if (activeTab === "KELUARAN") matchesTab = inv.type === "KELUARAN";
    else if (activeTab === "DRAFT") matchesTab = inv.status === "DRAFT";
    else if (activeTab === "RETUR") matchesTab = inv.status === "RETUR";

    const matchesSearch = 
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.taxInvoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.counterpartyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.counterpartyNpwp.includes(searchQuery);
    return matchesTab && matchesSearch;
  });

  return (
    <AppShell
      breadcrumbs={[
        { label: "Beranda", href: "/dashboard" },
        { label: "E Faktur", href: "/invoices" },
        { label: "Dashboard" }
      ]}
    >
      <div className="space-y-6">
        
        {/* Top Header Row: Title & Period Filter (Matching Screenshot 1) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Dasbor e-Faktur
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Pengelolaan Faktur Pajak Masukan & Keluaran SMK BINA PUTRA JAKARTA
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Period Selector (Matching Screenshot 1 Right: September-2026 + Calendar Icon) */}
            <div className="flex items-center bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden shadow-xs">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="bg-transparent pl-3 pr-2 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none cursor-pointer"
              >
                <option value="September-2026">September-2026</option>
                <option value="Agustus-2026">Agustus-2026</option>
                <option value="Juli-2026">Juli-2026</option>
                <option value="Tahun-2026">Tahun Buku 2026</option>
              </select>
              <div className="bg-[#381750] text-white p-2.5 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
            </div>

            {/* Quick Actions */}
            <button
              onClick={() => setIsCreateTxModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Tambah Transaksi</span>
            </button>
          </div>
        </div>

        {/* 3 Summary Cards (Replicating Screenshot 1 Structure with Elevated Saas Aesthetics) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          
          {/* Card 1: Total Pajak Keluaran */}
          <div 
            onClick={() => setActiveTab("KELUARAN")}
            className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Total Pajak Keluaran</p>
                <div className="mt-2 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  {countKeluaran}
                </div>
                <div className="mt-1 font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  PPN: {formatRupiah(totalKeluaran)}
                </div>
              </div>
              
              <div className="w-14 h-14 rounded-2xl bg-[#381750] text-white flex items-center justify-center shadow-md">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="12" y1="18" x2="16" y2="14"/>
                  <polyline points="13 14 16 14 16 17"/>
                </svg>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
              <span className="text-slate-400 font-medium">This month</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                <ArrowUpRight className="w-3.5 h-3.5" /> +100% vs bln lalu
              </span>
            </div>
          </div>

          {/* Card 2: Total Pajak Masukan */}
          <div 
            onClick={() => setActiveTab("MASUKAN")}
            className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Total Pajak Masukan</p>
                <div className="mt-2 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  {countMasukan}
                </div>
                <div className="mt-1 font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  PPN: {formatRupiah(totalMasukan)}
                </div>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-slate-600 text-white flex items-center justify-center shadow-md">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="14" x2="12" y2="18"/>
                  <polyline points="15 18 12 18 12 15"/>
                </svg>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
              <span className="text-slate-400 font-medium">This month</span>
              <span className="font-semibold text-slate-600 dark:text-slate-300">
                Pengadaan Dana BOS
              </span>
            </div>
          </div>

          {/* Card 3: Total Retur Dokumen */}
          <div 
            onClick={() => setActiveTab("RETUR")}
            className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Total Retur Dokumen</p>
                <div className="mt-2 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  {totalRetur}
                </div>
                <div className="mt-1 font-mono text-xs font-semibold text-amber-600">
                  Semua Faktur Valid
                </div>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <path d="M12 14a3 3 0 1 0 3 3"/>
                  <polyline points="15 14 15 17 12 17"/>
                </svg>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
              <span className="text-slate-400 font-medium">This month</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Nihil Retur
              </span>
            </div>
          </div>

        </div>

        {/* Data Table Section */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden">
          
          {/* Table Controls & Tabs */}
          <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <button
                onClick={() => setActiveTab("ALL")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "ALL"
                    ? "bg-[#381750] text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                Semua Faktur ({invoices.length})
              </button>
              <button
                onClick={() => setActiveTab("MASUKAN")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "MASUKAN"
                    ? "bg-slate-800 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                Pajak Masukan (Vendor)
              </button>
              <button
                onClick={() => setActiveTab("KELUARAN")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "KELUARAN"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                Pajak Keluaran (Sekolah)
              </button>
              <button
                onClick={() => setActiveTab("DRAFT")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "DRAFT"
                    ? "bg-amber-500 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                Faktur Draft
              </button>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari nomor faktur / rekanan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                onClick={() => setIsExportModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Ekspor</span>
              </button>
            </div>
          </div>

          {/* Table Element */}
          <div className="overflow-x-auto">
            <table className={`w-full text-left text-xs ${isCompactMode ? "compact-table" : ""}`}>
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Nomor Faktur</th>
                  <th className="py-3 px-4">Tanggal</th>
                  <th className="py-3 px-4">Rekanan / Vendor</th>
                  <th className="py-3 px-4">NPWP</th>
                  <th className="py-3 px-4 text-right">DPP (Rp)</th>
                  <th className="py-3 px-4 text-right">PPN (11%)</th>
                  <th className="py-3 px-4 text-right">Total (Rp)</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
                {filteredInvoices.length > 0 ? (
                  filteredInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-indigo-700 dark:text-indigo-400">
                        <div>{inv.taxInvoiceNumber}</div>
                        <div className="text-[10px] text-slate-400 font-sans font-normal">{inv.invoiceNumber}</div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-slate-500">
                        {formatDateIndo(inv.date)}
                      </td>
                      <td className="py-3 px-4 font-semibold">
                        <div>{inv.counterpartyName}</div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{inv.type}</span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                        {inv.counterpartyNpwp}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold">
                        {formatRupiah(inv.dpp)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {formatRupiah(inv.ppnAmount)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-black text-slate-900 dark:text-white">
                        {formatRupiah(inv.total)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          inv.status === "TERBIT"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : inv.status === "DRAFT"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setSelectedInvoice(inv)}
                            className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 font-semibold text-[11px] flex items-center gap-1"
                            title="Lihat Faktur Lengkap"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Lihat</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="py-14 text-center">
                      <div className="flex flex-col items-center justify-center space-y-2.5 max-w-sm mx-auto">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 border border-indigo-100 dark:border-indigo-900">
                          <FileText className="w-6 h-6" />
                        </div>
                        <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                          Belum Ada Faktur Pajak
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                          Belum ada e-Faktur Pajak Masukan maupun Keluaran yang tercatat pada periode ini.
                        </p>
                        <button
                          onClick={() => setIsCreateTxModalOpen(true)}
                          className="mt-1 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#381750] text-white text-xs font-bold hover:bg-[#4d1f6e] transition-colors shadow-xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Rekam Faktur Baru</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between text-xs text-slate-500">
            <span>Menampilkan 1–{filteredInvoices.length} dari {filteredInvoices.length} data faktur</span>
            <span>SMK BINA PUTRA JAKARTA • Pajak Pertambahan Nilai (PPN) 11%</span>
          </div>

        </div>

      </div>

      {/* Modals */}
      <CreateTransactionModal
        isOpen={isCreateTxModalOpen}
        onClose={() => setIsCreateTxModalOpen(false)}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title="Daftar e-Faktur Pajak Periode September 2026"
        rowCount={filteredInvoices.length}
        currentFilterText={activeTab}
      />

      <InvoiceDetailModal
        invoice={selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
      />
    </AppShell>
  );
}
