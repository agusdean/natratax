"use client";

import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useApp } from "@/context/AppContext";
import { GraduationCap, Plus } from "lucide-react";
import Link from "next/link";

export default function DaftarPermohonanEdukasiPage() {
  const { serviceRequests } = useApp();
  const requests = serviceRequests.filter((r) => r.type === "EDUKASI");

  return (
    <AppShell
      breadcrumbs={[
        { label: "Beranda", href: "/dashboard" },
        { label: "Layanan WP", href: "/layanan" },
        { label: "Daftar Permohonan Edukasi" }
      ]}
    >
      <div className="space-y-5">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#381750] text-white flex items-center justify-center shadow-md">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Daftar Permohonan Edukasi</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Riwayat pengajuan narasumber penyuluhan pajak dan status tindak lanjut ({requests.length} pengajuan)</p>
            </div>
          </div>

          <Link
            href="/layanan/permohonan-edukasi"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold text-xs shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Ajukan Edukasi Baru</span>
          </Link>
        </div>

        <div className="space-y-3">
          {requests.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 p-12 rounded-xl border border-slate-200 dark:border-slate-800 text-center text-slate-400">
              Belum ada permohonan edukasi perpajakan yang diajukan.
            </div>
          ) : (
            requests.map((r) => (
              <div key={r.id} className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">{r.ticketNumber}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      r.status === "SELESAI"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                    }`}>
                      {r.status.replace("_", " ")}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">• Diajukan: {r.dateSubmitted}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{r.title}</h3>
                  <p className="text-xs text-slate-500">{r.notes || r.currentStep}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AppShell>
  );
}
