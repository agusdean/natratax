"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useApp } from "@/context/AppContext";
import { ShieldAlert, Send, FileText } from "lucide-react";

export default function PengungkapanKetidakbenaranPage() {
  const { schoolProfile, addServiceRequest, showToast } = useApp();
  const [sptType, setSptType] = useState("SPT Masa PPN 1111");
  const [masaPajak, setMasaPajak] = useState("08-2026");
  const [taxShortfall, setTaxShortfall] = useState(1500000);
  const [reason, setReason] = useState("Koreksi pengkreditan faktur pajak masukan atas transaksi BOS");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created = addServiceRequest({
      type: "ADMINISTRASI",
      title: `Pengungkapan Ketidakbenaran ${sptType} (${masaPajak})`,
      category: "Pengungkapan Ketidakbenaran Pasal 8 KUP",
      applicantName: schoolProfile.principalName || "DR. H. SURYADI, M.PD",
      npwp: schoolProfile.taxId || "9988770000010609",
      status: "DALAM_PROSES",
      progressPercent: 20,
      currentStep: "Penelitian Formal Pengungkapan Ketidakbenaran SPT",
      notes: `Kekurangan Pajak Terutang: Rp ${Number(taxShortfall).toLocaleString("id-ID")}. Keterangan: ${reason}`,
    });

    showToast({
      type: "success",
      title: "Pengungkapan Ketidakbenaran Terdaftar",
      description: `Laporan pengungkapan ketidakbenaran pengisian SPT (Pasal 8 UU KUP) tersimpan dengan tiket: ${created.ticketNumber}.`
    });
  };

  return (
    <AppShell
      breadcrumbs={[
        { label: "Beranda", href: "/dashboard" },
        { label: "SPT", href: "/spt" },
        { label: "Pengungkapan Ketidakbenaran SPT" }
      ]}
    >
      <div className="space-y-5">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Pengungkapan Ketidakbenaran Pengisian SPT</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Fasilitas pengungkapan sukarela sebelum tindakan pemeriksaan sesuai Pasal 8 UU KUP</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Jenis SPT yang Diungkapkan
                </label>
                <select
                  value={sptType}
                  onChange={(e) => setSptType(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 font-semibold outline-none"
                >
                  <option value="SPT Masa PPN 1111">SPT Masa PPN 1111</option>
                  <option value="SPT Masa PPh Unifikasi">SPT Masa PPh Unifikasi</option>
                  <option value="SPT Tahunan PPh Badan">SPT Tahunan PPh Badan</option>
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

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Kekurangan Pembayaran Pajak (Rp)
              </label>
              <input
                type="number"
                required
                value={taxShortfall}
                onChange={(e) => setTaxShortfall(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 font-mono font-bold text-amber-600 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Penjelasan Ketidakbenaran & Fakta Materiel
              </label>
              <textarea
                rows={4}
                required
                placeholder="Jelaskan pos penghasilan atau faktur masukan yang belum sempat diperhitungkan pada pelaporan sebelumnya..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 outline-none font-medium"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold text-xs shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim Pernyataan Pengungkapan</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
