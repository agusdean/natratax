"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useApp } from "@/context/AppContext";
import { Download, Plus, ChevronLeft, ChevronRight, Eye, X, FileText } from "lucide-react";
import { formatRupiah, formatNPWP } from "@/lib/utils";
import { ExportModal } from "@/components/features/ExportModal";
import { OtherTaxDocument } from "@/types";

export default function DokumenLainKeluaranPage() {
  const { otherTaxDocuments, addOtherTaxDocument, isCompactMode, setIsCompactMode } = useApp();
  const [filterNpwp, setFilterNpwp] = useState("");
  const [filterNama, setFilterNama] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<OtherTaxDocument | null>(null);

  // Form state
  const [documentType, setDocumentType] = useState("Pemberitahuan Ekspor Barang (Teaching Factory)");
  const [documentNumber, setDocumentNumber] = useState(`PEB-${String(Date.now()).slice(-6)}-2026`);
  const [counterpartyName, setCounterpartyName] = useState("Global EduTech Solutions Ltd");
  const [counterpartyNpwp, setCounterpartyNpwp] = useState("000000000000000");
  const [dppAmount, setDppAmount] = useState<number>(25000000);
  const [ppnAmount, setPpnAmount] = useState<number>(0); // 0% ekspor
  const [description, setDescription] = useState("Penyerahan modul multimedia & software lab kejuruan luar daerah pabean");

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addOtherTaxDocument({
      documentNumber,
      documentType,
      type: "DOKUMEN_KELUARAN",
      date: new Date().toISOString().split("T")[0],
      counterpartyName,
      counterpartyNpwp,
      dpp: Number(dppAmount),
      ppn: Number(ppnAmount),
      status: "TERVERIFIKASI",
      description,
    });
    setIsCreateOpen(false);
  };

  const list = otherTaxDocuments.filter((d) => d.type === "DOKUMEN_KELUARAN");
  const filteredList = list.filter((d) => {
    const matchesNpwp = !filterNpwp || d.counterpartyNpwp.toLowerCase().includes(filterNpwp.toLowerCase());
    const matchesNama = !filterNama || d.counterpartyName.toLowerCase().includes(filterNama.toLowerCase());
    return matchesNpwp && matchesNama;
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
        { label: "Dokumen Lain Keluaran" }
      ]}
    >
      <div className="space-y-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Dokumen Lain Pajak Keluaran
            </h1>
            <span className="text-xs text-slate-500 font-mono">({totalRows} rekaman)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Rekam Dokumen Lain</span>
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
                      <div>NPWP Lawan Transaksi</div>
                      <input
                        type="text"
                        placeholder="Filter NPWP..."
                        value={filterNpwp}
                        onChange={(e) => setFilterNpwp(e.target.value)}
                        className="w-full h-7 px-2 text-xs font-normal text-slate-900 bg-white dark:bg-slate-800 border border-amber-300 rounded shadow-2xs outline-none"
                      />
                    </div>
                  </th>
                  <th className="py-2.5 px-3 min-w-[200px]">
                    <div className="space-y-1.5">
                      <div>Nama Lawan Transaksi</div>
                      <input
                        type="text"
                        placeholder="Filter Nama..."
                        value={filterNama}
                        onChange={(e) => setFilterNama(e.target.value)}
                        className="w-full h-7 px-2 text-xs font-normal text-slate-900 bg-white dark:bg-slate-800 border border-amber-300 rounded shadow-2xs outline-none"
                      />
                    </div>
                  </th>
                  <th className="py-2.5 px-3 min-w-[150px]">No. Dokumen</th>
                  <th className="py-2.5 px-3 min-w-[180px]">Jenis Dokumen</th>
                  <th className="py-2.5 px-3 min-w-[110px] text-right">DPP (Rp)</th>
                  <th className="py-2.5 px-3 min-w-[110px] text-right">PPN (Rp)</th>
                  <th className="py-2.5 px-3 min-w-[100px] text-center">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
                {currentRows.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-16 text-center text-slate-400">
                      <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                        Data Not Found
                      </span>
                    </td>
                  </tr>
                ) : (
                  currentRows.map((doc) => (
                    <tr 
                      key={doc.id} 
                      className={`hover:bg-amber-50/50 dark:hover:bg-amber-950/20 transition-colors ${
                        selectedIds.includes(doc.id) ? "bg-amber-50 dark:bg-amber-950/30" : ""
                      }`}
                    >
                      <td className="py-2.5 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(doc.id)}
                          onChange={() => toggleSelectRow(doc.id)}
                          className="rounded border-slate-300 text-amber-600"
                        />
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={() => setSelectedDoc(doc)}
                          className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-indigo-600 dark:text-indigo-400"
                          title="Lihat Detail Dokumen"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </td>
                      <td className="py-2.5 px-3 font-mono">{formatNPWP(doc.counterpartyNpwp)}</td>
                      <td className="py-2.5 px-3 font-medium">{doc.counterpartyName}</td>
                      <td className="py-2.5 px-3 font-mono font-semibold text-amber-700 dark:text-amber-400">{doc.documentNumber}</td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">{doc.documentType}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-semibold">{formatRupiah(doc.dpp)}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-amber-600">{formatRupiah(doc.ppn)}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          {doc.status}
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
              <span className="font-semibold text-slate-700 dark:text-slate-300">Padatkan</span>
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

        {/* Modal Rekam Dokumen Lain */}
        {isCreateOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
            <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-[#f59e0b] text-slate-900">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  <h3 className="font-bold text-sm">Rekam Dokumen Lain Pajak Keluaran</h3>
                </div>
                <button onClick={() => setIsCreateOpen(false)} className="p-1 hover:bg-amber-600 rounded">
                  <X className="w-5 h-5 text-slate-900" />
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="p-5 space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Jenis Dokumen Transaksi
                  </label>
                  <select
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 font-medium"
                  >
                    <option value="Pemberitahuan Ekspor Barang (Teaching Factory)">Pemberitahuan Ekspor Barang (Teaching Factory)</option>
                    <option value="Tagihan BUMN / Perum Penyerahan Jasa">Tagihan BUMN / Perum Penyerahan Jasa</option>
                    <option value="Nota Pelayanan Jasa Pelatihan & Workshop">Nota Pelayanan Jasa Pelatihan & Workshop</option>
                    <option value="Surat Ketetapan Pajak / Bukti Lainnya">Surat Ketetapan Pajak / Bukti Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nomor Dokumen
                  </label>
                  <input
                    type="text"
                    required
                    value={documentNumber}
                    onChange={(e) => setDocumentNumber(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 font-mono font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Nama Lawan Transaksi
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
                      NPWP / TIN
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
                      Nilai DPP (Rp)
                    </label>
                    <input
                      type="number"
                      required
                      min={1000}
                      value={dppAmount}
                      onChange={(e) => setDppAmount(Number(e.target.value))}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Nilai PPN (Rp)
                    </label>
                    <input
                      type="number"
                      required
                      value={ppnAmount}
                      onChange={(e) => setPpnAmount(Number(e.target.value))}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 font-mono font-bold text-amber-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Uraian / Keterangan Dokumen
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
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
                    Simpan Dokumen
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Detail Dokumen */}
        {selectedDoc && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-500" />
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Detail Dokumen Lain Pajak</h3>
                </div>
                <button onClick={() => setSelectedDoc(null)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">Nomor Dokumen</span>
                  <span className="font-mono font-bold text-amber-600">{selectedDoc.documentNumber}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">Jenis Dokumen</span>
                  <span className="font-medium text-right max-w-[200px]">{selectedDoc.documentType}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">Lawan Transaksi</span>
                  <span className="font-semibold">{selectedDoc.counterpartyName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">NPWP</span>
                  <span className="font-mono">{formatNPWP(selectedDoc.counterpartyNpwp)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">Nilai DPP</span>
                  <span className="font-mono font-semibold">{formatRupiah(selectedDoc.dpp)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">Nilai PPN</span>
                  <span className="font-mono font-bold text-amber-600">{formatRupiah(selectedDoc.ppn)}</span>
                </div>
                {selectedDoc.description && (
                  <div className="py-2 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg text-slate-600 dark:text-slate-300">
                    <span className="block font-bold text-[11px] mb-0.5">Uraian:</span>
                    {selectedDoc.description}
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedDoc(null)}
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
          title="Ekspor Data Dokumen Lain Pajak Keluaran"
          defaultFilename="Dokumen_Lain_Keluaran_NatraTax"
        />
      </div>
    </AppShell>
  );
}
