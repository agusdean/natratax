"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useApp } from "@/context/AppContext";
import { BookOpen, Plus, Download, FileSpreadsheet, X, CheckCircle2 } from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import { ExportModal } from "@/components/features/ExportModal";

export default function PencatatanPajakPage() {
  const { grossRevenues, addGrossRevenue, addPayment, showToast } = useApp();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Form state
  const [month, setMonth] = useState(10);
  const [year, setYear] = useState(2026);
  const [grossRevenue, setGrossRevenue] = useState(55000000);
  const [notes, setNotes] = useState("Peredaran Bruto Unit Teaching Factory & Jasa Pelatihan Komputer");

  const finalTaxRate = 0.5;
  const finalTaxDue = Math.round(grossRevenue * 0.005);

  const monthNames = [
    "", "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const billingCode = `0239 ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`;

    addGrossRevenue({
      month,
      year,
      grossRevenue: Number(grossRevenue),
      finalTaxRate,
      finalTaxDue,
      billingCode,
      isPaid: false,
      notes,
    });

    // Also auto-generate unpaid billing in Pembayaran so they can pay it!
    addPayment({
      billingCode,
      taxType: "PPh Final PP 55/2022 UMKM (411128 - 420)",
      period: `${String(month).padStart(2, "0")}-${year}`,
      amount: finalTaxDue,
      dueDate: `${year}-${String(month + 1).padStart(2, "0")}-15`,
      status: "PENDING",
      referenceNote: `Setoran PPh Final Omset ${monthNames[month]} ${year}`,
    });

    setIsCreateOpen(false);
    showToast({
      type: "success",
      title: "Pencatatan Berhasil Disimpan",
      description: `Omset ${monthNames[month]} ${year} tersimpan. Kode Billing ${billingCode} otomatis diterbitkan di menu Pembayaran.`
    });
  };

  return (
    <AppShell
      breadcrumbs={[
        { label: "Beranda", href: "/dashboard" },
        { label: "SPT", href: "/spt" },
        { label: "Pencatatan" }
      ]}
    >
      <div className="space-y-5">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#381750] text-white flex items-center justify-center shadow-md">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Pencatatan Peredaran Bruto</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Pencatatan peredaran usaha berkala dan penghitungan PPh Final PP 55/2022</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold text-xs shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Input Omset Baru</span>
            </button>
            <button
              onClick={() => setIsExportOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-xs shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor</span>
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f59e0b] text-slate-950 font-bold uppercase text-[11px]">
                <tr>
                  <th className="py-2.5 px-4">Masa Pajak</th>
                  <th className="py-2.5 px-4 text-right">Peredaran Bruto / Omset (Rp)</th>
                  <th className="py-2.5 px-4 text-center">Tarif Pajak</th>
                  <th className="py-2.5 px-4 text-right">PPh Final Terutang (Rp)</th>
                  <th className="py-2.5 px-4">Kode Billing Setor</th>
                  <th className="py-2.5 px-4 text-center">Status Pembayaran</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {grossRevenues.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-semibold">
                      <div>{monthNames[r.month]} {r.year}</div>
                      <div className="text-[11px] text-slate-400 font-normal">{r.notes}</div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                      {formatRupiah(r.grossRevenue)}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-amber-600">
                      {r.finalTaxRate}%
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600">
                      {formatRupiah(r.finalTaxDue)}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-amber-700 dark:text-amber-400">
                      {r.billingCode || "-"}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        r.isPaid 
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                      }`}>
                        {r.isPaid ? "LUNAS" : "BELUM DIBAYAR"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Input Omset */}
        {isCreateOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-amber-500" />
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Pencatatan Omset Bulanan Sekolah</h3>
                </div>
                <button onClick={() => setIsCreateOpen(false)} className="p-1 hover:bg-slate-100 rounded">
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Masa Bulan</label>
                    <select
                      value={month}
                      onChange={(e) => setMonth(Number(e.target.value))}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-lg p-2 font-medium"
                    >
                      {monthNames.map((name, idx) => idx > 0 && (
                        <option key={idx} value={idx}>{name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Tahun Pajak</label>
                    <input
                      type="number"
                      value={year}
                      onChange={(e) => setYear(Number(e.target.value))}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-lg p-2 font-mono font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Total Peredaran Bruto / Omset (Rp)</label>
                  <input
                    type="number"
                    required
                    min={1000}
                    value={grossRevenue}
                    onChange={(e) => setGrossRevenue(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-lg p-2.5 font-mono font-bold text-slate-900 dark:text-white"
                  />
                </div>

                <div className="bg-amber-50 dark:bg-amber-950/40 p-3 rounded-xl border border-amber-200 dark:border-amber-900 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-amber-800 dark:text-amber-300">Tarif PPh Final (PP 55/2022):</span>
                    <span className="font-bold">0.5%</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm text-emerald-700 dark:text-emerald-400 pt-1 border-t border-amber-200/50">
                    <span>Estimasi Pajak Terutang:</span>
                    <span className="font-mono">{formatRupiah(finalTaxDue)}</span>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Keterangan Sumber Omset</label>
                  <textarea
                    rows={2}
                    required
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-lg p-2"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                  <button type="button" onClick={() => setIsCreateOpen(false)} className="px-4 py-2 border rounded-lg">Batal</button>
                  <button type="submit" className="px-4 py-2 bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold rounded-lg cursor-pointer">
                    Simpan & Terbitkan Billing
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <ExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          title="Ekspor Rekapitulasi Pencatatan Bruto"
          defaultFilename="Pencatatan_Bruto_2026_NatraTax"
        />
      </div>
    </AppShell>
  );
}
