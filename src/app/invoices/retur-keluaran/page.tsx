"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useApp } from "@/context/AppContext";
import { 
  RotateCcw, 
  Search, 
  Download, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Eye,
  X,
  FileText
} from "lucide-react";
import { formatRupiah, formatDateIndo, formatNPWP } from "@/lib/utils";
import { ExportModal } from "@/components/features/ExportModal";
import { InvoiceReturn } from "@/types";

export default function ReturPajakKeluaranPage() {
  const { invoiceReturns, addInvoiceReturn, invoices, isCompactMode, setIsCompactMode, showToast } = useApp();
  
  const [filterNpwp, setFilterNpwp] = useState("");
  const [filterKodeTrx, setFilterKodeTrx] = useState("");
  const [filterNama, setFilterNama] = useState("");

  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedReturn, setSelectedReturn] = useState<InvoiceReturn | null>(null);

  // Form state for creating a return
  const [originalInvoiceNumber, setOriginalInvoiceNumber] = useState(
    invoices.find((i) => i.type === "KELUARAN")?.taxInvoiceNumber || "010.002-26.11029381"
  );
  const [returnNumber, setReturnNumber] = useState(`NRK-2026/09/${String(invoiceReturns.length + 1).padStart(3, "0")}`);
  const [counterpartyName, setCounterpartyName] = useState("PT Astra International Tbk");
  const [counterpartyNpwp, setCounterpartyNpwp] = useState("013456789012000");
  const [dppReturned, setDppReturned] = useState<number>(5000000);
  const [reason, setReason] = useState("Pengembalian sebagian barang karena spesifikasi tidak sesuai");

  const ppnReturned = Math.round(dppReturned * 0.11);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addInvoiceReturn({
      returnNumber,
      originalInvoiceNumber,
      type: "RETUR_KELUARAN",
      date: new Date().toISOString().split("T")[0],
      counterpartyName,
      counterpartyNpwp,
      dppReturned: Number(dppReturned),
      ppnReturned,
      status: "TERVERIFIKASI",
      reason,
    });
    setIsCreateOpen(false);
  };

  const list = invoiceReturns.filter((r) => r.type === "RETUR_KELUARAN");

  const filteredList = list.filter((r) => {
    const matchesNpwp = !filterNpwp || r.counterpartyNpwp.toLowerCase().includes(filterNpwp.toLowerCase());
    const matchesKode = !filterKodeTrx || r.originalInvoiceNumber.slice(0, 2).includes(filterKodeTrx);
    const matchesNama = !filterNama || r.counterpartyName.toLowerCase().includes(filterNama.toLowerCase());
    return matchesNpwp && matchesKode && matchesNama;
  });

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
        { label: "Retur Pajak Keluaran" }
      ]}
    >
      <div className="space-y-4">
        
        {/* Action Controls Top Bar */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Retur Pajak Keluaran
            </h1>
            <span className="text-xs text-slate-500 font-mono">
              ({totalRows} rekaman)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Rekam Retur</span>
            </button>
            <button
              onClick={() => setIsExportOpen(true)}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
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
                      className="rounded border-amber-300 text-amber-600" 
                    />
                  </th>
                  <th className="py-2.5 px-3 w-16 text-center">Aksi</th>
                  <th className="py-2.5 px-3 min-w-[180px]">
                    <div className="space-y-1.5">
                      <div>NPWP Pembeli</div>
                      <input
                        type="text"
                        placeholder="Cari NPWP..."
                        value={filterNpwp}
                        onChange={(e) => setFilterNpwp(e.target.value)}
                        className="w-full h-7 px-2 text-xs font-normal text-slate-900 bg-white dark:bg-slate-800 border border-amber-300 rounded shadow-2xs outline-none focus:ring-1 focus:ring-amber-600"
                      />
                    </div>
                  </th>
                  <th className="py-2.5 px-3 min-w-[200px]">
                    <div className="space-y-1.5">
                      <div>Nama Pembeli</div>
                      <input
                        type="text"
                        placeholder="Cari Nama..."
                        value={filterNama}
                        onChange={(e) => setFilterNama(e.target.value)}
                        className="w-full h-7 px-2 text-xs font-normal text-slate-900 bg-white dark:bg-slate-800 border border-amber-300 rounded shadow-2xs outline-none focus:ring-1 focus:ring-amber-600"
                      />
                    </div>
                  </th>
                  <th className="py-2.5 px-3 min-w-[140px]">
                    <div className="space-y-1.5">
                      <div>Kode Transaksi</div>
                      <input
                        type="text"
                        placeholder="Contoh: 01"
                        value={filterKodeTrx}
                        onChange={(e) => setFilterKodeTrx(e.target.value)}
                        className="w-full h-7 px-2 text-xs font-normal text-slate-900 bg-white dark:bg-slate-800 border border-amber-300 rounded shadow-2xs outline-none focus:ring-1 focus:ring-amber-600"
                      />
                    </div>
                  </th>
                  <th className="py-2.5 px-3 min-w-[150px]">No. Nota Retur</th>
                  <th className="py-2.5 px-3 min-w-[140px]">Faktur Asal</th>
                  <th className="py-2.5 px-3 min-w-[110px] text-right">DPP Retur</th>
                  <th className="py-2.5 px-3 min-w-[110px] text-right">PPN Retur</th>
                  <th className="py-2.5 px-3 min-w-[100px] text-center">Status</th>
                </tr>
              </thead>

              {/* Body */}
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
                {currentRows.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-16 text-center text-slate-400">
                      <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                        Data Not Found
                      </span>
                    </td>
                  </tr>
                ) : (
                  currentRows.map((ret) => (
                    <tr 
                      key={ret.id} 
                      className={`hover:bg-amber-50/50 dark:hover:bg-amber-950/20 transition-colors ${
                        selectedIds.includes(ret.id) ? "bg-amber-50 dark:bg-amber-950/30" : ""
                      }`}
                    >
                      <td className="py-2.5 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(ret.id)}
                          onChange={() => toggleSelectRow(ret.id)}
                          className="rounded border-slate-300 text-amber-600"
                        />
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={() => setSelectedReturn(ret)}
                          className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-indigo-600 dark:text-indigo-400"
                          title="Lihat Detail Nota Retur"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-medium">{formatNPWP(ret.counterpartyNpwp)}</td>
                      <td className="py-2.5 px-3 font-medium">{ret.counterpartyName}</td>
                      <td className="py-2.5 px-3 font-mono">{ret.originalInvoiceNumber.slice(0, 2)}</td>
                      <td className="py-2.5 px-3 font-mono font-semibold text-amber-700 dark:text-amber-400">{ret.returnNumber}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-500">{ret.originalInvoiceNumber}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-semibold">{formatRupiah(ret.dppReturned)}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-amber-600">{formatRupiah(ret.ppnReturned)}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          {ret.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer matching Screenshot 1 exactly */}
          <div className="p-3 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900">
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
                </select>
              </div>

              <div className="font-mono text-xs">
                {totalRows === 0 ? "0-0 of 0" : `${startIndex + 1}-${Math.min(startIndex + rowsPerPage, totalRows)} of ${totalRows}`}
              </div>

              <div className="flex items-center gap-1">
                <button 
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed text-slate-600 dark:text-slate-300"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed text-slate-600 dark:text-slate-300"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Rekam Retur */}
        {isCreateOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
            <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-[#f59e0b] text-slate-900">
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-5 h-5" />
                  <h3 className="font-bold text-sm">Rekam Nota Retur Pajak Keluaran</h3>
                </div>
                <button onClick={() => setIsCreateOpen(false)} className="p-1 hover:bg-amber-600 rounded">
                  <X className="w-5 h-5 text-slate-900" />
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="p-5 space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nomor Nota Retur
                  </label>
                  <input
                    type="text"
                    required
                    value={returnNumber}
                    onChange={(e) => setReturnNumber(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nomor Faktur Pajak Asal (NSFP)
                  </label>
                  <input
                    type="text"
                    required
                    value={originalInvoiceNumber}
                    onChange={(e) => setOriginalInvoiceNumber(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Nama Pembeli
                    </label>
                    <input
                      type="text"
                      required
                      value={counterpartyName}
                      onChange={(e) => setCounterpartyName(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      NPWP Pembeli
                    </label>
                    <input
                      type="text"
                      required
                      value={counterpartyNpwp}
                      onChange={(e) => setCounterpartyNpwp(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      DPP yang Diretur (Rp)
                    </label>
                    <input
                      type="number"
                      required
                      min={1000}
                      value={dppReturned}
                      onChange={(e) => setDppReturned(Number(e.target.value))}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      PPN Retur (11%)
                    </label>
                    <input
                      type="text"
                      disabled
                      value={formatRupiah(ppnReturned)}
                      className="w-full bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 font-mono font-bold text-amber-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Alasan Retur Barang / Pembatalan Jasa
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsCreateOpen(false)}
                    className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold shadow-xs cursor-pointer"
                  >
                    Simpan & Terbitkan Retur
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Detail Nota Retur */}
        {selectedReturn && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-500" />
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Detail Nota Retur Pajak</h3>
                </div>
                <button onClick={() => setSelectedReturn(null)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">Nomor Retur</span>
                  <span className="font-mono font-bold text-amber-600">{selectedReturn.returnNumber}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">Faktur Asal</span>
                  <span className="font-mono">{selectedReturn.originalInvoiceNumber}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">Nama Pembeli</span>
                  <span className="font-semibold">{selectedReturn.counterpartyName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">NPWP Pembeli</span>
                  <span className="font-mono">{formatNPWP(selectedReturn.counterpartyNpwp)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">Nilai DPP Retur</span>
                  <span className="font-mono font-semibold">{formatRupiah(selectedReturn.dppReturned)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">Nilai PPN Retur</span>
                  <span className="font-mono font-bold text-amber-600">{formatRupiah(selectedReturn.ppnReturned)}</span>
                </div>
                <div className="py-2 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg text-slate-600 dark:text-slate-300">
                  <span className="block font-bold text-[11px] mb-0.5">Alasan Retur:</span>
                  {selectedReturn.reason}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedReturn(null)}
                  className="px-4 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold text-xs"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}

        <ExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          title="Ekspor Data Retur Pajak Keluaran"
          defaultFilename="Retur_Pajak_Keluaran_NatraTax"
        />
      </div>
    </AppShell>
  );
}
