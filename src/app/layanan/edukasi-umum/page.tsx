"use client";

import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useApp } from "@/context/AppContext";
import { BookOpen, Download, FileText } from "lucide-react";

export default function EdukasiUmumPage() {
  const { showToast } = useApp();
  const modules = [
    { title: "Buku Panduan Dasar Perpajakan Indonesia (KUP, PPh, PPN)", format: "PDF (8.4 MB)", downloads: "14.2k" },
    { title: "Pedoman Pemadanan NIK menjadi NPWP 16 Digit", format: "PDF (2.1 MB)", downloads: "32.8k" },
    { title: "Hak dan Kewajiban Wajib Pajak Badan & Instansi Pemerintah", format: "PDF (4.6 MB)", downloads: "9.5k" },
  ];

  return (
    <AppShell
      breadcrumbs={[
        { label: "Beranda", href: "/dashboard" },
        { label: "Layanan WP", href: "/layanan" },
        { label: "Materi Edukasi Umum" }
      ]}
    >
      <div className="space-y-5">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Materi Edukasi Perpajakan Umum</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Modul pembelajaran dasar, pedoman regulasi perpajakan, dan infografis resmi</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {modules.map((m, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-3">
              <div>
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center mb-2">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{m.title}</h3>
                <p className="text-xs text-slate-400 mt-1">{m.format} • {m.downloads} diunduh</p>
              </div>

              <button
                onClick={() => showToast({ type: "success", title: "Unduh Modul", description: `Mengunduh modul "${m.title}"...` })}
                className="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Materi</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
