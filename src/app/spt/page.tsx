"use client";

import React, { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useSearchParams } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { 
  FileEdit, 
  Plus, 
  FileSpreadsheet, 
  FileText, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  SendHorizontal, 
  AlertCircle,
  Filter
} from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import { CreateSptModal } from "@/components/features/CreateSptModal";
import { ExportModal } from "@/components/features/ExportModal";
import { SptDetailModal } from "@/components/features/SptDetailModal";
import { SptRecord } from "@/types";

function KonsepSptPageContent() {
  const searchParams = useSearchParams();
  const { 
    sptList, 
    updateSptStatus, 
    finalizeSpt,
    isCompactMode, 
    setIsCompactMode, 
    showToast 
  } = useApp();

  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [filterTaxType, setFilterTaxType] = useState("");
  const [filterSptType, setFilterSptType] = useState("");
  const [filterMasaPajak, setFilterMasaPajak] = useState("");

  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<"csv" | "excel" | "pdf">("excel");
  const [selectedSpt, setSelectedSpt] = useState<SptRecord | null>(null);

  // Sync with URL query parameter
  useEffect(() => {
    const statusParam = searchParams.get("status");
    if (statusParam) {
      setFilterStatus(statusParam.toUpperCase());
    } else {
      setFilterStatus("ALL");
    }
  }, [searchParams]);

  // Filtering
  const filteredData = sptList.filter((spt) => {
    const matchesStatus = filterStatus === "ALL" || spt.status === filterStatus;
    const matchesTaxType = !filterTaxType || spt.taxType.toLowerCase().includes(filterTaxType.toLowerCase());
    const matchesSptType = !filterSptType || spt.sptCategory.toLowerCase().includes(filterSptType.toLowerCase());
    const matchesMasa = !filterMasaPajak || spt.taxPeriod.toLowerCase().includes(filterMasaPajak.toLowerCase());
    return matchesStatus && matchesTaxType && matchesSptType && matchesMasa;
  });

  // Pagination
  const totalRows = filteredData.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = filteredData.slice(startIndex, startIndex + rowsPerPage);

  const handleOpenExport = (format: "csv" | "excel" | "pdf") => {
    setExportFormat(format);
    setIsExportModalOpen(true);
  };

  const handleVerifySpt = (id: string, currentStatus: string) => {
    const target = sptList.find((s) => s.id === id);
    if (!target) return;

    if (currentStatus === "FINALIZED" || currentStatus === "DILAPORKAN" || currentStatus === "LOCKED") {
      showToast({
        type: "info",
        title: "Dokumen Terkunci",
        description: "SPT Masa ini telah difinalisasi secara permanen dan telah diarsipkan.",
      });
      return;
    }

    if (currentStatus === "KONSEP" || currentStatus === "DRAFT") {
      updateSptStatus(id, "VALIDATING");
      showToast({
        type: "info",
        title: "Validasi Dokumen Sumber",
        description: "Memeriksa kelengkapan faktur dan bukti potong terkait.",
      });
    } else if (currentStatus === "VALIDATING" || currentStatus === "MENUNGGU_VERIFIKASI") {
      if (target.taxPosition === "KURANG_BAYAR" && !target.ntpn) {
        updateSptStatus(id, "PAYMENT_REQUIRED");
      } else {
        updateSptStatus(id, "READY_TO_FINALIZE");
      }
    } else if (currentStatus === "PAYMENT_REQUIRED" || currentStatus === "MENUNGGU_PEMBAYARAN") {
      if (!target.ntpn) {
        showToast({
          type: "warning",
          title: "Penyetoran Kas Negara Diperlukan",
          description: `Harap lakukan validasi penyetoran billing ${target.billingCode || "pajak"} di menu Pembayaran terlebih dahulu.`,
        });
        return;
      }
      finalizeSpt(id);
    } else if (currentStatus === "READY_TO_FINALIZE" || currentStatus === "SIAP_PROSES") {
      finalizeSpt(id);
    }
  };

  return (
    <AppShell
      breadcrumbs={[
        { label: "Beranda", href: "/dashboard" },
        { label: "SPT", href: "/spt" },
        { label: "Konsep SPT" }
      ]}
    >
      <div className="space-y-5">
        
        {/* Page Title Row (Matching Screenshot 2: Icon + Konsep SPT) */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#381750] text-white flex items-center justify-center shadow-md shadow-purple-900/20">
            <FileEdit className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Konsep SPT
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Formulir Surat Pemberitahuan Masa Pajak Sekolah & Yayasan
            </p>
          </div>
        </div>

        {/* Action Row & Export Controls (Matching Screenshot 2 Action Bar) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#381750] hover:bg-[#4a1f6a] text-white font-bold text-xs sm:text-sm shadow-md shadow-purple-900/25 transition-all w-fit"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Konsep SPT</span>
          </button>

          <div className="flex items-center gap-3 self-end sm:self-center">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Export To :
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleOpenExport("csv")}
                title="Ekspor CSV"
                className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-colors shadow-2xs"
              >
                <Download className="w-4 h-4 text-slate-600 dark:text-slate-300" />
              </button>
              <button
                onClick={() => handleOpenExport("excel")}
                title="Ekspor Excel"
                className="w-8 h-8 rounded-lg border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 flex items-center justify-center text-emerald-700 dark:text-emerald-400 transition-colors shadow-2xs"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              </button>
              <button
                onClick={() => handleOpenExport("pdf")}
                title="Ekspor PDF"
                className="w-8 h-8 rounded-lg border border-rose-200 dark:border-rose-800/60 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 flex items-center justify-center text-rose-700 dark:text-rose-400 transition-colors shadow-2xs"
              >
                <FileText className="w-4 h-4 text-rose-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {[
            { id: "ALL", label: "Semua Status" },
            { id: "KONSEP", label: "Konsep" },
            { id: "MENUNGGU_VERIFIKASI", label: "Menunggu Verifikasi" },
            { id: "MENUNGGU_PEMBAYARAN", label: "Menunggu Pembayaran" },
            { id: "SIAP_PROSES", label: "Siap Diproses" },
            { id: "DILAPORKAN", label: "Dilaporkan (BPE)" },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => {
                setFilterStatus(st.id);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                filterStatus === st.id
                  ? "bg-[#381750] text-white shadow-xs"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50"
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        {/* Data Table with Warm Orange/Amber Header Bar (Matching Screenshot 2) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          
          <div className="bg-[#F59E0B] text-slate-950 font-bold text-xs uppercase tracking-wide py-3 px-4 grid grid-cols-12 gap-2 items-center">
            <div className="col-span-12 sm:col-span-3">Jenis Pajak</div>
            <div className="col-span-6 sm:col-span-2">Jenis SPT</div>
            <div className="col-span-6 sm:col-span-2">Masa Pajak</div>
            <div className="col-span-6 sm:col-span-2 text-right">Total Pajak (Rp)</div>
            <div className="col-span-6 sm:col-span-2 text-center">Status</div>
            <div className="col-span-12 sm:col-span-1 text-center">Aksi</div>
          </div>

          <div className="bg-amber-50/40 dark:bg-slate-800/60 p-2.5 border-b border-slate-200 dark:border-slate-800 grid grid-cols-12 gap-2">
            <div className="col-span-12 sm:col-span-3">
              <input
                type="text"
                placeholder="Filter jenis pajak..."
                value={filterTaxType}
                onChange={(e) => { setFilterTaxType(e.target.value); setCurrentPage(1); }}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-800 dark:text-slate-100 outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
            <div className="col-span-6 sm:col-span-2">
              <input
                type="text"
                placeholder="Filter kategori..."
                value={filterSptType}
                onChange={(e) => { setFilterSptType(e.target.value); setCurrentPage(1); }}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-800 dark:text-slate-100 outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
            <div className="col-span-6 sm:col-span-2">
              <input
                type="text"
                placeholder="Filter masa..."
                value={filterMasaPajak}
                onChange={(e) => { setFilterMasaPajak(e.target.value); setCurrentPage(1); }}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-800 dark:text-slate-100 outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
            <div className="col-span-12 sm:col-span-5 flex items-center justify-end text-[11px] text-slate-400 pr-2">
              Filter kolom aktif ({filteredData.length} baris)
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {currentRows.length > 0 ? (
              currentRows.map((spt) => (
                <div 
                  key={spt.id} 
                  className={`grid grid-cols-12 gap-2 items-center p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-xs text-slate-800 dark:text-slate-200 ${isCompactMode ? "py-2 text-[11px]" : ""}`}
                >
                  <div className="col-span-12 sm:col-span-3 font-bold text-indigo-950 dark:text-indigo-200 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-600" />
                    <span>{spt.taxType}</span>
                  </div>

                  <div className="col-span-6 sm:col-span-2 text-slate-600 dark:text-slate-400">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-semibold text-[10px]">
                      {spt.sptCategory}
                    </span>
                  </div>

                  <div className="col-span-6 sm:col-span-2 font-medium text-slate-700 dark:text-slate-300">
                    {spt.taxPeriod}
                  </div>

                  <div className="col-span-6 sm:col-span-2 text-right font-mono font-black text-amber-600 dark:text-amber-400">
                    {formatRupiah(spt.totalTax)}
                  </div>

                  <div className="col-span-6 sm:col-span-2 text-center">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      spt.status === "DILAPORKAN"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        : spt.status === "KONSEP"
                        ? "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300"
                        : spt.status === "MENUNGGU_VERIFIKASI"
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                        : "bg-blue-100 text-blue-800"
                    }`}>
                      {spt.status}
                    </span>
                  </div>

                  <div className="col-span-12 sm:col-span-1 flex items-center justify-center gap-1.5">
                    <button
                      onClick={() => handleVerifySpt(spt.id, spt.status)}
                      title="Proses / Majukan Tahap Alur"
                      className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 transition-colors"
                    >
                      <SendHorizontal className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setSelectedSpt(spt)}
                      title="Lihat Rincian SPT"
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-14 px-4 text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 mx-auto flex items-center justify-center border border-amber-200 dark:border-amber-800">
                  <AlertCircle className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-800 dark:text-white">
                    Data Tidak Ditemukan
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                    Tidak ada konsep SPT yang cocok dengan kriteria pencarian filter saat ini.
                  </p>
                </div>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#381750] text-white text-xs font-bold hover:bg-[#4a1f6a] transition-all shadow-md shadow-purple-900/20"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Buat Konsep SPT Baru
                </button>
              </div>
            )}
          </div>

          {/* Table Footer */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <div
                  onClick={() => setIsCompactMode(!isCompactMode)}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                    isCompactMode ? "bg-[#381750]" : "bg-slate-300 dark:bg-slate-700"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white shadow-xs transform transition-transform ${
                      isCompactMode ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </div>
                <span className="font-bold text-slate-700 dark:text-slate-300 text-xs">
                  Padatkan
                </span>
              </label>
            </div>

            <div className="flex items-center gap-4 self-end sm:self-center">
              
              <div className="flex items-center gap-2">
                <span className="text-slate-500 text-xs">Baris per halaman:</span>
                <select
                  value={rowsPerPage}
                  onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                  className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md px-2 py-1 text-xs font-semibold"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                </select>
              </div>

              <div className="text-slate-500 font-mono text-xs">
                {totalRows > 0 ? `${startIndex + 1}-${Math.min(startIndex + rowsPerPage, totalRows)} of ${totalRows}` : "0-0 of 0"}
              </div>

              <div className="flex items-center gap-1">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  className="p-1 rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                </button>
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  className="p-1 rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Modals */}
      <CreateSptModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title="Daftar Konsep SPT Masa Sekolah"
        rowCount={filteredData.length}
        currentFilterText="SPT Masa & Unifikasi 2026"
        defaultFormat={exportFormat}
      />

      <SptDetailModal
        spt={selectedSpt}
        onClose={() => setSelectedSpt(null)}
      />
    </AppShell>
  );
}

export default function KonsepSptPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-slate-400">Memuat data SPT...</div>}>
      <KonsepSptPageContent />
    </React.Suspense>
  );
}
