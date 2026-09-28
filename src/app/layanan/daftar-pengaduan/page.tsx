"use client";

import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useApp } from "@/context/AppContext";
import { ShieldCheck, MessageSquare, Plus } from "lucide-react";
import Link from "next/link";

export default function DaftarPengaduanPage() {
  const { serviceRequests } = useApp();
  const reports = serviceRequests.filter((r) => r.type === "PENGADUAN");

  return (
    <AppShell
      breadcrumbs={[
        { label: "Beranda", href: "/dashboard" },
        { label: "Layanan WP", href: "/layanan" },
        { label: "Daftar Pengaduan, Saran, Dan Apresiasi" }
      ]}
    >
      <div className="space-y-5">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#381750] text-white flex items-center justify-center shadow-md">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Daftar Pengaduan, Saran, Dan Apresiasi</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Riwayat penyampaian aspirasi dan tindak lanjut dari KPP & Kemenkeu ({reports.length} laporan)</p>
            </div>
          </div>

          <Link
            href="/layanan/buat-pengaduan"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold text-xs shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tulis Masukan Baru</span>
          </Link>
        </div>

        <div className="space-y-3">
          {reports.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 p-12 rounded-xl border border-slate-200 dark:border-slate-800 text-center text-slate-400">
              Belum ada riwayat pengaduan atau apresiasi yang dikirimkan.
            </div>
          ) : (
            reports.map((r) => (
              <div key={r.id} className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{r.ticketNumber}</span>
                    <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {r.category}
                    </span>
                  </div>
                  <span className="text-slate-400 font-mono">{r.dateSubmitted}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{r.title}</h4>
                <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg text-xs text-slate-600 dark:text-slate-300">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 block mb-0.5">Tindak Lanjut Helpdesk:</span>
                  {r.notes || r.currentStep}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AppShell>
  );
}
