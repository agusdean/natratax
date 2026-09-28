"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useApp } from "@/context/AppContext";
import { FileText, Plus, CheckCircle2 } from "lucide-react";
import { formatRupiah } from "@/lib/utils";

export default function BillingTagihanPage() {
  const { showToast } = useApp();
  const taxBills = [
    {
      skpNumber: "00012/206/24/005/26",
      taxType: "SKPKB PPN Masa Agustus 2026",
      amount: 1450000,
      dueDate: "2026-10-25",
      billingCode: "0239 9012 4410",
      status: "SIAP DIBAYAR",
    },
    {
      skpNumber: "00045/106/24/005/26",
      taxType: "STP Bunga Keterlambatan PPh 21",
      amount: 250000,
      dueDate: "2026-11-10",
      billingCode: "0239 9012 4411",
      status: "SIAP DIBAYAR",
    }
  ];

  return (
    <AppShell
      breadcrumbs={[
        { label: "Beranda", href: "/dashboard" },
        { label: "Pembayaran", href: "/payments" },
        { label: "Kode Billing Atas Tagihan Pajak" }
      ]}
    >
      <div className="space-y-5">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-md">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Kode Billing Atas Tagihan Pajak (SKP / STP)</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Penerbitan billing pelunasan Surat Ketetapan Pajak dan Surat Tagihan Pajak</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f59e0b] text-slate-950 font-bold uppercase text-[11px]">
                <tr>
                  <th className="py-2.5 px-4">Nomor SKP / STP</th>
                  <th className="py-2.5 px-4">Jenis Tagihan</th>
                  <th className="py-2.5 px-4 text-right">Pokok Tagihan</th>
                  <th className="py-2.5 px-4">Jatuh Tempo</th>
                  <th className="py-2.5 px-4 font-mono">Kode Billing</th>
                  <th className="py-2.5 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {taxBills.map((b, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-mono font-bold text-indigo-700 dark:text-indigo-400">{b.skpNumber}</td>
                    <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">{b.taxType}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-red-600">{formatRupiah(b.amount)}</td>
                    <td className="py-3 px-4 text-slate-500">{b.dueDate}</td>
                    <td className="py-3 px-4 font-mono font-bold text-amber-700 dark:text-amber-300">{b.billingCode}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => showToast({ type: "success", title: "Bayar Tagihan", description: `Mengarahkan ke pembayaran billing ${b.billingCode}...` })}
                        className="px-3 py-1 rounded-md bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold text-[11px]"
                      >
                        Setor Sekarang
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
