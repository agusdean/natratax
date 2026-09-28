"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useApp } from "@/context/AppContext";
import { FileText, Send, ArrowRight, CheckCircle2, History, Clock } from "lucide-react";
import { formatRupiah } from "@/lib/utils";

export default function PemindahbukuanPage() {
  const { schoolProfile, addServiceRequest, serviceRequests, showToast } = useApp();
  const [sourceBilling, setSourceBilling] = useState("0239 8812 9012");
  const [sourceTaxType, setSourceTaxType] = useState("PPh Pasal 21 Bulanan");
  const [targetTaxType, setTargetTaxType] = useState("PPh Final Pasal 4 ayat (2)");
  const [amount, setAmount] = useState(1250000);
  const [reason, setReason] = useState("Kesalahan pemilihan Kode Akun Pajak (KAP) pada saat setoran BOS tahap 2");

  const pbkList = serviceRequests.filter((r) => r.type === "PEMINDAHBUKUAN");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created = addServiceRequest({
      type: "PEMINDAHBUKUAN",
      title: `Permohonan Pbk: ${sourceTaxType} ke ${targetTaxType}`,
      category: "Pemindahbukuan (Pbk)",
      applicantName: schoolProfile.principalName || "DR. H. SURYADI, M.PD",
      npwp: schoolProfile.taxId || "9988770000010609",
      status: "DALAM_PROSES",
      progressPercent: 30,
      currentStep: "Penelitian Validitas Bukti Setor & Saldo Kas Negara",
      notes: `Alasan: ${reason}. NTPN/Billing: ${sourceBilling}. Nominal: Rp ${amount.toLocaleString("id-ID")}`,
    });

    showToast({
      type: "success",
      title: "Permohonan Pbk Diterima",
      description: `Permohonan Pbk ${formatRupiah(amount)} tercatat dengan BPE: ${created.bpeNumber}.`
    });
  };

  return (
    <AppShell
      breadcrumbs={[
        { label: "Beranda", href: "/dashboard" },
        { label: "Pembayaran", href: "/payments" },
        { label: "Permohonan Pemindahbukuan" }
      ]}
    >
      <div className="space-y-5">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#381750] text-white flex items-center justify-center shadow-md">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Permohonan Pemindahbukuan (Pbk)</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Pengalihan setoran pajak akibat salah kode akun, masa pajak, atau NPWP</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <h3 className="font-bold text-sm mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
            Formulir Elektronik Surat Permohonan Pemindahbukuan
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nomor Kode Billing / Bukti Penerimaan Negara (NTPN) Asal
                </label>
                <input
                  type="text"
                  required
                  value={sourceBilling}
                  onChange={(e) => setSourceBilling(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Jumlah Yang Diajukan Pbk (Rp)
                </label>
                <input
                  type="number"
                  required
                  min={1000}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 font-mono font-bold text-indigo-600 dark:text-indigo-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Akun Pajak & Jenis Setoran Asal
                </label>
                <input
                  type="text"
                  required
                  value={sourceTaxType}
                  onChange={(e) => setSourceTaxType(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tujuan Pemindahbukuan
                </label>
                <input
                  type="text"
                  required
                  value={targetTaxType}
                  onChange={(e) => setTargetTaxType(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Alasan & Dasar Pertimbangan Pemindahbukuan
              </label>
              <textarea
                rows={3}
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim Permohonan Pbk ke KPP</span>
              </button>
            </div>
          </form>
        </div>

        {/* Riwayat Permohonan Pbk */}
        {pbkList.length > 0 && (
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <History className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-xs">Riwayat Permohonan Pemindahbukuan</h3>
            </div>
            <div className="space-y-2 text-xs">
              {pbkList.map((p) => (
                <div key={p.id} className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="font-mono text-amber-600 font-bold">{p.ticketNumber}</span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{p.title}</p>
                    <p className="text-[11px] text-slate-400">{p.notes}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
