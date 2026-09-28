"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useApp } from "@/context/AppContext";
import { CreditCard, Send, Plus, Copy } from "lucide-react";
import { formatRupiah } from "@/lib/utils";

export default function LayananMandiriKodeBillingPage() {
  const { addPayment, showToast } = useApp();
  const [taxType, setTaxType] = useState("411124 - PPh Pasal 23");
  const [depositType, setDepositType] = useState("100 - Masa");
  const [period, setPeriod] = useState("09-2026");
  const [amount, setAmount] = useState(750000);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const newCode = "0239 " + Math.floor(1000 + Math.random() * 9000) + " " + Math.floor(1000 + Math.random() * 9000);
    setGeneratedCode(newCode);

    addPayment({
      billingCode: newCode,
      taxType,
      period,
      amount: Number(amount),
      dueDate: "2026-10-15",
      status: "PENDING",
      referenceNote: `Layanan Mandiri Billing ${taxType}`,
    });

    showToast({
      type: "success",
      title: "Kode Billing Terbit",
      description: `Kode billing ${newCode} aktif untuk disetorkan via Kas BOS.`
    });
  };

  return (
    <AppShell
      breadcrumbs={[
        { label: "Beranda", href: "/dashboard" },
        { label: "Pembayaran", href: "/payments" },
        { label: "Layanan Mandiri Kode Billing" }
      ]}
    >
      <div className="space-y-5">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#381750] text-white flex items-center justify-center shadow-md">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Layanan Mandiri Pembuatan Kode Billing</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Penerbitan ID Billing Mandiri untuk penyetoran pajak sekolah & yayasan</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="md:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <form onSubmit={handleGenerate} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Jenis Pajak (KAP)
                  </label>
                  <select
                    value={taxType}
                    onChange={(e) => setTaxType(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 font-semibold outline-none"
                  >
                    <option value="411121 - PPh Pasal 21">411121 - PPh Pasal 21</option>
                    <option value="411122 - PPh Pasal 22 Instansi">411122 - PPh Pasal 22 Instansi</option>
                    <option value="411124 - PPh Pasal 23">411124 - PPh Pasal 23</option>
                    <option value="411128 - PPh Final Pasal 4(2)">411128 - PPh Final Pasal 4(2)</option>
                    <option value="411211 - PPN Dalam Negeri">411211 - PPN Dalam Negeri</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Jenis Setoran (KJS)
                  </label>
                  <select
                    value={depositType}
                    onChange={(e) => setDepositType(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 font-semibold outline-none"
                  >
                    <option value="100 - Masa">100 - Masa</option>
                    <option value="104 - Pemungut Bendaharawan">104 - Pemungut Bendaharawan</option>
                    <option value="403 - PPN Pemungut Sekolah">403 - PPN Pemungut Sekolah</option>
                    <option value="900 - Pemungut BOS Instansi Pemerintah">900 - Pemungut BOS Instansi Pemerintah</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Masa Pajak
                  </label>
                  <input
                    type="text"
                    required
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Jumlah Setor (Rp)
                  </label>
                  <input
                    type="number"
                    required
                    min={1000}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 font-mono font-bold text-amber-600 outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold text-xs shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Generate Kode Billing</span>
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">ID Billing Terbit</h3>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                Kode billing dapat dibayarkan melalui Bank Persepsi (Bank DKI, Mandiri, BNI, BRI) atau kanal VA BOS.
              </p>

              {generatedCode ? (
                <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900">
                  <span className="text-[10px] text-amber-800 font-bold block mb-1">Kode Billing Aktif:</span>
                  <div className="font-mono text-base font-black text-amber-900 dark:text-amber-200 flex items-center justify-between">
                    <span>{generatedCode}</span>
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(generatedCode);
                        showToast({ type: "success", title: "Tersalin", description: "Kode billing disalin." });
                      }}
                      className="p-1 text-amber-700 hover:bg-amber-100 rounded"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-2">Masa Berlaku: s.d 15 Oktober 2026</span>
                </div>
              ) : (
                <div className="p-6 border border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-center text-xs text-slate-400">
                  Isi formulir dan tekan &quot;Generate Kode Billing&quot;
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
