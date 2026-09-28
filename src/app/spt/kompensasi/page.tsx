"use client";

import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useApp } from "@/context/AppContext";
import { Scale, ArrowRight, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { formatRupiah } from "@/lib/utils";

export default function DasborKompensasiPage() {
  const { compensations, applyCompensation, showToast } = useApp();

  const totalAvailable = compensations
    .filter((c) => c.status === "TERSEDIA")
    .reduce((sum, c) => sum + c.amount, 0);

  const totalCompensated = compensations
    .filter((c) => c.status === "DIKOMPENSASI")
    .reduce((sum, c) => sum + c.amount, 0);

  return (
    <AppShell
      breadcrumbs={[
        { label: "Beranda", href: "/dashboard" },
        { label: "SPT", href: "/spt" },
        { label: "Dasbor Kompensasi" }
      ]}
    >
      <div className="space-y-5">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#381750] text-white flex items-center justify-center shadow-md">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Dasbor Kompensasi Lebih Bayar</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Pengelolaan saldo kompensasi lebih bayar PPN dan PPh ke masa pajak berikutnya</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-xs font-semibold text-slate-500">Saldo Tersedia Dikompensasikan</span>
            <div className="text-2xl font-black text-emerald-600 mt-1 font-mono">{formatRupiah(totalAvailable)}</div>
            <p className="text-[11px] text-slate-400 mt-1">Dapat diaplikasikan ke SPT Masa berjalan</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-xs font-semibold text-slate-500">Total Telah Dikompensasikan</span>
            <div className="text-2xl font-black text-indigo-600 mt-1 font-mono">{formatRupiah(totalCompensated)}</div>
            <p className="text-[11px] text-slate-400 mt-1">Telah diserap pada pelaporan SPT sebelumnya</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-xs font-semibold text-slate-500">Status Validasi Fiskus</span>
            <div className="text-base font-bold text-slate-800 dark:text-slate-100 mt-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Sinkron dengan Coretax DJP</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Data SKKPP terverifikasi valid</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 font-bold text-xs text-slate-900 dark:text-white flex justify-between items-center">
            <span>Rincian Saldo Kompensasi Antar-Masa Pajak</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f59e0b] text-slate-950 font-bold uppercase text-[11px]">
                <tr>
                  <th className="py-2.5 px-4">Masa Asal Lebih Bayar</th>
                  <th className="py-2.5 px-4">Jenis SPT Pajak</th>
                  <th className="py-2.5 px-4 text-right">Nominal Lebih Bayar (Rp)</th>
                  <th className="py-2.5 px-4">Tujuan Kompensasi</th>
                  <th className="py-2.5 px-4">Nomor SKKPP / Ketetapan</th>
                  <th className="py-2.5 px-4 text-center">Status & Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {compensations.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-semibold">{c.periodOrigin}</td>
                    <td className="py-3 px-4">{c.sptType}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600">
                      {formatRupiah(c.amount)}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                      {c.periodDestination}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500">{c.decisionLetterNumber || "-"}</td>
                    <td className="py-3 px-4 text-center">
                      {c.status === "TERSEDIA" ? (
                        <button
                          onClick={() => applyCompensation(c.id)}
                          className="px-3 py-1 rounded-lg bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold text-[11px] cursor-pointer shadow-xs"
                        >
                          Terapkan ke SPT
                        </button>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          DIKOMPENSASI
                        </span>
                      )}
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
