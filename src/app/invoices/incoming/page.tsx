"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useApp } from "@/context/AppContext";
import { 
  ArrowDownLeft, 
  Search, 
  Download, 
  Plus, 
  Eye, 
  Printer, 
  X, 
  FileText,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { formatRupiah, formatDateIndo, formatNPWP } from "@/lib/utils";
import { ExportModal } from "@/components/features/ExportModal";
import { InvoiceDetailModal } from "@/components/features/InvoiceDetailModal";
import { Invoice } from "@/types";

export default function PajakMasukanPage() {
  const { invoices, addInvoice, showToast, isCompactMode, setIsCompactMode } = useApp();
  
  // Filters matching Screenshot 1
  const [filterNpwp, setFilterNpwp] = useState("");
  const [filterKodeTrx, setFilterKodeTrx] = useState("");
  const [filterNama, setFilterNama] = useState("");

  // Pagination matching Screenshot 1
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [isExportOpen, setIsExportOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // New Invoice form state
  const [vendorName, setVendorName] = useState("PT Sentra Edu Informatika (Vendor BOS)");
  const [vendorNpwp, setVendorNpwp] = useState("013456789012000");
  const [trxCode, setTrxCode] = useState("01");
  const [dppAmount, setDppAmount] = useState<number>(10000000);
  const [invoiceDate, setInvoiceDate] = useState("2026-09-28");
  const ppnRate = 11;
  const ppnAmount = Math.round(dppAmount * 0.11);
  const totalAmount = dppAmount + ppnAmount;

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const invoiceNumber = `INV/BP/2026/09/${String(invoices.length + 15).padStart(3, "0")}`;
    const taxInvoiceNumber = `010.002-26.${String(Math.floor(10000000 + Math.random() * 90000000))}`;

    addInvoice({
      invoiceNumber,
      taxInvoiceNumber,
      type: "MASUKAN",
      date: invoiceDate,
      counterpartyName: vendorName,
      counterpartyNpwp: vendorNpwp,
      dpp: Number(dppAmount),
      ppnRate,
      ppnAmount,
      total: totalAmount,
      status: "TERBIT",
      period: "09-2026",
    });

    showToast({
      type: "success",
      title: "Faktur Masukan Berhasil Dicatat",
      description: `Faktur vendor ${vendorName} siap dikreditkan pada SPT Masa PPN.`
    });

    setIsCreateOpen(false);
  };

  const masukanList = invoices.filter((i) => i.type === "MASUKAN");

  const filteredList = masukanList.filter((i) => {
    const matchesNpwp = !filterNpwp || i.counterpartyNpwp.toLowerCase().includes(filterNpwp.toLowerCase());
    const matchesKode = !filterKodeTrx || i.taxInvoiceNumber.slice(0, 2).includes(filterKodeTrx);
    const matchesNama = !filterNama || i.counterpartyName.toLowerCase().includes(filterNama.toLowerCase());
    return matchesNpwp && matchesKode && matchesNama;
  });

  // Pagination logic
  const totalRows = filteredList.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = filteredList.slice(startIndex, startIndex + rowsPerPage);

  const toggleSelectAll = () => {
    if (selectedIds.length === currentRows.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(currentRows.map((r) => r.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedIds((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <AppShell
      breadcrumbs={[
        { label: "Beranda", href: "/dashboard" },
        { label: "e-Faktur", href: "/invoices" },
        { label: "Pajak Masukan" }
      ]}
    >
      <div className="space-y-4">
        
        {/* Action Controls Top Bar */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Daftar Pajak Masukan
            </h1>
            <span className="text-xs text-slate-500 font-mono">
              ({totalRows} rekaman)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold text-xs shadow-xs transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Rekam Faktur Masukan</span>
            </button>
            <button
              onClick={() => setIsExportOpen(true)}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
              title="Ekspor Data"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Screenshot 1: Warm Orange Table Header Bar & Layout */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className={`w-full text-left text-xs ${isCompactMode ? "compact-table" : ""}`}>
              <thead className="bg-[#f59e0b] text-slate-900 text-xs font-bold select-none">
                <tr>
                  <th className="py-2.5 px-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={currentRows.length > 0 && selectedIds.length === currentRows.length}
                      onChange={toggleSelectAll}
                      className="rounded border-amber-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                    />
                  </th>
                  <th className="py-2.5 px-3 w-20 text-center">Aksi</th>
                  <th className="py-2.5 px-3 min-w-[200px]">
                    <div className="space-y-1.5">
                      <div>NPWP Penjual</div>
                      <input
                        type="text"
                        placeholder=""
                        value={filterNpwp}
                        onChange={(e) => {
                          setFilterNpwp(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="w-full h-7 px-2 text-xs font-normal text-slate-900 bg-white dark:bg-slate-800 border border-amber-300 rounded shadow-2xs outline-none focus:ring-1 focus:ring-amber-600"
                      />
                    </div>
                  </th>
                  <th className="py-2.5 px-3 min-w-[220px]">
                    <div className="space-y-1.5">
                      <div>Nama Penjual</div>
                      <input
                        type="text"
                        placeholder=""
                        value={filterNama}
                        onChange={(e) => {
                          setFilterNama(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="w-full h-7 px-2 text-xs font-normal text-slate-900 bg-white dark:bg-slate-800 border border-amber-300 rounded shadow-2xs outline-none focus:ring-1 focus:ring-amber-600"
                      />
                    </div>
                  </th>
                  <th className="py-2.5 px-3 min-w-[160px]">
                    <div className="space-y-1.5">
                      <div>Kode Transaksi</div>
                      <input
                        type="text"
                        placeholder=""
                        value={filterKodeTrx}
                        onChange={(e) => {
                          setFilterKodeTrx(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="w-full h-7 px-2 text-xs font-normal text-slate-900 bg-white dark:bg-slate-800 border border-amber-300 rounded shadow-2xs outline-none focus:ring-1 focus:ring-amber-600"
                      />
                    </div>
                  </th>
                </tr>
              </thead>

              {/* Body */}
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
                {currentRows.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-16 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-1.5">
                        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                          Data Not Found
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentRows.map((inv) => (
                    <tr 
                      key={inv.id} 
                      className={`hover:bg-amber-50/40 dark:hover:bg-slate-800/40 transition-colors ${
                        selectedIds.includes(inv.id) ? "bg-amber-50/60 dark:bg-amber-950/30" : ""
                      }`}
                    >
                      <td className="py-2.5 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(inv.id)}
                          onChange={() => toggleSelectRow(inv.id)}
                          className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                        />
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setSelectedInvoice(inv)}
                            className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                            title="Lihat Detail Faktur"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedInvoice(inv);
                              setTimeout(() => window.print(), 300);
                            }}
                            className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                            title="Cetak Salinan"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[11px] font-semibold text-slate-800 dark:text-slate-200">
                        {formatNPWP(inv.counterpartyNpwp)}
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-900 dark:text-white">
                        {inv.counterpartyName}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                        {inv.taxInvoiceNumber}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer matching Screenshot 1 exactly */}
          <div className="p-3 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900">
            {/* Padatkan Switch Toggle */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                role="switch"
                aria-checked={isCompactMode}
                onClick={() => setIsCompactMode(!isCompactMode)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isCompactMode ? "bg-[#f59e0b]" : "bg-slate-300 dark:bg-slate-700"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    isCompactMode ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Padatkan
              </span>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-4 self-end sm:self-center">
              <div className="flex items-center gap-1.5">
                <span>Baris per halaman:</span>
                <select
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 text-xs font-semibold outline-none cursor-pointer"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>

              <div className="font-mono text-xs">
                {totalRows === 0 
                  ? "0-0 of 0" 
                  : `${startIndex + 1}-${Math.min(startIndex + rowsPerPage, totalRows)} of ${totalRows}`}
              </div>

              <div className="flex items-center gap-1">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed text-slate-600 dark:text-slate-300"
                  title="Halaman Sebelumnya"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed text-slate-600 dark:text-slate-300"
                  title="Halaman Selanjutnya"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Create Modal */}
        {isCreateOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#f59e0b] text-white flex items-center justify-center font-bold">
                    <ArrowDownLeft className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Rekam Faktur Pajak Masukan
                    </h3>
                    <p className="text-[11px] text-slate-400">Perolehan BKP / JKP dari Vendor Sekolah BOS</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsCreateOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="mt-4 space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nama Penjual / Rekanan Vendor BOS
                  </label>
                  <input
                    type="text"
                    required
                    value={vendorName}
                    onChange={(e) => setVendorName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 outline-none focus:ring-1 focus:ring-amber-500 font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      NPWP Penjual (16 Digit)
                    </label>
                    <input
                      type="text"
                      required
                      value={vendorNpwp}
                      onChange={(e) => setVendorNpwp(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Kode Transaksi
                    </label>
                    <select
                      value={trxCode}
                      onChange={(e) => setTrxCode(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 outline-none focus:ring-1 focus:ring-amber-500 font-semibold"
                    >
                      <option value="01">01 - Pembelian / Perolehan Umum</option>
                      <option value="02">02 - Pembelian Pemungut Instansi Pemerintah</option>
                      <option value="04">04 - DPP Nilai Lain</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Dasar Pengenaan Pajak (DPP)
                    </label>
                    <input
                      type="number"
                      required
                      min={1000}
                      value={dppAmount}
                      onChange={(e) => setDppAmount(Number(e.target.value))}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 outline-none focus:ring-1 focus:ring-amber-500 font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Tanggal Faktur
                    </label>
                    <input
                      type="date"
                      required
                      value={invoiceDate}
                      onChange={(e) => setInvoiceDate(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 space-y-1 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">PPN Masukan (11%):</span>
                    <span className="font-bold text-amber-900 dark:text-amber-200">{formatRupiah(ppnAmount)}</span>
                  </div>
                  <div className="flex justify-between border-t border-amber-200/60 dark:border-amber-900/60 pt-1 font-bold">
                    <span>Total Pembayaran:</span>
                    <span>{formatRupiah(totalAmount)}</span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCreateOpen(false)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 font-bold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold shadow-xs transition-all"
                  >
                    Simpan Faktur
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <ExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          title="Faktur Pajak Masukan SMK"
          rowCount={filteredList.length}
          currentFilterText="Pajak Masukan"
        />

        <InvoiceDetailModal
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />

      </div>
    </AppShell>
  );
}
