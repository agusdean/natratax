"use client";

import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useApp } from "@/context/AppContext";
import { BookOpen, Download, Building2 } from "lucide-react";

export default function EdukasiKhususPage() {
  const { showToast } = useApp();
  const specialModules = [
    { title: "Pedoman Teknis Pemotongan Pajak Dana Bantuan Operasional Sekolah (BOS)", format: "PDF (6.2 MB)", tag: "Pendidikan & BOS" },
    { title: "Panduan Insentif Super Tax Deduction Vokasi 200% bagi Kemitraan SMK-DUDI", format: "PDF (3.8 MB)", tag: "SMK & Industri" },
    { title: "Tata Kelola Pembukuan & e-Faktur Unit Produksi / Teaching Factory SMK", format: "PDF (5.1 MB)", tag: "Teaching Factory" },
  ];

  return (
    <AppShell
      breadcrumbs={[
        { label: "Beranda", href: "/dashboard" },
        { label: "Layanan WP", href: "/layanan" },
        { label: "Materi Edukasi Khusus" }
      ]}
    >
      <div className="space-y-5">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#381750] text-white flex items-center justify-center shadow-md">
              <Building2 className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Materi Edukasi Khusus Vokasi & Sekolah</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Modul tematik perpajakan satuan pendidikan kejuruan, dana BOS, dan kemitraan industri</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {specialModules.map((m, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-3">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 mb-2 inline-block">
                  {m.tag}
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{m.title}</h3>
                <p className="text-xs text-slate-400 mt-1">{m.format}</p>
              </div>

              <button
                onClick={() => showToast({ type: "success", title: "Unduh Modul Khusus", description: `Mengunduh modul "${m.title}"...` })}
                className="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold text-xs shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Modul Vokasi</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
