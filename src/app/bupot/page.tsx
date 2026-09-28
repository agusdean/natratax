"use client";

import React, { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useSearchParams } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { 
  FileCheck2, 
  Plus, 
  Download, 
  Search, 
  Eye, 
  Printer, 
  X 
} from "lucide-react";
import { formatRupiah, formatNPWP } from "@/lib/utils";
import { ExportModal } from "@/components/features/ExportModal";
import { BupotDetailModal } from "@/components/features/BupotDetailModal";
import { TaxType, WithholdingSlip, BupotType } from "@/types";

function BupotPageContent() {
  const searchParams = useSearchParams();
  const { bupotList, addBupot, isCompactMode, showToast } = useApp();

  const [activeTypeFilter, setActiveTypeFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isCreateBupotOpen, setIsCreateBupotOpen] = useState(false);
  const [selectedBupot, setSelectedBupot] = useState<WithholdingSlip | null>(null);

  // Form state
  const [bupotType, setBupotType] = useState<BupotType>("BP21");
  const [taxType, setTaxType] = useState<TaxType>("PPH21");
  const [taxObjectCode, setTaxObjectCode] = useState("21-100-03");
  const [objectDescription, setObjectDescription] = useState("Imbalan kepada Tenaga Ahli / Asesor Uji Kompetensi");
  const [beneficiaryName, setBeneficiaryName] = useState("Ahmad Fauzi, S.Kom");
  const [beneficiaryNpwpNik, setBeneficiaryNpwpNik] = useState("3175081203890002");
  const [grossAmount, setGrossAmount] = useState(5000000);
  const [effectiveRate, setEffectiveRate] = useState(2.5);
  const [taxWithheld, setTaxWithheld] = useState(125000);

  useEffect(() => {
    const typeParam = searchParams.get("type");
    if (typeParam) {
      const upper = typeParam.toUpperCase();
      if (upper === "A1") setActiveTypeFilter("BP_A1");
      else if (upper === "A2") setActiveTypeFilter("BP_A2");
      else setActiveTypeFilter(upper);
    } else {
      setActiveTypeFilter("ALL");
    }
  }, [searchParams]);

  const filteredBupot = bupotList.filter((b) => {
    const matchesType = activeTypeFilter === "ALL" || b.bupotType === activeTypeFilter;
    const matchesSearch =
      b.bupotNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.beneficiaryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.beneficiaryNpwpNik.includes(searchQuery) ||
      b.objectDescription.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addBupot({
      bupotType,
      taxType,
      taxObjectCode,
      objectDescription,
      beneficiaryName,
      beneficiaryNpwpNik,
      grossAmount,
      effectiveRate,
      taxWithheld,
      periodMonth: 9,
      periodYear: 2026,
      status: "TERBIT",
    });
    setIsCreateBupotOpen(false);
  };

  return (
    <AppShell
      breadcrumbs={[
        { label: "Beranda", href: "/dashboard" },
        { label: "e-Bupot", href: "/bupot" },
        { label: "Bukti Potong" }
      ]}
    >
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#381750] text-white flex items-center justify-center shadow-md">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Bukti Pemotongan Pajak (e-Bupot)
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Penerbitan Bukti Potong PPh 21 (Guru/Staf), PPh 22/23 (Rekanan), & PPh Final
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCreateBupotOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#381750] hover:bg-[#4a1f6a] text-white font-bold text-xs sm:text-sm shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Bukti Potong</span>
            </button>
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-600 dark:text-slate-300"
              title="Ekspor"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Type Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: "ALL", label: "Semua Bukti Potong" },
            { id: "BP21", label: "BP 21 (Guru GTT & Narasumber)" },
            { id: "BPPU", label: "BPPU (PPh 22 & 23 Rekanan BOS)" },
            { id: "BP4_2", label: "PPh Final 4(2) Sarana/Sewa" },
            { id: "BPNR", label: "BPNR (Non-Residen)" },
            { id: "BP26", label: "BP 26 Luar Negeri" },
            { id: "BP_A1", label: "BP A1 Tahunan Guru" },
            { id: "BP_A2", label: "BP A2 ASN / PNS" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTypeFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                activeTypeFilter === tab.id
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Table Container */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="relative w-full max-w-xs">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari penerima, NIK, kode..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 outline-none"
              />
            </div>
            <span className="text-xs text-slate-400 font-medium">
              {filteredBupot.length} Berkas Ditemukan
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className={`w-full text-left text-xs ${isCompactMode ? "compact-table" : ""}`}>
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">No. Bukti Potong</th>
                  <th className="py-3 px-4">Kode Objek</th>
                  <th className="py-3 px-4">Penerima Penghasilan</th>
                  <th className="py-3 px-4">NPWP / NIK</th>
                  <th className="py-3 px-4 text-right">Penghasilan Bruto</th>
                  <th className="py-3 px-4 text-center">Tarif</th>
                  <th className="py-3 px-4 text-right">PPh Dipotong</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
                {filteredBupot.length > 0 ? (
                  filteredBupot.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {b.bupotNumber}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[10px] font-bold">
                          {b.taxObjectCode}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold">
                        <div>{b.beneficiaryName}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{b.objectDescription}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                        {formatNPWP(b.beneficiaryNpwpNik)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold">
                        {formatRupiah(b.grossAmount)}
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-amber-600">
                        {b.effectiveRate}%
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-black text-red-600 dark:text-red-400">
                        {formatRupiah(b.taxWithheld)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          {b.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setSelectedBupot(b)}
                            className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 text-[11px] font-semibold flex items-center gap-1"
                            title="Lihat Bukti Potong"
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
                          <FileCheck2 className="w-6 h-6" />
                        </div>
                        <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                          Belum Ada Bukti Potong
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                          Belum ada bukti pemotongan PPh 21, 23, atau 4(2) yang dibuat untuk masa ini.
                        </p>
                        <button
                          onClick={() => setIsCreateBupotOpen(true)}
                          className="mt-1 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#381750] text-white text-xs font-bold hover:bg-[#4d1f6e] transition-colors shadow-xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Buat Bukti Potong Sekarang</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>

      </div>

      {/* Modal Buat Bukti Potong */}
      {isCreateBupotOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Buat Bukti Pemotongan Pajak Baru
              </h3>
              <button onClick={() => setIsCreateBupotOpen(false)} className="p-1 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Jenis Bukti Pemotongan
                </label>
                <select
                  value={bupotType}
                  onChange={(e) => {
                    const val = e.target.value as any;
                    setBupotType(val);
                    if (val === "BP21") {
                      setTaxType("PPH21");
                      setTaxObjectCode("21-100-03");
                      setObjectDescription("Honor Tenaga Ahli / Penguji UKK");
                      setEffectiveRate(2.5);
                      setTaxWithheld(Math.round(grossAmount * 0.025));
                    } else if (val === "BPPU") {
                      setTaxType("PPH23");
                      setTaxObjectCode("23-104-02");
                      setObjectDescription("Jasa Perbaikan Perangkat & Lab SMK");
                      setEffectiveRate(2.0);
                      setTaxWithheld(Math.round(grossAmount * 0.02));
                    }
                  }}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 font-semibold"
                >
                  <option value="BP21">BP 21 - Honorarium Guru GTT & Tenaga Ahli</option>
                  <option value="BPPU">BPPU - PPh Pasal 22 & 23 Jasa / Barang</option>
                  <option value="BP4_2">PPh Final Pasal 4 Ayat 2 - Sewa Lahan/Bangunan</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Lengkap Penerima
                </label>
                <input
                  type="text"
                  required
                  value={beneficiaryName}
                  onChange={(e) => setBeneficiaryName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  NPWP atau NIK Penerima (16 Digit)
                </label>
                <input
                  type="text"
                  required
                  value={beneficiaryNpwpNik}
                  onChange={(e) => setBeneficiaryNpwpNik(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Bruto (Rp)
                  </label>
                  <input
                    type="number"
                    value={grossAmount}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setGrossAmount(val);
                      setTaxWithheld(Math.round((val * effectiveRate) / 100));
                    }}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    PPh Dipotong (Rp)
                  </label>
                  <input
                    type="number"
                    value={taxWithheld}
                    onChange={(e) => setTaxWithheld(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 font-mono font-black text-red-600"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-[11px] text-slate-500">
                Penerbitan bukti potong akan otomatis membukukan pemotongan ke SPT Masa Unifikasi dan Jurnal Pajak Sekolah.
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateBupotOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#381750] text-white rounded-lg font-bold"
                >
                  Terbitkan Bukti Potong
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title="Daftar Bukti Pemotongan Pajak (e-Bupot)"
        rowCount={filteredBupot.length}
        currentFilterText={activeTypeFilter}
      />

      <BupotDetailModal
        bupot={selectedBupot}
        onClose={() => setSelectedBupot(null)}
      />
    </AppShell>
  );
}

export default function BupotPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-slate-400">Memuat data e-Bupot...</div>}>
      <BupotPageContent />
    </React.Suspense>
  );
}
