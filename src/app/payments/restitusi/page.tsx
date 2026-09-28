"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useApp } from "@/context/AppContext";
import { Receipt, Send, AlertCircle } from "lucide-react";
import { formatRupiah } from "@/lib/utils";

export default function FormulirRestitusiPajakPage() {
  const { schoolProfile, showToast } = useApp();
  const [taxType, setTaxType] = useState("PPN Lebih Bayar (Pasal 9 Ayat 4c UU PPN)");
  const [refundAmount, setRefundAmount] = useState(8500000);
  const [bankAccount, setBankAccount] = useState("Bank DKI - Rekening Kas BOS SMK (012-34-56789-0)");
  const [reason, setReason] = useState("Kelebihan pembayaran pajak akibat transaksi belanja modal BOS dengan PPN dibebaskan/tidak dipungut");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast({
      type: "success",
      title: "Permohonan Restitusi Terdaftar",
      description: `Permohonan pengembalian kelebihan pembayaran pajak sebesar ${formatRupiah(refundAmount)} terdaftar dengan nomor BPE: REST-${Date.now().toString().slice(-6)}`
    });
  };

  return (
    <AppShell
      breadcrumbs={[
        { label: "Beranda", href: "/dashboard" },
        { label: "Pembayaran", href: "/payments" },
        { label: "Formulir Restitusi Pajak" }
      ]}
    >
      <div className="space-y-5">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#381750] text-white flex items-center justify-center shadow-md">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Formulir Restitusi Pajak</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Pengajuan pengembalian kelebihan pembayaran pajak (restitusi dana kas sekolah)</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Kategori Pajak Lebih Bayar
                </label>
                <select
                  value={taxType}
                  onChange={(e) => setTaxType(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 font-semibold outline-none"
                >
                  <option value="PPN Lebih Bayar (Pasal 9 Ayat 4c UU PPN)">PPN Lebih Bayar (Pasal 9 Ayat 4c UU PPN)</option>
                  <option value="PPh Lebih Bayar Tahunan Badan">PPh Lebih Bayar Tahunan Badan</option>
                  <option value="Pajak yang Seharusnya Tidak Terutang">Pajak yang Seharusnya Tidak Terutang</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Jumlah Pengembalian Dimohonkan (Rp)
                </label>
                <input
                  type="number"
                  required
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 font-mono font-bold text-emerald-600 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Rekening Tujuan Pengembalian Dana
              </label>
              <input
                type="text"
                required
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 font-medium outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Dasar Hukum & Alasan Restitusi
              </label>
              <textarea
                rows={3}
                required
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
                <span>Kirim Permohonan Restitusi</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
