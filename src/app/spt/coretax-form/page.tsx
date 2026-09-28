"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useApp } from "@/context/AppContext";
import { FileSpreadsheet, Send, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { formatRupiah } from "@/lib/utils";

export default function CoretaxFormPage() {
  const { schoolProfile, showToast, addSpt } = useApp();
  const [taxType, setTaxType] = useState("PPh Unifikasi (Pasal 21, 22, 23, 4(2))");
  const [masaPajak, setMasaPajak] = useState("09-2026");
  const [sptType, setSptType] = useState<"MASA" | "TAHUNAN">("MASA");
  const [pembetulanKe, setPembetulanKe] = useState(0);
  const [totalBruto, setTotalBruto] = useState(45000000);
  const [totalPajakTerutang, setTotalPajakTerutang] = useState(2475000);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addSpt({
      taxType,
      sptCategory: (sptType === "MASA" || sptType === "TAHUNAN" || sptType === "PEMBETULAN") ? sptType : "MASA",
      taxPeriod: masaPajak,
      periodMonth: 9,
      periodYear: 2026,
      totalDpp: Number(totalBruto),
      totalTax: Number(totalPajakTerutang),
      status: "KONSEP",
    });

    showToast({
      type: "success",
      title: "Konsep Coretax Form Dibuat",
      description: `SPT Masa ${masaPajak} untuk ${taxType} berhasil disimpan sebagai konsep SPT.`
    });
  };

  return (
    <AppShell
      breadcrumbs={[
        { label: "Beranda", href: "/dashboard" },
        { label: "SPT", href: "/spt" },
        { label: "Coretax Form" }
      ]}
    >
      <div className="space-y-5">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#381750] text-white flex items-center justify-center shadow-md">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Coretax Form SPT Elektronik</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Pengisian formulir terpadu SPT Masa & Tahunan sesuai sistem Coretax DJP</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Jenis Pajak
                </label>
                <select
                  value={taxType}
                  onChange={(e) => setTaxType(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 font-semibold outline-none"
                >
                  <option value="PPh Unifikasi (Pasal 21, 22, 23, 4(2))">PPh Unifikasi (Pasal 21, 22, 23, 4(2))</option>
                  <option value="PPN dan PPnBM Masa (1111)">PPN dan PPnBM Masa (1111)</option>
                  <option value="PPh Pasal 21 Bulanan">PPh Pasal 21 Bulanan</option>
                  <option value="SPT Tahunan Badan (Yayasan / Sekolah)">SPT Tahunan Badan (Yayasan / Sekolah)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Masa / Tahun Pajak
                </label>
                <input
                  type="text"
                  required
                  value={masaPajak}
                  onChange={(e) => setMasaPajak(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 font-mono outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Kategori SPT
                </label>
                <select
                  value={sptType}
                  onChange={(e) => setSptType(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 font-semibold outline-none"
                >
                  <option value="MASA">SPT MASA</option>
                  <option value="TAHUNAN">SPT TAHUNAN</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Pembetulan Ke-
                </label>
                <input
                  type="number"
                  min={0}
                  max={99}
                  value={pembetulanKe}
                  onChange={(e) => setPembetulanKe(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 font-mono font-bold outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Total Pajak Terutang (Rp)
                </label>
                <input
                  type="number"
                  min={0}
                  value={totalPajakTerutang}
                  onChange={(e) => setTotalPajakTerutang(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 font-mono font-bold text-amber-600 outline-none"
                />
              </div>
            </div>

            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900/60 text-[11px] text-amber-900 dark:text-amber-200">
              Coretax Form akan otomatis mengompilasi seluruh Bukti Potong terbit dan Faktur Pajak dalam masa pajak yang dipilih untuk membentuk Lampiran Induk SPT.
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold text-xs shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Simpan Konsep SPT Coretax</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
