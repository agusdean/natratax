"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useApp } from "@/context/AppContext";
import { ShieldCheck, Send } from "lucide-react";
import { formatRupiah } from "@/lib/utils";

export default function PphDtpPage() {
  const { showToast } = useApp();
  const [incentiveType, setIncentiveType] = useState("PPh DTP Fasilitas Layanan Air Bersih / PDAM Pendidikan");
  const [period, setPeriod] = useState("Tahun 2026");
  const [amount, setAmount] = useState(3200000);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast({
      type: "success",
      title: "Laporan Realisasi PPh DTP Diterima",
      description: `Laporan pemanfaatan insentif PPh Ditanggung Pemerintah sebesar ${formatRupiah(amount)} berhasil disimpan.`
    });
  };

  return (
    <AppShell
      breadcrumbs={[
        { label: "Beranda", href: "/dashboard" },
        { label: "Pembayaran", href: "/payments" },
        { label: "Permohonan PPh DTP" }
      ]}
    >
      <div className="space-y-5">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#381750] text-white flex items-center justify-center shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Permohonan PPh DTP (Ditanggung Pemerintah)</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Pemanfaatan insentif fiskal perpajakan Ditanggung Pemerintah atas utilitas dan sarana pendidikan</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Skema Insentif PPh DTP
                </label>
                <input
                  type="text"
                  required
                  value={incentiveType}
                  onChange={(e) => setIncentiveType(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Masa / Tahun Pajak Insentif
                </label>
                <input
                  type="text"
                  required
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Estimasi Nilai Pajak DTP (Rp)
              </label>
              <input
                type="number"
                required
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 font-mono font-bold text-amber-600 outline-none"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold text-xs shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Simpan Realisasi PPh DTP</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
