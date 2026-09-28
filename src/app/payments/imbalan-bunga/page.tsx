"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useApp } from "@/context/AppContext";
import { Percent, Send } from "lucide-react";
import { formatRupiah } from "@/lib/utils";

export default function ImbalanBungaPage() {
  const { showToast } = useApp();
  const [skNumber, setSkNumber] = useState("SKPLB-2026-00489/WPJ.04");
  const [interestAmount, setInterestAmount] = useState(480000);
  const [bankAccount, setBankAccount] = useState("Bank DKI - Kas BOS SMK Bina Putra Jakarta");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast({
      type: "success",
      title: "Permohonan Imbalan Bunga Dikirim",
      description: `Permohonan imbalan bunga atas ${skNumber} telah tercatat di KPP Pratama.`
    });
  };

  return (
    <AppShell
      breadcrumbs={[
        { label: "Beranda", href: "/dashboard" },
        { label: "Pembayaran", href: "/payments" },
        { label: "Permohonan Pemberian Imbalan Bunga" }
      ]}
    >
      <div className="space-y-5">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#381750] text-white flex items-center justify-center shadow-md">
              <Percent className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Permohonan Pemberian Imbalan Bunga</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Pengajuan hak imbalan bunga keterlambatan pengembalian kelebihan pembayaran pajak (Pasal 27B KUP)</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nomor Keputusan Kelebihan Bayar (SKPLB)
                </label>
                <input
                  type="text"
                  required
                  value={skNumber}
                  onChange={(e) => setSkNumber(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Jumlah Imbalan Bunga yang Dimohon (Rp)
                </label>
                <input
                  type="number"
                  required
                  value={interestAmount}
                  onChange={(e) => setInterestAmount(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 font-mono font-bold text-emerald-600 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Rekening Penampungan Dana Imbalan Bunga
              </label>
              <input
                type="text"
                required
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 font-medium outline-none"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold text-xs shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim Permohonan Imbalan Bunga</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
