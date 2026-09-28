"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useApp } from "@/context/AppContext";
import { Download, Plus, ChevronLeft, ChevronRight, Eye, X, FileText } from "lucide-react";
import { formatRupiah, formatNPWP } from "@/lib/utils";
import { InvoiceReturn } from "@/types";

export default function ReturDokumenLainMasukanPage() {
  const { invoiceReturns, addInvoiceReturn, otherTaxDocuments, isCompactMode, setIsCompactMode } = useApp();
  const [filterNpwp, setFilterNpwp] = useState("");
  const [filterNama, setFilterNama] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedReturn, setSelectedReturn] = useState<InvoiceReturn | null>(null);

  // Form state
  const [returnNumber, setReturnNumber] = useState(`NR-DOK-MAS-${String(Date.now()).slice(-4)}`);
  const [originalInvoiceNumber, setOriginalInvoiceNumber] = useState(
    otherTaxDocuments.find((d) => d.type === "DOKUMEN_MASUKAN")?.documentNumber || "SSP-PPNJLN-0926"
  );
  const [counterpartyName, setCounterpartyName] = useState("Zoom Video Communications Inc");
  const [counterpartyNpwp, setCounterpartyNpwp] = useState("000000000000000");
  const [dppReturned, setDppReturned] = useState<number>(2500000);
  const [reason, setReason] = useState("Koreksi kelebihan transfer SSP PPN Luar Negeri bulan sebelumnya");

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addInvoiceReturn({
      returnNumber,
      originalInvoiceNumber,
      type: "RETUR_DOKUMEN_MASUKAN",
      date: new Date().toISOString().split("T")[0],
      counterpartyName,
      counterpartyNpwp,
      dppReturned: Number(dppReturned),
      ppnReturned: Math.round(dppReturned * 0.11),
      status: "TERVERIFIKASI",
      reason,
    });
    setIsCreateOpen(false);
  };

  const list = invoiceReturns.filter((r) => r.type === "RETUR_DOKUMEN_MASUKAN");
  const filteredList = list.filter((r) => {
    const matchesNpwp = !filterNpwp || r.counterpartyNpwp.toLowerCase().includes(filterNpwp.toLowerCase());
    const matchesNama = !filterNama || r.counterpartyName.toLowerCase().includes(filterNama.toLowerCase());
    return matchesNpwp && matchesNama;
  });

  const totalRows = filteredList.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = filteredList.slice(startIndex, startIndex + rowsPerPage);

  return (
    <AppShell
      breadcrumbs={[
        { label: "Beranda", href: "/dashboard" },
        { label: "e-Faktur", href: "/invoices" },
        { label: "Retur Dokumen Lain Masukan" }
      ]}
    >
      <div className="space-y-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Retur Dokumen Lain Masukan
            </h1>
            <span className="text-xs text-slate-500 font-mono">({totalRows} rekaman)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Rekam Retur</span>
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className={`w-full text-left text-xs ${isCompactMode ? "compact-table" : ""}`}>
              <thead className="bg-[#f59e0b] text-slate-900 text-xs font-bold select-none">
                <tr>
                  <th className="py-2.5 px-3 w-10 text-center"><input type="checkbox" disabled /></th>
                  <th className="py-2.5 px-3 w-16 text-center">Aksi</th>
                  <th className="py-2.5 px-3 min-w-[200px]">
                    <div className="space-y-1.5">
                      <div>NPWP Penjual / Rekanan</div>
                      <input
                        type="text"
                        placeholder="Filter NPWP..."
                        value={filterNpwp}
                        onChange={(e) => setFilterNpwp(e.target.value)}
                        className="w-full h-7 px-2 text-xs font-normal text-slate-900 bg-white dark:bg-slate-800 border border-amber-300 rounded shadow-2xs outline-none"
                      />
                    </div>
                  </th>
                  <th className="py-2.5 px-3 min-w-[220px]">
                    <div className="space-y-1.5">
                      <div>Nama Penjual / Rekanan</div>
                      <input
                        type="text"
                        placeholder="Filter Nama..."
                        value={filterNama}
                        onChange={(e) => setFilterNama(e.target.value)}
                        className="w-full h-7 px-2 text-xs font-normal text-slate-900 bg-white dark:bg-slate-800 border border-amber-300 rounded shadow-2xs outline-none"
                      />
                    </div>
                  </th>
                  <th className="py-2.5 px-3 min-w-[150px]">No. Nota Retur</th>
                  <th className="py-2.5 px-3 min-w-[150px]">No. Dokumen Asal</th>
                  <th className="py-2.5 px-3 min-w-[120px] text-right">DPP Retur</th>
                  <th className="py-2.5 px-3 min-w-[100px] text-center">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
                {currentRows.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-16 text-center text-slate-400">
                      <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                        Data Not Found
                      </span>
                    </td>
                  </tr>
                ) : (
                  currentRows.map((ret) => (
                    <tr key={ret.id} className="hover:bg-amber-50/50 dark:hover:bg-amber-950/20">
                      <td className="py-2.5 px-3 text-center"><input type="checkbox" /></td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={() => setSelectedReturn(ret)}
                          className="p-1 text-indigo-600 dark:text-indigo-400"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </td>
                      <td className="py-2.5 px-3 font-mono">{formatNPWP(ret.counterpartyNpwp)}</td>
                      <td className="py-2.5 px-3 font-medium">{ret.counterpartyName}</td>
                      <td className="py-2.5 px-3 font-mono font-semibold text-amber-700">{ret.returnNumber}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-500">{ret.originalInvoiceNumber}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-semibold">{formatRupiah(ret.dppReturned)}</td>
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

          <div className="p-3 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900">
            <div className="flex items-center gap-2">
              <button
                type="button"
                role="switch"
                aria-checked={isCompactMode}
                onClick={() => setIsCompactMode(!isCompactMode)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  isCompactMode ? "bg-[#f59e0b]" : "bg-slate-300 dark:bg-slate-700"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    isCompactMode ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
              <span className="font-semibold text-slate-700 dark:text-slate-300">Padatkan</span>
            </div>

            <div className="flex items-center gap-4 self-end sm:self-center">
              <div className="flex items-center gap-1.5">
                <span>Baris per halaman:</span>
                <select
                  value={rowsPerPage}
                  onChange={(e) => setRowsPerPage(Number(e.target.value))}
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded px-1.5 py-0.5 text-xs font-semibold"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                </select>
              </div>

              <div className="font-mono text-xs">
                {totalRows === 0 ? "0-0 of 0" : `${startIndex + 1}-${Math.min(startIndex + rowsPerPage, totalRows)} of ${totalRows}`}
              </div>

              <div className="flex items-center gap-1">
                <button 
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="p-1 rounded disabled:opacity-30"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="p-1 rounded disabled:opacity-30"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Rekam Retur */}
        {isCreateOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Rekam Retur Dokumen Lain Masukan</h3>
                <button onClick={() => setIsCreateOpen(false)} className="p-1 text-slate-500"><X className="w-4 h-4" /></button>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold mb-1">Nomor Nota Retur</label>
                  <input
                    type="text"
                    required
                    value={returnNumber}
                    onChange={(e) => setReturnNumber(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-lg p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Nomor Dokumen Masukan Asal</label>
                  <input
                    type="text"
                    required
                    value={originalInvoiceNumber}
                    onChange={(e) => setOriginalInvoiceNumber(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-lg p-2 font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Nama Penjual</label>
                    <input
                      type="text"
                      required
                      value={counterpartyName}
                      onChange={(e) => setCounterpartyName(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">DPP Retur (Rp)</label>
                    <input
                      type="number"
                      required
                      value={dppReturned}
                      onChange={(e) => setDppReturned(Number(e.target.value))}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-lg p-2 font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Alasan Retur</label>
                  <textarea
                    rows={2}
                    required
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-lg p-2"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setIsCreateOpen(false)} className="px-3 py-1.5 border rounded-lg">Batal</button>
                  <button type="submit" className="px-4 py-1.5 bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold rounded-lg cursor-pointer">Simpan</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Detail */}
        {selectedReturn && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-5 space-y-3">
              <div className="flex justify-between border-b pb-2">
                <h3 className="font-bold text-sm">Detail Retur Dokumen Lain Masukan</h3>
                <button onClick={() => setSelectedReturn(null)}><X className="w-4 h-4" /></button>
              </div>
              <div className="text-xs space-y-1.5">
                <div><span className="text-slate-400">Nomor Retur:</span> <span className="font-mono font-bold">{selectedReturn.returnNumber}</span></div>
                <div><span className="text-slate-400">Dokumen Asal:</span> <span className="font-mono">{selectedReturn.originalInvoiceNumber}</span></div>
                <div><span className="text-slate-400">Penjual:</span> <span className="font-semibold">{selectedReturn.counterpartyName}</span></div>
                <div><span className="text-slate-400">Nilai:</span> <span className="font-mono font-bold">{formatRupiah(selectedReturn.dppReturned)}</span></div>
                <div><span className="text-slate-400">Alasan:</span> {selectedReturn.reason}</div>
              </div>
              <div className="flex justify-end pt-2">
                <button onClick={() => setSelectedReturn(null)} className="px-3 py-1 bg-slate-100 rounded">Tutup</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
